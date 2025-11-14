import { useState } from 'react';
import type { Issue } from '@/types/Beads.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, CheckCircle2, Play, Trash2, Link2 } from '@/lib/icons';
import { getBlockers, getBlocked, getChildren, getParent } from '@/services/beads/BeadsUtils.service';
import { DependencySection } from './DependencySection';
import { IssueDetailParentSelector } from './IssueDetailParentSelector';

interface IssueDetailProps {
  issue: Issue;
  allIssues: Issue[];
  onClose: () => void;
  onUpdateStatus: (id: string, status: Issue['status']) => void;
  onDelete: (id: string) => void;
  onNavigate: (issue: Issue) => void;
  onAssignParent: (issueId: string, parentId: string) => Promise<void>;
  onRemoveParent: (issueId: string, parentId: string) => Promise<void>;
}

export function IssueDetail({
  issue,
  allIssues,
  onClose,
  onUpdateStatus,
  onDelete,
  onNavigate,
  onAssignParent,
  onRemoveParent,
}: IssueDetailProps) {
  const [showParentSelector, setShowParentSelector] = useState(false);
  
  const blockers = getBlockers(issue, allIssues);
  const blocked = getBlocked(issue.id, allIssues);
  const children = getChildren(issue.id, allIssues);
  const parent = getParent(issue, allIssues);

  const handleStatusChange = () => {
    if (issue.status === 'open') {
      onUpdateStatus(issue.id, 'in_progress');
    } else if (issue.status === 'in_progress') {
      onUpdateStatus(issue.id, 'closed');
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

        <div>
          <Separator className="mb-4" />
          <h3 className="text-sm font-medium text-text-secondary mb-2">Parent Epic</h3>
          {parent ? (
            <div className="flex items-center justify-between p-2 bg-surface-accent rounded">
              <button
                onClick={() => onNavigate(parent)}
                className="text-sm text-garden-green hover:underline flex items-center gap-2"
              >
                <span>📦</span>
                <span>{parent.id} - {parent.title}</span>
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowParentSelector(true)}
              >
                Change
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowParentSelector(true)}
              className="w-full"
            >
              <Link2 className="h-4 w-4 mr-2" />
              Assign to Epic
            </Button>
          )}
        </div>

        <DependencySection title="Subtasks" issues={children} onNavigate={onNavigate} />
        <DependencySection title="Blocked By" issues={blockers} onNavigate={onNavigate} textColorClass="text-warning-text" />
        <DependencySection title="Blocking" issues={blocked} onNavigate={onNavigate} />
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

        {issue.status !== 'closed' && (
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

      {/* Parent Selector Dialog */}
      <IssueDetailParentSelector
        issue={issue}
        parent={parent}
        allIssues={allIssues}
        open={showParentSelector}
        onOpenChange={setShowParentSelector}
        onAssignParent={onAssignParent}
        onRemoveParent={onRemoveParent}
      />
    </div>
  );
}
