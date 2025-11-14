import { Issue } from '@/lib/beads/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertCircle, Bug, Zap, CheckSquare, Folder } from 'lucide-react';
import { getBlockers } from '@/lib/beads/utils';

interface KanbanCardProps {
  issue: Issue;
  allIssues: Issue[];
  isSelected: boolean;
  onClick: () => void;
  showBlockerInfo?: boolean;
  bgColor?: string;
}

export function KanbanCard({ issue, allIssues, isSelected, onClick, showBlockerInfo = false, bgColor }: KanbanCardProps) {
  const blockers = showBlockerInfo ? getBlockers(issue, allIssues) : [];
  
  const typeIcon = {
    bug: <Bug className="h-3 w-3" />,
    feature: <Zap className="h-3 w-3" />,
    task: <CheckSquare className="h-3 w-3" />,
    epic: <Folder className="h-3 w-3" />,
  };

  const typeColor = {
    bug: 'bg-red-500/10 text-red-700 dark:text-red-400',
    feature: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    task: 'bg-green-500/10 text-green-700 dark:text-green-400',
    epic: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  };

  const priorityColor = {
    0: 'border-l-4 border-l-red-500',
    1: 'border-l-4 border-l-orange-500',
    2: 'border-l-4 border-l-yellow-500',
    3: 'border-l-4 border-l-blue-500',
    4: 'border-l-4 border-l-gray-500',
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-3 cursor-pointer hover:shadow-md transition-all',
        bgColor || 'bg-[hsl(var(--surface))]',
        isSelected && 'ring-2 ring-garden-green',
        issue.priority <= 1 && priorityColor[issue.priority]
      )}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xs font-mono text-text-muted shrink-0">{issue.id}</span>
            <Badge variant="outline" className={cn('text-xs shrink-0', typeColor[issue.type])}>
              <span className="mr-1">{typeIcon[issue.type]}</span>
              {issue.type}
            </Badge>
          </div>
          {issue.priority <= 1 && (
            <Badge variant="destructive" className="text-xs shrink-0">
              P{issue.priority}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-text-primary line-clamp-2">
          {issue.title}
        </h3>

        {/* Blocker Info */}
        {showBlockerInfo && blockers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
            <AlertCircle className="h-3 w-3" />
            <span>Blocked by {blockers.length} issue{blockers.length > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Assignee */}
        {issue.assignee && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-garden-green/20 flex items-center justify-center">
              <span className="text-xs font-medium text-garden-green">
                {issue.assignee.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-text-muted">{issue.assignee}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
