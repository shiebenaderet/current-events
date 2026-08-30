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

// ── Completed-quiz store ────────────────────────────────────────────────
// The page's own answeredQuizzes is an in-memory Set, so a check mark would
// vanish on reload. These back a separate, persisted store keyed by quiz id.
// It is the only thing the site persists about reading: under the card
// model the menu is home, so which sections were open is not worth keeping.

test('doneKey is namespaced per page', () => {
  assert.equal(U.doneKey('/climate-change.html'), 'unfold-done:climate-change.html');
  assert.equal(U.doneKey('/'), 'unfold-done:index.html');
  assert.equal(U.doneKey(''), 'unfold-done:index.html');
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
