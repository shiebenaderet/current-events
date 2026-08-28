#!/usr/bin/env python3
"""Independently verify Study Mode's Key Word injector, without a browser.

study-mode.js's injectKeyWordGlosses() (Task 4) promotes each "Key Word"
box (a `.vocab` div whose `<b>` label starts with "Key Word") into an
inline gloss at the term's first use in that section's prose. The one rule
that must never break: an injected node must never land inside a
quotation (S2) -- scaffolding goes around a primary source, never inside
it. On this corpus a quotation shows up two ways, neither of which is a
`<blockquote>`/`<q>`/`<cite>` tag (this site has zero of those):
  (a) a `<div class="pull-quote">` container holding a verbatim quote, and
  (b) bare curly "..."/straight "..." quote marks inside ordinary <p> prose.
Both must be protected the same way the tag check would have been. When
every prose occurrence of a term is quoted AND has a container to attach
to (a pull-quote div, or -- if this site ever adds them -- a blockquote/
q/cite), the injector falls back to a sibling `<p class="sm-gloss-aside">`
placed *after* that container. When a term is only ever found inside bare
quote marks with no container element to attach a sibling to, the box is
left untouched and the term is recorded as "skipped" -- never injected. A
term with no prose occurrence at all is a separate, expected "orphan" (a
free V5 content-quality signal), not a bug.

This script is a from-scratch re-implementation of that traversal logic --
using only `html.parser` from the stdlib, not a call into study-mode.js and
not a browser -- so agreement between the two is real independent evidence
that the safety invariant holds, on the actual shipped HTML. It parses each
topic page into a small tree, locates every Key Word box, finds that term's
first occurrence in the surrounding prose exactly the way findTarget() in
study-mode.js does, and reports, per page, which terms will gloss inline,
which need the sibling-aside path, which are skipped as unsafe-to-touch
quotations, and which are orphans.

IMPORTANT: all matching happens against *rendered text* -- text produced by
HTMLParser's handle_data() for content between tags -- never against
attribute values (e.g. `data-def="..."`). A first pass at measuring this
corpus's real quote exposure was thrown off exactly by searching raw
source/attribute text and picking up `data-def="..."` strings as false
"quotations"; this script structurally cannot make that mistake, because
attribute values are parsed into a separate `attrs` dict and never become
text nodes at all.

Exit status is non-zero if any term classified as an INLINE gloss actually
has a blockquote/q/cite ancestor, a .pull-quote ancestor, or a match
position inside bare quote marks -- any of those would be an S2 blocking
violation.

Usage:  python3 tools/check_study_mode.py               # the 8 topic pages
        python3 tools/check_study_mode.py ai.html ...    # specific pages
"""
import re
import sys
from html.parser import HTMLParser

PROTECTED_TAGS = {'blockquote', 'q', 'cite'}
# This corpus has zero blockquote/q/cite tags (measured 2026-08-28). Real
# quotations are authored as a `.pull-quote` div, so a class-based
# container check is required alongside the (harmless, future-proofing)
# tag check above.
PROTECTED_CLASSES = {'pull-quote'}
HEADING_TAGS = {'h1', 'h2', 'h3', 'h4'}
SECTION_CLASSES = {'article', 'sec-body'}
SECTION_TAGS = {'section', 'body'}
VOID_TAGS = {
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
}

DEFAULT_PAGES = [
    'ai.html', 'ukraine.html', 'immigration.html', 'us-elections.html',
    'climate-change.html', 'iran.html', 'space-race.html', 'gun-violence.html',
]


# ---- a minimal DOM, built with html.parser only ----------------------------

class Node:
    __slots__ = ('kind', 'tag', 'attrs', 'text', 'parent', 'children')

    def __init__(self, kind, tag=None, attrs=None, text=None, parent=None):
        self.kind = kind          # 'el' or 'text'
        self.tag = tag
        self.attrs = attrs or {}
        self.text = text
        self.parent = parent
        self.children = []

    def classes(self):
        return self.attrs.get('class', '').split()


