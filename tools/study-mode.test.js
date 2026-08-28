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
