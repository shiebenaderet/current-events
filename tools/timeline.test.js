/* The timeline jump strip.
 *
 * Eight of the twelve timelines run to six entries or more, and the strip is
 * what makes a long one navigable. The things worth pinning down: it groups
 * by parent (the wrappers differ per page), it stays out of the way on short
 * timelines, and it never appears twice.
 *
 * Same stand-in-DOM approach as deeplink.test.js, and for the same reason:
 * site.js is a browser IIFE with nothing exported, and this repo carries no
 * dependencies.
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

class El {
  constructor(tag, attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.attrs = { ...attrs };
    this.id = attrs.id || '';
    this.open = false;
    this.textContent = '';
    this.listeners = {};
    this.style = {};
    this.parentNode = null;
    const set = new Set((attrs.class || '').split(' ').filter(Boolean));
    this.classList = {
      _s: set,
      add: (c) => set.add(c),
      remove: (c) => set.delete(c),
      contains: (c) => set.has(c),
      toggle: (c, on) => (on ? set.add(c) : set.delete(c)),
    };
  }
  get className() { return [...this.classList._s].join(' '); }
  /* Mutate the existing set rather than replacing it: classList's methods
     close over the set created in the constructor, so swapping _s would
     leave contains() reading the old one — which is exactly the bug that
     made these tests fail against working code. */
  set className(v) {
    this.classList._s.clear();
    for (const c of v.split(' ').filter(Boolean)) this.classList._s.add(c);
  }
  getAttribute(n) { return n === 'id' ? this.id : (this.attrs[n] ?? null); }
  setAttribute(n, v) { if (n === 'id') this.id = v; else this.attrs[n] = v; }
  removeAttribute(n) { delete this.attrs[n]; }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
  /* Honour the reference node. An insertBefore that always prepends
     silently reverses anything inserted in a loop — which is how the decade
     groups came out 1970s, 1960s, 1950s against working code. */
  insertBefore(c, ref) {
    c.parentNode = this;
    const i = ref ? this.children.indexOf(ref) : -1;
    if (i >= 0) this.children.splice(i, 0, c);
    else this.children.unshift(c);
    return c;
  }
  removeChild(c) {
    const i = this.children.indexOf(c);
    if (i >= 0) this.children.splice(i, 1);
    return c;
  }
  addEventListener(t, fn) { (this.listeners[t] ||= []).push(fn); }
  dispatch(t) { (this.listeners[t] || []).forEach((fn) => fn.call(this, { target: this })); }
  get firstChild() { return this.children[0] || null; }
  _match(sel) {
    if (sel.startsWith('.')) return this.classList.contains(sel.slice(1));
    return this.tagName === sel.toUpperCase();
  }
  querySelector(sel) {
    for (const c of this.children) {
      if (c._match(sel)) return c;
      const d = c.querySelector(sel);
      if (d) return d;
    }
    return null;
  }
  querySelectorAll(sel) {
    const out = [];
    for (const c of this.children) {
      if (c._match(sel)) out.push(c);
      out.push(...c.querySelectorAll(sel));
    }
    return out;
  }
  closest(sel) {
    let n = this;
    while (n) {
      if (sel.includes('details.unfold') && n.tagName === 'DETAILS'
          && n.classList.contains('unfold')) return n;
      n = n.parentNode;
    }
    return null;
  }
  scrollIntoView() {}
  get offsetHeight() { return 40; }
  focus() {}
  contains() { return false; }
}

/** Build a page with the given timelines: [[wrapperClass, entryCount], ...].
 *  insideCard puts each timeline in an open <details class="unfold"> with a
 *  sticky <summary>, which is the real arrangement on every topic page. */
