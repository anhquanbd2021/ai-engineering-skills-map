// Embedded copies of examples/*.json — a test asserts these stay in sync
// with the files on disk so the browser lab and the repo fixtures never drift.

export const EXAMPLES = {
  'fullstack-balanced': {
    name: 'Full-stack, balanced T',
    note: 'Practicing across all four skills, deepest in fundamentals.',
    ratings: {
      'build-deploy-ai': [2, 2, 2, 1, 2, 2],
      'engineering-fundamentals': [2, 3, 2, 2, 2],
      'coding-agents': [3, 2, 2, 2, 2, 1, 2],
      'shaping-the-build': [2, 2, 1, 2, 1],
    },
  },
  'devops-infra': {
    name: 'DevOps / platform engineer',
    note: 'Deep fundamentals and solid agent use; thin on AI-app construction and spec-shaping.',
    ratings: {
      'build-deploy-ai': [1, 1, 1, 2, 1, 1],
      'engineering-fundamentals': [3, 3, 2, 3, 2],
      'coding-agents': [2, 2, 2, 1, 1, 1, 2],
      'shaping-the-build': [1, 1, 1, 1, 1],
    },
  },
  'vibe-coder': {
    name: 'Vibe coder',
    note: 'Heavy agent usage, weak fundamentals — the profile the study warns about.',
    ratings: {
      'build-deploy-ai': [1, 0, 1, 0, 0, 0],
      'engineering-fundamentals': [1, 0, 0, 1, 0],
      'coding-agents': [3, 3, 2, 3, 1, 2, 2],
      'shaping-the-build': [0, 0, 1, 1, 0],
    },
  },
  'new-grad': {
    name: 'New graduate',
    note: 'Fundamentals started, everything else early — the meter shows where to aim first.',
    ratings: {
      'build-deploy-ai': [1, 0, 0, 1, 0, 0],
      'engineering-fundamentals': [2, 1, 1, 2, 1],
      'coding-agents': [1, 1, 0, 0, 1, 0, 0],
      'shaping-the-build': [1, 0, 0, 0, 1],
    },
  },
};
