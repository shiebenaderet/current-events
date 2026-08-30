/* Study Mode -- integration harness (Task 8, Step 2').
   Spec: .superpowers/sdd/2026-08-28-study-mode-implementation/task-8-brief.md

   Task 8's Step 2 ("load each page in a browser, toggle Study Mode, watch it
   work") cannot run here -- this environment has no browser. This file is
   the replacement: it parses each real page's actual HTML into a small,
   real DOM (built from node:fs + a hand-rolled parser, no library), loads
   the real study-mode.js source into a node:vm sandbox backed by that DOM
   (extending the same technique tools/study-mode.test.js already uses
   around its FakeIntersectionObserver, ~line 285 on), and drives the real
   `apply('on')` / `apply('off')` lifecycle against it.

   Only node builtins are used: node:test, node:assert, node:vm, node:fs.
   No new dependency is introduced.

   SCOPE OF THE DOM STUB. This is not a general HTML/CSS engine. It supports
   exactly the DOM surface study-mode.js is observed to call (see the
   selector engine note below) -- nothing more. Where that is a genuine
   limitation on what this harness can prove, it is called out in a comment
   at the point it matters, not silently worked around. */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

/* ───────────────────────── minimal DOM ───────────────────────── */

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);
const RAW_TEXT_TAGS = new Set(['script', 'style']);

