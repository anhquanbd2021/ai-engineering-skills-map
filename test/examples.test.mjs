import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { EXAMPLES } from '../public/examples.mjs';
import { validateAssessment } from '../public/meter.mjs';

const EXAMPLES_DIR = fileURLToPath(new URL('../examples', import.meta.url));

function canon(a) {
  // deep-sort keys so file/embedded formatting differences don't matter
  if (Array.isArray(a)) return a.map(canon);
  if (a && typeof a === 'object') {
    return Object.fromEntries(Object.keys(a).sort().map((k) => [k, canon(a[k])]));
  }
  return a;
}

test('embedded examples mirror examples/*.json exactly', () => {
  const files = readdirSync(EXAMPLES_DIR).filter((f) => f.endsWith('.json'));
  assert.equal(files.length, Object.keys(EXAMPLES).length, 'file/embedded count mismatch');
  for (const f of files) {
    const key = f.replace(/\.json$/, '');
    assert.ok(EXAMPLES[key], `embedded example missing for ${f}`);
    const disk = JSON.parse(readFileSync(join(EXAMPLES_DIR, f), 'utf8'));
    assert.deepEqual(canon(EXAMPLES[key]), canon(disk), `${key} drifted from disk`);
  }
});

test('every example is a valid assessment', () => {
  for (const [key, ex] of Object.entries(EXAMPLES)) {
    assert.equal(validateAssessment(ex), true, key);
  }
});
