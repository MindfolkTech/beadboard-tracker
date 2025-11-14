// ARCHIVED: Original LocalStorage implementation
// This file is kept for reference only
// The project now uses the bd CLI via API bridge

import type { Issue } from '@/types/Beads.types';

const STORAGE_KEY = 'beads_issues';

export const storage = {
  getIssues: (): Issue[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveIssues: (issues: Issue[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    } catch (error) {
      console.error('Failed to save issues:', error);
    }
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
