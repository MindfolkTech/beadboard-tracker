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
export function KanbanBoard({
  issues,
  onSelectIssue,
  selectedIssueId
}: KanbanBoardProps) {
  const blockedIssues = getBlockedIssues(issues);
  const readyIssues = getReadyIssuesLocal(issues);
  const inProgressIssues = issues.filter(i => i.status === 'in_progress');
  const doneIssues = issues.filter(i => i.status === 'done');
  const columns = [{
    title: 'Blocked',
    icon: <AlertCircle className="h-4 w-4" />,
    issues: blockedIssues,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-warning',
    showBlockerInfo: true
  }, {
    title: 'Ready',
    icon: <CheckCircle className="h-4 w-4" />,
    issues: readyIssues,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-success',
    showBlockerInfo: false
  }, {
    title: 'In Progress',
    icon: <Clock className="h-4 w-4" />,
    issues: inProgressIssues,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/5',
    showBlockerInfo: false
  }, {
    title: 'Done',
    icon: <CheckSquare className="h-4 w-4" />,
    issues: doneIssues,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-500/5',
    showBlockerInfo: false
  }];
  const activeColumns = columns.slice(0, 3); // Blocked, Ready, In Progress
  const doneColumn = columns[3]; // Done

  return <div className="flex flex-col gap-4 h-full p-6">
      {/* Top 3 Columns */}
      <div className="flex gap-4 flex-1 min-h-0">
        {activeColumns.map(column => <div key={column.title} className="flex-1 min-w-[280px] flex flex-col">
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
            <div className="flex-1 space-y-3 p-2 bg-[hsl(var(--surface))] rounded-b-lg overflow-y-auto">
              {column.issues.length === 0 ? <div className="flex items-center justify-center h-32 text-text-muted text-sm">
                  No issues
                </div> : column.issues.map(issue => <KanbanCard key={issue.id} issue={issue} allIssues={issues} isSelected={selectedIssueId === issue.id} onClick={() => onSelectIssue(issue)} showBlockerInfo={column.showBlockerInfo} bgColor={column.bgColor} />)}
            </div>
          </div>)}
      </div>

      {/* Done Section - Horizontal */}
      <div className="flex flex-col">
        {/* Header */}
        <div className={cn('flex items-center justify-between p-3 rounded-t-lg', doneColumn.bgColor)}>
          <div className="flex items-center gap-2">
            <span className={doneColumn.color}>{doneColumn.icon}</span>
            <h3 className="font-semibold text-sm text-text-primary">{doneColumn.title}</h3>
          </div>
          <span className="text-xs text-text-muted font-medium">
            {doneColumn.issues.length}
          </span>
        </div>

        {/* Horizontal Scrollable Content */}
        <div className={cn('flex gap-3 p-3 rounded-b-lg overflow-x-auto', doneColumn.bgColor)}>
          {doneColumn.issues.length === 0 ? <div className="flex items-center justify-center w-full h-32 text-text-muted text-sm">
              No completed issues
            </div> : doneColumn.issues.map(issue => <div key={issue.id} className="w-[280px] shrink-0">
                <KanbanCard issue={issue} allIssues={issues} isSelected={selectedIssueId === issue.id} onClick={() => onSelectIssue(issue)} showBlockerInfo={false} bgColor={doneColumn.bgColor} />
              </div>)}
        </div>
      </div>
    </div>;
}