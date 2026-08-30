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

  var api = {
    parseOrder: parseOrder,
    nextUnopened: nextUnopened,
    progressKey: progressKey,
    parseProgress: parseProgress,
    serializeProgress: serializeProgress
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    window.UnfoldLogic = api;
  }
})();
