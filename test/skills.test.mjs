import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, LEVELS, STUDY, skillById } from '../public/skills.mjs';

test('exactly four skill clusters, in the study\u2019s order', () => {
  assert.equal(SKILLS.length, 4);
  assert.deepEqual(
    SKILLS.map((s) => s.id),
    ['build-deploy-ai', 'engineering-fundamentals', 'coding-agents', 'shaping-the-build'],
  );
  assert.deepEqual(SKILLS.map((s) => s.order), [1, 2, 3, 4]);
});

test('every skill has unique id, summary, signals, emphasis note', () => {
  const ids = new Set();
  for (const s of SKILLS) {
    assert.ok(!ids.has(s.id), `duplicate id ${s.id}`);
    ids.add(s.id);
    assert.ok(s.name && s.short && s.summary, s.id);
    assert.ok(Array.isArray(s.signals) && s.signals.length >= 4, `${s.id} signals`);
    assert.ok(s.emphasisNote.includes('letter') || s.emphasisNote.includes('study'),
      `${s.id} emphasisNote must cite the letter/study`);
  }
});

test('study metadata is honest about the sample', () => {
  assert.match(STUDY.sample, /10,000\+ job postings/);
  assert.match(STUDY.sample, /interviews/);
  assert.ok(STUDY.url.startsWith('https://www.deeplearning.ai/'));
  assert.ok(STUDY.published);
});

test('levels are a strict 0..3 ladder', () => {
  assert.deepEqual(LEVELS.map((l) => l.score), [0, 1, 2, 3]);
  for (const l of LEVELS) assert.ok(l.label && l.hint);
});

test('skillById throws on unknown id', () => {
  assert.equal(skillById('coding-agents').id, 'coding-agents');
  assert.throws(() => skillById('prompt-shaman'), Error);
});
