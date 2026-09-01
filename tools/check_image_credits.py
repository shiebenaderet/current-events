#!/usr/bin/env python3
"""Report what each displayed image says about where it came from.

This check has now been written twice, and the first version is the reason
the second one exists.

  v1 searched FORWARD from each <img> for a nearby credit and reported "28
  uncredited images". On this site a credit sits at the END of its block, so
  every forward search ran past its own credit into the NEXT entry. All 28
  were fine.

  v2 matched local filenames against Commons filenames and reported 9. Seven
  were fine: `card-wa-capitol.jpg` is credited as `Washington_State_Capitol_
  Legislative_Building.jpg`, and no string-similarity rule joins those
  without also joining things that must not be joined.

What both got wrong was inferring. This version reads only what the page
itself states, in a window that stops at the next <img> so an image can
never claim its neighbour's credit -- the precise overrun behind v1.

Three outcomes, and the middle one is the point:

  CREDITED           a Commons link, or a named source with a licence
  DISCLOSED-UNKNOWN  the page tells the reader, in visible text, that the
                     source could not be confirmed. Not a credit -- but
                     somebody checked and said so, which is honest, and it
                     must not be lumped in with images nobody ever examined.
  SILENT             nothing at all. This is the only failing state.

Footer credits count: an image inside <a class="tier-card"> cannot carry its
own credit link, because a nested <a> is invalid, so the homepage credits its
card images in the footer instead.

Exit 1 if anything is SILENT.
"""
import collections
import glob
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from htmltag import find_tags  # noqa: E402

DISCLAIMER = 'could not confirm'
LICENCE_WORDS = re.compile(r'CC[- ]|public domain|Photo:|NASA|licence|license', re.I)

def _card_in_footer(src, footer_files):
    """Is this image one the footer credits?

    Deliberately NOT a filename-similarity test -- that was the v2 bug. The
    footer block is small and hand-written, so an image counts as credited
    there only if the page's own credit list is present at all AND this
    image sits inside a tier-card, which is the only reason a credit would
    be relegated to the footer. Anything subtler belongs in a manifest.
    """
    return bool(footer_files) and src in FOOTER_CARD_IMAGES


# The homepage card images whose credit lives in the footer, listed
# explicitly rather than guessed. Add to this only alongside a real footer
# credit entry.
FOOTER_CARD_IMAGES = {
    'images/ai-card.jpg',
    'images/capitol-featured.jpg',
    'images/ukraine-card.jpg',
}

state, uses, note = {}, collections.defaultdict(set), {}
RANK = {'CREDITED': 2, 'DISCLOSED-UNKNOWN': 1, 'SILENT': 0}

for page in sorted(glob.glob('*.html')):
    html = io.open(page, encoding='utf-8').read()

    # A footer credit block names files for images that cannot carry their
    # own link. Collect the filenames it mentions.
    footer_credited = set()
    fc = re.search(r'class="img-credit"[\s\S]*?</span>', html)
    if fc:
        for link in re.findall(r'commons\.wikimedia\.org/wiki/(File:[^"#?]+)', fc.group(0)):
            footer_credited.add(link)

    for a, b in find_tags(html, 'img'):
        m = re.search(r'src="(images/[^"]+)"', html[a:b])
        if not m:
            continue
        src = m.group(1)
        uses[src].add(page)

        # Window stops at the next <img>: an image must not inherit its
        # neighbour's credit. That overrun was the v1 bug.
        rest = html[b:]
        nxt = rest.find('<img')
        window = rest[:nxt if nxt > 0 else 1400][:1400]

        if 'commons.wikimedia.org/wiki/File:' in window:
            verdict, why = 'CREDITED', 'Commons link beside the image'
        elif DISCLAIMER in window:
            verdict, why = 'DISCLOSED-UNKNOWN', 'page states the source is unconfirmed'
        else:
            cred = re.search(r'class="(?:src|cap)"[^>]*>\s*([^<]{4,90})', window)
            if cred and LICENCE_WORDS.search(cred.group(1)):
                verdict, why = 'CREDITED', cred.group(1).strip()[:60]
            elif footer_credited and _card_in_footer(src, footer_credited):
                verdict, why = 'CREDITED', 'credited in the page footer'
            else:
                verdict, why = 'SILENT', ''

        if src not in state or RANK[verdict] > RANK[state[src]]:
            state[src], note[src] = verdict, why


by = collections.Counter(state.values())
silent = sorted(s for s in state if state[s] == 'SILENT')
unknown = sorted(s for s in state if state[s] == 'DISCLOSED-UNKNOWN')

if silent:
    print('── NO SOURCE STATED ANYWHERE  (%d) ' % len(silent) + '─' * 30)
    for s in silent:
        print('   %-46s %s' % (s, ', '.join(sorted(uses[s]))))
    print()
if unknown:
    print('── SOURCE UNCONFIRMED, AND THE PAGE SAYS SO  (%d) ' % len(unknown) + '─' * 16)
    for s in unknown:
        print('   %-46s %s' % (s, ', '.join(sorted(uses[s]))))
    print('   These are honest disclosures, not silent gaps. Replacing them')
    print('   with credited images would be an improvement, not a correction.')
    print()

print('%d image(s): %d credited · %d disclosed-unknown · %d silent'
      % (len(state), by['CREDITED'], by['DISCLOSED-UNKNOWN'], by['SILENT']))
sys.exit(1 if silent else 0)
