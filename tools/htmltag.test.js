/* The '>' inside an attribute value.
 *
 * Every portrait on this site carries:
 *
 *   onerror="this.outerHTML='<div class=\'emoji-fallback\'>🖥️</div>'"
 *
 * so `<img\b[^>]*>` ends at the '>' that closes that inner <div>. Appending
 * loading="lazy" after such a match put it inside the attribute value and
 * produced stray </div> on eight pages at once — caught by a well-formedness
 * check, not by any test, which is why these exist now.
 *
 * The Python matcher in tools/htmltag.py is the fix. These assert the
 * property it has to keep, against the real pages.
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const PAGES = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));

/** Attribute-aware tag scan: the JS twin of tools/htmltag.py find_tags. */
function findTags(html, name) {
  const out = [];
  const re = new RegExp(`<${name}\\b`, 'gi');
  let m;
  while ((m = re.exec(html))) {
    let i = re.lastIndex;
    let quote = null;
    while (i < html.length) {
      const c = html[i];
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") {
        quote = c;
      } else if (c === '>') {
        out.push([m.index, i + 1]);
        break;
      }
      i++;
    }
  }
  return out;
}

test('every page is well-formed: no stray or unclosed tags', () => {
  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img',
    'input', 'link', 'meta', 'source', 'track', 'wbr']);
  for (const page of PAGES) {
    // Script and style contents are CDATA: a '<' in a JS string or a CSS
    // comment is not a tag. Python's HTMLParser knows that; this walker has
    // to be told, or it reports stray tags on perfectly good pages.
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8')
      .replace(/<script\b[\s\S]*?<\/script>/gi, '<script></script>')
      .replace(/<style\b[\s\S]*?<\/style>/gi, '<style></style>');
    const stack = [];
    const stray = [];
    const re = /<(\/?)([a-zA-Z][\w-]*)\b/g;
    let m;
    let i = 0;
    // walk with the same quote-awareness so attribute contents are skipped
    const tags = [];
    while (i < html.length) {
      const lt = html.indexOf('<', i);
      if (lt < 0) break;
      re.lastIndex = lt;
      const mm = re.exec(html);
      if (!mm || mm.index !== lt) { i = lt + 1; continue; }
      let j = re.lastIndex;
      let quote = null;
      while (j < html.length) {
        const c = html[j];
        if (quote) { if (c === quote) quote = null; }
        else if (c === '"' || c === "'") quote = c;
        else if (c === '>') break;
        j++;
      }
      const closing = mm[1] === '/';
      const name = mm[2].toLowerCase();
      const selfClosing = html[j - 1] === '/';
      // No special-casing: the contents are already collapsed above, so
      // <script></script> balances like any other pair. Filtering only the
      // OPENING tag left every closing one looking stray.
      tags.push({ closing, name, selfClosing });
      i = j + 1;
    }
    for (const t of tags) {
      if (VOID.has(t.name) || t.selfClosing) continue;
      if (!t.closing) stack.push(t.name);
      else {
        const at = stack.lastIndexOf(t.name);
        if (at < 0) stray.push(t.name);
        else stack.length = at;
      }
    }
    assert.deepEqual(stray, [], `${page} has stray closing tags: ${stray.slice(0, 4)}`);
  }
});

test('an attribute containing ">" does not truncate its tag', () => {
  // The exact shape that broke: HTML inside onerror.
  const sample = `<img src="a.jpg" alt="A" onerror="this.outerHTML='<div class=\\'x\\'>!</div>'">`;
  const [[start, end]] = findTags(sample, 'img');
  assert.equal(start, 0);
  assert.equal(end, sample.length, 'tag should span to the real closing bracket');
  const naive = sample.match(/<img\b[^>]*>/)[0];
  assert.notEqual(naive.length, sample.length,
    'the naive pattern should be shown to fail here');
});

test('the pages really do contain such attributes, so this matters', () => {
  let withHtmlInAttr = 0;
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    for (const [a, b] of findTags(html, 'img')) {
      if (/onerror="[^"]*<[a-z]/i.test(html.slice(a, b))) withHtmlInAttr++;
    }
  }
  assert.ok(withHtmlInAttr > 0,
    'expected images whose onerror contains markup — the trap this guards');
});

test('deferred images did not lose their fallback handler', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    for (const [a, b] of findTags(html, 'img')) {
      const tag = html.slice(a, b);
      if (!/loading="lazy"/.test(tag)) continue;
      if (!/onerror=/.test(tag)) continue;
      assert.ok(/onerror="[^"]*"/.test(tag),
        `${page}: an onerror was truncated — ${tag.slice(0, 90)}`);
    }
  }
});
