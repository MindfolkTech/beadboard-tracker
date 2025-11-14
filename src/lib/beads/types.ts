// Beads Issue Tracking System - Core Types
// Based on steveyegge/beads specification

export type IssueStatus = 'open' | 'in_progress' | 'blocked' | 'closed';
export type IssueType = 'bug' | 'feature' | 'task' | 'epic';
export type Priority = 0 | 1 | 2 | 3 | 4; // 0 is highest, matches bd CLI (P0-P4)
export type DependencyType = 'blocks' | 'related' | 'parent' | 'child' | 'discovered-from';

export interface Dependency {
  type: DependencyType;
  targetId: string;
}

export interface Issue {
  id: string; // Hash-based ID like bd-a1b2
  title: string;
  description?: string;
  status: IssueStatus;
  type: IssueType;
  priority: Priority;
  assignee?: string;
  dependencies: Dependency[];
  createdAt: number;
  updatedAt: number;
  closedAt?: number;
  labels?: string[];
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  type?: IssueType;
  priority?: Priority;
  assignee?: string;
  labels?: string[];
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  status?: IssueStatus;
  type?: IssueType;
  priority?: Priority;
  assignee?: string;
  labels?: string[];
}

export interface BeadsState {
  issues: Issue[];
  filters: {
    status?: IssueStatus[];
    type?: IssueType[];
    priority?: Priority[];
    assignee?: string;
    search?: string;
  };
}
