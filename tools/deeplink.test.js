/* Deep links to a single card.
 *
 * A teacher sends one student one section:
 *   current.mrbsocialstudies.org/iran.html#where-things-stand
 *
 * Two halves have to hold up. The link must open that card and only that
 * card, and opening a card must put its slug in the address bar so the link
 * can be copied in the first place.
 *
 * site.js is a browser IIFE with no exports, so this drives it against a
 * small stand-in DOM — enough for initUnfold() to run. That is deliberate:
 * the repository has no dependencies and adding a DOM library to test forty
 * lines of wiring would cost more than it returns. The stand-in mirrors one
 * browser behaviour that matters here, that replaceState updates
 * location.hash, because an earlier version of syncHash read location.hash
 * to decide whether to clear it and that made it untestable.
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
  getAttribute(n) { return n === 'id' ? this.id : (this.attrs[n] ?? null); }
  setAttribute(n, v) { if (n === 'id') this.id = v; else this.attrs[n] = v; }
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
  querySelector(sel) {
    for (const c of this.children) {
      if (sel === 'summary' && c.tagName === 'SUMMARY') return c;
      if (sel.startsWith('.') && c.classList.contains(sel.slice(1))) return c;
      const d = c.querySelector(sel);
      if (d) return d;
    }
    return null;
  }
  querySelectorAll(sel) {
    const out = [];
    for (const c of this.children) {
      if (sel.includes('details.unfold') && c.tagName === 'DETAILS'
          && c.classList.contains('unfold')) out.push(c);
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
  focus() {}
  contains() { return false; }
}

const CARDS = [
  ['Breaking — Hormuz', 'breaking-hormuz', 1],
  ['Where things stand', 'where-things-stand', 2],
  ['How we got here', 'how-we-got-here', 3],
];

function mount(hash = '') {
  const written = [];
  const root = new El('html');
  const body = new El('body');
  root.appendChild(body);
  const byId = { unfoldCta: body.appendChild(new El('div', { id: 'unfoldCta' })) };
  for (const [title, slug, order] of CARDS) {
    const d = new El('details', {
      class: 'unfold', id: slug, 'data-order': String(order),
      'data-title': title, 'data-minutes': '5',
    });
    d.appendChild(new El('summary'));
    body.appendChild(d);
    byId[slug] = d;
  }

  global.document = {
    documentElement: root,
    body,
    getElementById: (i) => byId[i] || null,
    querySelector: (s) => (s.startsWith('#') ? byId[s.slice(1)] || null : null),
    querySelectorAll: (s) => root.querySelectorAll(s),
    createElement: (t) => new El(t),
    addEventListener() {},
    readyState: 'complete',
  };
  global.window = {
    location: { hash, pathname: '/iran.html', search: '', origin: 'https://x' },
    history: {
      // Browsers reflect replaceState into location; the stand-in must too,
      // or the clear-on-close path cannot be exercised.
      replaceState(_s, _t, url) {
        written.push(url);
        const i = url.indexOf('#');
        global.window.location.hash = i < 0 ? '' : url.slice(i);
      },
    },
    addEventListener() {},
    requestAnimationFrame: (f) => f(),
    matchMedia: () => ({ matches: false }),
    localStorage: { getItem: () => null, setItem() {} },
    navigator: { clipboard: null },
    UnfoldLogic: require('../unfold-logic.js'),
  };
  global.history = global.window.history;
  global.navigator = global.window.navigator;
  global.localStorage = global.window.localStorage;

  // site.js is an IIFE over document/window with nothing exported. `src` is
  // this repo's own file, read whole, with nothing interpolated into it.
  const src = fs.readFileSync(path.join(ROOT, 'site.js'), 'utf8');
  new Function(src)();
  return { byId, written };
}

test('a deep link opens the card it names, and only that one', () => {
  const { byId } = mount('#where-things-stand');
  assert.equal(byId['where-things-stand'].open, true);
  assert.equal(byId['breaking-hormuz'].open, false);
  assert.equal(byId['how-we-got-here'].open, false);
});

test('opening a card puts its slug in the address bar', () => {
  const { byId, written } = mount();
  const card = byId['how-we-got-here'];
  card.open = true;
  card.dispatch('toggle');
  assert.ok(written.length > 0, 'expected a URL write');
  assert.ok(written.at(-1).endsWith('#how-we-got-here'), written.at(-1));
});

test('closing the last card clears the hash', () => {
  const { byId, written } = mount();
  const card = byId['how-we-got-here'];
  card.open = true;
  card.dispatch('toggle');
  card.open = false;
  card.dispatch('toggle');
  assert.equal(written.at(-1), '/iran.html');
});

test('a fresh load with nothing open writes no history at all', () => {
  const { written } = mount();
  assert.equal(written.length, 0,
    'a plain page visit should not touch the URL');
});

test('every card on every topic page has a linkable id', () => {
  const pages = ['ai.html', 'climate-change.html', 'gun-violence.html',
    'immigration.html', 'iran.html', 'space-race.html', 'ukraine.html',
    'us-elections.html'];
  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const cards = html.match(/<details class="unfold[^"]*"[^>]*>/g) || [];
    assert.ok(cards.length > 0, `${page} has no cards`);
    for (const tag of cards) {
      assert.ok(/\sid="[a-z0-9-]+"/.test(tag),
        `${page}: card without a linkable id — ${tag.slice(0, 90)}`);
    }
  }
});

test('card ids are unique within a page', () => {
  const pages = ['ai.html', 'climate-change.html', 'gun-violence.html',
    'immigration.html', 'iran.html', 'space-race.html', 'ukraine.html',
    'us-elections.html'];
  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const ids = [...html.matchAll(/<details class="unfold[^"]*"[^>]*\sid="([^"]+)"/g)]
      .map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${page} has duplicate card ids`);
  }
});
