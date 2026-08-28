const { test } = require('node:test');
const assert = require('node:assert');
const SM = require('../study-mode.js');

test('firstSentence takes the first sentence', () => {
  assert.equal(
    SM.firstSentence('Congress writes the laws. The president carries them out.'),
    'Congress writes the laws.'
  );
});

test('firstSentence is not fooled by U.S.', () => {
  assert.equal(
    SM.firstSentence('The U.S. government has three parts, called branches. Each branch has a job.'),
    'The U.S. government has three parts, called branches.'
  );
});

test('firstSentence returns whole string when there is no terminal punctuation', () => {
  assert.equal(SM.firstSentence('No terminal punctuation here'), 'No terminal punctuation here');
});

test('firstSentence handles empty and null input', () => {
  assert.equal(SM.firstSentence(''), '');
  assert.equal(SM.firstSentence(null), '');
});

test('firstSentence collapses whitespace', () => {
  assert.equal(SM.firstSentence('  Two   spaces.  Next.  '), 'Two spaces.');
});

test('termPattern matches case-insensitively on a word boundary', () => {
  const re = SM.termPattern('poll tax');
  assert.ok(re.test('Poll tax was a fee some states charged'));
  assert.ok(re.test('Poll taxes in federal elections were banned'));
});

test('termPattern does not match inside a longer word', () => {
  const re = SM.termPattern('act');
  assert.equal(re.test('The factory closed'), false);
});

test('termPattern escapes regex metacharacters', () => {
  const re = SM.termPattern('U.S. (federal)');
  assert.ok(re.test('the U.S. (federal) courts'));
  assert.equal(re.test('the UXSX federal courts'), false);
});

test('termPattern returns null for empty input', () => {
  assert.equal(SM.termPattern(''), null);
  assert.equal(SM.termPattern('   '), null);
});

test('hasProtectedAncestor guards quoted spans', () => {
  assert.equal(SM.hasProtectedAncestor(['P', 'BLOCKQUOTE', 'DIV']), true);
  assert.equal(SM.hasProtectedAncestor(['SPAN', 'Q']), true);
  assert.equal(SM.hasProtectedAncestor(['CITE']), true);
  assert.equal(SM.hasProtectedAncestor(['blockquote']), true, 'case-insensitive');
});

test('hasProtectedAncestor allows ordinary prose', () => {
  assert.equal(SM.hasProtectedAncestor(['P', 'DIV', 'BODY']), false);
  assert.equal(SM.hasProtectedAncestor([]), false);
});

test('resolveInitialState prefers an explicit URL value', () => {
  assert.equal(SM.resolveInitialState('on', 'off'), 'on');
  assert.equal(SM.resolveInitialState('off', 'on'), 'off');
});

test('resolveInitialState falls back to the stored value', () => {
  assert.equal(SM.resolveInitialState(null, 'on'), 'on');
  assert.equal(SM.resolveInitialState('garbage', 'on'), 'on');
});

test('resolveInitialState defaults to off', () => {
  assert.equal(SM.resolveInitialState(null, null), 'off');
  assert.equal(SM.resolveInitialState('garbage', 'garbage'), 'off');
});

test('readStudyParam extracts on/off from a query string', () => {
  assert.equal(SM.readStudyParam('?study=on'), 'on');
  assert.equal(SM.readStudyParam('?a=1&study=off&b=2'), 'off');
  assert.equal(SM.readStudyParam('?study=ON'), 'on', 'case-insensitive');
});

test('readStudyParam returns null when absent or junk', () => {
  assert.equal(SM.readStudyParam(''), null);
  assert.equal(SM.readStudyParam('?other=1'), null);
  assert.equal(SM.readStudyParam('?study=banana'), null);
});

test('keyWordFromBox parses the colon form (us-elections)', () => {
  assert.equal(SM.keyWordFromBox('Key Word: Poll tax'), 'Poll tax');
  assert.equal(SM.keyWordFromBox('Key Word:Midterm Penalty'), 'Midterm Penalty');
  assert.equal(SM.keyWordFromBox('  Key Word:  Judicial review  '), 'Judicial review');
});

