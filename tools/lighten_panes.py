#!/usr/bin/env python3
"""Turn the dark Situation Update / focus panes light.

WHY. 6,036 words across the site were set light-on-dark, including single
sections of 1,302 (iran) and 900 (gun-violence) words. A dark ground is fine
for a short pull-out and poor for sustained reading, and these panes hold the
longest volatile passages on the site — for a class with many students
reading below grade level, that is the worst place to put the hardest
surface. It was also reported directly: the panes read as "not great".

The panes stay DISTINCT. They keep the eyebrow, the badge, the date line and
their own tinted ground; they simply stop being inverted.

WHY MECHANICALLY. 289 pane-scoped rules across seven inline stylesheets,
about 130 of them encoding light-on-dark colour. Hand-editing seven files is
exactly how the v4.0.0 Source Serif swap missed 32 declarations — two
variants existed and only one was found. A script applies the same mapping
everywhere and can be checked afterwards by asserting no light-on-dark
colour survives inside a pane.

Mapping, by what the colour was FOR rather than by its literal value:
    ground          var(--ink) / #0f1420 / #241417  -> var(--paper-warm)
    body text       #f0ece4, rgba(255,255,255,.7-.9) -> var(--ink-light)
    emphasis        #fff                             -> var(--ink)
    faint/caption   rgba(255,255,255,.4-.6)          -> var(--ink-faint)
    hairlines       rgba(255,255,255,.1-.35)         -> var(--rule)
    tinted fill     rgba(255,255,255,.04-.08)        -> rgba(0,0,0,.04)
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['ai.html', 'gun-violence.html', 'immigration.html', 'iran.html',
         'space-race.html', 'ukraine.html', 'us-elections.html']
PANE = re.compile(r'update-pane|focus-pane|update-box|update-head|update-date|'
                  r'update-badge|update-grid|update-sources|mini-tl')

DARK_GROUNDS = ('var(--ink)', '#0f1420', '#241417', '#1a1a1a')


def rgba_to_token(m):
    """Map a white overlay to the light-ground token that does its job."""
    alpha = float(m.group(1))
    if alpha <= 0.08:
        return 'rgba(0, 0, 0, .04)'
    if alpha <= 0.35:
        return 'var(--rule)'
    if alpha <= 0.62:
        return 'var(--ink-faint)'
    return 'var(--ink-light)'


WHITE = re.compile(r'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)')


def convert(body):
    for g in DARK_GROUNDS:
        body = body.replace('background:' + g, 'background:var(--paper-warm)')
        body = body.replace('background: ' + g, 'background: var(--paper-warm)')
    body = body.replace('#f0ece4', 'var(--ink-light)')
    body = WHITE.sub(rgba_to_token, body)
    body = re.sub(r'color:\s*#fff\b', 'color:var(--ink)', body)
    body = re.sub(r'border-top-color:\s*#fff\b', 'border-top-color:var(--ink)', body)
    return body


def main():
    apply = '--apply' in sys.argv
    changed = 0
    for page in PAGES:
        path = os.path.join(ROOT, page)
        src = io.open(path, encoding='utf-8').read()
        m = re.search(r'(<style[^>]*>)([\s\S]*?)(</style>)', src)
        if not m:
            continue
        css = m.group(2)
        out = []
        i = 0
        hits = 0
        for rule in re.finditer(r'([^{}]+)\{([^}]*)\}', css):
            sel, body = rule.group(1), rule.group(2)
            if not PANE.search(sel):
                continue
            new = convert(body)
            # The pane-scoped tooltip inversions exist only because the ground
            # was dark. On a light pane the site's default tooltip is right,
            # so those rules are dropped rather than recoloured.
            if re.search(r'\.term::(after|before)', sel):
                new = None
            if new is None:
                out.append((rule.start(), rule.end(), ''))
                hits += 1
            elif new != body:
                out.append((rule.start(2), rule.end(2), new))
                hits += 1
        if hits and apply:
            for start, end, repl in sorted(out, key=lambda r: -r[0]):
                css = css[:start] + repl + css[end:]
            src = src[:m.start(2)] + css + src[m.end(2):]
            io.open(path, 'w', encoding='utf-8').write(src)
        print('%-22s %3d pane rule(s) %s' % (page, hits, 'converted' if apply else 'to convert'))
        changed += hits

    print()
    print('%d rules %s' % (changed, 'converted' if apply else '(dry run; --apply to convert)'))


if __name__ == '__main__':
    main()
