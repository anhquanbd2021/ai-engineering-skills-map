import { SKILLS, LEVELS, STUDY } from './skills.mjs';
import { report, emphasisFor } from './meter.mjs';
import { EXAMPLES } from './examples.mjs';

const skillsEl = document.getElementById('skills');
const verdictEl = document.getElementById('verdict');
const buttonsEl = document.getElementById('exampleButtons');

// current ratings: { skillId: number[] }
const ratings = {};
for (const s of SKILLS) ratings[s.id] = s.signals.map(() => 0);

function buildExampleButtons() {
  for (const [key, ex] of Object.entries(EXAMPLES)) {
    const btn = document.createElement('button');
    btn.textContent = ex.name;
    btn.title = ex.note;
    btn.addEventListener('click', () => loadExample(key));
    buttonsEl.appendChild(btn);
  }
}

function loadExample(key) {
  const ex = EXAMPLES[key];
  for (const s of SKILLS) ratings[s.id] = [...ex.ratings[s.id]];
  render();
}

function render() {
  skillsEl.innerHTML = '';
  for (const [i, skill] of SKILLS.entries()) {
    const card = document.createElement('article');
    card.className = 'skill';
    card.innerHTML = `
      <h2><span class="num pal${i}">${skill.order}</span> ${skill.name}</h2>
      <p class="summary">${skill.summary}</p>
      <p class="basis"><strong>Study emphasis:</strong> ${emphasisFor(skill)}%
        <span class="dim">(${skill.signals.length} named sub-skills — editorial estimate)</span></p>
      <div class="bars">
        <div class="bar-row"><span class="bar-label">study emphasis</span>
          <div class="bar"><div class="fill emphasis" data-emphasis="${skill.id}"></div></div>
        </div>
        <div class="bar-row"><span class="bar-label">your coverage</span>
          <div class="bar"><div class="fill coverage pal${i}" data-skill="${skill.id}"></div></div>
        </div>
      </div>
      <ul class="signals"></ul>`;
    const list = card.querySelector('.signals');
    skill.signals.forEach((sig, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="sig-name">${sig}</span>
        <span class="sig-controls"></span>
        <span class="sig-level"></span>`;
      const controls = li.querySelector('.sig-controls');
      for (const level of LEVELS) {
        const b = document.createElement('button');
        b.className = 'lvl';
        b.textContent = level.score;
        b.title = `${level.label} — ${level.hint}`;
        b.addEventListener('click', () => {
          ratings[skill.id][idx] = level.score;
          render();
        });
        controls.appendChild(b);
      }
      list.appendChild(li);
    });
    skillsEl.appendChild(card);
  }
  paint();
}

function paint() {
  // CSP strips inline style attributes; widths go in via the .style API.
  for (const skill of SKILLS) {
    const em = document.querySelector(`.fill.emphasis[data-emphasis="${skill.id}"]`);
    if (em) em.style.width = `${emphasisFor(skill)}%`;
  }
  const assessment = { name: 'you', ratings };
  const r = report(assessment);
  for (const s of r.scores) {
    const fill = document.querySelector(`.fill.coverage[data-skill="${s.id}"]`);
    if (fill) fill.style.width = `${s.coverage}%`;
    const card = fill.closest('.skill');
    card.querySelectorAll('.signals li').forEach((li, idx) => {
      const skill = SKILLS.find((k) => k.id === s.id);
      const val = ratings[skill.id][idx];
      li.querySelectorAll('.lvl').forEach((b) => {
        b.classList.toggle('on', Number(b.textContent) === val);
      });
      li.querySelector('.sig-level').textContent = LEVELS[val].label;
    });
  }
  const flagList = r.flags.length
    ? `<ul class="flags">${r.flags.map((f) => `<li>⚠ ${f}</li>`).join('')}</ul>`
    : '';
  const gapText = r.gaps
    .map((g) => `${g.short}: ${g.gap > 0 ? '+' : ''}${g.gap}`)
    .join(' · ');
  verdictEl.innerHTML = `
    <h2>Your read-out</h2>
    <p><strong>Profile:</strong> ${r.t.verdict}
      (breadth on ${r.t.broadCount}/4 axes, deepest:
      ${SKILLS.find((s) => s.id === r.t.deepest).short} at ${r.t.deepestCoverage}%)</p>
    <p><strong>Gaps vs. study emphasis:</strong> ${gapText}</p>
    ${flagList}
    <p class="dim">Data source: ${STUDY.title} — ${STUDY.authors}, ${STUDY.venue}
      (${STUDY.published}). ${STUDY.sample}.</p>`;
}

buildExampleButtons();
render();
