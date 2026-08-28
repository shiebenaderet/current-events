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

  // This corpus has zero <blockquote>/<q>/<cite> tags today (measured
  // 2026-08-28). Real quotations are authored as a `.pull-quote` div, so a
  // class-based container check is required alongside the tag check above
  // -- the tag check stays in place too, at no cost, for if semantic
  // quotation tags are ever introduced.
  var PROTECTED_CLASSES = ['pull-quote'];

  function hasProtectedClass(classNames) {
    if (!classNames || !classNames.length) return false;
    for (var i = 0; i < classNames.length; i++) {
      if (PROTECTED_CLASSES.indexOf(String(classNames[i])) !== -1) return true;
    }
    return false;
  }

  // Quotations also show up with no dedicated container at all -- just
  // curly or straight quote marks inside ordinary prose (e.g. "coalition
  // of the willing"). This asks only of the single text node the match
  // lives in (per node, not per paragraph): scanning the text up to
  // `index`, is a straight-quote pair open, or a curly-quote pair open?
  // A straight quote toggles open/closed each time it's seen; an unpaired
  // opener with no closer before `index` leaves it "open" for the rest of
  // the node, which is the intended conservative behavior -- when in
  // doubt (an unresolved quote), treat the position as quoted rather than
  // risk injecting into someone's words. Never throws on odd input.
  function isInsideQuoteMarks(text, index) {
    var t = String(text == null ? '' : text);
    var i = Math.max(0, Math.min(Number(index) || 0, t.length));
    var straightOpen = false;
    var curlyDepth = 0;
    for (var k = 0; k < i; k++) {
      var ch = t.charAt(k);
      if (ch === '"') straightOpen = !straightOpen;
      else if (ch === '“') curlyDepth++;
      else if (ch === '”') { if (curlyDepth > 0) curlyDepth--; }
    }
    return straightOpen || curlyDepth > 0;
  }

  // A quotation can be split across text nodes by ordinary inline markup
  // (e.g. `Dr. Smith said "the <strong>hydropower</strong> plan is dead."`
  // -- ai.html:432 already bolds a word inside a quotation elsewhere), so
  // isInsideQuoteMarks alone -- scoped to one text node -- can miss it: the
  // node holding the match may itself contain zero quote marks. This is
  // the pure core of that fix: given a block's rendered text already split
  // into the ordered fragments a DOM walk of its text nodes would produce,
  // and the index of the fragment the match's own text node corresponds
  // to, compute the match's true offset in the whole block and defer to
  // isInsideQuoteMarks on that. Kept separate from the DOM walk that
  // gathers `fragments` (isQuotedInBlock, below) so the split-across-nodes
  // shape is testable here without a DOM.
  function isQuotedAtFragmentOffset(fragments, targetIndex, matchIndex) {
    var offset = 0;
    for (var i = 0; i < targetIndex; i++) {
      offset += String(fragments[i] == null ? '' : fragments[i]).length;
    }
    offset += matchIndex;
    var blockText = fragments.join('');
    return isInsideQuoteMarks(blockText, offset);
  }

  function keyWordFromBox(labelText) {
    var t = String(labelText == null ? '' : labelText).trim().replace(/\s+/g, ' ');
    // Separator is a colon on us-elections and an em-dash on every other page;
    // measured across all 55 Key Word labels in the corpus.
    var m = t.match(/^Key\s*Word\s*[:—–-]\s*(.+)$/i);
    return m ? m[1].trim() : null;
  }

  function resolveInitialState(urlValue, storedValue) {
    if (urlValue === 'on' || urlValue === 'off') return urlValue;
    if (storedValue === 'on' || storedValue === 'off') return storedValue;
    return 'off';
  }

  // Parsed by hand rather than URLSearchParams so the helper is testable in
  // node without a DOM and works in the same browsers the rest of site.js targets.
  function readStudyParam(search) {
    var s = String(search == null ? '' : search);
    var m = s.match(/[?&]study=([^&#]*)/i);
    if (!m) return null;
    var v = decodeURIComponent(m[1]).toLowerCase();
    return (v === 'on' || v === 'off') ? v : null;
  }

  function applyState(state) {
    if (typeof document === 'undefined') return;
    var on = state === 'on';
    document.body.classList.toggle('study-mode', on);
    var btn = document.getElementById('studyModeToggle');
    if (btn) {
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (on) { buildLayer(); } else { teardownLayer(); }
  }

  function store(state) {
    try { localStorage.setItem('studyMode', state); } catch (e) { /* private mode: session-only */ }
  }

  function read() {
    try { return localStorage.getItem('studyMode'); } catch (e) { return null; }
  }

  function toggle() {
    var next = document.body.classList.contains('study-mode') ? 'off' : 'on';
    store(next);
    applyState(next);
  }

  function init() {
    if (typeof document === 'undefined') return;
    var state = resolveInitialState(readStudyParam(window.location.search), read());
    if (state === 'on') store(state);   // an explicit ?study=on persists onward
    applyState(state);
  }

  function ancestorTags(node, stopAt) {
    var tags = [], n = node;
    while (n && n !== stopAt) {
      if (n.tagName) tags.push(n.tagName);
      n = n.parentNode;
    }
    return tags;
  }

  function ancestorClasses(node, stopAt) {
    var classes = [], n = node;
    while (n && n !== stopAt) {
      if (n.classList) {
        for (var i = 0; i < n.classList.length; i++) classes.push(n.classList[i]);
      }
      n = n.parentNode;
    }
    return classes;
  }

  // Block-level containers whose full rendered text a quotation might be
  // split across (by a <strong>, <span class="term">, <a>, etc. sitting
  // inside it). Whichever of these is reached first walking up from a text
  // node -- or the section root itself, if none -- is "the block."
  var BLOCK_TAGS = ['P', 'LI', 'TD', 'DIV', 'FIGCAPTION'];

  function nearestBlock(node, stopAt) {
    var n = node.parentNode;
    while (n && n !== stopAt) {
      if (n.tagName && BLOCK_TAGS.indexOf(n.tagName) !== -1) return n;
      n = n.parentNode;
    }
    return stopAt;
  }

  // Walks the block's text nodes (same document order textContent itself
  // is built from) to collect fragments, finds which one is `node`, and
  // hands off to the pure isQuotedAtFragmentOffset for the actual call.
  function isQuotedInBlock(node, root, matchIndex) {
    var block = nearestBlock(node, root);
    var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null, false);
    var fragments = [], targetIndex = -1, n, i = 0;
    while ((n = walker.nextNode())) {
      fragments.push(n.nodeValue);
      if (n === node) targetIndex = i;
      i++;
    }
    if (targetIndex === -1) return isInsideQuoteMarks(node.nodeValue, matchIndex);
    return isQuotedAtFragmentOffset(fragments, targetIndex, matchIndex);
  }

  // The first text node inside `root` that matches `re` and is not inside a
  // quotation, heading, citation, or the Key Word box itself. A match can be
  // "quoted" four ways: a protected tag ancestor (blockquote/q/cite, not
  // present in this corpus today but cheap to keep), a protected class
  // ancestor (.pull-quote), bare quote marks around the match inside its own
  // text node, or -- since a quotation can be split across text nodes by
  // ordinary inline markup -- bare quote marks around the match once the
  // whole containing block's rendered text is considered. All four are
  // treated the same by the caller.
  function findTarget(root, re, excludeBox) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var node, protectedHit = null;
    while ((node = walker.nextNode())) {
      var m = node.nodeValue.match(re);
      if (!m) continue;
      var tags = ancestorTags(node, root);
      if (excludeBox && excludeBox.contains(node)) continue;
      if (tags.indexOf('H1') !== -1 || tags.indexOf('H2') !== -1 ||
          tags.indexOf('H3') !== -1 || tags.indexOf('H4') !== -1) continue;
      if (node.parentNode && node.parentNode.classList &&
          node.parentNode.classList.contains('cite-inline')) continue;
      var classes = ancestorClasses(node, root);
      // isInsideQuoteMarks on the node's own text is a fast pre-check: a
      // "quoted" verdict from it is always safe to trust as-is (it can
      // only ever be as-or-more cautious than the block-level view), so
      // isQuotedInBlock -- the correct, expensive check -- only runs when
      // the fast check didn't already find a reason to protect the match.
      var quoted = hasProtectedAncestor(tags) || hasProtectedClass(classes) ||
        isInsideQuoteMarks(node.nodeValue, m.index) ||
        isQuotedInBlock(node, root, m.index);
      if (quoted) {
        // Remember it, but keep looking for an unquoted occurrence first.
        if (!protectedHit) protectedHit = node;
        continue;
      }
      return { node: node, quoted: false };
    }
    return protectedHit ? { node: protectedHit, quoted: true } : null;
  }

  function quotedAncestor(node) {
    var n = node;
    while (n) {
      if (n.tagName && PROTECTED_TAGS.indexOf(n.tagName.toUpperCase()) !== -1) return n;
      if (n.classList) {
        for (var i = 0; i < PROTECTED_CLASSES.length; i++) {
          if (n.classList.contains(PROTECTED_CLASSES[i])) return n;
        }
      }
      n = n.parentNode;
    }
    return null;
  }

  function injectKeyWordGlosses() {
    var boxes = document.querySelectorAll('.vocab');
    var injected = 0, orphans = [], skipped = [];
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      if (box.getAttribute('data-sm-done')) continue;
      var label = box.querySelector('b');
      var defEl = box.querySelector('p');
      if (!label || !defEl) continue;
      var term = keyWordFromBox(label.textContent);
      if (!term) continue;
      var re = termPattern(term);
      if (!re) continue;

      var section = box.closest ? box.closest('.article, .sec-body, section, body') : null;
      if (!section) section = document.body;

      var hit = findTarget(section, re, box);
      if (!hit) { orphans.push(term); continue; }

      var text = defEl.textContent.trim();

      if (hit.quoted) {
        // S2: scaffolding goes AROUND a source, never inside it. A source
        // container (blockquote/q/cite tag, or a .pull-quote div) gets a
        // sibling aside; bare quote marks with no container element are
        // left untouched -- there is nothing safe to insert a sibling
        // after, so the term is recorded as skipped rather than injected.
        var bq = quotedAncestor(hit.node);
        if (!bq || !bq.parentNode) { skipped.push(term); continue; }
        var aside = document.createElement('p');
        aside.className = 'sm-gloss-aside';
        aside.setAttribute('data-sm-injected', '1');
        aside.textContent = term + ' — ' + text;
        bq.parentNode.insertBefore(aside, bq.nextSibling);
      } else {
        // Use the match's own index, not indexOf(m[0]) -- if the matched
        // text occurs twice in this node, indexOf would always find the
        // first occurrence even when the regex (word-boundary-aware) truly
        // matched the second, splicing the gloss in at the wrong spot.
        var m = hit.node.nodeValue.match(re);
        var idx = m.index;
        var after = hit.node.splitText(idx + m[0].length);
        var span = document.createElement('span');
        span.className = 'sm-gloss';
        span.setAttribute('data-sm-injected', '1');
        span.textContent = text;
        after.parentNode.insertBefore(span, after);
      }
      box.setAttribute('data-sm-done', '1');
      injected++;
    }
    return { injected: injected, orphans: orphans, skipped: skipped };
  }

  function teardownLayer() {
    if (typeof document === 'undefined') return;
    var nodes = document.querySelectorAll('[data-sm-injected]');
    for (var i = 0; i < nodes.length; i++) {
      var p = nodes[i].parentNode;
      if (p) { p.removeChild(nodes[i]); p.normalize(); }
    }
    var done = document.querySelectorAll('[data-sm-done]');
    for (var j = 0; j < done.length; j++) done[j].removeAttribute('data-sm-done');
  }

  function buildLayer() {
    if (typeof document === 'undefined') return;
    var r = injectKeyWordGlosses();
    if (window.location.search.indexOf('smdebug') !== -1) {
      if (r.orphans.length) {
        console.log('[study-mode] Key Word boxes with no match in prose (V5 orphans):', r.orphans);
      }
      if (r.skipped.length) {
        console.log('[study-mode] Key Words quoted with no safe container to gloss around (skipped):', r.skipped);
      }
    }
  }

  var api = {
    firstSentence: firstSentence,
    termPattern: termPattern,
    hasProtectedAncestor: hasProtectedAncestor,
    hasProtectedClass: hasProtectedClass,
    isInsideQuoteMarks: isInsideQuoteMarks,
    isQuotedAtFragmentOffset: isQuotedAtFragmentOffset,
    resolveInitialState: resolveInitialState,
    readStudyParam: readStudyParam,
    keyWordFromBox: keyWordFromBox
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    window.StudyMode = api;
    api.apply = applyState;
    api.toggle = toggle;
    api.init = init;
    window.toggleStudyMode = toggle;
  }
})();