test('keyWordFromBox parses the em-dash form (every other page)', () => {
  assert.equal(SM.keyWordFromBox('Key Word — Artificial Intelligence (AI)'), 'Artificial Intelligence (AI)');
  assert.equal(SM.keyWordFromBox('Key Word — Strait of Hormuz'), 'Strait of Hormuz');
  assert.equal(SM.keyWordFromBox('Key Word – Cold War'), 'Cold War');
  assert.equal(SM.keyWordFromBox('Key Word - Sovereignty'), 'Sovereignty');
});

test('keyWordFromBox keeps a dash that is part of the term itself', () => {
  assert.equal(
    SM.keyWordFromBox('Key Word: Judicial Review — Marbury v. Madison (1803)'),
    'Judicial Review — Marbury v. Madison (1803)');
});

test('keyWordFromBox returns null when the label is not a Key Word', () => {
  assert.equal(SM.keyWordFromBox('Did you know?'), null);
  assert.equal(SM.keyWordFromBox(''), null);
});

test('hasProtectedClass flags a pull-quote ancestor', () => {
  assert.equal(SM.hasProtectedClass(['pull-quote']), true);
  assert.equal(SM.hasProtectedClass(['attrib', 'pull-quote']), true);
});

test('hasProtectedClass allows ordinary classes', () => {
  assert.equal(SM.hasProtectedClass(['lede', 'article']), false);
  assert.equal(SM.hasProtectedClass([]), false);
  assert.equal(SM.hasProtectedClass(null), false);
});

test('isInsideQuoteMarks detects a match inside straight double quotes', () => {
  const t = 'The term "computer vision" was invented decades ago.';
  assert.equal(SM.isInsideQuoteMarks(t, t.indexOf('computer vision')), true);
});

test('isInsideQuoteMarks detects a match inside curly quotes', () => {
  const t = 'They called it “coalition of the willing” that week.';
  assert.equal(SM.isInsideQuoteMarks(t, t.indexOf('coalition of the willing')), true);
});

test('isInsideQuoteMarks returns false for a match in plain prose', () => {
  const t = 'The Speaker of the House is elected by the full House.';
  assert.equal(SM.isInsideQuoteMarks(t, t.indexOf('Speaker')), false);
});

test('isInsideQuoteMarks returns false before any quote mark has opened', () => {
  const t = 'Poll tax was a fee, later called "unconstitutional" by the Court.';
  assert.equal(SM.isInsideQuoteMarks(t, t.indexOf('Poll tax')), false);
});

test('isInsideQuoteMarks treats an unpaired quote as open through the rest of the node, and does not throw', () => {
  const t = 'A stray " mark with no closing pair, term appears after it';
  assert.equal(SM.isInsideQuoteMarks(t, t.indexOf('term appears')), true);
  assert.doesNotThrow(() => SM.isInsideQuoteMarks(t, 9999));
});

test('isInsideQuoteMarks handles empty and null text without throwing', () => {
  assert.equal(SM.isInsideQuoteMarks('', 0), false);
  assert.equal(SM.isInsideQuoteMarks(null, 0), false);
  assert.equal(SM.isInsideQuoteMarks(undefined, 0), false);
});

// Finding 1 (fix round 2): a quotation split across text nodes by ordinary
// inline markup, e.g. <p>Dr. Smith said "the <strong>hydropower</strong>
// plan is dead."</p> -- the term's own text node ("hydropower") holds zero
// quote marks; only the whole block's rendered text reveals it's quoted.
// isQuotedAtFragmentOffset is the pure core of that check: it takes the
// block's text already split into ordered fragments (as a DOM walk of its
// text nodes would produce) plus which fragment holds the match, with no
// DOM required to exercise it.
test('isQuotedAtFragmentOffset detects a quotation split across text nodes by inline markup', () => {
  const fragments = ['Dr. Smith said "the ', 'hydropower', ' plan is dead."'];
  assert.equal(SM.isQuotedAtFragmentOffset(fragments, 1, 0), true);
});

