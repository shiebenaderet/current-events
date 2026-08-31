#!/usr/bin/env python3
"""Stamp the build version into every page: cache-busted assets, and a
visible build number in the footer.

Why this exists. GitHub Pages serves site.css with `cache-control:
max-age=600` and no fingerprint in the filename, so a browser that has the
file keeps using it. A shipped change is then live and invisible at the same
time — which is exactly what happened with the 4.4.0 timeline: the CSS and
JS were both correct on the server while the page still rendered the old
layout, and there was no way to tell that from looking.

Two fixes, both here so they can never drift apart:

  1. ?v=<version> on every local .css and .js reference. The URL changes
     when the version does, so the browser has to fetch it. This is the part
     that actually solves the problem.
  2. A build number in the footer, so anyone looking at a page can say which
     build they are looking at without opening devtools.

Run after bumping VERSION, before committing:

    python3 tools/stamp_version.py

Idempotent: run it twice and nothing changes the second time.
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['index.html', 'ai.html', 'climate-change.html', 'gun-violence.html',
         'immigration.html', 'iran.html', 'space-race.html', 'ukraine.html',
         'us-elections.html']

# Local assets only. A ?v= on a CDN or Google Fonts URL would just miss its
# cache for no benefit, and on some hosts breaks the request outright.
ASSET = re.compile(r'(?P<attr>href|src)="(?P<path>(?!https?:|//)[^"?#]+\.(?:css|js))'
                   r'(?:\?v=[^"]*)?"')
# Strips the separator too, or a second run stacks another <br> in front of
# the stamp and the tool stops being idempotent.
STAMP = re.compile(r'(?:<br>\s*)*<span class="build-version">[^<]*</span>\s*')


def main():
    version = io.open(os.path.join(ROOT, 'VERSION'), encoding='utf-8').read().strip()
    if not re.fullmatch(r'\d+\.\d+\.\d+', version):
        sys.exit('VERSION is not a semver triple: %r' % version)

    changed = 0
    for page in PAGES:
        path = os.path.join(ROOT, page)
        src = io.open(path, encoding='utf-8').read()
        before = src

        src = ASSET.sub(
            lambda m: '%s="%s?v=%s"' % (m.group('attr'), m.group('path'), version),
            src)

        # One build stamp per page, at the end of the footer.
        src = STAMP.sub('', src)
        stamp = ('<span class="build-version">Build %s</span>' % version)
        idx = src.rfind('</footer>')
        if idx < 0:
            sys.exit('%s: no </footer> to stamp' % page)
        src = src[:idx] + '<br>' + stamp + src[idx:]

        if src != before:
            io.open(path, 'w', encoding='utf-8').write(src)
            changed += 1
        n = len(ASSET.findall(src))
        print('  %-22s %d asset(s) stamped' % (page, n))

    print('\nversion %s stamped into %d page(s)' % (version, changed))


if __name__ == '__main__':
    main()
