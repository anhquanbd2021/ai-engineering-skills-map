// Pure scoring engine for the Skills Demand Meter.
// Coverage = how much of a skill's named sub-skills you practice (0-100).
// Emphasis = how prominently the study features the skill (0-100), derived
// mechanically from the count of sub-skills the letter names for it.
// Gap = emphasis - coverage → where the market asks more than you show.

import { SKILLS, LEVELS, skillById } from './skills.mjs';

export const RATING_MIN = 0;
export const RATING_MAX = LEVELS.length - 1; // 3
export const BREADTH_THRESHOLD = 50; // coverage % that counts as "literate"
export const DEPTH_THRESHOLD = 66; // coverage % that counts as "deep"

export function maxSignals(skills = SKILLS) {
  return Math.max(...skills.map((s) => s.signals.length));
}

// Mechanical, defensible emphasis score: share of the richest sub-skill
// list in the letter. Labeled an editorial estimate wherever displayed.
export function emphasisFor(skill, skills = SKILLS) {
  return Math.round((100 * skill.signals.length) / maxSignals(skills));
}

export function levelLabel(score) {
  const level = LEVELS.find((l) => l.score === score);
  if (!level) throw new RangeError(`rating must be ${RATING_MIN}-${RATING_MAX}, got ${score}`);
  return level.label;
}

// ratings: array of 0-3 aligned to skill.signals indexes.
export function coverageFor(skill, ratings) {
  if (!Array.isArray(ratings)) throw new TypeError('ratings must be an array');
  if (ratings.length !== skill.signals.length) {
    throw new RangeError(
      `${skill.id}: expected ${skill.signals.length} ratings, got ${ratings.length}`,
    );
  }
  let sum = 0;
  for (const r of ratings) {
    if (!Number.isInteger(r) || r < RATING_MIN || r > RATING_MAX) {
      throw new RangeError(`${skill.id}: rating must be an integer ${RATING_MIN}-${RATING_MAX}, got ${r}`);
    }
    sum += r;
  }
  return Math.round((100 * sum) / (skill.signals.length * RATING_MAX));
}

// assessment: { name?, ratings: { [skillId]: number[] } }
export function validateAssessment(assessment, skills = SKILLS) {
  if (!assessment || typeof assessment !== 'object') {
    throw new TypeError('assessment must be an object');
  }
  if (!assessment.ratings || typeof assessment.ratings !== 'object') {
    throw new TypeError('assessment.ratings must be an object keyed by skill id');
  }
  for (const skill of skills) {
    if (!(skill.id in assessment.ratings)) {
      throw new RangeError(`assessment is missing ratings for "${skill.id}"`);
    }
    coverageFor(skill, assessment.ratings[skill.id]); // validates shape/values
  }
  return true;
}

export function profileScores(assessment, skills = SKILLS) {
  validateAssessment(assessment, skills);
  return skills.map((skill) => {
    const coverage = coverageFor(skill, assessment.ratings[skill.id]);
    const emphasis = emphasisFor(skill, skills);
    return {
      id: skill.id,
      name: skill.name,
      short: skill.short,
      coverage,
      emphasis,
      gap: emphasis - coverage,
    };
  });
}

export function gaps(scores) {
  return [...scores].sort((a, b) => b.gap - a.gap);
}

// T-shaped read: breadth = axes at/above literacy; depth = strongest axis.
export function tProfile(scores) {
  const broad = scores.filter((s) => s.coverage >= BREADTH_THRESHOLD);
  const deepest = [...scores].sort((a, b) => b.coverage - a.coverage)[0];
  const isDeep = deepest.coverage >= DEPTH_THRESHOLD;
  let verdict;
  if (isDeep && broad.length >= 3) verdict = 't-shaped';
  else if (isDeep) verdict = 'deep-but-narrow';
  else if (broad.length >= 3) verdict = 'broad-but-shallow';
  else verdict = 'early-stage';
  return { verdict, broadCount: broad.length, deepest: deepest.id, deepestCoverage: deepest.coverage };
}

// Named anti-pattern from the study: heavy agent usage on weak fundamentals
// means the trades the agent makes are invisible to you.
export function flags(scores) {
  const byId = Object.fromEntries(scores.map((s) => [s.id, s]));
  const out = [];
  if (
    byId['coding-agents'].coverage >= DEPTH_THRESHOLD &&
    byId['engineering-fundamentals'].coverage < BREADTH_THRESHOLD
  ) {
    out.push(
      'leverage-without-steering: high coding-agent usage on weak ' +
        'fundamentals — you can generate fast but can\u2019t audit the ' +
        'trade-offs being made for you.',
    );
  }
  if (
    byId['build-deploy-ai'].coverage >= DEPTH_THRESHOLD &&
    byId['shaping-the-build'].coverage < BREADTH_THRESHOLD
  ) {
    out.push(
      'builder-without-compass: strong AI construction skills with thin ' +
        'product/business judgment — fast at building, unsteered on what ' +
        'to build.',
    );
  }
  return out;
}

export function report(assessment, skills = SKILLS) {
  const scores = profileScores(assessment, skills);
  return {
    name: assessment.name || 'anonymous',
    scores,
    gaps: gaps(scores),
    t: tProfile(scores),
    flags: flags(scores),
  };
}
