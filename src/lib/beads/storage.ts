// Beads Storage - API-based connection to bd CLI
import { Issue } from './types';
import { apiClient } from './api-client';

export const storage = {
  getIssues: async (): Promise<Issue[]> => {
    try {
      return await apiClient.listIssues();
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      return [];
    }
  },

  saveIssues: async (issues: Issue[]): Promise<void> => {
    // Not used with API - individual operations handled by API client
    console.warn('saveIssues called but not implemented for API storage');
  },

  clear: async (): Promise<void> => {
    // Not applicable for bd CLI storage
    console.warn('clear called but not implemented for API storage');
  },
};
