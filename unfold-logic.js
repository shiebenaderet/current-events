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





  /* Completed-quiz store.

     This is the only thing the site persists about a student's reading, and
     that is deliberate. Under the card model the menu is home: on returning
     to a page you land on the primer and the tiles, not mid-way through
     whatever you last opened. So which sections were open is not worth
     remembering; which parts you finished is.

     The page's own answeredQuizzes is an in-memory Set that empties on
     every reload, so a check derived from it
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