test('isQuotedAtFragmentOffset detects a quotation split across nodes with curly quotes', () => {
  const fragments = ['The report called it “the ', 'coalition', ' of the willing.”'];
  assert.equal(SM.isQuotedAtFragmentOffset(fragments, 1, 0), true);
});

test('isQuotedAtFragmentOffset returns false for a term outside any quote in the same block', () => {
  const fragments = ['The Speaker of the House is ', 'elected', ' by the full House.'];
  assert.equal(SM.isQuotedAtFragmentOffset(fragments, 1, 0), false);
});

test('isQuotedAtFragmentOffset returns false for a quote that closes before the match fragment', () => {
  const fragments = ['She called it "a plan" before adding: ', 'hydropower', ' is the future.'];
  assert.equal(SM.isQuotedAtFragmentOffset(fragments, 1, 0), false);
});

test('isQuotedAtFragmentOffset matches a single-fragment block exactly like isInsideQuoteMarks', () => {
  const t = 'The term "computer vision" was invented decades ago.';
  const idx = t.indexOf('computer vision');
  assert.equal(SM.isQuotedAtFragmentOffset([t], 0, idx), SM.isInsideQuoteMarks(t, idx));
});

test('derivePrimerText skips the br-head paragraph and returns the first content paragraph', () => {
  const paragraphs = [
    { isBrHead: true, fragments: ['Before you read 3 min'] },
    { isBrHead: false, fragments: ['Congress writes the laws.'] },
    { isBrHead: false, fragments: ['The president carries them out.'] }
  ];
  assert.equal(SM.derivePrimerText(paragraphs), 'Congress writes the laws.');
});

test('derivePrimerText handles a multi-paragraph primer by returning the first non-empty content paragraph', () => {
  const paragraphs = [
    { isBrHead: true, fragments: ['Before you read 5 min'] },
    { isBrHead: false, fragments: ['Nobody writes rules like "cats have pointy ears."'] },
    { isBrHead: false, fragments: ['Every wrong guess nudges its internal settings.'] },
    // The br-first paragraph's own anchor text is excluded structurally (no
    // fragment carries it) -- this paragraph is never reached anyway since
    // an earlier one already returns, but its shape mirrors the real DOM walk.
    { isBrHead: false, fragments: ['First: '] }
  ];
  assert.equal(
    SM.derivePrimerText(paragraphs),
    'Nobody writes rules like "cats have pointy ears."'
  );
});

test('derivePrimerText strips a trailing "First:" when the anchor-stripped pointer is the only content paragraph', () => {
  const paragraphs = [
    { isBrHead: true, fragments: ['Before you read 3 min'] },
    // "First: <a>What are the three branches of government?</a>" with the
    // anchor's own text already excluded, as the DOM walker would produce.
    { isBrHead: false, fragments: ['First: '] }
  ];
  assert.equal(SM.derivePrimerText(paragraphs), null);
});

test('derivePrimerText returns null for a primer with no content paragraph', () => {
  const paragraphs = [
    { isBrHead: true, fragments: ['Before you read 3 min'] }
  ];
  assert.equal(SM.derivePrimerText(paragraphs), null);
});

test('derivePrimerText removes only the anchor\'s own text, not every matching substring elsewhere in the paragraph (fix round 1, finding 2)', () => {
  // Regression for the over-strip bug: "AI AI is the topic. First: <a>AI</a>"
  // with the anchor's contribution already excluded by position, the way
  // the DOM walker builds fragments -- so the leading "AI AI" prose, which
  // happens to share the link's exact text, must survive.
  const paragraphs = [
    { isBrHead: false, fragments: ['AI AI is the topic. First: '] }
  ];
  assert.equal(SM.derivePrimerText(paragraphs), 'AI AI is the topic.');
});

