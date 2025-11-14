// Beads API Client - Connects to bridge server
import { Issue, CreateIssueInput, UpdateIssueInput, Dependency } from './types';

const API_URL = import.meta.env.VITE_BEADS_API_URL || 'http://localhost:3001/api';

class BeadsApiClient {
  async listIssues(filters?: {
    status?: string;
    priority?: number;
    assignee?: string;
  }): Promise<Issue[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority !== undefined) params.append('priority', filters.priority.toString());
    if (filters?.assignee) params.append('assignee', filters.assignee);

    const url = `${API_URL}/issues${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch issues: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getIssue(id: string): Promise<Issue> {
    const response = await fetch(`${API_URL}/issues/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch issue: ${response.statusText}`);
    }
    
    return response.json();
  }

  async createIssue(input: CreateIssueInput): Promise<Issue> {
    const response = await fetch(`${API_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create issue: ${response.statusText}`);
    }
    
    return response.json();
  }

  async updateIssue(id: string, updates: UpdateIssueInput): Promise<Issue> {
    const response = await fetch(`${API_URL}/issues/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update issue: ${response.statusText}`);
    }
    
    return response.json();
  }

  async deleteIssue(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/issues/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete issue: ${response.statusText}`);
    }
  }

  async addDependency(issueId: string, dependency: Dependency): Promise<void> {
    const response = await fetch(`${API_URL}/issues/${issueId}/dependencies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dependency),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add dependency: ${response.statusText}`);
    }
  }

  async removeDependency(issueId: string, targetId: string): Promise<void> {
    const response = await fetch(`${API_URL}/issues/${issueId}/dependencies/${targetId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to remove dependency: ${response.statusText}`);
    }
  }

  async getReadyIssues(): Promise<Issue[]> {
    const response = await fetch(`${API_URL}/ready`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ready issues: ${response.statusText}`);
    }
    
    return response.json();
  }

  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_URL.replace('/api', '')}/health`);
      return response.json();
    } catch (error) {
      throw new Error('Cannot connect to beads bridge server. Make sure it\'s running.');
    }
  }
}

export const apiClient = new BeadsApiClient();
