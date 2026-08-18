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
    initSuggestForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
