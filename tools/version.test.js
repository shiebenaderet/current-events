/* The build stamp has to match VERSION, on every page.
 *
 * This exists because a shipped change was live on the server and invisible
 * in the browser at the same time: GitHub Pages serves site.css with
 * max-age=600 and no fingerprint in the filename, so a cached copy kept
 * rendering the old layout with nothing on the page to say so.
 *
 * tools/stamp_version.py fixes that by appending ?v=<version> to local
 * assets and writing the build number into the footer. These tests fail if
 * someone bumps VERSION and forgets to run it — which is the only way the
 * two can drift.
 */
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const PAGES = ['index.html', 'ai.html', 'climate-change.html', 'gun-violence.html',
  'immigration.html', 'iran.html', 'space-race.html', 'ukraine.html',
  'us-elections.html'];
const VERSION = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();

test('VERSION is a semver triple', () => {
  assert.match(VERSION, /^\d+\.\d+\.\d+$/);
});

test('every page shows the current build in its footer', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const m = html.match(/<span class="build-version">Build ([^<]+)<\/span>/);
    assert.ok(m, `${page}: no build stamp — run tools/stamp_version.py`);
    assert.equal(m[1], VERSION,
      `${page}: stamp says ${m[1]}, VERSION says ${VERSION}`);
  }
});

test('the build stamp appears exactly once per page', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const n = (html.match(/class="build-version"/g) || []).length;
    assert.equal(n, 1, `${page} has ${n} build stamps`);
  }
});

test('every local css/js reference is cache-busted with the current version', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const refs = [...html.matchAll(
      /(?:href|src)="((?!https?:|\/\/)[^"?#]+\.(?:css|js))(\?v=([^"]*))?"/g)];
    assert.ok(refs.length > 0, `${page} references no local assets`);
    for (const [, file, , stamped] of refs) {
      assert.equal(stamped, VERSION,
        `${page}: ${file} is stamped ${stamped || '(nothing)'}, expected ${VERSION}`);
    }
  }
});

test('the stamp never points at an asset that is not there', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    for (const [, file] of html.matchAll(
      /(?:href|src)="((?!https?:|\/\/)[^"?#]+\.(?:css|js))\?v=/g)) {
      assert.ok(fs.existsSync(path.join(ROOT, file)),
        `${page} references a missing file: ${file}`);
    }
  }
});