function decodeEntities(text) {
  return String(text)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

class TextNode {
  constructor(value) {
    this.nodeType = 3;
    this.nodeValue = value;
    this.parentNode = null;
  }
  get textContent() { return this.nodeValue; }
  set textContent(v) { this.nodeValue = String(v); }
  get nextSibling() { return siblingAfter(this); }
  // Real DOM Text.splitText: this node keeps [0, offset), a new sibling
  // text node gets [offset, end), inserted immediately after this one.
  splitText(offset) {
    const rest = this.nodeValue.slice(offset);
    this.nodeValue = this.nodeValue.slice(0, offset);
    const created = new TextNode(rest);
    const parent = this.parentNode;
    if (parent) {
      const idx = parent.childNodes.indexOf(this);
      parent.childNodes.splice(idx + 1, 0, created);
      created.parentNode = parent;
    }
    return created;
  }
}

function siblingAfter(node) {
  const parent = node.parentNode;
  if (!parent) return null;
  const idx = parent.childNodes.indexOf(node);
  return idx === -1 ? null : (parent.childNodes[idx + 1] || null);
}

function makeClassList(el) {
  const read = () => (el.attrs.class || '').split(/\s+/).filter(Boolean);
  const write = (arr) => {
    // Canonicalization: an empty class list is stored as NO class attribute
    // at all, not class="". This matches how these pages are authored (no
    // element ships a bare class="") and keeps the round-trip check in
    // "teardown returns the DOM to its pre-activation state" a real
    // structural comparison rather than one that spuriously fails over an
    // attribute-presence quirk of this stub. Semantically the two are
    // equivalent in HTML/CSS (an empty class list matches nothing either
    // way); this just picks the representation the source files use.
    if (arr.length) el.attrs.class = arr.join(' ');
    else delete el.attrs.class;
  };
  const list = read();
  list.contains = (c) => read().indexOf(c) !== -1;
  list.add = (c) => { const a = read(); if (a.indexOf(c) === -1) { a.push(c); write(a); } };
  list.remove = (c) => write(read().filter((x) => x !== c));
  list.toggle = (c, force) => {
    const has = list.contains(c);
    if (force === undefined) { if (has) list.remove(c); else list.add(c); return !has; }
    if (force) list.add(c); else list.remove(c);
    return !!force;
  };
  return list;
}

class Element {
  constructor(tagName, attrs) {
    this.nodeType = 1;
    this.tagName = String(tagName).toUpperCase();
    this.attrs = attrs || {};
    this.childNodes = [];
    this.parentNode = null;
    this._listeners = {};
    this.style = {};
  }
  get id() { return this.attrs.id || ''; }
  set id(v) { this.attrs.id = String(v); }
  // study-mode.js assigns el.className on every node it creates. Without
  // this accessor the assignment landed on a plain JS property and the
  // stub's classList/selector engine never saw the class -- so a check
  // written against '.sm-gloss' silently matched nothing. Mapping it to
  // attrs.class, as the real DOM does, is what makes the fix-round-3 gloss
  // assertions below able to fail.
  get className() { return this.attrs.class || ''; }
  set className(v) { this.attrs.class = String(v); }
  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attrs, name) ? this.attrs[name] : null;
  }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  removeAttribute(name) { delete this.attrs[name]; }
  get classList() { return makeClassList(this); }
  get textContent() {
    let s = '';
    for (const c of this.childNodes) s += c.textContent;
    return s;
  }
  set textContent(v) {
    const t = new TextNode(String(v));
    t.parentNode = this;
    this.childNodes = [t];
  }
  get innerHTML() { return this.childNodes.map(serializeNode).join(''); }
  set innerHTML(html) {
    const nodes = parseNodes(String(html));
    for (const n of nodes) n.parentNode = this;
    this.childNodes = nodes;
  }
  appendChild(child) { child.parentNode = this; this.childNodes.push(child); return child; }
  insertBefore(newNode, refNode) {
    newNode.parentNode = this;
    if (refNode == null) { this.childNodes.push(newNode); return newNode; }
    const idx = this.childNodes.indexOf(refNode);
    this.childNodes.splice(idx === -1 ? this.childNodes.length : idx, 0, newNode);
    return newNode;
  }
  removeChild(child) {
    const idx = this.childNodes.indexOf(child);
    if (idx !== -1) this.childNodes.splice(idx, 1);
    child.parentNode = null;
    return child;
  }
  get nextSibling() { return siblingAfter(this); }
  get nextElementSibling() {
    if (!this.parentNode) return null;
    const sibs = this.parentNode.childNodes;
    let idx = sibs.indexOf(this);
    for (let i = idx + 1; i < sibs.length; i++) if (sibs[i].nodeType === 1) return sibs[i];
    return null;
  }
  contains(other) {
    let n = other;
    while (n) { if (n === this) return true; n = n.parentNode; }
    return false;
  }
  closest(selectorList) {
    let n = this;
    while (n) {
      if (n.nodeType === 1 && matchesAny(n, selectorList)) return n;
      n = n.parentNode;
    }
    return null;
  }
  querySelector(sel) { return queryDescendants(this, sel)[0] || null; }
  querySelectorAll(sel) { return queryDescendants(this, sel); }
  addEventListener(type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); }
  // Merges adjacent text-node siblings back into one, recursively -- what
  // teardownLayer() relies on to restore an injection site's original
  // single text node after removing the gloss span spliced into it via
  // splitText(). Node.normalize() is spec'd to do this for the whole
  // subtree rooted at the node it's called on, so this does too.
  normalize() {
    const merged = [];
    for (const c of this.childNodes) {
      if (c.nodeType === 3 && merged.length && merged[merged.length - 1].nodeType === 3) {
        merged[merged.length - 1].nodeValue += c.nodeValue;
      } else {
        merged.push(c);
      }
    }
    this.childNodes = merged;
    for (const c of this.childNodes) if (c.nodeType === 1) c.normalize();
  }
}

function serializeNode(n) {
  if (n.nodeType === 3) return n.nodeValue;
  const tag = n.tagName.toLowerCase();
  const attrOrder = Object.keys(n.attrs);
  const attrStr = attrOrder.map((k) => ` ${k}="${n.attrs[k]}"`).join('');
  if (VOID_TAGS.has(tag)) return `<${tag}${attrStr}>`;
  const inner = n.childNodes.map(serializeNode).join('');
  return `<${tag}${attrStr}>${inner}</${tag}>`;
}

/* ───────────────────────── selector engine ─────────────────────────
   study-mode.js's own DOM calls (grepped exhaustively across the file)
   never use a compound or descendant-combinator selector -- every
   querySelector/querySelectorAll/closest argument is a single simple
   selector, or several joined by commas: '.vocab', '.sec-head',
   '[data-sm-injected]', '[data-sm-done]', 'b', 'p', 'h2, h3',
   '.article, .sec-body, section, body'. So that -- type, .class, #id,
   [attr-presence], comma-separated -- is all this engine implements.
   It is not a general selector engine and is not meant to be one. */

