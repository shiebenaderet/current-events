#!/usr/bin/env python3
"""Find CSS rules that can never match anything on their own page.

Each topic page carries its own inline stylesheet, so a class can be alive on
one page and dead on another; only the dead copies are the finding.
.section-nav is the case that motivated this: v4.0.0 deleted the markup from
nine pages and left the rules on all nine, including a position:fixed rule
that was still reserving 80px above three heroes months later.

BEING WRONG HERE DELETES WORKING STYLING, so a class counts as live if it
appears in ANY of:

  - a class="..." attribute in the page's markup
  - anywhere in the page's own inline <script> (classList.add, a template
    string, a lookup table of class names)
  - anywhere in site.js, study-mode.js or unfold-logic.js, which build DOM
    for every page

A rule is dead only when every class it names is dead, and a rule naming no
class at all (element or :root selectors) is never touched.

Prints; does not edit. Pass --apply to rewrite the pages.
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['index.html', 'ai.html', 'climate-change.html', 'gun-violence.html',
         'immigration.html', 'iran.html', 'space-race.html', 'ukraine.html',
         'us-elections.html']
SHARED_JS = ['site.js', 'study-mode.js', 'unfold-logic.js']

CLASS_RE = re.compile(r'\.(-?[A-Za-z_][\w-]*)')


def shared_js_text():
    out = []
    for f in SHARED_JS:
        p = os.path.join(ROOT, f)
        if os.path.exists(p):
            out.append(io.open(p, encoding='utf-8').read())
    return '\n'.join(out)


SHARED = shared_js_text()


def strip_js_comments(js):
    """Remove // and /* */ comments without touching string or regex bodies.

    A class named only in a comment must not count as used, but a class named
    inside a string literal must — classList.add('is-open') is the whole
    point. So this walks the source rather than running a regex over it.
    """
    out = []
    i, n = 0, len(js)
    while i < n:
        c = js[i]
        if c in '"\'`':                       # string: copy through verbatim
            q = c
            out.append(c)
            i += 1
            while i < n:
                out.append(js[i])
                if js[i] == '\\':
                    i += 2
                    if i - 1 < n:
                        out.append(js[i - 1])
                    continue
                if js[i] == q:
                    i += 1
                    break
                i += 1
            continue
        if c == '/' and i + 1 < n and js[i + 1] == '/':
            while i < n and js[i] != '\n':
                i += 1
            continue
        if c == '/' and i + 1 < n and js[i + 1] == '*':
            end = js.find('*/', i + 2)
            i = n if end < 0 else end + 2
            continue
        out.append(c)
        i += 1
    return ''.join(out)


def live_classes(src):
    """Every class name this page could plausibly use at any point."""
    markup = re.sub(r'<style[\s\S]*?</style>', ' ', src)
    used = set()
    for m in re.finditer(r'class="([^"]*)"', markup):
        used.update(m.group(1).split())
    # Anything a script mentions as a bare word is treated as live. Blunt on
    # purpose: a false "live" leaves a dead rule in place, a false "dead"
    # deletes working styling.
    #
    # Comments are stripped first. Without that, a class survives merely by
    # being *named* in a comment — .section-nav did exactly that, kept alive
    # on all nine pages by two passing mentions in prose, months after its
    # markup was deleted.
    scripts = '\n'.join(re.findall(r'<script[^>]*>([\s\S]*?)</script>', src))
    code = strip_js_comments(scripts) + '\n' + strip_js_comments(SHARED)
    words = set(re.findall(r'[A-Za-z_][\w-]*', code))
    return used, words


def split_rules(css):
    """(selector, body, start, end) for each top-level rule, @media aware."""
    out = []
    i = 0
    n = len(css)
    while i < n:
        brace = css.find('{', i)
        if brace < 0:
            break
        sel = css[i:brace].strip()
        depth = 1
        j = brace + 1
        while j < n and depth:
            if css[j] == '{':
                depth += 1
            elif css[j] == '}':
                depth -= 1
            j += 1
        if sel.startswith('@'):
            # recurse into at-rules so nested rules are checked too
            inner = css[brace + 1:j - 1]
            for s, b, st, en in split_rules(inner):
                out.append((s, b, brace + 1 + st, brace + 1 + en))
        else:
            out.append((sel, css[brace + 1:j - 1], i, j))
        i = j
    return out


def main():
    apply = '--apply' in sys.argv
    grand = 0
    for page in PAGES:
        path = os.path.join(ROOT, page)
        src = io.open(path, encoding='utf-8').read()
        used, words = live_classes(src)

        style = re.search(r'(<style[^>]*>)([\s\S]*?)(</style>)', src)
        if not style:
            continue
        css = style.group(2)
        clean = re.sub(r'/\*[\s\S]*?\*/', lambda m: ' ' * len(m.group(0)), css)

        dead_rules = []
        for sel, body, start, end in split_rules(clean):
            names = set(CLASS_RE.findall(sel))
            if not names:
                continue                       # element/:root rules: leave alone
            if any(c in used or c in words for c in names):
                continue                       # something in it can match
            dead_rules.append((sel.strip(), sorted(names), start, end))

        if not dead_rules:
            print('%-22s clean' % page)
            continue

        classes = sorted({c for _, ns, _, _ in dead_rules for c in ns})
        print('%-22s %2d rule(s) that can never match  (%s)'
              % (page, len(dead_rules), ', '.join('.' + c for c in classes[:6])
                 + (' …' if len(classes) > 6 else '')))
        grand += len(dead_rules)

        if apply:
            for sel, ns, start, end in sorted(dead_rules, key=lambda r: -r[2]):
                css = css[:start] + css[end:]
            src = src[:style.start(2)] + css + src[style.end(2):]
            io.open(path, 'w', encoding='utf-8').write(src)

    print()
    print('%d dead rule(s) across %d pages%s'
          % (grand, len(PAGES), ' — removed' if apply else ' (dry run; --apply to remove)'))


if __name__ == '__main__':
    main()
