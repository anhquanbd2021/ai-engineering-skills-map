// The four skill clusters from "The AI Engineering Skills Map" (Part 1),
// Andrew Ng & DeepLearning.AI, The Batch — Aug 14, 2026.
// https://www.deeplearning.ai/the-batch/the-ai-engineering-skills-map
//
// HONESTY NOTE: the letter names the four clusters and the sub-skills inside
// each, but does NOT publish per-skill posting percentages. `emphasis` is
// therefore derived mechanically from how many sub-skills the letter names
// per cluster (see emphasisFor in meter.mjs) and must be presented as an
// editorial estimate, never as live labor-market data.

export const STUDY = {
  title: 'The AI Engineering Skills Map (Part 1)',
  authors: 'Andrew Ng & the DeepLearning.AI team',
  venue: 'The Batch',
  published: '2026-08-14',
  url: 'https://www.deeplearning.ai/the-batch/the-ai-engineering-skills-map',
  sample: '10,000+ job postings, dozens of structured interviews with hiring ' +
    'managers, recruiters and AI experts, plus surveys',
};

export const SKILLS = [
  {
    id: 'build-deploy-ai',
    name: 'Building & deploying AI applications',
    short: 'Build AI apps',
    order: 1,
    summary:
      'AI applications produce unpredictable outputs. The skill is the ' +
      'building blocks plus the statistical techniques to measure, steer, ' +
      'and govern them so behavior stays predictable enough to ship.',
    signals: [
      'LLM fundamentals and context engineering',
      'Retrieval-augmented generation (RAG)',
      'Agentic workflows',
      'Machine-learning / deep-learning fundamentals',
      'Disciplined evals and error-analysis loops',
      'Measuring, steering and governing unpredictable outputs',
    ],
    emphasisNote:
      'Named first in the letter and given the richest sub-skill list; ' +
      'the study calls evals/error-analysis loops the core differentiator.',
  },
  {
    id: 'engineering-fundamentals',
    name: 'Software engineering fundamentals',
    short: 'Fundamentals',
    order: 2,
    summary:
      'Engineering software is making trade-offs — cost, scalability, ' +
      'reliability, speed, security and privacy. Fundamentals are what let ' +
      'you recognize and steer the trade-offs a coding agent makes for you.',
    signals: [
      'Recognizing trade-offs: cost, scale, reliability, speed, security',
      'Choosing software stacks and system architecture',
      'Data-store design',
      'Testing and verification discipline',
      'Steering agents with the precise language of engineering',
    ],
    emphasisNote:
      'Not an AI skill at all — yet ranked among the four. The letter ' +
      'frames it as the layer that makes every other skill steerable.',
  },
  {
    id: 'coding-agents',
    name: 'Using coding agents',
    short: 'Coding agents',
    order: 3,
    summary:
      'A working mental model of what agents can and cannot do, and ' +
      'calibrated judgment about when to intervene and when to leave them ' +
      'alone — without wasting time or tokens.',
    signals: [
      'Mental model of agent capabilities and limits',
      'Managing the agent\u2019s context',
      'Balancing planning vs. execution',
      'Giving agents verifiers/evals so they close their own loops',
      'Working from a spec (and knowing when not to bother)',
      'Orchestrating multiple agents',
      'Keeping routines current as tools evolve',
    ],
    emphasisNote:
      'The letter calls agentic coding "a key skill for every developer"; ' +
      'its sub-skill list is the longest of the four and still evolving.',
  },
  {
    id: 'shaping-the-build',
    name: 'Shaping the build',
    short: 'Shape the build',
    order: 4,
    summary:
      'Agents deliver to a clear spec increasingly well, so engineering ' +
      'work shifts upstream into deciding what belongs in the spec: ' +
      'product sense, business context, and customer goals.',
    signals: [
      'Product sense and business context',
      'Understanding customer goals',
      'Deciding what belongs in the spec',
      'MVP-fast vs. build-carefully judgment',
      'Ownership: identifying problems worth solving',
    ],
    emphasisNote:
      'Described as where engineering work is shifting; hiring interviews ' +
      'weighted it heavily in the study\u2019s structured interviews.',
  },
];

export const LEVELS = [
  { score: 0, label: 'Not aware', hint: 'Haven\u2019t used or studied this yet' },
  { score: 1, label: 'Aware', hint: 'Could explain it; haven\u2019t practiced it' },
  { score: 2, label: 'Practicing', hint: 'Used it on real work in the last quarter' },
  { score: 3, label: 'Fluent', hint: 'Could teach it; it shapes how I work' },
];

export function skillById(id) {
  const skill = SKILLS.find((s) => s.id === id);
  if (!skill) throw new Error(`unknown skill id: ${id}`);
  return skill;
}
