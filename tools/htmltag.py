"""Find HTML tags without being fooled by '>' inside an attribute value.

`<img\\b[^>]*>` is the obvious pattern and it is wrong on this codebase. The
portrait images carry:

    onerror="this.outerHTML='<div class=\\'emoji-fallback\\'>🖥️</div>'"

so the naive match ends at the '>' that closes the inner <div>, and anything
appended after it lands in the middle of an attribute. Doing that to every
image produced stray </div> on eight pages at once.

This walks the tag instead, tracking quote state, so a '>' only ends the tag
when it is outside quotes.
"""
import re


def find_tags(html, name):
    """Yield (start, end) for each <name ...> in html, attribute-aware."""
    open_re = re.compile(r'<%s\b' % re.escape(name), re.I)
    for m in open_re.finditer(html):
        i = m.end()
        quote = None
        while i < len(html):
            c = html[i]
            if quote:
                if c == quote:
                    quote = None
            elif c in '"\'':
                quote = c
            elif c == '>':
                yield (m.start(), i + 1)
                break
            i += 1


def add_attrs(tag, extra):
    """Append attributes to a tag string, handling a self-closing slash."""
    inner = tag[:-1].rstrip()
    if inner.endswith('/'):
        inner = inner[:-1].rstrip()
        return '%s %s />' % (inner, extra)
    return '%s %s>' % (inner, extra)


def has_attr(tag, attr):
    return re.search(r'\s%s\s*=' % re.escape(attr), tag, re.I) is not None
