#!/usr/bin/env python3
"""Word counts and reading times for the topic pages.

Single source of truth for every "N min" figure on the site. Re-run it after a
content refresh; if a printed minute value no longer matches the .br-time in the
page, the page is stale.

Prose = text inside <p> only. Headings, nav, captions, scripts and styles are
excluded, because a student reads the paragraphs.
"""
import csv
import glob
import os
import re
import sys

WPM = 130  # middle-school silent reading, deliberately not an adult rate

# Sections that are navigational or too thin to warrant an entry block.
SKIP_TITLE = re.compile(
    r'you found a secret|videos|dig deeper|keep learning|all sources'
    r'|key people|two historical figures|see it happen|questions for class'
    r'|ranked reading|\(page lead\)', re.I)
MIN_WORDS = 150


def strip_code(html):
    html = re.sub(r'<script.*?</script>', '', html, flags=re.S)
    return re.sub(r'<style.*?</style>', '', html, flags=re.S)


def prose_words(fragment):
    paras = re.findall(r'<p[^>]*>(.*?)</p>', fragment, flags=re.S)
    text = " ".join(re.sub(r'<[^>]+>', ' ', p) for p in paras)
    text = re.sub(r'&[a-z]+;', ' ', text)
    return len(re.findall(r"[A-Za-z][A-Za-z'-]*", text))


def minutes(words):
    return max(1, round(words / WPM))


def sections(path):
    """Yield (section_id, title, words) for each <h2> section.

    Split on every <h2>, NOT on <div class="sec-head">. The dated "Where Things
    Stand" pane on every page uses .update-head instead of .sec-head, and it is
    the section most likely to be assigned on its own. Splitting on sec-head
    alone silently drops it and undercounts every page -- gun-violence reads
    8,749 words instead of 9,715 that way.
    """
    html = strip_code(open(path, encoding='utf-8').read())
    parts = re.split(r'(<h2[^>]*>.*?</h2>)', html, flags=re.S)
    # Prose before the first <h2> is the hero dek and standfirst. A student reads
    # it, so it counts toward the page total, but it is not an assignable section
    # and never gets a block.
    lead = prose_words(parts[0])
    if lead:
        yield "", "(page lead)", lead
    for i in range(1, len(parts), 2):
        head = parts[i]
        body = parts[i + 1] if i + 1 < len(parts) else ""
        title = re.sub(r'<[^>]+>', '', head).strip()
        # The id may sit on the h2 itself or on the wrapper just before it.
        sid = ""
        m = re.search(r'id="([^"]+)"', head)
        if m:
            sid = m.group(1)
        else:
            pre = parts[i - 1][-500:] if i >= 1 else ""
            ids = re.findall(r'id="([^"]+)"', pre)
            if ids:
                sid = ids[-1]
        yield sid, title, prose_words(body)


def wants_block(title, words):
    return not SKIP_TITLE.search(title) and words >= MIN_WORDS


LANDING_MAX_MIN = 7  # spec: the entry point is 5-7 minutes


def landing_fragment(html):
    """Everything outside the unfold details -- i.e. the landing layer.

    Deliberately a structural test, not a class-name test: a <p> counts as
    landing prose exactly when no <details class="unfold"> encloses it, so
    the measurement cannot drift as landing markup gains new wrappers.
    """
    html = strip_code(html)
    return re.sub(r'<details[^>]*class="[^"]*unfold[^"]*"[^>]*>.*?</details>',
                  '', html, flags=re.S)


def landing_sections(path):
    """Yield (title, words) for landing prose only.

    Two exclusions, for different reasons. The unfold <details> are excluded
    because a student reaches them by choosing to; end matter (Key People,
    Videos, Dig Deeper) is excluded because it is reference material a
    student browses, not the entry-point read -- the same SKIP_TITLE rule
    that decides which sections get wrapped in the first place.
    """
    html = landing_fragment(open(path, encoding='utf-8').read())
    parts = re.split(r'(<h2[^>]*>.*?</h2>)', html, flags=re.S)
    # The hero dek sits before the first <h2>. It is the first thing a
    # student reads, so it counts here, even though sections() labels it
    # "(page lead)" and SKIP_TITLE screens that label out elsewhere.
    lead = prose_words(parts[0])
    if lead:
        yield "(hero dek)", lead
    for i in range(1, len(parts), 2):
        title = re.sub(r'<[^>]+>', '', parts[i]).strip()
        if SKIP_TITLE.search(title):
            continue
        body = parts[i + 1] if i + 1 < len(parts) else ""
        words = prose_words(body)
        if words:
            yield title, words


def landing_report(paths):
    rows, failed = [], False
    for path in paths:
        if 'class="unfold"' not in open(path, encoding='utf-8').read():
            continue
        words = sum(w for _, w in landing_sections(path))
        mins = minutes(words)
        over = mins > LANDING_MAX_MIN
        failed = failed or over
        rows.append((path, words, mins, 'OVER' if over else 'ok'))
    return rows, failed


def main():
    if '--landing' in sys.argv:
        paths = [a for a in sys.argv[1:] if a != '--landing'] or sorted(
            f for f in glob.glob("*.html") if f != "index.html")
        rows, failed = landing_report(paths)
        print('page,landing_words,landing_minutes,status')
        for r in rows:
            print(','.join(str(x) for x in r))
        print('FAIL: landing layer over %d min' % LANDING_MAX_MIN
              if failed else 'OK: landing layers within budget')
        return 1 if failed else 0

    targets = sys.argv[1:] or sorted(
        f for f in glob.glob("*.html") if f != "index.html")
    out = csv.writer(sys.stdout)
    out.writerow(["page", "section_id", "title", "words", "minutes", "wants_block"])
    for path in targets:
        if not os.path.exists(path):
            sys.exit(f"missing: {path}")
        total = 0
        for sid, title, words in sections(path):
            total += words
            out.writerow([path, sid, title, words, minutes(words),
                          "yes" if wants_block(title, words) else "no"])
        out.writerow([path, "TOTAL", "", total, minutes(total), ""])


if __name__ == "__main__":
    # sys.exit(main()) so --landing can fail a build. main() returns None on
    # the default path, and sys.exit(None) exits 0.
    sys.exit(main())
