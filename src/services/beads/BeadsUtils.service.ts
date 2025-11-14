// Beads Utilities
import type { Issue } from '@/types/Beads.types';

/**
 * Generate hash-based ID like bd-a1b2
 */
export function generateIssueId(): string {
  const hash = Math.random().toString(36).substring(2, 6);
  return `bd-${hash}`;
}

/**
 * Check if issue is ready (no open blockers)
 */
export function isIssueReady(issue: Issue, allIssues: Issue[]): boolean {
  if (issue.status !== 'open') return false;
  
  const blockers = issue.dependencies
    .filter(dep => dep.type === 'blocks')
    .map(dep => allIssues.find(i => i.id === dep.targetId))
    .filter((i): i is Issue => !!i && i.status !== 'closed');
  
  return blockers.length === 0;
}

/**
 * Get issues that block this issue
 */
export function getBlockers(issue: Issue, allIssues: Issue[]): Issue[] {
  return issue.dependencies
    .filter(dep => dep.type === 'blocks')
    .map(dep => allIssues.find(i => i.id === dep.targetId))
    .filter((i): i is Issue => !!i);
}

/**
 * Get issues blocked by this issue
 */
export function getBlocked(issueId: string, allIssues: Issue[]): Issue[] {
  return allIssues.filter(issue =>
    issue.dependencies.some(dep => dep.type === 'blocks' && dep.targetId === issueId)
  );
}

/**
 * Get child issues (subtasks)
 */
export function getChildren(issueId: string, allIssues: Issue[]): Issue[] {
  return allIssues.filter(issue =>
    issue.dependencies.some(dep => dep.type === 'parent' && dep.targetId === issueId)
  );
}

/**
 * Get parent issue
 */
export function getParent(issue: Issue, allIssues: Issue[]): Issue | undefined {
  const parentDep = issue.dependencies.find(dep => dep.type === 'parent');
  return parentDep ? allIssues.find(i => i.id === parentDep.targetId) : undefined;
}

/**
 * Get related issues
 */
export function getRelated(issue: Issue, allIssues: Issue[]): Issue[] {
  return issue.dependencies
    .filter(dep => dep.type === 'related')
    .map(dep => allIssues.find(i => i.id === dep.targetId))
    .filter((i): i is Issue => !!i);
}

/**
 * Sort issues by priority then updated date
 */
export function sortIssues(issues: Issue[]): Issue[] {
  return [...issues].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority; // 0 is highest
    }
    return b.updatedAt - a.updatedAt; // newest first
  });
}

/**
 * Get all epics (issues with type: 'epic')
 */
export function getEpics(allIssues: Issue[]): Issue[] {
  return allIssues.filter(issue => issue.type === 'epic');
}

/**
 * Get issues without a parent (not epics themselves)
 */
export function getIssuesWithoutParent(allIssues: Issue[]): Issue[] {
  return allIssues.filter(issue => 
    !issue.dependencies.some(dep => dep.type === 'parent') &&
    issue.type !== 'epic'
  );
}

/**
 * Get blocked issues (open with unfinished blockers)
 */
export function getBlockedIssues(allIssues: Issue[]): Issue[] {
  return allIssues.filter(issue => 
    issue.status === 'open' && !isIssueReady(issue, allIssues)
  );
}

/**
 * Get ready issues (open with no blockers)
 */
export function getReadyIssuesLocal(allIssues: Issue[]): Issue[] {
  return allIssues.filter(issue => isIssueReady(issue, allIssues));
}