test('derivePrimerText returns null for an empty or missing paragraph list', () => {
  assert.equal(SM.derivePrimerText([]), null);
  assert.equal(SM.derivePrimerText(null), null);
});

/* ---- fix round 1, finding 1: buildBar() re-entrancy guard ----
   study-mode.js has no test-time DOM (jsdom is not a project dependency,
   and none is being added). buildBar/teardownLayer/buildLayer are private
   closures, only reachable in the browser-export branch of the module
   (`typeof module !== 'undefined'` is false there). So this loads the real
   source into a vm context with a hand-rolled, minimal DOM stub -- just
   enough surface for applyState('on') -> buildLayer() -> buildBar() to run
   -- and calls the resulting window.StudyMode.apply('on') twice with no
   teardown between, exactly the api.apply-reachable path the finding
   described. No new dependency: vm and fs are Node built-ins. */

const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function makeClassList() {
  const set = new Set();
  return {
    contains: (c) => set.has(c),
    add: (c) => set.add(c),
    remove: (c) => set.delete(c),
    toggle: (c, force) => {
      if (force === undefined) {
        if (set.has(c)) { set.delete(c); return false; }
        set.add(c);
        return true;
      }
      if (force) set.add(c); else set.delete(c);
      return force;
    }
  };
}

function loadBrowserSandbox() {
  const src = fs.readFileSync(path.join(__dirname, '../study-mode.js'), 'utf8');
  const idMap = {};

  class FakeElement {
    constructor(tag) {
      this.tagName = String(tag || '').toUpperCase();
      this._id = '';
      this.children = [];
      this.attrs = {};
      this.classList = makeClassList();
      this.style = {};
      this._listeners = {};
    }
    set id(v) { this._id = v; if (v) idMap[v] = this; }
    get id() { return this._id; }
    set innerHTML(v) { this._innerHTML = v; }
    get innerHTML() { return this._innerHTML; }
    setAttribute(k, v) { this.attrs[k] = v; }
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attrs, k) ? this.attrs[k] : null; }
    addEventListener(type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); }
    appendChild(child) { this.children.push(child); child.parentNode = this; return child; }
    querySelector() { return null; } // not exercised: the observer callback never fires in this test
  }

  class FakeIntersectionObserver {
    constructor(cb, opts) {
      this.cb = cb;
      this.opts = opts;
      this.observedEls = [];
      this.disconnected = false;
      FakeIntersectionObserver.instances.push(this);
    }
    observe(el) { this.observedEls.push(el); }
    disconnect() { this.disconnected = true; }
  }
  FakeIntersectionObserver.instances = [];

  const vocabBoxes = [];
  const secHeads = [new FakeElement('div')]; // one section, so buildBar has something to build for

  const document = {
    body: new FakeElement('body'),
    getElementById: (id) => idMap[id] || null,
    querySelectorAll: (sel) => (sel === '.vocab' ? vocabBoxes : sel === '.sec-head' ? secHeads : []),
    createElement: (tag) => new FakeElement(tag)
  };

  const window = { location: { search: '' } };

  const sandbox = { console, document, window, IntersectionObserver: FakeIntersectionObserver };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'study-mode.js (vm sandbox)' });
  return sandbox;
}

test('buildBar() does not leak a second #sm-bar or a second IntersectionObserver when applyState("on") runs twice without a teardown between (fix round 1, finding 1)', () => {
  const sandbox = loadBrowserSandbox();
  assert.ok(sandbox.window.StudyMode && typeof sandbox.window.StudyMode.apply === 'function',
    'module should attach apply() to window.StudyMode in the browser branch');

  sandbox.window.StudyMode.apply('on'); // first buildBar(): creates #sm-bar + observer #1
  sandbox.window.StudyMode.apply('on'); // second call, no teardown between: the reachable-leak path

  const barChildren = sandbox.document.body.children.filter((el) => el.id === 'sm-bar');
  assert.equal(barChildren.length, 1, 'exactly one #sm-bar should exist, not two');
  assert.equal(sandbox.IntersectionObserver.instances.length, 1,
    'exactly one IntersectionObserver should ever be constructed');
  assert.equal(sandbox.IntersectionObserver.instances[0].disconnected, false,
    'the single observer should still be live (no teardown happened in this test)');
});