class TreeBuilder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('el', tag='root')
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node('el', tag=tag, attrs=dict(attrs), parent=self.stack[-1])
        self.stack[-1].children.append(node)
        if tag not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        node = Node('el', tag=tag, attrs=dict(attrs), parent=self.stack[-1])
        self.stack[-1].children.append(node)

    def handle_endtag(self, tag):
        # Real HTML is occasionally sloppy; pop back to the nearest matching
        # open tag if one exists, ignore stray/unmatched close tags.
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        # Rendered text only. Attribute values (data-def="...", href="...",
        # etc.) never reach this method -- HTMLParser hands those to
        # handle_starttag()'s `attrs` list instead. This is what keeps this
        # script from repeating the raw-source/attribute-value false
        # positive that inflated the first measurement of quote exposure.
        if not data:
            return
        parent = self.stack[-1]
        parent.children.append(Node('text', text=data, parent=parent))


def parse(html_text):
    tb = TreeBuilder()
    tb.feed(html_text)
    return tb.root


def walk(node):
    """Depth-first, document order. Yields every descendant (el + text)."""
    for c in node.children:
        yield c
        if c.kind == 'el':
            yield from walk(c)


def text_nodes(node):
    for n in walk(node):
        if n.kind == 'text':
            yield n


def find_all(node, pred):
    for n in walk(node):
        if n.kind == 'el' and pred(n):
            yield n


def get_text(node):
    return ''.join(t.text for t in text_nodes(node))


def contains(ancestor, node):
    n = node
    while n is not None:
        if n is ancestor:
            return True
        n = n.parent
    return False


def ancestor_tags(node, stop_at):
    tags = []
    n = node.parent
    while n is not None and n is not stop_at:
        if n.tag:
            tags.append(n.tag)
        n = n.parent
    return tags


def ancestor_classes(node, stop_at):
    classes = []
    n = node.parent
    while n is not None and n is not stop_at:
        classes.extend(n.classes())
        n = n.parent
    return classes


def has_protected_ancestor(tags):
    return any(t in PROTECTED_TAGS for t in tags)


def has_protected_class(classes):
    return any(c in PROTECTED_CLASSES for c in classes)


def is_inside_quote_marks(text, index):
    """Port of study-mode.js's isInsideQuoteMarks(). Scans `text` up to
    `index` only (the single text node the match lives in, not the whole
    paragraph). A straight " toggles open/closed; a curly opener/closer
    pair tracks depth. An unpaired opener with no closer before `index`
    is left "open" for the rest of the node -- conservative by design:
    when in doubt, treat the position as quoted. Never raises."""
    t = '' if text is None else str(text)
    i = max(0, min(index, len(t)))
    straight_open = False
    curly_depth = 0
    for ch in t[:i]:
        if ch == '"':
            straight_open = not straight_open
        elif ch == '“':  # “
            curly_depth += 1
        elif ch == '”':  # ”
            if curly_depth > 0:
                curly_depth -= 1
    return straight_open or curly_depth > 0


# ---- study-mode.js's pure helpers, re-derived independently ----------------

def key_word_from_box(label_text):
    t = re.sub(r'\s+', ' ', label_text.strip())
    m = re.match(r'^Key\s*Word\s*[:—–-]\s*(.+)$', t, re.I)
    return m.group(1).strip() if m else None


def term_pattern(term):
    raw = term.strip()
    if not raw:
        return None
    esc = re.escape(raw)
    lead = r'\b' if re.match(r'^\w', raw) else ''
    tail = r'(?:e?s)?\b' if re.search(r'\w$', raw) else ''
    return re.compile(lead + esc + tail, re.I)


def find_section_root(box):
    """Mirror box.closest('.article, .sec-body, section, body')."""
    n = box
    while n is not None:
        if n.kind == 'el':
            if SECTION_CLASSES & set(n.classes()):
                return n
            if n.tag in SECTION_TAGS:
                return n
        n = n.parent
    return None


def find_target(section, regex, box):
    """Mirror findTarget() in study-mode.js. A match is "quoted" if it has
    a protected tag ancestor, a protected class ancestor (.pull-quote), or
    sits inside bare quote marks in its own text node -- all three are
    treated the same: remembered as a fallback while the search keeps
    looking for a clean, unquoted occurrence."""
    protected_hit = None
    for node in text_nodes(section):
        m = regex.search(node.text)
        if not m:
            continue
        if contains(box, node):
            continue
        tags = ancestor_tags(node, section)
        if HEADING_TAGS & set(tags):
            continue
        if node.parent is not None and 'cite-inline' in node.parent.classes():
            continue
        classes = ancestor_classes(node, section)
        quoted = (has_protected_ancestor(tags) or has_protected_class(classes)
                  or is_inside_quote_marks(node.text, m.start()))
        if quoted:
            if protected_hit is None:
                protected_hit = node
            continue
        return ('inline', node, tags, classes, m.start())
    if protected_hit is not None:
        pm = regex.search(protected_hit.text)
        return ('quoted', protected_hit, ancestor_tags(protected_hit, section),
                ancestor_classes(protected_hit, section), pm.start() if pm else 0)
    return None


