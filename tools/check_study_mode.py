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
  (b) bare curly "..."/straight "..." quote marks inside ordinary <p> prose,
      which can be split across text nodes by ordinary inline markup (e.g.
      `Dr. Smith said "the <strong>hydropower</strong> plan is dead."`) --
      so quote detection has to look at the whole containing block's
      rendered text, not just the one text node the match happens to fall
      in (fix round 2, Finding 1).
Both (a) and (b) must be protected the same way the tag check would have
been. When every prose occurrence of a term is quoted AND has a container
to attach to (a pull-quote div, or -- if this site ever adds them -- a
blockquote/q/cite), the injector falls back to a sibling
`<p class="sm-gloss-aside">` placed *after* that container. When a term is
only ever found inside bare quote marks with no container element to
attach a sibling to, the box is left untouched and the term is recorded as
"skipped" -- never injected. A Key Word whose first prose match sits inside
an authored `.term` span is skipped too (fix round 3): study mode already
reveals that word's definition inline, so a second gloss would print the
same definition twice. A term with no prose occurrence at all is a
separate, expected "orphan" (a free V5 content-quality signal), not a bug.

This script is a from-scratch re-implementation of that traversal logic --
using only `html.parser` from the stdlib, not a call into study-mode.js and
not a browser -- so agreement between the two is real independent evidence
that the safety invariant holds, on the actual shipped HTML.

SAFETY-NET DESIGN (fix round 2, Finding 2): a checker that decides "inline"
and then re-tests its OWN decision to look for violations can never fail --
if the classifier is wrong, its self-check inherits the exact same wrong
answer. So the classifier (find_target(), below) and the violation check
(in check_page()) are now two genuinely different pieces of code. The
classifier's quote-in-block detection is a linear open/close TOGGLE scan
(a straight quote flips a boolean; a curly opener/closer pair tracks
depth), ported 1:1 from study-mode.js's isInsideQuoteMarks(). The violation
check instead independently re-derives quoted spans in the SAME block's
rendered text using PAIRED-SPAN REGEX MATCHING -- a structurally different
algorithm (it requires both delimiters of a pair to be present; the toggle
scan does not) -- and only flags a violation when the two methods actually
disagree about a term the classifier decided to gloss inline. `--self-test`
proves this safety net can actually fire: see self_test() below.

IMPORTANT: all matching happens against *rendered text* -- text produced by
HTMLParser's handle_data() for content between tags -- never against
attribute values (e.g. `data-def="..."`). A first pass at measuring this
corpus's real quote exposure was thrown off exactly by searching raw
source/attribute text and picking up `data-def="..."` strings as false
"quotations"; this script structurally cannot make that mistake, because
attribute values are parsed into a separate `attrs` dict and never become
text nodes at all.

Exit status is non-zero if the independent violation check disagrees with
the classifier for any term classified INLINE -- that would be an S2
blocking violation.

Usage:  python3 tools/check_study_mode.py               # the 8 topic pages
        python3 tools/check_study_mode.py ai.html ...    # specific pages
        python3 tools/check_study_mode.py --self-test    # prove it can fail
"""
import re
import sys
from collections import namedtuple
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
# Block-level containers whose full rendered text a quotation might be
# split across (by a <strong>, <span class="term">, <a>, etc. sitting
# inside it). Whichever of these is reached first walking up from a text
# node -- or the section root itself, if none -- is "the block."
BLOCK_TAGS = {'p', 'li', 'td', 'div', 'figcaption'}
VOID_TAGS = {
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
}

DEFAULT_PAGES = [
    'ai.html', 'ukraine.html', 'immigration.html', 'us-elections.html',
    'climate-change.html', 'iran.html', 'space-race.html', 'gun-violence.html',
]

# In-memory fault fixture for --self-test: Finding 1's exact shape, a
# quotation split across text nodes by a <strong>, with no pull-quote/
# blockquote/q/cite container -- the case that slipped through fix round 1.
FAULT_HTML = """
<div class="article">
  <p>Dr. Smith said "the <strong>hydropower</strong> plan is dead."</p>
  <div class="vocab"><b>Key Word — Hydropower</b><p>Energy generated by moving water.</p></div>
