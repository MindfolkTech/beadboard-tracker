import { Issue } from '@/lib/beads/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, CheckCircle2, Play, Trash2 } from 'lucide-react';
import { getBlockers, getBlocked, getChildren, getParent } from '@/lib/beads/utils';

interface IssueDetailProps {
  issue: Issue;
  allIssues: Issue[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: Issue['status']) => void;
  onDelete: (id: string) => void;
  onNavigate: (issue: Issue) => void;
}

export function IssueDetail({
  issue,
  allIssues,
  onClose,
  onUpdateStatus,
  onDelete,
  onNavigate,
}: IssueDetailProps) {
  const blockers = getBlockers(issue, allIssues);
  const blocked = getBlocked(issue.id, allIssues);
  const children = getChildren(issue.id, allIssues);
  const parent = getParent(issue, allIssues);

  const handleStatusChange = () => {
    if (issue.status === 'open') {
      onUpdateStatus(issue.id, 'in_progress');
    } else if (issue.status === 'in_progress') {
      onUpdateStatus(issue.id, 'done');
    }
  };

  return (
    <div className="h-full bg-surface flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-text-secondary">{issue.id}</span>
          <Badge className="bg-tag-personality text-tag-personality-foreground">
            {issue.type}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-text-muted hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">{issue.title}</h2>
          {issue.description && (
            <p className="text-text-secondary whitespace-pre-wrap">{issue.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-muted">Status</span>
            <p className="text-text-primary font-medium capitalize">{issue.status.replace('_', ' ')}</p>
          </div>
          <div>
            <span className="text-text-muted">Priority</span>
            <p className="text-text-primary font-medium">P{issue.priority}</p>
          </div>
          {issue.assignee && (
            <div>
              <span className="text-text-muted">Assignee</span>
              <p className="text-text-primary font-medium">{issue.assignee}</p>
            </div>
          )}
          <div>
            <span className="text-text-muted">Created</span>
            <p className="text-text-primary">{new Date(issue.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {parent && (
          <div>
            <Separator className="mb-4" />
            <h3 className="text-sm font-medium text-text-secondary mb-2">Parent</h3>
            <button
              onClick={() => onNavigate(parent)}
              className="text-sm text-garden-green hover:underline"
            >
              {parent.id} - {parent.title}
            </button>
          </div>
        )}

        {children.length > 0 && (
          <div>
            <Separator className="mb-4" />
            <h3 className="text-sm font-medium text-text-secondary mb-2">Subtasks</h3>
            <div className="space-y-2">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => onNavigate(child)}
                  className="block text-sm text-garden-green hover:underline"
                >
                  {child.id} - {child.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {blockers.length > 0 && (
          <div>
            <Separator className="mb-4" />
            <h3 className="text-sm font-medium text-text-secondary mb-2">Blocked By</h3>
            <div className="space-y-2">
              {blockers.map(blocker => (
                <button
                  key={blocker.id}
                  onClick={() => onNavigate(blocker)}
                  className="block text-sm text-warning-text hover:underline"
                >
                  {blocker.id} - {blocker.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {blocked.length > 0 && (
          <div>
            <Separator className="mb-4" />
            <h3 className="text-sm font-medium text-text-secondary mb-2">Blocking</h3>
            <div className="space-y-2">
              {blocked.map(b => (
                <button
                  key={b.id}
                  onClick={() => onNavigate(b)}
                  className="block text-sm text-garden-green hover:underline"
                >
                  {b.id} - {b.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(issue.id)}
          className="text-error-text hover:text-error-text hover:bg-error"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>

        {issue.status !== 'done' && (
          <Button
            onClick={handleStatusChange}
            className="bg-btn-primary text-btn-primary-foreground hover:opacity-90"
          >
            {issue.status === 'open' ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Complete
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