function matchesSimple(el, sel) {
  const s = sel.trim();
  if (!s) return false;
  if (s[0] === '.') return el.classList.contains(s.slice(1));
  if (s[0] === '#') return el.id === s.slice(1);
  if (s[0] === '[' && s[s.length - 1] === ']') return el.getAttribute(s.slice(1, -1)) !== null;
  return el.tagName === s.toUpperCase();
}

function matchesAny(el, selectorList) {
  return selectorList.split(',').some((s) => matchesSimple(el, s));
}

function queryDescendants(root, sel) {
  const out = [];
  (function walk(node) {
    for (const c of node.childNodes) {
      if (c.nodeType === 1) {
        if (matchesAny(c, sel)) out.push(c);
        walk(c);
      }
    }
  })(root);
  return out;
}

/* ───────────────────────── HTML parser ─────────────────────────
   A small stack-based tokenizer, not a spec-accurate HTML5 parser: no
   implied-tag-closing rules (this corpus's tags are all explicitly
   closed -- verified separately by counting every tag this parser cares
   about across all 8 pages), no foster-parenting for tables. Comments
   and doctype/other bang-declarations are skipped. <script>/<style>
   content is captured as one raw (non-entity-decoded) text node, matching
   how a real HTML parser treats them, and is never tokenized as markup. */

function findTagEnd(html, ltIndex) {
  let i = ltIndex + 1;
  let quote = null;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (quote) { if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '>') return i;
  }
  return html.length;
}

function parseTagContent(content) {
  const m = content.match(/^[a-zA-Z][a-zA-Z0-9:-]*/);
  const tagName = m ? m[0] : '';
  const rest = content.slice(tagName.length);
  const attrs = {};
  const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let am;
  while ((am = attrRe.exec(rest))) {
    const name = am[1];
    const value = am[4] !== undefined ? am[4] : am[5] !== undefined ? am[5] : am[6] !== undefined ? am[6] : '';
    attrs[name] = decodeEntities(value);
  }
  return { tagName, attrs };
}

// Parses a full document OR a fragment (same grammar either way) and
// returns the list of top-level nodes produced.
function parseNodes(html) {
  const roots = [];
  const stack = [];
  let pos = 0;

  function targetList() { return stack.length ? stack[stack.length - 1].childNodes : roots; }
  function pushText(raw) {
    if (!raw) return;
    const node = new TextNode(decodeEntities(raw));
    node.parentNode = stack.length ? stack[stack.length - 1] : null;
    targetList().push(node);
  }

  while (pos < html.length) {
    const lt = html.indexOf('<', pos);
    if (lt === -1) { pushText(html.slice(pos)); break; }
    if (lt > pos) pushText(html.slice(pos, lt));

    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt + 4);
      pos = end === -1 ? html.length : end + 3;
      continue;
    }
    if (html.startsWith('<!', lt)) {
      const end = html.indexOf('>', lt);
      pos = end === -1 ? html.length : end + 1;
      continue;
    }
    if (html[lt + 1] === '/') {
      const end = html.indexOf('>', lt);
      const raw = html.slice(lt + 2, end === -1 ? html.length : end).trim();
      const tagName = (raw.split(/\s/)[0] || '').toUpperCase();
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tagName === tagName) { stack.length = i; break; }
      }
      pos = end === -1 ? html.length : end + 1;
      continue;
    }

    const end = findTagEnd(html, lt);
    const raw = html.slice(lt + 1, end);
    const selfClosing = /\/\s*$/.test(raw);
    const { tagName, attrs } = parseTagContent(selfClosing ? raw.replace(/\/\s*$/, '') : raw);
    if (!tagName) { pos = end + 1; continue; }
    const el = new Element(tagName, attrs);
    el.parentNode = stack.length ? stack[stack.length - 1] : null;
    targetList().push(el);
    pos = end + 1;

    const lower = tagName.toLowerCase();
    if (VOID_TAGS.has(lower) || selfClosing) continue;

    if (RAW_TEXT_TAGS.has(lower)) {
      const closeRe = new RegExp('</' + lower + '\\s*>', 'i');
      const rest = html.slice(pos);
      const cm = closeRe.exec(rest);
      const rawText = cm ? rest.slice(0, cm.index) : rest;
      const textNode = new TextNode(rawText);
      textNode.parentNode = el;
      el.childNodes.push(textNode);
      pos = cm ? pos + cm.index + cm[0].length : html.length;
      continue;
    }
    stack.push(el);
  }
  return roots;
}

