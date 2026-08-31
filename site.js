(function () {
  function prefersReducedMotion() {
    return !!(window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function setTextSize(size) {
    document.body.classList.remove('text-lg', 'text-xl');
    if (size === 'lg') document.body.classList.add('text-lg');
    if (size === 'xl') document.body.classList.add('text-xl');
    localStorage.setItem('textSize', size);
  }

  function initA11y() {
    var saved = localStorage.getItem('textSize');
    if (saved && saved !== 'normal') {
      document.body.classList.add('text-' + saved);
    }
    if (window.StudyMode && window.StudyMode.init) window.StudyMode.init();
  }

  /* Vocabulary tooltips open on tap as well as hover.
     The per-page CSS reveals .term::after on :hover/:focus; a touchscreen has neither
     reliably, so tapping a term toggles .is-open instead. One term open at a time.
     Markup is untouched: data-def, tabindex and the aria-describedby/.term-desc pair
     still carry the definition for screen readers. */
  function closeTerms(except) {
    var open = document.querySelectorAll('.term.is-open');
    for (var i = 0; i < open.length; i++) {
      if (open[i] !== except) open[i].classList.remove('is-open');
    }
  }

  function initTerms() {
    if (!document.querySelector('.term')) return;

    document.addEventListener('click', function (e) {
      // Study Mode hides the tooltip (site.css: `body.study-mode .term::after,
      // .term::before{display:none !important}`) and sets cursor:default on
      // .term, because the definition is already printed inline beside the
      // word. Without this guard the tap handler still ran: a tap toggled
      // .is-open on an element whose tooltip cannot appear, and preventDefault
      // swallowed the tap. Leave the tooltip alone while Study Mode is on.
      if (document.body.classList.contains('study-mode')) { closeTerms(null); return; }
      var term = e.target.closest ? e.target.closest('.term') : null;
      if (!term) { closeTerms(null); return; }
      e.preventDefault();
      var wasOpen = term.classList.contains('is-open');
      closeTerms(term);
      term.classList.toggle('is-open', !wasOpen);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeTerms(null);
    });

    // A tooltip pinned over moving text is worse than none.
    window.addEventListener('scroll', function () { closeTerms(null); }, { passive: true });
  }

  /* Progressive section reveal. Disclosure itself is native <details>, so the
     page is fully usable with JS off — this only adds the *ordering*: one
     prominent "Keep going" CTA at a time, pointing at the lowest unopened
     section. Every <summary> stays clickable in any order (spec D3). */
  function initUnfold() {
    var L = window.UnfoldLogic;
    var nodes = document.querySelectorAll('details.unfold');
    if (!L || !nodes.length) return;

    var sections = [];
    for (var i = 0; i < nodes.length; i++) {
      var order = L.parseOrder(nodes[i].getAttribute('data-order'));
      if (order !== null) sections.push({ order: order, el: nodes[i] });
    }
    if (!sections.length) return;

    /* Tiles are listed by data-order, not by position in the file. On most
       pages those agree, but ukraine keeps its "Where the war stands"
       section eighth in the document for historical-narrative reasons while
       it is plainly the first thing a reader wants. Under the card model the
       document order is never seen, so the menu should be ordered for the
       reader rather than for the source file. */
    sections.sort(function (a, b) { return a.order - b.order; });

    function span(cls, text) {
      var el = document.createElement('span');
      el.className = cls;
      el.textContent = text;
      return el;
    }

    var doneKey = L.doneKey(window.location.pathname);
    var seenKey = doneKey.replace('unfold-done:', 'unfold-seen:');

    function read(key) {
      try { return L.parseDone(localStorage.getItem(key)); }
      catch (e) { return []; }
    }

    function write(key, list) {
      try { localStorage.setItem(key, L.serializeDone(list)); }
      catch (e) { /* progress is a convenience, never a requirement */ }
    }

    function readDone() { return read(doneKey); }

    /* Two states, not one.

       A check used to mean "answered this part's quiz", which left Videos
       and Dig Deeper permanently blank — they have no quiz, so no amount of
       opening them could ever mark them. Opening a part now records that it
       was visited; answering its quiz still upgrades it to done. Every tile
       can now reflect what the student actually did with it. */
    function markSeen(order) {
      var next = L.addDone(read(seenKey), String(order));
      write(seenKey, next);
    }

    /* One card at a time. Opening a section closes the others, so a student
       reads one thing and then meets the menu again, instead of accumulating
       an endless scroll.

       Print is unaffected: the print stylesheet shows every section's
       children regardless of the open attribute, so a teacher still gets the
       whole topic on paper. Find-in-page is unaffected too — the closed
       sections stay in the DOM. */
    var closing = false;
    function collapseOthers(keep) {
      if (closing) return;          // our own closes must not re-enter
      closing = true;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el !== keep && sections[i].el.open) {
          sections[i].el.open = false;
        }
      }
      closing = false;
    }

    /* While a card is open it is the whole view: the hero, the primer and
       the top menu are hidden, so a student cannot drift back up into them
       by scrolling. The way back is the card's own summary (which closes it)
       or the menu at its end — both deliberate acts rather than a scroll.

       CSS-only, keyed off a class on <html>, so print is untouched: the
       print stylesheet shows every section regardless, and a teacher still
       gets the whole topic on paper. */
    var wasCardOpen = false;
    function syncCardOpen(silent) {
      var anyOpen = false;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.open) { anyOpen = true; break; }
      }
      document.documentElement.classList.toggle('card-open', anyOpen);

      // Leaving a card should land on the overview, not wherever the scroll
      // happened to be when the hero and primer reappeared above it. Only on
      // an actual close — `silent` covers the initial call, where nothing is
      // open and there is nothing to return from.
      if (!silent && wasCardOpen && !anyOpen) {
        var menu = document.getElementById('unfoldCta');
        if (menu) menu.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      wasCardOpen = anyOpen;
      syncHash();
    }

    /* Keep the address bar pointing at the open card, so a teacher can send a
       student straight to one section by copying the URL. Every card carries
       a slug id (#where-things-stand), and openForHash below already opens
       whatever the hash names.

       replaceState rather than assigning location.hash: assigning it makes
       the browser jump to the element AND pushes a history entry, so opening
       three cards would need three Back presses to leave the page, and the
       jump would fight reveal()'s own scroll. replaceState changes the URL
       and does neither. Wrapped because a file:// page in some browsers
       throws on it, and a thrown error here would take initUnfold with it. */
    var lastHash = null;          // what we last wrote; null = never written
    function syncHash() {
      if (!window.history || !history.replaceState) return;
      var open = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.open) { open = sections[i].el; break; }
      }
      var want = (open && open.id) ? '#' + open.id : '';
      // A fresh load with nothing open and no incoming hash needs no write.
      if (lastHash === null && !want && !window.location.hash) return;
      if (want === lastHash) return;
      try {
        history.replaceState(null, '',
          window.location.pathname + window.location.search + want);
        lastHash = want;
      } catch (e) { /* non-fatal: the card still opened */ }
    }

    function reveal(el) {
      /* Order matters, and getting it wrong cost a click.

         Closing the previously-open section is what changes the page's
         height. If that section sits ABOVE the target — which it does
         whenever you jump backwards, or forwards from an end-of-section
         menu — the target slides up by however tall the closing section
         was. Opening first and scrolling immediately measured the old
         layout and landed past the target, so it took a second click to
         actually arrive.

         So: collapse first, open second, and scroll only once the browser
         has laid the page out again. */
      collapseOthers(el);
      el.open = true;

      // focus() scrolls the focused element into view on its own, which
      // races the scroll below and lands somewhere between the two.
      var s = el.querySelector('summary');
      if (s && s.focus) {
        try { s.focus({ preventScroll: true }); }
        catch (e) { s.focus(); }      // older browsers ignore the options bag
      }

      /* Instant, never smooth. Picking a tile is navigation — the equivalent
         of opening a page — and smooth-scrolling it animates the reader
         through every part between here and there, which on a 23-minute
         topic is most of the document flying past. That reads as the page
         lurching rather than as arriving somewhere.

         This also sidesteps the reduced-motion problem entirely: there is no
         motion left to suppress. */
      function go() {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      if (window.requestAnimationFrame) window.requestAnimationFrame(go);
      else go();
    }

    /* Every section ends with the menu again, so finishing a card is an
       event that hands the choice back rather than dropping the student
       into the next wall of prose. Built in JS rather than authored into
       nine pages: the menu must stay in sync with the tiles, and one
       renderer cannot drift from itself. */
    /* With JS running, the tiles ARE the menu, so a closed section's summary
       row is a second copy of the same navigation stacked underneath it.
       Hidden via a class set here rather than in the stylesheet outright,
       because with JS off the summaries are the only way to open anything —
       the accordion has to keep working. */
    document.documentElement.classList.add('js-unfold');

    var menus = [document.getElementById('unfoldCta')];
    for (var m = 0; m < sections.length; m++) {
      var tail = document.createElement('div');
      tail.className = 'unfold-cta unfold-cta-end';
      sections[m].el.appendChild(tail);
      menus.push(tail);

      /* The way back, as real text rather than a CSS ::before. Generated
         content is not reliably announced, so a screen-reader user would
         have had a visual-only affordance. Hidden by CSS unless a card is
         open, where the summary becomes the sticky header. */
      var back = sections[m].el.querySelector('summary');
      if (back && !back.querySelector('.unfold-back')) {
        back.insertBefore(span('unfold-back', '← Overview'), back.firstChild);
      }

      /* A way to hand one section to one student. The address bar already
         updates when a card opens, but nobody discovers that by looking, so
         the card says so out loud.

         It lives in the end-of-card menu rather than the summary, because
         the summary IS the toggle — a button inside it would close the card
         on its way to being clicked. */
      addLinkButton(sections[m].el, tail);
    }

    function addLinkButton(el, tail) {
      if (!el.id) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'unfold-link';
      btn.textContent = 'Copy link to this section';
      btn.addEventListener('click', function () {
        var url = window.location.origin + window.location.pathname + '#' + el.id;
        function done(ok) {
          btn.textContent = ok ? 'Link copied' : url;
          if (ok) {
            setTimeout(function () {
              btn.textContent = 'Copy link to this section';
            }, 2000);
          }
        }
        // Clipboard access needs a secure context, so it fails on plain
        // http:// — show the URL to copy by hand rather than doing nothing.
        try {
          navigator.clipboard.writeText(url).then(
            function () { done(true); },
            function () { done(false); }
          );
        } catch (e) { done(false); }
      });
      tail.appendChild(btn);
    }

    /* One tile per section, in page order, all equal weight — the student
       chooses (spec D3 as revised 2026-08-29). A tile checks when its quiz
       has been answered, right or wrong: the check records that the student
       worked through the part, and Discovery Points already track how well
       separately. */
    function renderMenu(target, isEnd) {
      if (!target) return;
      var done = readDone();
      var seen = read(seenKey);
      target.hidden = false;
      while (target.firstChild) target.removeChild(target.firstChild);

      var head = document.createElement('p');
      head.className = 'unfold-tiles-head';
      head.textContent = isEnd ? 'Finished — pick another part'
                               : 'Learn more — pick a part';
      target.appendChild(head);

      var grid = document.createElement('div');
      grid.className = 'unfold-tiles';

      for (var i = 0; i < sections.length; i++) {
        (function (sec) {
          var quiz = sec.el.getAttribute('data-quiz') || '';
          var isDone = quiz && done.indexOf(quiz) !== -1;
          var isSeen = !isDone && seen.indexOf(String(sec.order)) !== -1;
          var isHere = isEnd && target.parentNode === sec.el;
          var title = sec.el.getAttribute('data-title') || '';
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'unfold-tile' + (isDone ? ' is-done' : '') +
            (isSeen ? ' is-seen' : '') +
            (isHere ? ' is-current' : '') +
            (sec.el.classList.contains('unfold-extra') ? ' is-extra' : '');
          if (isDone) btn.setAttribute('aria-label', title + ' — completed');
          else if (isSeen) btn.setAttribute('aria-label', title + ' — opened');

          var mark = span('unfold-tile-check', isDone ? '✓' : (isSeen ? '·' : ''));
          mark.setAttribute('aria-hidden', 'true');
          btn.appendChild(mark);
          btn.appendChild(span('unfold-tile-title',
            sec.el.getAttribute('data-title') || ''));
          var mins = sec.el.getAttribute('data-minutes') || '';
          btn.appendChild(span('unfold-tile-time', mins ? mins + ' min' : ''));

          btn.addEventListener('click', function () { reveal(sec.el); });
          grid.appendChild(btn);
        })(sections[i]);
      }
      target.appendChild(grid);
    }

    function refreshCta() {
      for (var i = 0; i < menus.length; i++) renderMenu(menus[i], i > 0);
    }

    // Called by each page's quiz handler once an answer is recorded.
    function markDone(quizId) {
      var next = L.addDone(readDone(), quizId);
      writeDone(next);
      refreshCta();
    }
    window.Unfold = { markDone: markDone };

    // A deep link or a section-nav click must open its section even when
    // collapsed — otherwise every existing #anchor on this page silently
    // stops working.
    function openForHash(hash) {
      if (!hash || hash === '#') return;
      var target = null;
      try { target = document.querySelector(hash); } catch (e) { return; }
      if (!target) return;
      var d = target.closest ? target.closest('details.unfold') : null;
      if (d && !d.open) {
        d.open = true;
        target.scrollIntoView({ block: 'start' });
      }
    }

    for (var j = 0; j < sections.length; j++) {
      (function (sec) {
        sec.el.addEventListener('toggle', function () {
          if (sec.el.open) {
            collapseOthers(sec.el);
            markSeen(sec.order);
          }
          syncCardOpen();
          refreshCta();
        });
      })(sections[j]);
    }

    /* Deliberately no restore of previously-open sections. Under the card
       model the menu is home: a student returning to the page should land on
       the primer and the tiles, not mid-way through whatever they last
       opened. What persists is which parts they finished — the check marks —
       which is the part worth remembering. A deep link still opens its own
       section, below. */

    window.addEventListener('hashchange', function () {
      openForHash(window.location.hash);
    });
    openForHash(window.location.hash);
    syncCardOpen(true);
    refreshCta();
  }

  /* Homepage cards show how far a student got on that topic.

     Reads the same per-page store the tiles write, which works because
     localStorage is per-origin, not per-page. A card only shows progress
     once there is some: an untouched topic showing "0 of 10 parts" reads as
     a chore list, which is the opposite of an invitation. Cards without a
     data-parts count are skipped entirely, so topics that have not been
     converted to the card model yet simply look as they always did. */
  function initCardProgress() {
    var L = window.UnfoldLogic;
    // .lead-story too: the homepage's featured topic uses a different class
    // from the grid cards, and it is the one students land on first.
    var cards = document.querySelectorAll('[data-parts]');
    if (!L || !cards.length) return;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var total = parseInt(card.getAttribute('data-parts'), 10);
      var href = (card.getAttribute('href') || '').split('/').pop();
      if (!total || !href) continue;

      /* Counts parts VISITED, not parts quizzed. Two of the ten carry no
         quiz (Videos, Dig Deeper), so a quiz-only count could never reach
         10 of 10 however thoroughly a student read the topic — the card
         would sit at 8 forever and read as unfinished work. */
      var doneKey = L.doneKey(href);
      var visited;
      try {
        var seen = L.parseDone(
          localStorage.getItem(doneKey.replace('unfold-done:', 'unfold-seen:')));
        var done = L.parseDone(localStorage.getItem(doneKey));
        // Opening a part is what records it, and you cannot reach a part's
        // quiz without opening it — so seen normally covers done. done is
        // the floor only for a student whose progress predates this store.
        visited = Math.max(seen.length, done.length);
      } catch (e) { continue; }
      if (!visited) continue;

      // Grid cards use .tier-meta, the featured story uses .lead-meta.
      var meta = card.querySelector('.tier-meta, .lead-meta');
      if (!meta) continue;
      var tag = document.createElement('span');
      tag.className = 'tier-progress';
      tag.textContent = visited >= total
        ? 'All ' + total + ' parts opened'
        : visited + ' of ' + total + ' parts opened';
      meta.insertBefore(tag, meta.firstChild);
    }
  }

  /* Countdowns, computed rather than typed.

     A hardcoded "68 days until Election Day" is true the day it is written
     and false every day after — VOICE.md's rule against undated "now" and
     "currently" is the same bug, and a countdown is that bug wearing a date.
     The markup stores only the date; this derives the rest, so it can never
     go stale and never needs a refresh.

     Falls back to whatever the element already says, so with JS off the
     sentence still reads true. */
  function initCountdown() {
    var nodes = document.querySelectorAll('.days-until[data-until]');
    for (var i = 0; i < nodes.length; i++) {
      var parts = (nodes[i].getAttribute('data-until') || '').split('-');
      if (parts.length !== 3) continue;
      // Local midnight, not UTC: new Date('2026-11-03') parses as UTC and
      // lands on Nov 2 for anyone west of Greenwich — including every
      // student reading this in Washington State.
      var target = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var days = Math.round((target - today) / 86400000);

      if (days > 1) nodes[i].textContent = days + ' days until Election Day';
      else if (days === 1) nodes[i].textContent = 'Election Day is tomorrow';
      else if (days === 0) nodes[i].textContent = 'Election Day is today';
      // Past the date, the fallback text (which names the date) is correct
      // and the count is not, so leave it alone.
    }
  }

  function initSuggestForm() {
    var form = document.getElementById('suggest-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var topic = (form.topic.value || '').trim();
      var why = (form.why.value || '').trim();
      if (!topic || !why) {
        form.reportValidity();
        return;
      }
      if (topic.length > 120) topic = topic.slice(0, 120);
      if (why.length > 800) why = why.slice(0, 800);
      var name = (form.sname.value || '').trim() || '(not given)';
      var role = form.role.value || 'other';
      var body = [
        'Name: ' + name,
        'I am a: ' + role,
        '',
        'Topic idea:',
        topic,
        '',
        'Why it matters for 8th grade Social Studies:',
        why
      ].join('\n');
      var url = 'mailto:benaderets885@edmonds.wednet.edu?subject=' +
        encodeURIComponent('Current Events Explained — Topic Suggestion: ' + topic) +
        '&body=' + encodeURIComponent(body);
      var status = document.getElementById('suggest-status');
      if (status) {
        status.hidden = false;
        status.textContent = 'Opening your email app. If nothing happens, use the school email link below the button.';
      }
      window.location.href = url;
    });
  }

  window.setTextSize = setTextSize;

  function init() {
    initA11y();
    initTerms();
    initUnfold();
    initCardProgress();
    initCountdown();
    initSuggestForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
