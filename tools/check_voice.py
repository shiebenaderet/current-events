#!/usr/bin/env python3
"""Angle 2 — content consistency. Check the standing editorial rules that a
machine can actually check.

Every rule here comes from docs/VOICE.md. This does not judge prose; it finds
places where a rule the project already made for itself is not being kept, so
a person can look at those rather than at all 85 sections.

Deliberately NOT checked here, because they need judgement rather than
matching: whether the second sentence is a consequence of the first, whether
a contested question stays contested, whether a source supports its claim.

Reports; never edits.
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

# VOICE: "Never use undated now / today / currently / right now for an
# ongoing event." Historical "today" is allowed, so the match needs a
# present-tense frame around it rather than the bare word.
UNDATED = re.compile(
    r'\b(?:right now|currently|as of (?:today|now))\b'
    r'|\b(?:is|are|has|have|remains?|stands?|sits?)\s+(?:still\s+)?(?:now|currently)\b'
    r'|\bnow\s+(?:holds?|leads?|controls?|runs?|faces?)\b',
    re.I)

# VOICE explicitly allows historical "now" that cannot be read as a news
# ticker — "born in what is now Afghanistan" is a place name, not a claim
# about this week. A crisis line saying help is available right now is also
# correct and should stay that way.
UNDATED_OK = re.compile(
    r'what is now|what are now|in what is|988|crisis|lifeline|help is available',
    re.I)

# VOICE: "Do not talk about the page." Functional notes are exempt.
PAGE_TALK = re.compile(
    r'\b(?:this page|this section|further down this page|below on this page|'
    r'the section above|the section below|earlier on this page|later on this page)\b',
    re.I)
# VOICE exempts functional notes. "Sources for this section" is the label on
# a disclosure widget, not prose addressing the reader about the page, and it
# accounted for 20 of the first run's 28 hits — a gate nobody would use.
PAGE_TALK_OK = re.compile(
    r'nonpartisan|sourced|konami|does not store|content warning|discussion|'
    r'trusted sources|how it.s sourced|sources for this section|'
    r'questions for class|think about it|photo|photograph|credit', re.I)

# The card model broke positional reference: a card is the whole view, so
# "the chart above" may be in a card the reader never opened.
# Only CROSS-SECTION references break under the card model. Inside one card
# "the map below" is still the map below — the card is the whole view, so
# within it, position is real. What breaks is pointing at another card.
POSITIONAL = re.compile(
    r'\b(?:section|sections|part|parts|page)\s+(?:above|below)\b'
    r'|\b(?:above|below)\s+(?:in|on)\s+(?:this|the)\s+page\b'
    r'|\bearlier section|\blater section',
    re.I)

STRIP = re.compile(r'<(script|style)[\s\S]*?</\1>')
TAGS = re.compile(r'<[^>]+>')


def text_of(fragment, drop_glosses=False):
    if drop_glosses:
        # .term-desc is screen-reader-only in the default view, so its words
        # are not prose the reader wades through. Counting them pushed a
        # 93-word flash item past the 150-word threshold purely because it
        # had been glossed.
        fragment = re.sub(r'<span id="term-desc-[^"]*" class="term-desc">'
                          r'[\s\S]*?</span>', ' ', fragment)
    t = TAGS.sub(' ', STRIP.sub(' ', fragment))
    return re.sub(r'\s+', ' ', t)


def context(text, m, width=70):
    a = max(0, m.start() - width)
    return ('…' if a else '') + text[a:m.end() + width].strip() + '…'


def main():
    findings = {'undated': [], 'page-talk': [], 'positional': [], 'no-before-read': []}

    for page in PAGES:
        src = io.open(os.path.join(ROOT, page), encoding='utf-8').read()
        for a, b, title, tag in quizlib.sections(src):
            body = src[a:b]
            text = text_of(body)
            where = '%s · %s' % (page.replace('.html', ''), title)
            reference_card = ('unfold-extra' in tag
                              or re.search(r'source|question|keep learning|'
                                           r'video|key people|dig deeper',
                                           title, re.I) is not None)

            for m in UNDATED.finditer(text):
                near = text[max(0, m.start() - 90):m.end() + 90]
                if UNDATED_OK.search(near):
                    continue
                findings['undated'].append((where, context(text, m)))

            # Reference cards (Sources, Keep learning, Questions for class)
            # are where VOICE's exempt cases live: sourcing notes and
            # discussion prompts that treat the explainer as a classroom
            # object. Flagging them is noise, and noise is how a gate dies.
            for m in PAGE_TALK.finditer(text):
                near = text[max(0, m.start() - 120):m.end() + 120]
                if reference_card or PAGE_TALK_OK.search(near):
                    continue
                findings['page-talk'].append((where, context(text, m)))

            for m in POSITIONAL.finditer(text):
                findings['positional'].append((where, context(text, m)))

            # VOICE: every substantial section opens with a Before you read.
            # Navigational sections and anything under 150 words do not.
            words = len(re.findall(r"[A-Za-z][A-Za-z'’-]*",
                                   text_of(body, drop_glosses=True)))
            if words >= 150 and not reference_card and 'before-read' not in body:
                findings['no-before-read'].append((where, '%d words' % words))

    total = sum(len(v) for v in findings.values())
    labels = {
        'undated': 'UNDATED "now / currently" on an ongoing event  (VOICE: Date the news)',
        'page-talk': 'TALKS ABOUT THE PAGE  (VOICE: Do not talk about the page)',
        'positional': 'POSITIONAL REFERENCE — a card is the whole view, so "above" may be unread',
        'no-before-read': 'SUBSTANTIAL SECTION WITH NO "Before you read"',
    }
    for key in ('undated', 'page-talk', 'positional', 'no-before-read'):
        items = findings[key]
        print('── %s ── %d' % (labels[key], len(items)))
        for where, ctx in items:
            print('   %-34s %s' % (where[:34], ctx[:110]))
        print()

    print('%d finding(s) across %d pages' % (total, len(PAGES)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