class Document {
  constructor(roots) { this._roots = roots; }
  get body() { return this._byTag('BODY'); }
  _byTag(tag) {
    let found = null;
    (function walk(nodes) {
      for (const n of nodes) {
        if (found) return;
        if (n.nodeType === 1) { if (n.tagName === tag) { found = n; return; } walk(n.childNodes); }
      }
    })(this._roots);
    return found;
  }
  getElementById(id) {
    let found = null;
    (function walk(nodes) {
      for (const n of nodes) {
        if (found) return;
        if (n.nodeType === 1) { if (n.attrs.id === id) { found = n; return; } walk(n.childNodes); }
      }
    })(this._roots);
    return found;
  }
  querySelectorAll(sel) {
    const out = [];
    (function walk(nodes) {
      for (const n of nodes) {
        if (n.nodeType === 1) { if (matchesAny(n, sel)) out.push(n); walk(n.childNodes); }
      }
    })(this._roots);
    return out;
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  createElement(tag) { return new Element(tag, {}); }
  // Only ever called by study-mode.js as (root, NodeFilter.SHOW_TEXT, null,
  // false); it always wants every descendant text node of root, in
  // document order, which is exactly what a real TreeWalker with that
  // filter would hand back one at a time via nextNode().
  createTreeWalker(root) {
    const list = [];
    (function walk(node) {
      for (const c of node.childNodes) {
        if (c.nodeType === 3) list.push(c);
        else if (c.nodeType === 1) walk(c);
      }
    })(root);
    let i = 0;
    return { nextNode: () => (i < list.length ? list[i++] : null) };
  }
  serialize() { return this._roots.map(serializeNode).join(''); }
}

function loadDocument(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  return new Document(parseNodes(html));
}

/* ───────────────────────── vm sandbox around the real study-mode.js ─────────────────────────
   Same technique tools/study-mode.test.js already uses for its
   buildBar()-reentrancy test (see that file, "loadBrowserSandbox"): load
   the actual source into a vm context lacking `module`, so the file's own
   `typeof module !== 'undefined'` branch is false and it takes the
   browser export path, attaching window.StudyMode.{apply,toggle,init}.
   The difference here is that `document` is backed by a real page's DOM
   instead of a handful of hand-built fixture elements. */

class FakeIntersectionObserver {
  constructor(cb, opts) {
    this.cb = cb;
    this.opts = opts;
    this.observedEls = [];
    FakeIntersectionObserver.instances.push(this);
  }
  observe(el) { this.observedEls.push(el); }
  disconnect() { this.disconnected = true; }
}

const STUDY_MODE_SRC = fs.readFileSync(path.join(__dirname, '../study-mode.js'), 'utf8');

function loadSandbox(document) {
  FakeIntersectionObserver.instances = [];
  const window = { location: { search: '' } };
  const sandbox = {
    console,
    document,
    window,
    IntersectionObserver: FakeIntersectionObserver,
    NodeFilter: { SHOW_TEXT: 4 }
  };
  vm.createContext(sandbox);
  vm.runInContext(STUDY_MODE_SRC, sandbox, { filename: 'study-mode.js (integration vm sandbox)' });
  return sandbox;
}

/* ───────────────────────── the 8 pages ───────────────────────── */

const ROOT = path.join(__dirname, '..');
const PAGES = [
  'ai.html', 'climate-change.html', 'gun-violence.html', 'immigration.html',
  'iran.html', 'space-race.html', 'ukraine.html', 'us-elections.html'
];

// Classes an injected node must never descend from. .term and .term-desc
// are the fix-round-3 findings (Critical 1 and 2): a gloss spliced inside a
// .term printed the same definition twice back to back and rendered it
// underlined as part of the term, and a gloss spliced inside a .term-desc
// corrupted an aria-describedby target -- i.e. mangled the sentence a
// screen-reader student hears. .cite-inline is a source label, never prose.
// Re-derived here by an independent ancestor walk, on purpose: the point of
// this harness is to check the real DOM rather than trust study-mode.js's
// own guard.
const NO_INJECT_CLASSES = ['term', 'term-desc', 'cite-inline'];

function noInjectAncestorOf(node) {
  let n = node.parentNode;
  while (n) {
    if (n.nodeType === 1) {
      for (const c of NO_INJECT_CLASSES) if (n.classList.contains(c)) return c;
    }
    n = n.parentNode;
  }
  return null;
}

// Independent recomputation of what a Key Word box's gloss text SHOULD be:
// every text node of the definition <p> that does not descend from a
// .cite-inline, joined in document order, whitespace collapsed. Written as
// its own walk rather than by calling into study-mode.js, so a regression in
// the production derivation is caught rather than mirrored.
function expectedGlossText(defEl) {
  const parts = [];
  (function walk(el) {
    for (const c of el.childNodes) {
      if (c.nodeType === 1) {
        if (c.classList.contains('cite-inline')) continue;
        walk(c);
      } else if (c.nodeType === 3) {
        parts.push(c.nodeValue);
      }
    }
  })(defEl);
  return parts.join('').replace(/\s+/g, ' ').trim();
}

// The two sides of Critical 3, per page: what each Key Word gloss should
// say, and what the pre-fix `defEl.textContent.trim()` produced (the string
// with the citation label run onto the end of a sentence, e.g.
// "...are the main ones.NASA"). Only boxes whose raw text actually differs
// contribute a "bad" string, so a page with no in-vocab citations
// contributes nothing rather than a false pass.
function glossTextExpectations(document) {
  const good = new Set();
  const bad = new Set();
  for (const box of document.querySelectorAll('.vocab')) {
    const label = box.querySelector('b');
    const defEl = box.querySelector('p');
    if (!label || !defEl) continue;
    if (!/^Key\s*Word\s*[:—–-]\s*.+$/i.test(label.textContent.trim().replace(/\s+/g, ' '))) continue;
    const clean = expectedGlossText(defEl);
    const raw = defEl.textContent.trim();
    good.add(clean);
    if (raw.replace(/\s+/g, ' ') !== clean) bad.add(raw);
  }
  return { good, bad };
}

function hasProtectedAncestorInDom(node) {
  // The primary-source safety invariant, re-checked directly against the
  // live DOM rather than trusting study-mode.js's own guard logic --
  // walking real ancestors independently is the point of an integration
  // check like this one.
  let n = node.parentNode;
  while (n) {
    if (n.nodeType === 1) {
      const tag = n.tagName;
      if (tag === 'BLOCKQUOTE' || tag === 'Q' || tag === 'CITE') return true;
      if (n.classList.contains('pull-quote')) return true;
    }
    n = n.parentNode;
  }
  return false;
}

for (const page of PAGES) {
  describe(page, () => {
    test('before activation: zero [data-sm-injected] nodes exist', () => {
      const document = loadDocument(path.join(ROOT, page));
      assert.equal(document.querySelectorAll('[data-sm-injected]').length, 0);
    });

    test("apply('on') injects glosses as the page's own content warrants", () => {
      const document = loadDocument(path.join(ROOT, page));
      const hasKeyWordBoxes = document.querySelectorAll('.vocab').length > 0;
      const hasPrimers = document.querySelectorAll('.sec-head').length > 0 &&
        document.querySelectorAll('.before-read').length > 0;

      const sandbox = loadSandbox(document);
      sandbox.window.StudyMode.apply('on');

      const injected = document.querySelectorAll('[data-sm-injected]');
      if (hasKeyWordBoxes) {
        // gun-violence.html has zero .vocab boxes (documented site-wide in
        // CHANGELOG 3.6.0's "Still open" note), so this is conditional on the
        // page actually having Key Word boxes at all.
        //
        // Having boxes is still not the same as having something to inject:
        // a Key Word already carried by a .term is deliberately skipped
        // rather than double-glossed, and on climate-change.html every one
        // of them is (Greenhouse Gas, Keeling Curve, Hydropower), so that
        // page correctly injects nothing.
        //
        // Until the section bar was removed this read `injected.length > 0`
        // and passed anyway -- because the bar itself carried
        // data-sm-injected, so chrome was satisfying an assertion about
        // glosses. Presence is properly owned by tools/check_study_mode.py,
        // which does the full skip/orphan analysis; what belongs here is
        // that whatever IS injected is a gloss and nothing else.
        for (const node of injected) {
          assert.ok(node.classList.contains('sm-gloss') ||
                    node.classList.contains('sm-gloss-aside') ||
                    node.tagName === 'SPAN' || node.tagName === 'ASIDE',
            'every injected node should be a gloss, got ' + node.tagName);
        }
      }
    });

    test('no injected node sits inside a blockquote/q/cite/.pull-quote ancestor (primary-source safety invariant)', () => {
      const document = loadDocument(path.join(ROOT, page));
      const sandbox = loadSandbox(document);
      sandbox.window.StudyMode.apply('on');

      const injected = document.querySelectorAll('[data-sm-injected]');
      for (const node of injected) {
        assert.equal(
          hasProtectedAncestorInDom(node),
          false,
          `injected node (${node.tagName}, text="${(node.textContent || '').slice(0, 60)}") ` +
          'must not descend from a blockquote/q/cite/.pull-quote'
        );
      }
    });

    test('no injected node sits inside a .term/.term-desc/.cite-inline ancestor (fix round 3, Critical 1 and 2)', () => {
      const document = loadDocument(path.join(ROOT, page));
      const sandbox = loadSandbox(document);
      sandbox.window.StudyMode.apply('on');

      const injected = document.querySelectorAll('[data-sm-injected]');
      for (const node of injected) {
        const bad = noInjectAncestorOf(node);
        assert.equal(
          bad,
          null,
          `injected node (${node.tagName}, text="${(node.textContent || '').slice(0, 60)}") ` +
          `must not descend from a .${bad}`
        );
      }
    });

    test('no injected gloss text carries a citation label (fix round 3, Critical 3)', () => {
      const document = loadDocument(path.join(ROOT, page));
      const { good, bad } = glossTextExpectations(document);
      const sandbox = loadSandbox(document);
      sandbox.window.StudyMode.apply('on');

      for (const node of document.querySelectorAll('[data-sm-injected]')) {
        if (node.id === 'sm-bar') continue;
        const txt = node.textContent;
        for (const b of bad) {
          assert.ok(
            txt.indexOf(b) === -1,
            `gloss text must not contain the citation-label-swallowing string "${b.slice(-60)}"`
          );
        }
        if (node.classList.contains('sm-gloss')) {
          assert.ok(
            good.has(txt),
            `inline gloss text must equal its Key Word definition with .cite-inline anchors removed; got "${txt.slice(-70)}"`
          );
        }
      }
    });

    test("apply('off') removes every injected node and restores the pre-activation DOM exactly", () => {
      const document = loadDocument(path.join(ROOT, page));
      const before = document.serialize();

      const sandbox = loadSandbox(document);
      sandbox.window.StudyMode.apply('on');
      assert.ok(document.querySelectorAll('[data-sm-injected]').length >= 0); // sanity: no throw
      sandbox.window.StudyMode.apply('off');

      assert.equal(document.querySelectorAll('[data-sm-injected]').length, 0,
        'no [data-sm-injected] node should remain after apply("off")');
      assert.equal(document.serialize(), before,
        'serialized DOM after apply("on") then apply("off") must match the pre-activation serialization exactly');
    });

    test("apply('on') applied twice with no teardown between does not duplicate any gloss", () => {
      const document = loadDocument(path.join(ROOT, page));
      const sandbox = loadSandbox(document);

      sandbox.window.StudyMode.apply('on');
      const afterFirst = document.querySelectorAll('[data-sm-injected]').length;
      sandbox.window.StudyMode.apply('on'); // no teardown between -- the re-entrancy path
      const afterSecond = document.querySelectorAll('[data-sm-injected]').length;

      assert.equal(afterSecond, afterFirst,
        'a second apply("on") with no teardown must not add any new injected node (data-sm-done idempotency guard)');
    });
  });
}

/* ───────────────────────── fix round 3: named render checks ─────────────────────────
   The three defects that reached the whole-feature review, each pinned to the
   exact real-page node it corrupted, and each printing the resulting text so
   a reviewer can read the student's-eye view rather than infer it from a
   boolean. These are deliberately concrete: the per-page invariants above
   generalise them, but a generalised assertion that silently stops covering
   the original case is how these shipped in the first place. */

describe('fix round 3 render checks', () => {
  test('climate-change: the Greenhouse Gas definition is printed once, not twice (Critical 1)', () => {
    const document = loadDocument(path.join(ROOT, 'climate-change.html'));
    const sandbox = loadSandbox(document);
    sandbox.window.StudyMode.apply('on');

    const desc = document.getElementById('term-desc-3');
    assert.ok(desc, 'expected climate-change #term-desc-3 (greenhouse gases)');
    const para = desc.parentNode;
    const text = para.textContent.replace(/\s+/g, ' ').trim();
    console.log('\n[render] climate-change, paragraph holding #term-desc-3:\n  ' + text + '\n');

    const def = 'A gas that traps heat instead of letting it escape to space.';
    let count = 0, at = text.indexOf(def);
    while (at !== -1) { count++; at = text.indexOf(def, at + 1); }
    assert.equal(count, 1, 'the greenhouse-gas definition must appear exactly once in this paragraph');
    assert.equal(document.querySelectorAll('[data-sm-injected]').filter((n) => desc.parentNode.contains(n) && n.classList.contains('sm-gloss') && n.textContent.indexOf(def) === 0).length, 0,
      'no Key Word gloss should be injected beside a term that already carries this definition');
  });

  test('ai: #term-desc-1 is byte-identical to its authored definition (Critical 2)', () => {
    const document = loadDocument(path.join(ROOT, 'ai.html'));
    const before = document.getElementById('term-desc-1').textContent;
    const sandbox = loadSandbox(document);
    sandbox.window.StudyMode.apply('on');

    const after = document.getElementById('term-desc-1').textContent;
    console.log('[render] ai, #term-desc-1 after apply("on"):\n  ' + after + '\n');
    assert.equal(after, before,
      'an aria-describedby target must never have a gloss spliced into it');
    // ...and it still matches the data-def the .term itself advertises.
    const term = document.querySelector('.term');
    assert.equal(after, term.getAttribute('data-def'));
  });

  test('us-elections: the Checks and Balances gloss does not end in a "src" citation label (Critical 3)', () => {
    const document = loadDocument(path.join(ROOT, 'us-elections.html'));
    const sandbox = loadSandbox(document);
    sandbox.window.StudyMode.apply('on');

    const glosses = document.querySelectorAll('.sm-gloss')
      .filter((n) => n.textContent.indexOf('A system where each branch') === 0);
    assert.equal(glosses.length, 1, 'expected exactly one Checks and Balances gloss');
    const txt = glosses[0].textContent;
    console.log('[render] us-elections, Checks and Balances gloss:\n  ' + txt + '\n');
    assert.ok(!/\bsrc\b/.test(txt), 'gloss must not carry the "src" citation label');
    // The pre-fix string ran the label straight onto the sentence before it.
    assert.ok(txt.indexOf('at all.src') === -1, 'the citation label must not be run onto the sentence');
    assert.ok(/make this system work\.$/.test(txt), 'gloss must end at the end of the definition');
  });
});
