(function () {
  function toggleDyslexic() {
    document.body.classList.toggle('dyslexic');
    var on = document.body.classList.contains('dyslexic');
    localStorage.setItem('dyslexicFont', on ? 'on' : 'off');
    var btn = document.getElementById('dyslexicToggle');
    if (btn) btn.classList.toggle('active', on);
  }

  function setTextSize(size) {
    document.body.classList.remove('text-lg', 'text-xl');
    if (size === 'lg') document.body.classList.add('text-lg');
    if (size === 'xl') document.body.classList.add('text-xl');
    localStorage.setItem('textSize', size);
  }

  function initA11y() {
    if (localStorage.getItem('dyslexicFont') === 'on') {
      document.body.classList.add('dyslexic');
      var btn = document.getElementById('dyslexicToggle');
      if (btn) btn.classList.add('active');
    }
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

  window.toggleDyslexic = toggleDyslexic;
  window.setTextSize = setTextSize;

  function init() {
    initA11y();
    initTerms();
    initSuggestForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