</div>
"""


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


# Mirror of study-mode.js's ALREADY_GLOSSED_CLASSES / NON_PROSE_CLASSES
# (fix round 3, Critical 1 and 2). A match inside a `.term` means the page
# already glosses that word inline in study mode, so the whole Key Word is
# abandoned and recorded as skipped rather than glossed a second time. A
# match inside a `.term-desc` (an aria-describedby target) or a
# `.cite-inline` (a source label) is simply not a prose injection site, so
# the scan steps over it and keeps looking.
ALREADY_GLOSSED_CLASSES = {'term'}
NON_PROSE_CLASSES = {'term-desc', 'cite-inline'}


def is_already_glossed(classes):
    return any(c in ALREADY_GLOSSED_CLASSES for c in classes)


def is_non_prose(classes):
    return any(c in NON_PROSE_CLASSES for c in classes)


def is_inside_quote_marks(text, index):
    """Port of study-mode.js's isInsideQuoteMarks(): a linear open/close
    TOGGLE scan of `text` up to `index`. A straight " toggles open/closed;
    a curly opener/closer pair tracks depth. An unpaired opener with no
    closer before `index` is left "open" for the rest of the text --
    conservative by design: when in doubt, treat the position as quoted.
    Never raises. This is the PRIMARY classifier's algorithm -- see
    independent_offset_is_quoted() below for the deliberately different
    algorithm used to cross-check it."""
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


def independent_quote_spans(text):
    """A SECOND, independently-coded way to find quoted spans in `text`:
    paired-span regex matching, not a linear toggle. Requires both
    delimiters of a pair to be present (an unpaired opener matches
    nothing, the opposite conservatism from the toggle scan), so this is a
    structurally different algorithm, not a restatement of
    is_inside_quote_marks() -- that's what makes it a genuine second
    method rather than the classifier re-checking itself. Used only to
    cross-check the classifier's 'inline' calls in check_page(); it never
    participates in classification itself."""
    spans = []
    for m in re.finditer(r'"[^"]*"', text):
        spans.append((m.start(), m.end()))
    for m in re.finditer(r'“[^”]*”', text):
        spans.append((m.start(), m.end()))
    return spans


def independent_offset_is_quoted(text, offset):
    return any(start <= offset < end for start, end in independent_quote_spans(text))


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


def nearest_block(node, stop_at):
    """Mirror study-mode.js's nearestBlock()."""
    n = node.parent
    while n is not None and n is not stop_at:
        if n.tag in BLOCK_TAGS:
            return n
        n = n.parent
    return stop_at


def locate_in_block(block, node, match_index):
    """Where does `node`'s match at `match_index` fall in `block`'s full
    rendered text? Walks block's text nodes in the same document order
    get_text()/textContent is built from, summing fragment lengths until
    reaching `node`. Returns (block_text, absolute_offset). Mirrors
    study-mode.js's isQuotedInBlock()'s fragment-gathering, kept as its
    own function so the offset math is exercised the same way for both the
    primary check and the independent one below."""
    offset = 0
    for t in text_nodes(block):
        if t is node:
            return get_text(block), offset + match_index
        offset += len(t.text)
    return node.text, match_index


Hit = namedtuple('Hit', 'kind node tags classes match_start block block_text block_offset')


def find_target(section, regex, box):
    """Mirror findTarget() in study-mode.js. A match is "quoted" if it has
    a protected tag ancestor, a protected class ancestor (.pull-quote), or
    sits inside bare quote marks -- checked both in its own text node (a
    fast, always-safe-to-trust pre-check) and, since a quotation can be
    split across text nodes by inline markup, in the whole containing
    block's rendered text (the check that actually decides "not quoted").
    All are treated the same: remembered as a fallback while the search
    keeps looking for a clean, unquoted occurrence."""
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
        classes = ancestor_classes(node, section)
        # Checked against every ancestor, not just the immediate parent: a
        # .term or .cite-inline can wrap a <strong>/<em> around the match.
        if is_non_prose(classes):
            continue
        block = nearest_block(node, section)
        block_text, block_offset = locate_in_block(block, node, m.start())
        if is_already_glossed(classes):
            return Hit('blocked', node, tags, classes, m.start(), block, block_text, block_offset)
        quoted = (has_protected_ancestor(tags) or has_protected_class(classes)
                  or is_inside_quote_marks(node.text, m.start())
                  or is_inside_quote_marks(block_text, block_offset))
        hit = Hit('inline', node, tags, classes, m.start(), block, block_text, block_offset)
        if quoted:
            if protected_hit is None:
                protected_hit = hit._replace(kind='quoted')
            continue
        return hit
    return protected_hit


def _naive_find_target_for_self_test(section, regex, box):
    """DELIBERATELY reproduces the pre-fix-round-2 defect (Finding 1): quote
    detection scoped to a single text node only, never the containing
    block. Used ONLY by --self-test, to manufacture a false 'inline'
    verdict on the fault fixture so the independent check below has
    something real to catch. Production code (find_target(), above) never
    calls this, and already contains the fix."""
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
        block = nearest_block(node, section)
        block_text, block_offset = locate_in_block(block, node, m.start())
        quoted = (has_protected_ancestor(tags) or has_protected_class(classes)
                  or is_inside_quote_marks(node.text, m.start()))  # node-only: the bug
        hit = Hit('inline', node, tags, classes, m.start(), block, block_text, block_offset)
        if quoted:
            if protected_hit is None:
                protected_hit = hit._replace(kind='quoted')
            continue
        return hit
    return protected_hit


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

        if hit.kind == 'blocked':
            # Already an authored .term on this page -- study mode reveals
            # that definition inline, so a second gloss is not injected.
            skipped_terms.append(term)
        elif hit.kind == 'inline':
            inline_terms.append(term)
            # SECOND, INDEPENDENT method (Finding 2): re-derive quotedness
            # over the same block's rendered text with paired-span regex
            # matching instead of the classifier's toggle scan. This does
            # NOT re-test the classifier's own inputs/expression -- it is
            # a different algorithm reaching its own conclusion. Only a
            # genuine disagreement is a violation.
            if independent_offset_is_quoted(hit.block_text, hit.block_offset):
                violations.append(term)
        else:
            container = quoted_ancestor(hit.node)
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


