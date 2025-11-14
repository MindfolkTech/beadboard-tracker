import { useState, useEffect, useCallback } from 'react';
import type { Issue, CreateIssueInput, UpdateIssueInput, IssueStatus, Dependency } from '@/types/Beads.types';
import { beadsApiService } from '@/services/beads/BeadsApi.service';
import { isIssueReady, sortIssues } from '@/services/beads/BeadsUtils.service';
import { toast } from 'sonner';

interface UseBeadsReturn {
  issues: Issue[];
  loading: boolean;
  createIssue: (input: CreateIssueInput) => Promise<Issue>;
  updateIssue: (id: string, updates: UpdateIssueInput) => Promise<void>;
  closeIssue: (id: string) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  addDependency: (issueId: string, dependency: Dependency) => Promise<void>;
  removeDependency: (issueId: string, targetId: string) => Promise<void>;
  getReadyIssues: () => Promise<Issue[]>;
  getIssuesByStatus: (status: IssueStatus) => Issue[];
}

/**
 * Main hook for managing Beads issues via API
 * @returns Object with issues state, loading state, and all CRUD operations
 */
export function useBeads(): UseBeadsReturn {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial issues from API
  useEffect(() => {
    let mounted = true;
    
    const loadIssues = async () => {
      try {
        await beadsApiService.checkHealth();
        const loadedIssues = await beadsApiService.listIssues();
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
      const loadedIssues = await beadsApiService.listIssues();
      setIssues(loadedIssues);
    } catch (error) {
      console.error('Failed to refresh issues:', error);
    }
  }, []);

  // Generic operation executor with error handling
  const executeOperation = useCallback(async <T,>(
    operation: () => Promise<T>,
    successMessage: string,
    errorMessage: string
  ): Promise<T> => {
    try {
      const result = await operation();
      await refreshIssues();
      toast.success(successMessage);
      return result;
    } catch (error) {
      toast.error(errorMessage);
      throw error;
    }
  }, [refreshIssues]);

  const createIssue = useCallback(async (input: CreateIssueInput): Promise<Issue> => {
    return await executeOperation(
      () => beadsApiService.createIssue(input),
      `Created issue`,
      'Failed to create issue'
    );
  }, [executeOperation]);

  const updateIssue = useCallback(async (id: string, updates: UpdateIssueInput): Promise<void> => {
    await executeOperation(
      () => beadsApiService.updateIssue(id, updates),
      `Updated ${id}`,
      'Failed to update issue'
    );
  }, [executeOperation]);

  const closeIssue = useCallback(async (id: string): Promise<void> => {
    await executeOperation(
      () => beadsApiService.updateIssue(id, { status: 'closed' }),
      `Closed ${id}`,
      'Failed to close issue'
    );
  }, [executeOperation]);

  const deleteIssue = useCallback(async (id: string): Promise<void> => {
    await executeOperation(
      () => beadsApiService.deleteIssue(id),
      `Deleted ${id}`,
      'Failed to delete issue'
    );
  }, [executeOperation]);

  const addDependency = useCallback(async (issueId: string, dependency: Dependency): Promise<void> => {
    await executeOperation(
      () => beadsApiService.addDependency(issueId, dependency),
      'Dependency added',
      'Failed to add dependency'
    );
  }, [executeOperation]);

  const removeDependency = useCallback(async (issueId: string, targetId: string): Promise<void> => {
    await executeOperation(
      () => beadsApiService.removeDependency(issueId, targetId),
      'Dependency removed',
      'Failed to remove dependency'
    );
  }, [executeOperation]);

  const getReadyIssues = useCallback(async (): Promise<Issue[]> => {
    try {
      return await beadsApiService.getReadyIssues();
    } catch {
      return sortIssues(issues.filter(issue => isIssueReady(issue, issues)));
    }
  }, [issues]);

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
