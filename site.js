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

    var key = L.progressKey(window.location.pathname);
    var cta = document.getElementById('unfoldCta');

    function span(cls, text) {
      var el = document.createElement('span');
      el.className = cls;
      el.textContent = text;
      return el;
    }

    function read() {
      try { return L.parseProgress(localStorage.getItem(key)); }
      catch (e) { return []; }   // private mode / storage disabled
    }

    function write(list) {
      try { localStorage.setItem(key, L.serializeProgress(list)); }
      catch (e) { /* progress is a convenience, never a requirement */ }
    }

    function openedOrders() {
      var out = [];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.open) out.push(sections[i].order);
      }
      return out;
    }

    function find(order) {
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].order === order) return sections[i].el;
      }
      return null;
    }

    function refreshCta() {
      if (!cta) return;
      var next = L.nextUnopened(
        sections.map(function (s) { return s.order; }),
        openedOrders()
      );
      if (next === null) { cta.hidden = true; return; }
      var el = find(next);
      var title = el.getAttribute('data-title') || '';
      var mins = el.getAttribute('data-minutes') || '';
      cta.hidden = false;
      while (cta.firstChild) cta.removeChild(cta.firstChild);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'unfold-cta-btn';
      // Built node-by-node rather than via innerHTML: data-title and
      // data-minutes are page-authored, but there is no reason for this to
      // be the one place a future edit could inject markup.
      btn.appendChild(span('unfold-cta-label', 'Keep going'));
      btn.appendChild(span('unfold-cta-title', title));
      btn.appendChild(span('unfold-cta-time', mins ? mins + ' min' : ''));
      btn.addEventListener('click', function () {
        el.open = true;
        var s = el.querySelector('summary');
        if (s && s.focus) s.focus();
        // site.css's reduced-motion block cannot reach this: scrollIntoView's
        // behavior is a script argument, not a CSS property, so the media
        // query has to be read here by hand.
        el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                            block: 'start' });
      });
      cta.appendChild(btn);
    }

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
      sections[j].el.addEventListener('toggle', function () {
        write(openedOrders());
        refreshCta();
      });
    }

    var saved = read();
    for (var k = 0; k < sections.length; k++) {
      if (saved.indexOf(sections[k].order) !== -1) sections[k].el.open = true;
    }

    window.addEventListener('hashchange', function () {
      openForHash(window.location.hash);
    });
    openForHash(window.location.hash);
    refreshCta();
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
    initSuggestForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
