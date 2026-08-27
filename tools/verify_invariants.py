#!/usr/bin/env python3
"""Compare structural invariants between a git ref and the working tree.

The repo has no tests. These counts are the regression suite: if any of them
moves during a task that was not meant to touch content, something broke.

Usage:  python3 tools/verify_invariants.py main us-elections.html
        python3 tools/verify_invariants.py HEAD          # all topic pages
"""
import glob
import re
import subprocess
import sys

PATTERNS = {
    "cite-inline": r'class="cite-inline"',
    "term": r'class="term"',
    "term-desc": r'class="term-desc"',
    "div-open": r'<div',
    "div-close": r'</div>',
    "img": r'<img',
    "onerror": r'onerror=',
}


def counts(text):
    return {name: len(re.findall(pat, text)) for name, pat in PATTERNS.items()}


def dup_ids(text):
    ids = re.findall(r'id="([^"]+)"', text)
    return sorted({i for i in ids if ids.count(i) > 1})


def at_ref(ref, path):
    r = subprocess.run(["git", "show", f"{ref}:{path}"],
                       capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else None


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: verify_invariants.py <git-ref> [file...]")
    ref = sys.argv[1]
    targets = sys.argv[2:] or sorted(glob.glob("*.html"))
    failed = False

    for path in targets:
        now = open(path, encoding='utf-8').read()
        before = at_ref(ref, path)
        cur = counts(now)

        dups = dup_ids(now)
        if dups:
            print(f"DIFF {path} duplicate-ids: {', '.join(dups)}")
            failed = True

        if cur["div-open"] != cur["div-close"]:
            print(f"DIFF {path} div-balance: "
                  f"{cur['div-open']} open vs {cur['div-close']} close")
            failed = True

        if cur["img"] != cur["onerror"]:
            print(f"DIFF {path} img-without-onerror: "
                  f"{cur['img']} img vs {cur['onerror']} onerror")
            failed = True

        if cur["term"] != cur["term-desc"]:
            print(f"DIFF {path} term-pair: "
                  f"{cur['term']} term vs {cur['term-desc']} term-desc")
            failed = True

        if before is None:
            print(f"NEW  {path} (not present at {ref})")
            continue

        old = counts(before)
        for name in ("cite-inline", "term", "term-desc"):
            if old[name] != cur[name]:
                print(f"DIFF {path} {name}: {old[name]} -> {cur[name]}")
                failed = True

        # data-def text must survive byte-identical
        old_defs = re.findall(r'data-def="([^"]*)"', before)
        new_defs = re.findall(r'data-def="([^"]*)"', now)
        if old_defs != new_defs:
            print(f"DIFF {path} data-def text changed")
            failed = True

    print("FAIL" if failed else "OK: all invariants hold")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
