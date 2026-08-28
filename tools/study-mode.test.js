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
