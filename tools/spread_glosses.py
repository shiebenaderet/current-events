#!/usr/bin/env python3
"""Gloss a term at its first mention in EVERY card, not just the first card.

Deep links (4.3.0) changed what "first mention" means. A term defined in
card 2 and used in card 6 was fine when everyone arrived at the top; it is
not fine when a teacher sends a student straight to card 6. 31 terms across
the site were in that state.

The fix is duplication, not a glossary: reading-intervention V4 marks an
end-of-document glossary as a FINDING and a same-sentence gloss as a pass,
so the definition belongs beside each use.

Conservative by construction:
  - only terms already glossed somewhere on that page, reusing that exact
    data-def, so no definition is invented here
  - first bare occurrence per card only
  - prose paragraphs only: never inside a heading, link, caption, existing
    .term, or the timeline's year tab
  - whole-word, case-sensitive-first match, so "rate" does not hit
    "accurate" and "crewed" does not hit "uncrewed"

Emits the same markup the pages already use: a .term span carrying data-def
and aria-describedby, plus its sr-only .term-desc sibling, which is what
Study Mode un-clips.
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, '/private/tmp/claude-501/-Users-shiebenaderet-Developer-current-events/'
                   '83277b57-ce31-482e-9cff-38e21e04ad09/scratchpad')
import quizlib  # noqa: E402

PAGES = ['ai.html', 'climate-change.html', 'gun-violence.html', 'immigration.html',
         'iran.html', 'space-race.html', 'ukraine.html', 'us-elections.html']

# Only terms worth the interruption: technical, and not carried by context.
# Chosen by reading each candidate in the card where it appears bare.
WORTH_IT = {
    'capsule', 'docking', 'crewed', 'uncrewed', 'satellite', 'referendum',
    'donbas', 'genocide', 'bolsheviks', 'militia', 'background check',
    'extreme risk protection order', 'green card', 'asylum', 'refugee',
    'naturalization', 'quota', 'proxy', 'sanctions', 'ceasefire',
    'neural network', 'algorithm', 'training data', 'greenhouse gas',
    'proxies', 'glacier', 'meta-analysis', 'per capita',
    # second pass: technical terms still arriving bare in a linkable card
    'backpropagation', 'parameters', 'silencers', 'school resource officer',
    'federally licensed dealers', 'national-origins quota', 'memorandum',
}

# Left bare on purpose. Proper nouns do not need re-defining at every mention
# (Geoffrey Hinton, the Keeling Curve, Sputnik 1, Revolutionary Guard), and
# some words are carried by the sentence around them well enough that a
# second gloss would interrupt more than it helps: commercial, currency,
# retaliatory, peace negotiations, refugees, ayatollah.

# Never inside these: the text is a label, a link or already glossed.
SKIP_IN = re.compile(
    r'<(h[1-6]|a|summary|button|figcaption)\b[^>]*>[\s\S]*?</\1>'
    r'|<span class="term"[\s\S]*?</span>\s*<span id="term-desc-\d+"[\s\S]*?</span>'
    r'|<div class="tl-year"[\s\S]*?</div>'
    r'|<span class="mini-tl-date"[\s\S]*?</span>'
    r'|class="cap"[\s\S]{0,400}?</div>',
    re.I)


def blanked(html):
    """Same string with un-glossable regions blanked, so offsets still line up."""
    return SKIP_IN.sub(lambda m: ' ' * len(m.group(0)), html)


def main():
    apply = '--apply' in sys.argv
    next_id = 9000            # far above any existing term-desc id
    total = 0

    for page in PAGES:
        path = os.path.join(ROOT, page)
        src = io.open(path, encoding='utf-8').read()

        defs = {}
        for m in re.finditer(r'<span class="term"[^>]*data-def="([^"]+)"[^>]*>'
                             r'([^<]{3,45})</span>', src):
            defs.setdefault(m.group(2).strip().lower(), m.group(1))

        edits = []
        for a, b, title, tag in quizlib.sections(src):
            if 'unfold-extra' in tag:
                continue
            body = src[a:b]
            safe = blanked(body)
            for term, definition in defs.items():
                if term not in WORTH_IT:
                    continue
                if re.search(r'<span class="term"[^>]*>%s</span>' % re.escape(term),
                             body, re.I):
                    continue                      # already glossed in this card
                m = re.search(r'\b(%s)\b' % re.escape(term), safe, re.I)
                if not m:
                    continue
                edits.append((a + m.start(), a + m.end(), m.group(1), definition))

        if not edits:
            print('%-22s nothing to add' % page)
            continue

        edits.sort(key=lambda e: -e[0])
        for start, end, word, definition in edits:
            tid = 'term-desc-%d' % next_id
            next_id += 1
            span = ('<span class="term" tabindex="0" data-def="%s" '
                    'aria-describedby="%s">%s</span>'
                    '<span id="%s" class="term-desc">%s</span>'
                    % (definition, tid, word, tid, definition))
            if apply:
                src = src[:start] + span + src[end:]
        if apply:
            io.open(path, 'w', encoding='utf-8').write(src)
        print('%-22s %2d gloss(es) %s' % (page, len(edits),
                                          'added' if apply else 'to add'))
        total += len(edits)

    print()
    print('%d gloss(es) %s' % (total, 'added' if apply else '(dry run; --apply)'))


if __name__ == '__main__':
    main()
