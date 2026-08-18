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

  window.toggleDyslexic = toggleDyslexic;
  window.setTextSize = setTextSize;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initA11y);
  } else {
    initA11y();
  }
})();
