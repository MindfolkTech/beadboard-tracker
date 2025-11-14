import { useState } from 'react';
import type { Issue } from '@/types/Beads.types';
import { IssueRow } from './IssueRow';
import { getEpics, getChildren, getIssuesWithoutParent } from '@/services/beads/beadsUtils.service';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface EpicGroupedListProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  selectedIssueId?: string;
}

export function EpicGroupedList({ issues, onSelectIssue, selectedIssueId }: EpicGroupedListProps) {
  const epics = getEpics(issues);
  const unassignedIssues = getIssuesWithoutParent(issues);
  
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(
    new Set(epics.map(e => e.id))
  );

  const toggleEpic = (epicId: string) => {
    setExpandedEpics(prev => {
      const next = new Set(prev);
      if (next.has(epicId)) {
        next.delete(epicId);
      } else {
        next.add(epicId);
      }
      return next;
    });
  };

  const calculateProgress = (epicId: string) => {
    const children = getChildren(epicId, issues);
    if (children.length === 0) return { done: 0, total: 0, percentage: 0 };
    
    const done = children.filter(c => c.status === 'closed').length;
    const total = children.length;
    const percentage = (done / total) * 100;
    
    return { done, total, percentage };
  };

  if (epics.length === 0 && unassignedIssues.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        <p>No issues found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {/* Epics */}
      {epics.map(epic => {
        const children = getChildren(epic.id, issues);
        const isExpanded = expandedEpics.has(epic.id);
        const progress = calculateProgress(epic.id);

        return (
          <div key={epic.id} className="bg-[hsl(var(--surface))]">
            {/* Epic Header */}
            <button
              onClick={() => toggleEpic(epic.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-[hsl(var(--surface-accent))] transition-colors"
            >
              <div className="shrink-0">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                )}
              </div>
              
              <Folder className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-text-muted">{epic.id}</span>
                  <span className="font-medium text-text-primary truncate">{epic.title}</span>
                </div>
                
                {children.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Progress value={progress.percentage} className="h-1.5 w-32" />
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {progress.done}/{progress.total} done
                    </span>
                  </div>
                )}
              </div>
            </button>

            {/* Children */}
            {isExpanded && children.length > 0 && (
              <div className="pl-12 border-l-2 border-purple-500/20 ml-4">
                {children.map(child => (
                  <IssueRow
                    key={child.id}
                    issue={child}
                    isSelected={selectedIssueId === child.id}
                    onClick={() => onSelectIssue(child)}
                  />
                ))}
              </div>
            )}

            {isExpanded && children.length === 0 && (
              <div className="pl-12 ml-4 py-4 text-sm text-text-muted">
                No issues in this epic yet
              </div>
            )}
          </div>
        );
      })}

      {/* Unassigned Issues */}
      {unassignedIssues.length > 0 && (
        <div className="bg-[hsl(var(--surface))]">
          <div className="p-4 bg-[hsl(var(--surface-accent))]">
            <h3 className="font-medium text-sm text-text-secondary">
              📋 Unassigned Issues
            </h3>
          </div>
          <div>
            {unassignedIssues.map(issue => (
              <IssueRow
                key={issue.id}
                issue={issue}
                isSelected={selectedIssueId === issue.id}
                onClick={() => onSelectIssue(issue)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
