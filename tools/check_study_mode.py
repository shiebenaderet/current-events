#!/usr/bin/env python3
"""Independently verify Study Mode's Key Word injector, without a browser.

study-mode.js's injectKeyWordGlosses() (Task 4) promotes each "Key Word"
box (a `.vocab` div whose `<b>` label starts with "Key Word") into an
inline gloss at the term's first use in that section's prose. The one rule
that must never break: an injected node must never land inside a
`blockquote`, `q`, or `cite` -- scaffolding goes around a primary source,
never inside it (S2). When every prose occurrence of a term is quoted, the
injector is specified to fall back to a sibling `<p class="sm-gloss-aside">`
placed *after* the quotation, and a term with no prose occurrence at all is
an expected "orphan" (a free V5 content-quality signal), not a bug.

This script is a from-scratch re-implementation of that traversal logic --
using only `html.parser` from the stdlib, not a call into study-mode.js and
not a browser -- so agreement between the two is real independent evidence
that the safety invariant holds, on the actual shipped HTML. It parses each
topic page into a small tree, locates every Key Word box, finds that term's
first occurrence in the surrounding prose exactly the way findTarget() in
study-mode.js does (skipping headings, citation links, and the box itself,
preferring an unquoted hit but falling back to a quoted one), and reports,
per page: which terms will gloss inline, which would need the sibling-aside
path, and which are orphans.

Exit status is non-zero if any term classified as an INLINE gloss actually
has a blockquote/q/cite ancestor at its matched occurrence -- that would be
an S2 blocking violation.

Usage:  python3 tools/check_study_mode.py               # the 8 topic pages
        python3 tools/check_study_mode.py ai.html ...    # specific pages
"""
import glob
import re
import sys
from html.parser import HTMLParser

PROTECTED_TAGS = {'blockquote', 'q', 'cite'}
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


def has_protected_ancestor(tags):
    return any(t in PROTECTED_TAGS for t in tags)


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
    """Mirror findTarget() in study-mode.js."""
    protected_hit = None
    for node in text_nodes(section):
        if not regex.search(node.text):
            continue
        if contains(box, node):
            continue
        tags = ancestor_tags(node, section)
        if HEADING_TAGS & set(tags):
            continue
        if node.parent is not None and 'cite-inline' in node.parent.classes():
            continue
        if has_protected_ancestor(tags):
            if protected_hit is None:
                protected_hit = node
            continue
        return ('inline', node, tags)
    if protected_hit is not None:
        return ('quoted', protected_hit, ancestor_tags(protected_hit, section))
    return None


# ---- per-page check ----------------------------------------------------

def check_page(path):
    raw = open(path, encoding='utf-8').read()
    root = parse(raw)
    boxes = list(find_all(root, lambda n: 'vocab' in n.classes()))

    inline_terms, aside_terms, orphan_terms = [], [], []
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

        kind, node, tags = hit
        if kind == 'inline':
            inline_terms.append(term)
            # Independent safety check: a term classified INLINE must
            # genuinely sit outside every blockquote/q/cite ancestor.
            if has_protected_ancestor(tags):
                violations.append(term)
        else:
            aside_terms.append(term)

    return {
        'path': path,
        'total': len(inline_terms) + len(aside_terms) + len(orphan_terms),
        'inline': inline_terms,
        'aside': aside_terms,
        'orphans': orphan_terms,
        'violations': violations,
    }


def main():
    pages = sys.argv[1:] or DEFAULT_PAGES
    total_kw = total_inline = total_aside = total_orphan = 0
    any_violation = False

    for path in pages:
        r = check_page(path)
        total_kw += r['total']
        total_inline += len(r['inline'])
        total_aside += len(r['aside'])
        total_orphan += len(r['orphans'])

        print(f"== {r['path']} ==")
        print(f"  Key Words: {r['total']}   will gloss inline: {len(r['inline'])}   "
              f"sibling-aside needed: {len(r['aside'])}   orphans: {len(r['orphans'])}")
        if r['inline']:
            print(f"    inline:  {', '.join(r['inline'])}")
        if r['aside']:
            print(f"    aside:   {', '.join(r['aside'])}")
        if r['orphans']:
            print(f"    orphans: {', '.join(r['orphans'])}")
        if r['violations']:
            any_violation = True
            print(f"  !!! S2 VIOLATION -- inline gloss lands inside a quotation for: "
                  f"{', '.join(r['violations'])}")

    print()
    print(f"TOTAL  Key Words: {total_kw}   inline: {total_inline}   "
          f"sibling-aside: {total_aside}   orphans: {total_orphan}")

    if any_violation:
        print("FAIL: S2 blocking violation detected")
        return 1
    print("OK: no Key Word would receive an inline gloss inside a quotation")
    return 0


if __name__ == '__main__':
    sys.exit(main())
