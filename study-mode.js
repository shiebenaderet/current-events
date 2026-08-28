/* Study Mode — additive reading support.
   Spec: docs/plans/2026-08-28-study-mode-design.md
   Adds glosses and a section frame around the text. Never rewrites prose. */
(function () {
  'use strict';

  /* ---- pure helpers (no DOM; unit-tested in tools/study-mode.test.js) ---- */

  // Abbreviations whose trailing period must not end a sentence. "U.S." is the
  // one that actually occurs in this corpus; the rest are cheap insurance.
  var ABBR = /(?:^|[\s(])(?:U\.S|Mr|Mrs|Ms|Dr|St|Jr|Sr|vs|etc|e\.g|i\.e|No|Inc|Gov|Sen|Rep|Prof)\.$/i;

  function firstSentence(text) {
    var t = String(text == null ? '' : text).trim().replace(/\s+/g, ' ');
    if (!t) return '';
    var re = /[.!?](?=\s|$)/g;
    var m;
    while ((m = re.exec(t)) !== null) {
      var cand = t.slice(0, m.index + 1);
      if (ABBR.test(cand)) continue;
      // A real sentence break is followed by end-of-text or a capitalised word.
      // (A length heuristic here cannot tell a short sentence from an abbreviation.)
      var rest = t.slice(m.index + 1).replace(/^\s+/, '');
      if (rest && !/^["'“‘(]?[A-Z0-9]/.test(rest)) continue;
      return cand;
    }
    return t;
  }

  function termPattern(term) {
    var raw = String(term == null ? '' : term).trim();
    if (!raw) return null;
    var esc = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // \b only means anything beside a word character. A term ending in ")" can
    // never satisfy a trailing \b before a space, so the boundaries are conditional.
    var lead = /^\w/.test(raw) ? '\\b' : '';
    var tail = /\w$/.test(raw) ? '(?:e?s)?\\b' : '';
    return new RegExp(lead + esc + tail, 'i');
  }

  var PROTECTED_TAGS = ['BLOCKQUOTE', 'Q', 'CITE'];

  function hasProtectedAncestor(tagNames) {
    if (!tagNames || !tagNames.length) return false;
    for (var i = 0; i < tagNames.length; i++) {
      if (PROTECTED_TAGS.indexOf(String(tagNames[i]).toUpperCase()) !== -1) return true;
    }
    return false;
  }

  function resolveInitialState(urlValue, storedValue) {
    if (urlValue === 'on' || urlValue === 'off') return urlValue;
    if (storedValue === 'on' || storedValue === 'off') return storedValue;
    return 'off';
  }

  var api = {
    firstSentence: firstSentence,
    termPattern: termPattern,
    hasProtectedAncestor: hasProtectedAncestor,
    resolveInitialState: resolveInitialState
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    window.StudyMode = api;
  }
})();
