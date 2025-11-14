// Beads State Management Hook
import { useState, useEffect, useCallback } from 'react';
import { Issue, CreateIssueInput, UpdateIssueInput, IssueStatus, Dependency } from '@/lib/beads/types';
import { storage } from '@/lib/beads/storage';
import { generateIssueId, isIssueReady, sortIssues } from '@/lib/beads/utils';
import { initializeSampleData } from '@/lib/beads/sample-data';
import { toast } from 'sonner';

export function useBeads() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  // Load issues from storage
  useEffect(() => {
    // Initialize with sample data if first time
    const isFirstTime = initializeSampleData();
    if (isFirstTime) {
      toast.success('Welcome to Beads! Sample issues loaded.');
    }
    
    const loadedIssues = storage.getIssues();
    setIssues(loadedIssues);
    setLoading(false);
  }, []);

  // Save issues to storage whenever they change
  const saveIssues = useCallback((newIssues: Issue[]) => {
    setIssues(newIssues);
    storage.saveIssues(newIssues);
  }, []);

  // Create a new issue
  const createIssue = useCallback((input: CreateIssueInput): Issue => {
    const now = Date.now();
    const newIssue: Issue = {
      id: generateIssueId(),
      title: input.title,
      description: input.description,
      status: 'open',
      type: input.type || 'task',
      priority: input.priority ?? 2,
      assignee: input.assignee,
      dependencies: [],
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    saveIssues([...issues, newIssue]);
    toast.success(`Created ${newIssue.id}`);
    return newIssue;
  }, [issues, saveIssues]);

  // Update an existing issue
  const updateIssue = useCallback((id: string, updates: UpdateIssueInput) => {
    const updatedIssues = issues.map(issue => {
      if (issue.id === id) {
        return {
          ...issue,
          ...updates,
          updatedAt: Date.now(),
        };
      }
      return issue;
    });

    saveIssues(updatedIssues);
    toast.success(`Updated ${id}`);
  }, [issues, saveIssues]);

  // Close an issue
  const closeIssue = useCallback((id: string) => {
    const updatedIssues = issues.map(issue => {
      if (issue.id === id) {
        return {
          ...issue,
          status: 'done' as IssueStatus,
          closedAt: Date.now(),
          updatedAt: Date.now(),
        };
      }
      return issue;
    });

    saveIssues(updatedIssues);
    toast.success(`Closed ${id}`);
  }, [issues, saveIssues]);

  // Delete an issue
  const deleteIssue = useCallback((id: string) => {
    const updatedIssues = issues.filter(issue => issue.id !== id);
    saveIssues(updatedIssues);
    toast.success(`Deleted ${id}`);
  }, [issues, saveIssues]);

  // Add a dependency
  const addDependency = useCallback((issueId: string, dependency: Dependency) => {
    const updatedIssues = issues.map(issue => {
      if (issue.id === issueId) {
        // Check if dependency already exists
        const exists = issue.dependencies.some(
          dep => dep.type === dependency.type && dep.targetId === dependency.targetId
        );
        if (exists) return issue;

        return {
          ...issue,
          dependencies: [...issue.dependencies, dependency],
          updatedAt: Date.now(),
        };
      }
      return issue;
    });

    saveIssues(updatedIssues);
    toast.success('Dependency added');
  }, [issues, saveIssues]);

  // Remove a dependency
  const removeDependency = useCallback((issueId: string, dependency: Dependency) => {
    const updatedIssues = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          dependencies: issue.dependencies.filter(
            dep => !(dep.type === dependency.type && dep.targetId === dependency.targetId)
          ),
          updatedAt: Date.now(),
        };
      }
      return issue;
    });

    saveIssues(updatedIssues);
    toast.success('Dependency removed');
  }, [issues, saveIssues]);

  // Get ready issues (no open blockers)
  const getReadyIssues = useCallback((): Issue[] => {
    return sortIssues(issues.filter(issue => isIssueReady(issue, issues)));
  }, [issues]);

  // Get issues by status
  const getIssuesByStatus = useCallback((status: IssueStatus): Issue[] => {
    return sortIssues(issues.filter(issue => issue.status === status));
  }, [issues]);

  return {
    issues,
    loading,
    createIssue,
    updateIssue,
    closeIssue,
    deleteIssue,
    addDependency,
    removeDependency,
    getReadyIssues,
    getIssuesByStatus,
  };
}
