import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, LEVELS, skillById } from '../public/skills.mjs';
import {
  emphasisFor,
  coverageFor,
  validateAssessment,
  profileScores,
  gaps,
  tProfile,
  flags,
  report,
  levelLabel,
  BREADTH_THRESHOLD,
  DEPTH_THRESHOLD,
} from '../public/meter.mjs';
import { EXAMPLES } from '../public/examples.mjs';

const zeros = () =>
  Object.fromEntries(SKILLS.map((s) => [s.id, s.signals.map(() => 0)]));
const full = () =>
  Object.fromEntries(SKILLS.map((s) => [s.id, s.signals.map(() => 3)]));

test('coverageFor: all-zero → 0, all-three → 100', () => {
  const s = SKILLS[0];
  assert.equal(coverageFor(s, s.signals.map(() => 0)), 0);
  assert.equal(coverageFor(s, s.signals.map(() => 3)), 100);
});

test('coverageFor: mean of ratings, rounded', () => {
  const s = skillById('engineering-fundamentals'); // 5 signals
  assert.equal(coverageFor(s, [3, 3, 3, 3, 3]), 100);
  assert.equal(coverageFor(s, [1, 1, 1, 1, 1]), 33); // 5/15
  assert.equal(coverageFor(s, [3, 0, 0, 0, 0]), 20); // 3/15
});

test('coverageFor: rejects wrong length and bad values', () => {
  const s = SKILLS[0];
  assert.throws(() => coverageFor(s, [1, 2]), RangeError);
  assert.throws(() => coverageFor(s, s.signals.map(() => 4)), RangeError);
  assert.throws(() => coverageFor(s, s.signals.map(() => -1)), RangeError);
  assert.throws(() => coverageFor(s, s.signals.map(() => 1.5)), RangeError);
  assert.throws(() => coverageFor(s, 'nope'), TypeError);
});

test('emphasisFor: richest list = 100, others proportional', () => {
  const richest = SKILLS.reduce((a, b) => (b.signals.length > a.signals.length ? b : a));
  assert.equal(emphasisFor(richest), 100);
  for (const s of SKILLS) {
    const e = emphasisFor(s);
    assert.ok(e > 0 && e <= 100, `${s.id} emphasis ${e}`);
    const expected = Math.round(
      (100 * s.signals.length) / Math.max(...SKILLS.map((k) => k.signals.length)),
    );
    assert.equal(e, expected);
  }
});

test('validateAssessment: requires every skill id', () => {
  const ratings = zeros();
  delete ratings['coding-agents'];
  assert.throws(() => validateAssessment({ ratings }), RangeError);
  assert.throws(() => validateAssessment(null), TypeError);
  assert.throws(() => validateAssessment({}), TypeError);
  assert.equal(validateAssessment({ ratings: zeros() }), true);
});

test('profileScores: coverage/emphasis/gap consistent', () => {
  const scores = profileScores({ ratings: full() });
  for (const s of scores) {
    assert.equal(s.coverage, 100);
    assert.equal(s.gap, s.emphasis - 100);
  }
});

test('gaps: sorted descending by gap', () => {
  const r = gaps(profileScores({ ratings: EXAMPLES['vibe-coder'].ratings }));
  for (let i = 1; i < r.length; i++) assert.ok(r[i - 1].gap >= r[i].gap);
  assert.equal(r[0].id, 'build-deploy-ai'); // vibe coder's biggest gap (86% emphasis, ~11% coverage)
});

test('tProfile verdicts', () => {
  const balanced = tProfile(profileScores({ ratings: EXAMPLES['fullstack-balanced'].ratings }));
  assert.equal(balanced.verdict, 't-shaped');
  assert.ok(balanced.broadCount >= 3);

  const devops = tProfile(profileScores({ ratings: EXAMPLES['devops-infra'].ratings }));
  assert.equal(devops.verdict, 'deep-but-narrow');
  assert.equal(devops.deepest, 'engineering-fundamentals');

  const grad = tProfile(profileScores({ ratings: EXAMPLES['new-grad'].ratings }));
  assert.equal(grad.verdict, 'early-stage');
});

test('flags: vibe coder triggers leverage-without-steering', () => {
  const f = flags(profileScores({ ratings: EXAMPLES['vibe-coder'].ratings }));
  assert.ok(f.some((x) => x.startsWith('leverage-without-steering')));
  // balanced profile triggers nothing
  assert.equal(flags(profileScores({ ratings: EXAMPLES['fullstack-balanced'].ratings })).length, 0);
});

test('flags: builder-without-compass', () => {
  const ratings = zeros();
  ratings['build-deploy-ai'] = ratings['build-deploy-ai'].map(() => 3); // 100%
  ratings['engineering-fundamentals'] = ratings['engineering-fundamentals'].map(() => 3);
  ratings['coding-agents'] = ratings['coding-agents'].map(() => 2);
  // shaping stays 0 → below breadth threshold
  const f = flags(profileScores({ ratings }));
  assert.ok(f.some((x) => x.startsWith('builder-without-compass')));
});

test('levelLabel maps 0-3 and rejects out-of-range', () => {
  for (const l of LEVELS) assert.equal(levelLabel(l.score), l.label);
  assert.throws(() => levelLabel(4), RangeError);
});

test('report returns full bundle', () => {
  const r = report(EXAMPLES['devops-infra']);
  assert.equal(r.name, 'DevOps / platform engineer');
  assert.equal(r.scores.length, SKILLS.length);
  assert.ok(r.gaps.length === SKILLS.length && r.t && Array.isArray(r.flags));
});

test('thresholds are sane', () => {
  assert.ok(BREADTH_THRESHOLD < DEPTH_THRESHOLD);
  assert.ok(DEPTH_THRESHOLD <= 100);
});
