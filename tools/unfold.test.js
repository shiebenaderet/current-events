const { test } = require('node:test');
const assert = require('node:assert');
const U = require('../unfold-logic.js');

test('parseOrder accepts positive integers only', () => {
  assert.equal(U.parseOrder('3'), 3);
  assert.equal(U.parseOrder('1'), 1);
  assert.equal(U.parseOrder('0'), null);
  assert.equal(U.parseOrder('-2'), null);
  assert.equal(U.parseOrder('abc'), null);
  assert.equal(U.parseOrder(null), null);
});

test('nextUnopened returns the lowest order not yet opened', () => {
  assert.equal(U.nextUnopened([1, 2, 3], []), 1);
  assert.equal(U.nextUnopened([1, 2, 3], [1]), 2);
  assert.equal(U.nextUnopened([1, 2, 3], [1, 2]), 3);
});

test('nextUnopened returns null when everything is open', () => {
  assert.equal(U.nextUnopened([1, 2, 3], [1, 2, 3]), null);
  assert.equal(U.nextUnopened([], []), null);
});

// D3: opening out of order must not skip earlier sections. A student who
// jumps to section 2 via the nav still gets "keep going -> 1" as the guided
// next step, because ordered-never-blocked guides without locking.
test('nextUnopened still points at an earlier unopened section', () => {
  assert.equal(U.nextUnopened([1, 2, 3], [2]), 1);
  assert.equal(U.nextUnopened([1, 2, 3], [3, 2]), 1);
});

test('nextUnopened ignores unknown orders in the opened set', () => {
  assert.equal(U.nextUnopened([1, 2], [9]), 1);
});

test('progressKey is namespaced per page', () => {
  assert.equal(U.progressKey('/climate-change.html'), 'unfold:climate-change.html');
  assert.equal(U.progressKey('/'), 'unfold:index.html');
  assert.equal(U.progressKey(''), 'unfold:index.html');
});

test('parseProgress survives absent, empty and corrupt storage', () => {
  assert.deepEqual(U.parseProgress(null), []);
  assert.deepEqual(U.parseProgress(''), []);
  assert.deepEqual(U.parseProgress('1,2'), [1, 2]);
  assert.deepEqual(U.parseProgress('a,2,,3'), [2, 3]);
  assert.deepEqual(U.parseProgress('{"junk":1}'), []);
});

test('serializeProgress round-trips through parseProgress', () => {
  assert.equal(U.serializeProgress([1, 2, 3]), '1,2,3');
  assert.equal(U.serializeProgress([]), '');
  assert.deepEqual(U.parseProgress(U.serializeProgress([3, 1])), [3, 1]);
});

// ── Completed-quiz store ────────────────────────────────────────────────
// The page's own answeredQuizzes is an in-memory Set, so a check mark would
// vanish on reload. These back a separate, persisted store keyed by quiz id.

test('doneKey is namespaced per page and distinct from progressKey', () => {
  assert.equal(U.doneKey('/climate-change.html'), 'unfold-done:climate-change.html');
  assert.equal(U.doneKey('/'), 'unfold-done:index.html');
  assert.notEqual(U.doneKey('/a.html'), U.progressKey('/a.html'));
});

test('parseDone survives absent, empty and messy storage', () => {
  assert.deepEqual(U.parseDone(null), []);
  assert.deepEqual(U.parseDone(''), []);
  assert.deepEqual(U.parseDone('q1,q2'), ['q1', 'q2']);
  assert.deepEqual(U.parseDone(' q1 , ,q2 '), ['q1', 'q2']);
});

test('addDone is idempotent, so answering twice cannot double-count', () => {
  assert.deepEqual(U.addDone([], 'q1'), ['q1']);
  assert.deepEqual(U.addDone(['q1'], 'q1'), ['q1']);
  assert.deepEqual(U.addDone(['q1'], 'q2'), ['q1', 'q2']);
});

test('addDone ignores empty ids rather than storing a blank', () => {
  assert.deepEqual(U.addDone(['q1'], ''), ['q1']);
  assert.deepEqual(U.addDone(['q1'], null), ['q1']);
});

test('serializeDone round-trips through parseDone', () => {
  assert.equal(U.serializeDone(['q1', 'q2']), 'q1,q2');
  assert.equal(U.serializeDone([]), '');
  assert.deepEqual(U.parseDone(U.serializeDone(['q6', 'q1'])), ['q6', 'q1']);
});
