import type { Issue } from '@/types/Beads.types';
import { cn } from '@/lib/utils';
import { Circle, CheckCircle2, Clock } from 'lucide-react';

interface IssueRowProps {
  issue: Issue;
  isSelected: boolean;
  onClick: () => void;
}

const statusIcons = {
  open: Circle,
  in_progress: Clock,
  done: CheckCircle2,
};

const priorityLabels = {
  0: 'Urgent',
  1: 'High',
  2: 'Medium',
  3: 'Low',
};

const typeColors = {
  bug: 'tag-modality',
  feature: 'tag-personality',
  task: 'tag-language',
  epic: 'tag-specialty',
};

export function IssueRow({ issue, isSelected, onClick }: IssueRowProps) {
  const StatusIcon = statusIcons[issue.status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b border-border',
        'hover:bg-surface-accent',
        isSelected && 'bg-surface-accent'
      )}
    >
      <StatusIcon
        className={cn(
          'h-4 w-4 flex-shrink-0',
          issue.status === 'closed' ? 'text-success-text' : 'text-text-muted'
        )}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-secondary">{issue.id}</span>
          <span
            className={cn(
              'text-sm font-normal text-text-primary truncate',
              issue.status === 'closed' && 'line-through text-text-muted'
            )}
          >
            {issue.title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={cn(
            'px-2 py-0.5 rounded text-xs',
            `bg-${typeColors[issue.type]} text-${typeColors[issue.type]}-foreground`
          )}
        >
          {issue.type}
        </span>

        {issue.priority <= 1 && (
          <span className="px-2 py-0.5 rounded text-xs bg-warning text-warning-text">
            P{issue.priority}
          </span>
        )}

        {issue.assignee && (
          <div className="w-6 h-6 rounded-full bg-garden-green text-on-dark flex items-center justify-center text-xs font-medium">
            {issue.assignee.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