function mount(specs, insideCard = false, labelFor = null) {
  const observed = [];
  const root = new El('html');
  const body = new El('body');
  root.appendChild(body);
  const wraps = [];
  for (const [cls, count] of specs) {
    const wrap = new El('div', { class: cls });
    for (let i = 0; i < count; i++) {
      const item = new El('div', { class: 'tl-item' });
      const year = new El('div', { class: 'tl-year' });
      year.textContent = String(1950 + i);
      if (labelFor) labelFor(i, year);
      const bodyEl = new El('div', { class: 'tl-body' });
      const h = new El('h4');
      h.textContent = 'Event ' + i;
      bodyEl.appendChild(h);
      item.appendChild(year);
      item.appendChild(bodyEl);
      wrap.appendChild(item);
    }
    if (insideCard) {
      const card = new El('details', { class: 'unfold' });
      card.open = true;
      card.appendChild(new El('summary'));
      card.appendChild(wrap);
      body.appendChild(card);
    } else {
      body.appendChild(wrap);
    }
    wraps.push(wrap);
  }

  global.document = {
    documentElement: root,
    body,
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: (s) => root.querySelectorAll(s),
    createElement: (t) => new El(t),
    addEventListener() {},
    readyState: 'complete',
  };
  global.window = {
    location: { hash: '', pathname: '/ai.html', search: '', origin: 'https://x' },
    history: { replaceState() {} },
    addEventListener() {},
    requestAnimationFrame: (f) => f(),
    matchMedia: () => ({ matches: false }),
    localStorage: { getItem: () => null, setItem() {} },
    navigator: {},
    IntersectionObserver: class {
      constructor(fn) { this.fn = fn; }
      observe(el) { observed.push(el); }
    },
  };
  global.history = global.window.history;
  global.navigator = global.window.navigator;
  global.localStorage = global.window.localStorage;
  global.IntersectionObserver = global.window.IntersectionObserver;

  // This repo's own site.js, read whole; nothing is interpolated into it.
  new Function(fs.readFileSync(path.join(ROOT, 'site.js'), 'utf8'))();
  return { wraps, observed };
}

test('an ungrouped timeline gets one jump button per entry', () => {
  // Below the grouping threshold the stops are the years themselves.
  const { wraps } = mount([['article', 9]]);
  const strip = wraps[0].querySelector('.tl-jump');
  assert.ok(strip, 'expected a jump strip on a 9-entry timeline');
  const buttons = strip.querySelectorAll('button');
  assert.equal(buttons.length, 9);
  assert.equal(buttons[0].textContent, '1950');
});

test('a short timeline gets no strip — chrome for a problem nobody has', () => {
  const { wraps } = mount([['article', 5]]);
  assert.equal(wraps[0].querySelector('.tl-jump'), null);
});

test('six entries is the threshold', () => {
  assert.ok(mount([['article', 6]]).wraps[0].querySelector('.tl-jump'),
    'six should get a strip');
  assert.equal(mount([['article', 5]]).wraps[0].querySelector('.tl-jump'), null,
    'five should not');
});

test('every timeline gets the spine class, long or short', () => {
  const { wraps } = mount([['article', 3], ['article', 12]]);
  assert.ok(wraps[0].classList.contains('tl-wrap'));
  assert.ok(wraps[1].classList.contains('tl-wrap'));
});

test('timelines are grouped by parent, not merged into one', () => {
  // The wrappers genuinely differ per page (#aiTimeline, .article, ...), so
  // two timelines on one page must not pool their entries.
  const { wraps } = mount([['article', 8], ['some-other-wrapper', 7]]);
  assert.equal(wraps[0].querySelector('.tl-jump').querySelectorAll('button').length, 8);
  assert.equal(wraps[1].querySelector('.tl-jump').querySelectorAll('button').length, 7);
});

test('each jump button names where it lands, for screen readers', () => {
  const { wraps } = mount([['article', 6]]);
  const b = wraps[0].querySelector('.tl-jump').querySelectorAll('button')[0];
  assert.match(b.getAttribute('aria-label'), /^Jump to 1950: Event 0$/);
});

test('the strip observes every entry so it can track the scroll', () => {
  const { observed } = mount([['article', 9]]);
  assert.equal(observed.length, 9);
});


