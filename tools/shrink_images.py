#!/usr/bin/env python3
"""Resize images to the size they are actually displayed at.

The site ships 23.7 MB of images, and the homepage alone loads 4.0 MB of
card art with no lazy-loading. On a classroom network that is thirty
simultaneous copies of the same 4 MB.

The mismatch is not marginal. james-madison.jpg is 2465x3000 and displays in
a 110px circle — twenty-two times the dimension it needs, at 2.7 MB.

Each image is capped by how it is USED, at roughly 3x the display size so it
still looks right on a retina screen and at larger text settings:

    .person portrait   110px circle       ->  400px long edge
    homepage card      170px tall band    -> 1000px long edge
    hero background    full-bleed         -> 1800px long edge
    anything else      column width       -> 1400px long edge

Uses sips, which ships with macOS, so this adds no dependency to a repo that
deliberately has none. Originals stay recoverable in git history.

    python3 tools/shrink_images.py            # report
    python3 tools/shrink_images.py --apply    # resize
"""
import io
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(ROOT, 'images')
PAGES = [f for f in os.listdir(ROOT) if f.endswith('.html')]

CAPS = [('portrait', 400), ('card', 1000), ('hero', 1800), ('other', 1400)]
QUALITY = 'normal'          # sips: low | normal | high | best


def classify():
    """How is each image used? Widest use wins."""
    use = {}
    for page in PAGES:
        src = io.open(os.path.join(ROOT, page), encoding='utf-8').read()

        for m in re.finditer(r'url\([\'"]?images/([^\'")]+)', src):
            use.setdefault(m.group(1), set()).add('hero')

        for m in re.finditer(r'<div class="person"[^>]*>[\s\S]{0,400}?'
                             r'<img[^>]*src="images/([^"]+)"', src):
            use.setdefault(m.group(1), set()).add('portrait')

        for m in re.finditer(r'<div class="tier-photo"[^>]*>\s*'
                             r'<img[^>]*src="images/([^"]+)"', src):
            use.setdefault(m.group(1), set()).add('card')

        # 'other' is a FALLBACK, not an additional use. Adding it to every
        # <img> made each portrait "portrait AND other", and since the widest
        # use wins, every 110px portrait was capped at 1400px — which is how
        # james-madison.jpg kept its 2.7 MB.
        for m in re.finditer(r'<img[^>]*src="images/([^"]+)"', src):
            use.setdefault(m.group(1), set())

    for name, kinds in use.items():
        if not kinds:
            kinds.add('other')
    return use


def dims(path):
    out = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', path],
                         capture_output=True, text=True).stdout
    w = re.search(r'pixelWidth: (\d+)', out)
    h = re.search(r'pixelHeight: (\d+)', out)
    return (int(w.group(1)), int(h.group(1))) if w and h else (0, 0)


def main():
    apply = '--apply' in sys.argv
    use = classify()
    rows = []
    for name in sorted(os.listdir(IMAGES)):
        path = os.path.join(IMAGES, name)
        if not os.path.isfile(path) or not name.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        kinds = use.get(name, {'other'})
        # widest use wins: an image used as both portrait and hero is a hero
        cap = max(c for k, c in CAPS if k in kinds) if kinds & {k for k, _ in CAPS} else 1400
        w, h = dims(path)
        long_edge = max(w, h)
        before = os.path.getsize(path)
        if long_edge <= cap and before < 400 * 1024:
            continue
        rows.append((name, sorted(kinds), w, h, cap, before))

    if not rows:
        print('nothing oversized')
        return

    print('%-42s %-10s %11s %6s %9s' % ('image', 'used as', 'now', 'cap', 'size'))
    saved = 0
    for name, kinds, w, h, cap, before in rows:
        path = os.path.join(IMAGES, name)
        print('%-42s %-10s %5dx%-5d %6d %8dKB' % (name[:42], kinds[0], w, h, cap, before // 1024))
        if apply:
            subprocess.run(['sips', '-Z', str(cap), '-s', 'formatOptions', QUALITY,
                            path, '--out', path],
                           capture_output=True)
            saved += before - os.path.getsize(path)

    print()
    if apply:
        total = sum(os.path.getsize(os.path.join(IMAGES, f))
                    for f in os.listdir(IMAGES)
                    if os.path.isfile(os.path.join(IMAGES, f)))
        print('%d image(s) resized, %.1f MB saved, %.1f MB remaining'
              % (len(rows), saved / 1024 / 1024, total / 1024 / 1024))
    else:
        print('%d image(s) oversized (dry run; --apply to resize)' % len(rows))


if __name__ == '__main__':
    main()
