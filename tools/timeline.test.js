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
  insertBefore(c) { c.parentNode = this; this.children.unshift(c); return c; }
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
  closest() { return null; }
  scrollIntoView() {}
  focus() {}
  contains() { return false; }
}

/** Build a page with the given timelines: [[wrapperClass, entryCount], ...] */
function mount(specs) {
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
      const bodyEl = new El('div', { class: 'tl-body' });
      const h = new El('h4');
      h.textContent = 'Event ' + i;
      bodyEl.appendChild(h);
      item.appendChild(year);
      item.appendChild(bodyEl);
      wrap.appendChild(item);
    }
    body.appendChild(wrap);
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

test('a long timeline gets a jump strip with one button per entry', () => {
  const { wraps } = mount([['article', 19]]);
  const strip = wraps[0].querySelector('.tl-jump');
  assert.ok(strip, 'expected a jump strip on a 19-entry timeline');
  const buttons = strip.querySelectorAll('button');
  assert.equal(buttons.length, 19);
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