def main_check(pages):
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
              f"skipped (quoted w/ no container, or already a .term): {len(r['skipped'])}   "
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
            print(f"  !!! S2 VIOLATION -- independent check disagrees with the classifier "
                  f"for: {', '.join(r['violations'])}")

    print()
    print(f"TOTAL  Key Words: {total_kw}   inline: {total_inline}   "
          f"sibling-aside: {total_aside}   skipped: {total_skipped}   orphans: {total_orphan}")

    if any_violation:
        print("FAIL: S2 blocking violation detected")
        return 1
    print("OK: no Key Word would receive an inline gloss inside a quotation")
    return 0


# ---- --self-test: prove the safety net can actually fire -------------------

def self_test():
    """Builds the Finding-1 fault shape in memory (a quotation split across
    text nodes by inline markup, no container) and proves two things:
    (1) the real, fixed find_target() already refuses to gloss it inline
        (Finding 1's fix holds on this exact fixture), and
    (2) if a classifier regression like Finding 1 ever came back --
        reproduced here on purpose via _naive_find_target_for_self_test(),
        never called by production code -- the REAL independent check used
        in check_page() (independent_offset_is_quoted(), a different
        algorithm from the classifier's) still catches the resulting false
        'inline' verdict and reports it as a violation.
    Exit 0 means the fault WAS detected (the safety net works). Exit
    non-zero means it was NOT detected (the safety net is broken)."""
    print("=== --self-test: proving the independent violation check can fail-detect ===")
    print()
    print("Fault fixture (in-memory only, not a file on disk):")
    print(FAULT_HTML.strip())
    print()

    root = parse(FAULT_HTML)
    box = next(find_all(root, lambda n: 'vocab' in n.classes()), None)
    if box is None:
        print("SELF-TEST INCONCLUSIVE: fixture has no .vocab box.")
        return 1
    label = next(find_all(box, lambda n: n.tag == 'b'), None)
    term = key_word_from_box(get_text(label)) if label is not None else None
    if term is None:
        print("SELF-TEST INCONCLUSIVE: fixture's box has no parseable Key Word term.")
        return 1
    regex = term_pattern(term)
    section = find_section_root(box) or root

    # (1) Sanity check: the real, fixed classifier should already refuse
    # to gloss this inline.
    real_hit = find_target(section, regex, box)
    real_kind = real_hit.kind if real_hit is not None else 'orphan'
    if real_hit is not None and real_hit.kind == 'inline':
        print(f"UNEXPECTED: the real, FIXED find_target() classifies {term!r} as INLINE "
              f"on the fault fixture -- Finding 1's fix is not actually working. "
              f"This is itself a failure.")
        return 1
    print(f"(1) Sanity check: the real, fixed find_target() classifies {term!r} as "
          f"{real_kind!r} (not inline) on the fault fixture -- Finding 1's fix holds here.")
    print()

    # (2) The actual self-test: manufacture the Finding-1 regression with
    # a deliberately naive, node-only classifier, and confirm the REAL
    # independent check (same function check_page() runs on every real
    # 'inline' verdict) still catches the resulting false 'inline' call.
    naive_hit = _naive_find_target_for_self_test(section, regex, box)
    if naive_hit is None or naive_hit.kind != 'inline':
        print("SELF-TEST INCONCLUSIVE: the deliberately naive classifier did not produce "
              "an 'inline' verdict to test the safety net against -- fixture needs "
              "adjusting so it actually reproduces the Finding 1 shape.")
        return 1

    print(f"(2) Naive classifier (deliberately reproduces the pre-fix-round-2 bug: quote "
          f"detection scoped to one text node only): {term!r} -> INLINE. Its own text node "
          f"{naive_hit.node.text!r} has zero quote marks in isolation -- this IS the "
          f"Finding 1 defect, reproduced on purpose to test the safety net.")
    print(f"    Containing block's full rendered text: {naive_hit.block_text!r}")
    print(f"    Match offset within that block: {naive_hit.block_offset}")

    violation = independent_offset_is_quoted(naive_hit.block_text, naive_hit.block_offset)
    print(f"    independent_offset_is_quoted(block_text, block_offset) = {violation}")
    print()

    if violation:
        print(f"FAULT DETECTED: the independent check disagrees with the naive classifier "
              f"and flags {term!r} as a violation, exactly as check_page() would for any "
              f"real page with this defect. The safety net works.")
        print("--self-test: PASS (exit 0)")
        return 0
    print(f"FAULT NOT DETECTED: the independent check agreed with the naive classifier's "
          f"false 'inline' call. The safety net has a hole.")
    print("--self-test: FAIL (exit 1)")
    return 1


def main():
    argv = sys.argv[1:]
    if '--self-test' in argv:
        return self_test()
    pages = [a for a in argv if not a.startswith('--')] or DEFAULT_PAGES
    return main_check(pages)


if __name__ == '__main__':
    sys.exit(main())
