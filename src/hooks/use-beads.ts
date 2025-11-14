// Beads State Management Hook - API Edition
import { useState, useEffect, useCallback } from 'react';
import { Issue, CreateIssueInput, UpdateIssueInput, IssueStatus, Dependency } from '@/lib/beads/types';
import { apiClient } from '@/lib/beads/api-client';
import { isIssueReady, sortIssues } from '@/lib/beads/utils';
import { toast } from 'sonner';

export function useBeads() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  // Load issues from API
  useEffect(() => {
    let mounted = true;
    
    const loadIssues = async () => {
      try {
        await apiClient.checkHealth();
        const loadedIssues = await apiClient.listIssues();
        if (mounted) {
          setIssues(loadedIssues);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          toast.error('Cannot connect to beads server. Make sure bd CLI is installed and server is running.');
          setLoading(false);
        }
      }
    };
    
    loadIssues();
    return () => { mounted = false; };
  }, []);

  // Refresh issues from API
  const refreshIssues = useCallback(async () => {
    try {
      const loadedIssues = await apiClient.listIssues();
      setIssues(loadedIssues);
    } catch (error) {
      console.error('Failed to refresh issues:', error);
    }
  }, []);

  // Create a new issue
  const createIssue = useCallback(async (input: CreateIssueInput): Promise<Issue> => {
    try {
      const newIssue = await apiClient.createIssue(input);
      await refreshIssues();
      toast.success(`Created ${newIssue.id}`);
      return newIssue;
    } catch (error) {
      toast.error('Failed to create issue');
      throw error;
    }
  }, [refreshIssues]);

  // Update an existing issue
  const updateIssue = useCallback(async (id: string, updates: UpdateIssueInput) => {
    try {
      await apiClient.updateIssue(id, updates);
      await refreshIssues();
      toast.success(`Updated ${id}`);
    } catch (error) {
      toast.error('Failed to update issue');
      throw error;
    }
  }, [refreshIssues]);

  // Close an issue
  const closeIssue = useCallback(async (id: string) => {
    try {
      await apiClient.updateIssue(id, { status: 'done' });
      await refreshIssues();
      toast.success(`Closed ${id}`);
    } catch (error) {
      toast.error('Failed to close issue');
      throw error;
    }
  }, [refreshIssues]);

  // Delete an issue
  const deleteIssue = useCallback(async (id: string) => {
    try {
      await apiClient.deleteIssue(id);
      await refreshIssues();
      toast.success(`Deleted ${id}`);
    } catch (error) {
      toast.error('Failed to delete issue');
      throw error;
    }
  }, [refreshIssues]);

  // Add a dependency
  const addDependency = useCallback(async (issueId: string, dependency: Dependency) => {
    try {
      await apiClient.addDependency(issueId, dependency);
      await refreshIssues();
      toast.success('Dependency added');
    } catch (error) {
      toast.error('Failed to add dependency');
      throw error;
    }
  }, [refreshIssues]);

  // Remove a dependency
  const removeDependency = useCallback(async (issueId: string, targetId: string) => {
    try {
      await apiClient.removeDependency(issueId, targetId);
      await refreshIssues();
      toast.success('Dependency removed');
    } catch (error) {
      toast.error('Failed to remove dependency');
      throw error;
    }
  }, [refreshIssues]);

  // Get ready issues (no open blockers)
  const getReadyIssues = useCallback(async (): Promise<Issue[]> => {
    try {
      return await apiClient.getReadyIssues();
    } catch {
      return sortIssues(issues.filter(issue => isIssueReady(issue, issues)));
    }
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
