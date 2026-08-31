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

  /* Timelines: a spine, and a way to skip along it.

     Eight of the twelve run to six entries or more (ai's is 19), and a long
     flat run of dated rows gives a reader scrolling through it no sense of
     where they are and no way to jump. The spine is CSS; this adds the jump
     strip and keeps it in step with the scroll.

     Everything here is an enhancement over markup that already works: with
     JS off the entries are still a dated list in document order, which is
     the whole point of building the site this way. */
  function initTimelines() {
    var items = document.querySelectorAll('.tl-item');
    if (!items.length) return;

    /* Group by parent rather than by a wrapper class — the wrappers are not
       consistent across pages (#aiTimeline, #ukraineTimeline, and on
       space-race the items sit straight inside .article), and inventing a
       convention here would mean editing eight files to match it. */
    var groups = [];
    for (var i = 0; i < items.length; i++) {
      var parent = items[i].parentNode;
      var g = null;
      for (var k = 0; k < groups.length; k++) {
        if (groups[k].parent === parent) { g = groups[k]; break; }
      }
      if (!g) { g = { parent: parent, items: [] }; groups.push(g); }
      g.items.push(items[i]);
    }

    for (var n = 0; n < groups.length; n++) buildTimeline(groups[n]);
  }

  /* Nineteen equal entries is the density problem, and a jump strip of
     nineteen years only restates it. Above a dozen, entries are collected
     into decades that open and close, so the timeline starts as a short list
     of eras and expands where the reader wants detail.

     Returns [{label, details, items}] or null when the timeline is short
     enough to leave alone. */
  function groupByEra(parent, list) {
    if (list.length < 12) return null;

    /* Labels are not tidy years. Real ones on this site include "Around 550
       BCE", "~882 AD", "1951–1953", "Early 1900s" and "Jun 17, 2026", so
       take the first number that looks like a year and read BCE as negative. */
    function yearOf(item) {
      var y = item.querySelector('.tl-year');
      if (!y) return null;
      var text = y.textContent;
      var m = text.match(/(\d{3,4})/);
      if (!m) return null;
      var year = parseInt(m[1], 10);
      return /\bBCE?\b/i.test(text) ? -year : year;
    }

    var years = [];
    for (var i = 0; i < list.length; i++) {
      var y = yearOf(list[i]);
      // Bail rather than half-group: one unparsed entry would land in an
      // "everything else" bucket, which is worse than the flat list.
      if (y === null) return null;
      years.push(y);
    }

    /* Decades only make sense over a span a few decades wide. ai runs
       1950–2026 and groups into seven decades. iran runs from 550 BCE and
       ukraine from 882 AD; decade buckets there would be mostly empty and
       occasionally hold one event, which is worse than no grouping.

       Those two want NAMED historical eras — Kievan Rus', empire, Soviet,
       independence — and naming them is an editorial judgement about where
       the breaks fall, not something to infer from the dates. So they stay
       flat until someone makes that call. */
    var span = Math.max.apply(null, years) - Math.min.apply(null, years);
    if (span > 120) return null;

    var decades = [];
    for (var d2 = 0; d2 < years.length; d2++) {
      decades.push(Math.floor(years[d2] / 10) * 10);
    }

    var eras = [];
    for (var j = 0; j < list.length; j++) {
      var last = eras[eras.length - 1];
      if (!last || last.decade !== decades[j]) {
        eras.push({ decade: decades[j], items: [list[j]] });
      } else {
        last.items.push(list[j]);
      }
    }
    if (eras.length < 3) return null;   // not enough grouping to be worth it

    var out = [];
    for (var k = 0; k < eras.length; k++) {
      var era = eras[k];
      var det = document.createElement('details');
      det.className = 'tl-era';
      // The first era open, so the timeline still begins as a timeline
      // rather than as a menu of closed boxes.
      det.open = (k === 0);
      var sum = document.createElement('summary');
      var label = era.decade + 's';
      // span() lives inside initUnfold; this runs outside it.
      function chip(cls, text) {
        var el = document.createElement('span');
        el.className = cls;
        el.textContent = text;
        return el;
      }
      sum.appendChild(chip('tl-era-label', label));
      sum.appendChild(chip('tl-era-count',
        era.items.length + (era.items.length === 1 ? ' event' : ' events')));
      det.appendChild(sum);
      parent.insertBefore(det, era.items[0]);
      for (var n = 0; n < era.items.length; n++) det.appendChild(era.items[n]);
      out.push({ label: label, details: det, items: era.items });
    }
    return out;
  }

  function buildTimeline(group) {
    var parent = group.parent;
    var list = group.items;
    parent.classList.add('tl-wrap');

    // Below six entries the whole thing is on screen in a scroll or two, and
    // a jump strip would be chrome for a problem nobody has.
    if (list.length < 6) return;
    if (parent.querySelector('.tl-jump')) return;

    /* Dense timelines get grouped before anything else, so the jump strip is
       built from the eras rather than from nineteen individual years. */
    var eras = groupByEra(parent, list);

    var strip = document.createElement('div');
    strip.className = 'tl-jump';
    strip.setAttribute('role', 'navigation');
    strip.setAttribute('aria-label', 'Jump to a point in this timeline');

    /* An open card's <summary> is itself sticky at top:0 with z-index 20, so
       a strip that also sticks at 0 slides underneath it and is unreadable.
       The offset is measured rather than guessed because the summary's
       height changes with the A/A/A text-size control. */
    function placeStrip() {
      var card = parent.closest ? parent.closest('details.unfold') : null;
      var summary = card ? card.querySelector('summary') : null;
      strip.style.top = (summary ? summary.offsetHeight : 0) + 'px';
    }
    placeStrip();
    window.addEventListener('resize', placeStrip);
    // The text-size buttons change the summary's height without a resize.
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.closest && t.closest('.text-size-controls')) {
        window.setTimeout(placeStrip, 0);
      }
    });

    var label = document.createElement('span');
    label.className = 'tl-jump-label';
    label.textContent = 'Jump to';
    strip.appendChild(label);

    /* One button per era where the timeline was grouped, one per entry where
       it was not. Nineteen year-buttons only restate the density they were
       added to relieve. */
    var stops = [];
    if (eras) {
      for (var e = 0; e < eras.length; e++) {
        stops.push({
          text: eras[e].label,
          aria: 'Jump to the ' + eras[e].label + ', ' + eras[e].items.length + ' events',
          target: eras[e].details,
          era: eras[e].details,
          watch: eras[e].items
        });
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var yearEl = list[i].querySelector('.tl-year');
        var year = yearEl ? yearEl.textContent.trim() : '';
        if (!year) continue;
        var h = list[i].querySelector('h4');
        stops.push({
          text: year,
          aria: 'Jump to ' + year + (h ? ': ' + h.textContent.trim() : ''),
          target: list[i],
          era: null,
          watch: [list[i]]
        });
      }
    }

    var buttons = [];
    for (var s = 0; s < stops.length; s++) {
      (function (stop) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = stop.text;
        b.setAttribute('aria-label', stop.aria);
        b.addEventListener('click', function () {
          // A closed era cannot be scrolled to. Open it first, then go.
          if (stop.era && !stop.era.open) stop.era.open = true;
          stop.target.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start'
          });
        });
        strip.appendChild(b);
        buttons.push({ btn: b, item: stop.target, watch: stop.watch });
      })(stops[s]);
    }
    if (!buttons.length) return;
    parent.insertBefore(strip, parent.firstChild);

    /* Keep the strip showing where the reader is. IntersectionObserver
       rather than a scroll handler: no listener firing on every frame, and
       it reports what is actually on screen rather than a computed guess. */
    if (!window.IntersectionObserver) return;
    var seen = [];
    var obs = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        // A stop may cover several entries (an era), so find the stop whose
        // watch list contains whatever just crossed.
        var idx = -1;
        for (var j = 0; j < buttons.length && idx < 0; j++) {
          for (var w = 0; w < buttons[j].watch.length; w++) {
            if (buttons[j].watch[w] === entries[e].target) { idx = j; break; }
          }
        }
        if (idx < 0) continue;
        seen[idx] = entries[e].isIntersecting;
      }
      var current = -1;
      for (var s = 0; s < seen.length; s++) {
        if (seen[s]) { current = s; break; }
      }
      for (var b2 = 0; b2 < buttons.length; b2++) {
        if (b2 === current) buttons[b2].btn.setAttribute('aria-current', 'true');
        else buttons[b2].btn.removeAttribute('aria-current');
      }
    }, { rootMargin: '-45% 0px -45% 0px' });
    for (var o = 0; o < buttons.length; o++) {
      for (var v = 0; v < buttons[o].watch.length; v++) obs.observe(buttons[o].watch[v]);
    }
  }

  window.setTextSize = setTextSize;

  function init() {
    initA11y();
    initTerms();
    initUnfold();
    initTimelines();
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
