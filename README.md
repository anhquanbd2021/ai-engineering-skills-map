# Skills Demand Meter

A zero-dependency Node 20+ lab that profiles you against the **four AI
engineering skill clusters** from *The AI Engineering Skills Map (Part 1)* —
Andrew Ng & the DeepLearning.AI team, *The Batch* (Aug 14, 2026), built on an
analysis of **10,000+ job postings** plus structured interviews with hiring
managers, recruiters, and AI experts.

Companion demo for the LinkedIn article in this repo's parent folder.

## What it proves

- The study's four clusters are a **profile shape**, not a single "AI skill":
  one axis is AI-app construction, one is classic engineering fundamentals,
  one is coding-agent operation, one is spec/product judgment.
- A self-assessment across the study's *named sub-skills* produces a coverage
  score per axis; compared with a study-emphasis score it surfaces a **gap**
  per axis — a prioritized learning order.
- Two named anti-patterns fall out mechanically:
  **leverage-without-steering** (fluent agent use on weak fundamentals) and
  **builder-without-compass** (strong AI-app construction, thin spec/product
  judgment) — the exact failure modes the letter describes.
- A **T-shaped** verdict needs both breadth (≥50% coverage on 3+ axes) and
  depth (≥66% on one).

## Run it

```bash
npm start            # serves the lab on PORT (default 3000)
npm run report       # CLI: emphasis table + all example profiles
npm test             # node --test "test/*.test.mjs"
npm run check        # tests + report (render.yaml buildCommand)
```

Open `http://localhost:3000/` — rate yourself 0–3 on each named sub-skill,
watch the dual bars (hatched = study emphasis, solid = your coverage), read
the verdict. "Load an example" fills in a reference profile (balanced
full-stack, DevOps, vibe coder, new grad). `/guide.html` maps every widget to
the article.

## Layout

- `app/server.js` — hardened allowlist static server (`/health`, `/version`,
  security headers)
- `public/skills.mjs` — the four-cluster dataset: sub-skills named in the
  letter, order, emphasis notes
- `public/meter.mjs` — pure scoring: coverage, emphasis, gaps, T-profile,
  anti-pattern flags
- `public/examples.mjs` — embedded copies of `examples/*.json` (sync is
  asserted by test)
- `public/index.html` / `app.js` / `styles.css` / `guide.html` — the lab UI
- `scripts/report.mjs` — CLI report (`npm run report`)
- `examples/` — four reference assessments
- `test/` — `node --test "test/*.test.mjs"`
- `render.yaml` — free-tier Render deploy (`npm run check` + `/health`)

## Honest limits

- **The emphasis bars are editorial estimates.** The published letter names
  the four clusters and their sub-skills but does **not** publish per-skill
  posting frequencies. Emphasis is derived mechanically from how many
  sub-skills the letter names per cluster — prominence inside the study, not
  live labor-market data.
- **Self-ratings are reflective, not a measurement.** A 0–3 answer tells you
  where to look next; it doesn't grade your ability.
- **The map is Part 1 and evolving.** Ng states it will be updated; the
  dataset here snapshots the August 2026 letter.
- Ratings live in browser memory only — nothing is sent anywhere.