/* ── Decade grouping on dense timelines ───────────────────────────────── */

test('a timeline of twelve or more is grouped into decades', () => {
  const { wraps } = mount([['article', 25]]);
  const eras = wraps[0].querySelectorAll('.tl-era');
  const labels = eras.map((e) => e.querySelector('.tl-era-label').textContent);
  assert.deepEqual(labels, ['1950s', '1960s', '1970s'],
    'consecutive years from 1950 should split at each decade boundary');
});

test('a timeline under twelve is left flat', () => {
  const { wraps } = mount([['article', 8]]);
  assert.equal(wraps[0].querySelectorAll('.tl-era').length, 0);
});

test('the first era is open so the timeline still reads as a timeline', () => {
  const { wraps } = mount([['article', 25]]);
  const eras = wraps[0].querySelectorAll('.tl-era');
  assert.equal(eras[0].open, true, 'first era should start open');
  assert.equal(eras[1].open, false, 'later eras should start closed');
});

test('grouping moves every entry into an era, losing none', () => {
  const { wraps } = mount([['article', 25]]);
  const inEras = wraps[0].querySelectorAll('.tl-era')
    .reduce((n, e) => n + e.querySelectorAll('.tl-item').length, 0);
  assert.equal(inEras, 25);
});

test('a grouped timeline gets one jump button per era, not per year', () => {
  const { wraps } = mount([['article', 25]]);
  const buttons = wraps[0].querySelector('.tl-jump').querySelectorAll('button');
  const eras = wraps[0].querySelectorAll('.tl-era');
  assert.equal(buttons.length, eras.length,
    'nineteen year buttons would restate the density the grouping relieves');
});

test('the jump strip clears the sticky card header instead of hiding under it', () => {
  // An open card's <summary> is sticky at top:0 with z-index 20; a strip at
  // top:0 slides underneath it. It has to be offset by the summary's height.
  const { wraps } = mount([['article', 25]], /* insideCard */ true);
  const strip = wraps[0].querySelector('.tl-jump');
  assert.equal(strip.style.top, '40px',
    'strip should be offset by the sticky summary height');
});


test('a millennia-spanning timeline is left flat, not bucketed by decade', () => {
  // ukraine runs from ~882 AD and iran from 550 BCE. Decade buckets across
  // that span would be mostly empty and occasionally hold one event, which
  // is worse than the flat list. Those want named historical eras, and
  // naming them is an editorial call rather than something to infer.
  const { wraps } = mount([['article', 14]]);
  const items = wraps[0].querySelectorAll('.tl-item');
  items[0].querySelector('.tl-year').textContent = '~882 AD';
  // rebuild with the wide span in place
  const { wraps: w2 } = mount([['article', 14]], false, (i, yearEl) => {
    yearEl.textContent = i === 0 ? '~882 AD' : String(1950 + i);
  });
  assert.equal(w2[0].querySelectorAll('.tl-era').length, 0,
    'a 1100-year span should not be grouped into decades');
});

test('BCE labels are read as negative years, not as 550 AD', () => {
  const { wraps } = mount([['article', 14]], false, (i, yearEl) => {
    yearEl.textContent = i === 0 ? 'Around 550 BCE' : String(2000 + i);
  });
  assert.equal(wraps[0].querySelectorAll('.tl-era').length, 0,
    '550 BCE to 2013 is a 2500-year span and must not be grouped');
});

test('messy but close-together labels still group', () => {
  // "Early 1900s", "1951–1953", "Jun 17, 2026" all appear on this site.
  const { wraps } = mount([['article', 13]], false, (i, yearEl) => {
    const labels = ['Early 1930s', '1941–1944', 'March 1950', '1951–1953',
      '1960', 'Jun 17, 1962', '1970', '1971', '1980', '1985', '1990',
      '1995', '2000'];
    yearEl.textContent = labels[i];
  });
  assert.ok(wraps[0].querySelectorAll('.tl-era').length >= 3,
    'a 70-year span with messy labels should still group');
});
