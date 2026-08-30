/* Unfold — ordering logic for the progressive section reveal.
   Pure functions only: no DOM, no storage access. site.js's initUnfold()
   supplies both. Kept separate from site.js so `node --test` can exercise
   the ordering rules headlessly, the same split study-mode.js uses. */
(function () {
  function parseOrder(value) {
    if (value === null || value === undefined) return null;
    var n = parseInt(value, 10);
    if (isNaN(n) || n < 1) return null;
    return n;
  }

  // The guided next step is always the LOWEST unopened order, even if the
  // student opened a later one first via the nav. Ordered, never blocked.
  function nextUnopened(orders, opened) {
    var sorted = orders.slice().sort(function (a, b) { return a - b; });
    for (var i = 0; i < sorted.length; i++) {
      if (opened.indexOf(sorted[i]) === -1) return sorted[i];
    }
    return null;
  }

  function progressKey(pathname) {
    var file = String(pathname || '').split('/').pop();
    if (!file) file = 'index.html';
    return 'unfold:' + file;
  }

  function parseProgress(raw) {
    if (!raw) return [];
    var out = [];
    var parts = String(raw).split(',');
    for (var i = 0; i < parts.length; i++) {
      var n = parseOrder(parts[i]);
      if (n !== null) out.push(n);
    }
    return out;
  }

  function serializeProgress(list) {
    return list.join(',');
  }

  /* Completed-quiz store.

     Kept separate from the opened-section store above because they answer
     different questions: which sections has this student expanded (a
     convenience, restored on reload) versus which has this student actually
     worked through (the check mark). The page's own answeredQuizzes is an
     in-memory Set that empties on every reload, so a check derived from it
     alone would disappear the moment a student closed the tab. */
  function fileOf(pathname) {
    return String(pathname || '').split('/').pop() || 'index.html';
  }

  function doneKey(pathname) {
    return 'unfold-done:' + fileOf(pathname);
  }

  function parseDone(raw) {
    if (!raw) return [];
    var out = [];
    var parts = String(raw).split(',');
    for (var i = 0; i < parts.length; i++) {
      var id = parts[i].trim();
      if (id) out.push(id);
    }
    return out;
  }

  function serializeDone(list) {
    return list.join(',');
  }

  // Idempotent: a student who reopens a section and answers again must not
  // be counted twice, and a blank id must never enter the store.
  function addDone(list, id) {
    if (!id) return list.slice();
    var out = list.slice();
    if (out.indexOf(id) === -1) out.push(id);
    return out;
  }

  var api = {
    parseOrder: parseOrder,
    nextUnopened: nextUnopened,
    progressKey: progressKey,
    parseProgress: parseProgress,
    serializeProgress: serializeProgress,
    doneKey: doneKey,
    parseDone: parseDone,
    serializeDone: serializeDone,
    addDone: addDone
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    window.UnfoldLogic = api;
  }
})();
