import { Issue } from './types';

// Sample issues for demo/onboarding
export const sampleIssues: Issue[] = [
  {
    id: 'bd-a1b2',
    title: 'Set up authentication system',
    description: 'Implement user authentication with JWT tokens and secure password hashing.',
    status: 'in_progress',
    type: 'feature',
    priority: 0,
    assignee: 'agent',
    dependencies: [],
    tags: ['backend', 'security'],
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: 'bd-c3d4',
    title: 'Fix memory leak in data processing',
    description: 'Users reporting slow performance after extended use. Profiler shows growing memory consumption in the data processing module.',
    status: 'open',
    type: 'bug',
    priority: 1,
    dependencies: [],
    tags: ['performance', 'critical'],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'bd-e5f6',
    title: 'Add dark mode support',
    description: 'Implement system-aware dark mode with manual toggle option.',
    status: 'open',
    type: 'feature',
    priority: 2,
    dependencies: [],
    tags: ['ui', 'enhancement'],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'bd-g7h8',
    title: 'Update dependencies to latest versions',
    description: 'Review and update all npm packages to their latest stable versions. Check for breaking changes.',
    status: 'open',
    type: 'task',
    priority: 3,
    dependencies: [],
    tags: ['maintenance'],
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 43200000,
  },
  {
    id: 'bd-i9j0',
    title: 'Design new landing page',
    description: 'Create mockups for updated landing page with improved conversion flow.',
    status: 'done',
    type: 'task',
    priority: 2,
    assignee: 'designer',
    dependencies: [],
    tags: ['design', 'marketing'],
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 5,
    closedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'bd-k1l2',
    title: 'Implement real-time collaboration',
    description: 'Add WebSocket support for real-time multi-user collaboration on documents.',
    status: 'open',
    type: 'epic',
    priority: 1,
    dependencies: [
      { type: 'blocks', targetId: 'bd-a1b2' },
    ],
    tags: ['backend', 'realtime'],
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
];

// Initialize storage with sample data if empty
export function initializeSampleData() {
  const existing = localStorage.getItem('beads_issues');
  if (!existing) {
    localStorage.setItem('beads_issues', JSON.stringify(sampleIssues));
    return true;
  }
  return false;
}
