// CLI side-by-side report: study emphasis per skill + verdicts for every
// example profile. Run: npm run report
import { SKILLS, STUDY } from '../public/skills.mjs';
import { report, emphasisFor } from '../public/meter.mjs';
import { EXAMPLES } from '../public/examples.mjs';

const pad = (s, n) => String(s).padEnd(n);
const bar = (pct, width = 24) =>
  '█'.repeat(Math.round((pct / 100) * width)).padEnd(width, '░');

console.log('SKILLS DEMAND METER — CLI report');
console.log(`Source: ${STUDY.title} — ${STUDY.authors}, ${STUDY.venue} (${STUDY.published})`);
console.log(`Method: ${STUDY.sample}\n`);
console.log('Study emphasis (editorial estimate = share of named sub-skills):\n');
for (const s of SKILLS) {
  const e = emphasisFor(s);
  console.log(`  ${pad(s.short, 16)} ${bar(e)} ${e}%  (${s.signals.length} sub-skills)`);
}
console.log('');

for (const [key, ex] of Object.entries(EXAMPLES)) {
  const r = report(ex);
  console.log(`— ${ex.name} (${key})`);
  for (const s of r.scores) {
    const gap = s.gap > 0 ? `+${s.gap}` : `${s.gap}`;
    console.log(`    ${pad(s.short, 16)} cover ${bar(s.coverage, 16)} ${pad(`${s.coverage}%`, 4)} gap ${gap}`);
  }
  console.log(`    verdict: ${r.t.verdict} (breadth ${r.t.broadCount}/4, deepest ${r.t.deepest} @ ${r.t.deepestCoverage}%)`);
  for (const f of r.flags) console.log(`    ⚠ ${f}`);
  console.log('');
}
console.log('Honest limits: emphasis is derived from named sub-skill counts, not');
console.log('published posting frequencies; self-ratings are reflective.');
