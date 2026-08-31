#!/usr/bin/env python3
"""Every colour inside a Situation Update / focus pane must pass AA on the
pane's light ground.

The panes were dark until 4.8.0 and a lot of colour was chosen for that:
stylesheet rules, and — the part a stylesheet sweep misses entirely — inline
style attributes. Ten of those were sitting at 1.1–1.6:1 after the ground
flipped, which is invisible text.

Checks the inline attributes, since the rules are handled by
tools/lighten_panes.py and verified by its own assertion. Skips anything
carrying its own background: white on a coloured chip is still fine.
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['ai.html', 'gun-violence.html', 'immigration.html', 'iran.html',
         'space-race.html', 'ukraine.html', 'us-elections.html']
GROUND = '#f5f1e8'          # --paper-warm, the pane ground
AA = 4.5


def lum(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return .2126 * f(r) + .7152 * f(g) + .0722 * f(b)


def ratio(fg, bg=GROUND):
    a, b = lum(fg), lum(bg)
    hi, lo = max(a, b), min(a, b)
    return (hi + .05) / (lo + .05)


def tokens_of(src):
    """The page's :root palette, so var(--ink-faint) can be checked too."""
    m = re.search(r':root\s*\{([^}]*)\}', src)
    if not m:
        return {}
    return {k: v.strip() for k, v in
            re.findall(r'(--[a-z-]+)\s*:\s*([^;]+)', m.group(1))}


def resolve(value, tokens, depth=0):
    """A literal, or a var() chased through the palette."""
    value = value.strip()
    if value.startswith('#'):
        return value
    m = re.match(r'var\(\s*(--[a-z-]+)', value)
    if m and depth < 4:
        nxt = tokens.get(m.group(1))
        if nxt:
            return resolve(nxt, tokens, depth + 1)
    return None


def main():
    bad = 0
    checked = 0
    for page in PAGES:
        src = io.open(os.path.join(ROOT, page), encoding='utf-8').read()
        tokens = tokens_of(src)
        for m in re.finditer(r'\sstyle="([^"]+)"', src):
            v = m.group(1)
            cm = re.search(r'(?<!-)color:\s*(#[0-9a-fA-F]{3,6}|white|var\([^)]+\))', v)
            if not cm:
                continue
            if re.search(r'background:\s*(#|rgba|var)', v):
                continue                      # carries its own ground
            before = src[:m.start()]
            in_pane = (max(before.rfind('update-pane'), before.rfind('focus-pane'))
                       > before.rfind('</details>'))
            if not in_pane:
                continue
            raw = cm.group(1)
            colour = '#ffffff' if raw == 'white' else resolve(raw, tokens)
            if not colour:
                continue                      # unresolvable: nothing to judge
            r = ratio(colour)
            checked += 1
            if r < AA:
                bad += 1
                print('  FAIL %-16s %-44s %.2f:1' % (page, v[:44], r))

    print('%d in-pane inline colour(s) checked against %s' % (checked, GROUND))
    print('all pass AA' if not bad else '%d BELOW %.1f:1' % (bad, AA))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
