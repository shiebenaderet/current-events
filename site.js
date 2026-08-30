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

    function span(cls, text) {
      var el = document.createElement('span');
      el.className = cls;
      el.textContent = text;
      return el;
    }

    var doneKey = L.doneKey(window.location.pathname);

    function readDone() {
      try { return L.parseDone(localStorage.getItem(doneKey)); }
      catch (e) { return []; }
    }

    function writeDone(list) {
      try { localStorage.setItem(doneKey, L.serializeDone(list)); }
      catch (e) { /* progress is a convenience, never a requirement */ }
    }

    function reveal(el) {
      el.open = true;
      var s = el.querySelector('summary');
      if (s && s.focus) s.focus();
      // site.css's reduced-motion block cannot reach this: scrollIntoView's
      // behavior is a script argument, not a CSS property, so the media
      // query has to be read here by hand.
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                          block: 'start' });
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
    }

    /* One tile per section, in page order, all equal weight — the student
       chooses (spec D3 as revised 2026-08-29). A tile checks when its quiz
       has been answered, right or wrong: the check records that the student
       worked through the part, and Discovery Points already track how well
       separately. */
    function renderMenu(target, isEnd) {
      if (!target) return;
      var done = readDone();
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
          var isHere = isEnd && target.parentNode === sec.el;
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'unfold-tile' + (isDone ? ' is-done' : '') +
            (isHere ? ' is-current' : '') +
            (sec.el.classList.contains('unfold-extra') ? ' is-extra' : '');
          if (isDone) btn.setAttribute('aria-label',
            (sec.el.getAttribute('data-title') || '') + ' — completed');

          var mark = span('unfold-tile-check', isDone ? '✓' : '');
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

    for (var j = 0; j < sections.length; j++) {
      (function (sec) {
        sec.el.addEventListener('toggle', function () {
          if (sec.el.open) collapseOthers(sec.el);
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
    var cards = document.querySelectorAll('.tier-card[data-parts]');
    if (!L || !cards.length) return;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var total = parseInt(card.getAttribute('data-parts'), 10);
      var href = (card.getAttribute('href') || '').split('/').pop();
      if (!total || !href) continue;

      var done;
      try { done = L.parseDone(localStorage.getItem(L.doneKey(href))); }
      catch (e) { continue; }
      if (!done.length) continue;

      var meta = card.querySelector('.tier-meta');
      if (!meta) continue;
      var tag = document.createElement('span');
      tag.className = 'tier-progress';
      tag.textContent = done.length >= total
        ? 'All ' + total + ' parts done'
        : done.length + ' of ' + total + ' parts done';
      meta.insertBefore(tag, meta.firstChild);
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
    initSuggestForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