/* ── fix round 3: the pure halves of Critical 1, 2 and 3 ──────────────────
   The DOM-level proofs live in tools/study-mode.integration.test.js, which
   drives the real pages. These pin the pure predicates those DOM paths
   delegate to, so a regression shows up here first and with a smaller
   failure message. */

test('isAlreadyGlossed detects a .term ancestor (Critical 1: the Key Word is already glossed on the page)', () => {
  assert.equal(SM.isAlreadyGlossed(['term']), true);
  // Ancestor lists arrive as a flat list of every class up the chain.
  assert.equal(SM.isAlreadyGlossed(['strong', 'term', 'article']), true);
  assert.equal(SM.isAlreadyGlossed(['article', 'sec-body']), false);
  assert.equal(SM.isAlreadyGlossed([]), false);
  assert.equal(SM.isAlreadyGlossed(null), false);
  // A .term-desc is NOT "already glossed" -- incidental wording inside one
  // term's definition must not veto glossing a different word's real use.
  assert.equal(SM.isAlreadyGlossed(['term-desc']), false);
});

test('isNonProse detects .term-desc and .cite-inline ancestors (Critical 2: aria targets and source labels are not injection sites)', () => {
  assert.equal(SM.isNonProse(['term-desc']), true);
  assert.equal(SM.isNonProse(['cite-inline']), true);
  assert.equal(SM.isNonProse(['em', 'cite-inline', 'p']), true);
  assert.equal(SM.isNonProse(['term']), false);
  assert.equal(SM.isNonProse(['article']), false);
  assert.equal(SM.isNonProse([]), false);
  assert.equal(SM.isNonProse(null), false);
});

test('the two class predicates are disjoint, so a node is either abandoned or stepped over, never both', () => {
  const all = ['term', 'term-desc', 'cite-inline'];
  for (const c of all) {
    assert.equal(SM.isAlreadyGlossed([c]) && SM.isNonProse([c]), false, c);
  }
});

test('deriveDefinitionText joins fragments and collapses the gap a removed citation leaves behind (Critical 3)', () => {
  // The real shape: "<text>.<a class=cite-inline>NASA</a>" -- the anchor is
  // dropped by identity upstream, so the fragments never contain "NASA".
  assert.equal(
    SM.deriveDefinitionText(['A gas that traps heat. CO₂ is the main one.']),
    'A gas that traps heat. CO₂ is the main one.'
  );
  // A mid-paragraph citation leaves a space on each side of the hole.
  assert.equal(
    SM.deriveDefinitionText(['The leader of the House. ', ' One of the biggest powers is scheduling.']),
    'The leader of the House. One of the biggest powers is scheduling.'
  );
});

test('deriveDefinitionText trims and normalises whitespace, and survives empty input', () => {
  assert.equal(SM.deriveDefinitionText(['  A system where each branch limits\n  the other two.  ']),
    'A system where each branch limits the other two.');
  assert.equal(SM.deriveDefinitionText([]), '');
  assert.equal(SM.deriveDefinitionText(null), '');
});

test('deriveDefinitionText is fragment-based, so a definition that repeats the citation label keeps its own copy (no string surgery)', () => {
  // "NASA" is the label AND a legitimate word in the definition. A regex
  // that stripped a trailing "NASA" off the joined string would eat the
  // real one too; removing the anchor node itself cannot.
  assert.equal(
    SM.deriveDefinitionText(["NASA's program to send astronauts back to the Moon."]),
    "NASA's program to send astronauts back to the Moon."
  );
});