def quoted_ancestor(node):
    """Mirror quotedAncestor() in study-mode.js: nearest ancestor that is
    either a protected tag or carries a protected class, walking all the
    way to the document root (unbounded, like the JS)."""
    n = node.parent
    while n is not None:
        if n.tag in PROTECTED_TAGS:
            return n
        if PROTECTED_CLASSES & set(n.classes()):
            return n
        n = n.parent
    return None


# ---- per-page check ----------------------------------------------------

def check_page(path):
    raw = open(path, encoding='utf-8').read()
    root = parse(raw)
    boxes = list(find_all(root, lambda n: 'vocab' in n.classes()))

    inline_terms, aside_terms, skipped_terms, orphan_terms = [], [], [], []
    violations = []

    for box in boxes:
        label = next(find_all(box, lambda n: n.tag == 'b'), None)
        defp = next(find_all(box, lambda n: n.tag == 'p'), None)
        if label is None or defp is None:
            continue
        term = key_word_from_box(get_text(label))
        if term is None:
            continue
        regex = term_pattern(term)
        if regex is None:
            continue

        section = find_section_root(box) or root
        hit = find_target(section, regex, box)
        if hit is None:
            orphan_terms.append(term)
            continue

        kind, node, tags, classes, match_start = hit
        if kind == 'inline':
            inline_terms.append(term)
            # Independent safety check: a term classified INLINE must
            # genuinely sit outside every blockquote/q/cite/.pull-quote
            # ancestor AND outside bare quote marks in its own text node.
            if (has_protected_ancestor(tags) or has_protected_class(classes)
                    or is_inside_quote_marks(node.text, match_start)):
                violations.append(term)
        else:
            container = quoted_ancestor(node)
            if container is not None:
                aside_terms.append(term)
            else:
                skipped_terms.append(term)

    return {
        'path': path,
        'total': len(inline_terms) + len(aside_terms) + len(skipped_terms) + len(orphan_terms),
        'inline': inline_terms,
        'aside': aside_terms,
        'skipped': skipped_terms,
        'orphans': orphan_terms,
        'violations': violations,
    }


def main():
    pages = sys.argv[1:] or DEFAULT_PAGES
    total_kw = total_inline = total_aside = total_skipped = total_orphan = 0
    any_violation = False

    for path in pages:
        r = check_page(path)
        total_kw += r['total']
        total_inline += len(r['inline'])
        total_aside += len(r['aside'])
        total_skipped += len(r['skipped'])
        total_orphan += len(r['orphans'])

        print(f"== {r['path']} ==")
        print(f"  Key Words: {r['total']}   will gloss inline: {len(r['inline'])}   "
              f"sibling-aside needed: {len(r['aside'])}   "
              f"skipped (quoted, no container): {len(r['skipped'])}   "
              f"orphans: {len(r['orphans'])}")
        if r['inline']:
            print(f"    inline:  {', '.join(r['inline'])}")
        if r['aside']:
            print(f"    aside:   {', '.join(r['aside'])}")
        if r['skipped']:
            print(f"    skipped: {', '.join(r['skipped'])}")
        if r['orphans']:
            print(f"    orphans: {', '.join(r['orphans'])}")
        if r['violations']:
            any_violation = True
            print(f"  !!! S2 VIOLATION -- inline gloss lands inside a quotation for: "
                  f"{', '.join(r['violations'])}")

    print()
    print(f"TOTAL  Key Words: {total_kw}   inline: {total_inline}   "
          f"sibling-aside: {total_aside}   skipped: {total_skipped}   orphans: {total_orphan}")

    if any_violation:
        print("FAIL: S2 blocking violation detected")
        return 1
    print("OK: no Key Word would receive an inline gloss inside a quotation")
    return 0


if __name__ == '__main__':
    sys.exit(main())
