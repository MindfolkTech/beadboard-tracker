import { Issue } from '@/lib/beads/types';
import { KanbanCard } from './KanbanCard';
import { getBlockedIssues, getReadyIssuesLocal } from '@/lib/beads/utils';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Clock, CheckSquare } from 'lucide-react';

interface KanbanBoardProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  selectedIssueId?: string;
}

export function KanbanBoard({ issues, onSelectIssue, selectedIssueId }: KanbanBoardProps) {
  const blockedIssues = getBlockedIssues(issues);
  const readyIssues = getReadyIssuesLocal(issues);
  const inProgressIssues = issues.filter(i => i.status === 'in_progress');
  const doneIssues = issues.filter(i => i.status === 'done');

  const columns = [
    {
      title: 'Blocked',
      icon: <AlertCircle className="h-4 w-4" />,
      issues: blockedIssues,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/5',
      showBlockerInfo: true,
    },
    {
      title: 'Ready',
      icon: <CheckCircle className="h-4 w-4" />,
      issues: readyIssues,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/5',
      showBlockerInfo: false,
    },
    {
      title: 'In Progress',
      icon: <Clock className="h-4 w-4" />,
      issues: inProgressIssues,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/5',
      showBlockerInfo: false,
    },
    {
      title: 'Done',
      icon: <CheckSquare className="h-4 w-4" />,
      issues: doneIssues,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-500/5',
      showBlockerInfo: false,
    },
  ];

  return (
    <div className="flex gap-4 h-full overflow-x-auto p-6">
      {columns.map(column => (
        <div key={column.title} className="flex-1 min-w-[280px] flex flex-col">
          {/* Column Header */}
          <div className={cn('flex items-center justify-between p-3 rounded-t-lg', column.bgColor)}>
            <div className="flex items-center gap-2">
              <span className={column.color}>{column.icon}</span>
              <h3 className="font-semibold text-sm text-text-primary">{column.title}</h3>
            </div>
            <span className="text-xs text-text-muted font-medium">
              {column.issues.length}
            </span>
          </div>

          {/* Column Content */}
          <div className="flex-1 space-y-3 p-2 bg-[hsl(var(--surface-accent))] rounded-b-lg overflow-y-auto">
            {column.issues.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-text-muted text-sm">
                No issues
              </div>
            ) : (
              column.issues.map(issue => (
                <KanbanCard
                  key={issue.id}
                  issue={issue}
                  allIssues={issues}
                  isSelected={selectedIssueId === issue.id}
                  onClick={() => onSelectIssue(issue)}
                  showBlockerInfo={column.showBlockerInfo}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
