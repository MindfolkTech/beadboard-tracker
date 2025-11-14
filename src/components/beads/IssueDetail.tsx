import { useState } from 'react';
import { Issue } from '@/lib/beads/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, CheckCircle2, Play, Trash2, Link2 } from 'lucide-react';
import { getBlockers, getBlocked, getChildren, getParent } from '@/lib/beads/utils';
import { toast } from 'sonner';

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
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  
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

  const handleParentChange = async () => {
    if (!selectedParentId) return;
    
    try {
      // Remove old parent if exists
      if (parent) {
        await onRemoveParent(issue.id, parent.id);
      }
      
      // Add new parent
      await onAssignParent(issue.id, selectedParentId);
      setShowParentSelector(false);
      setSelectedParentId('');
      toast.success('Parent updated');
    } catch (error) {
      toast.error('Failed to update parent');
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

      {/* Parent Selector Dialog */}
      <Dialog open={showParentSelector} onOpenChange={setShowParentSelector}>
        <DialogContent className="bg-surface border-border">
          <DialogHeader>
            <DialogTitle className="text-text-primary">
              {parent ? 'Change Parent Epic' : 'Assign to Epic'}
            </DialogTitle>
          </DialogHeader>
          
          {parent && (
            <Alert className="bg-surface-accent border-border">
              <AlertDescription className="text-text-secondary">
                Current parent will be removed before assigning new parent.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Select
              value={selectedParentId}
              onValueChange={setSelectedParentId}
            >
              <SelectTrigger className="bg-warm-white border-border">
                <SelectValue placeholder="Select epic" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {allIssues
                  .filter(i => i.type === 'epic' && i.id !== issue.id)
                  .map(epic => (
                    <SelectItem key={epic.id} value={epic.id}>
                      📦 {epic.id} - {epic.title} ({epic.status})
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowParentSelector(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleParentChange}
              disabled={!selectedParentId}
              className="bg-btn-primary text-btn-primary-foreground"
            >
              {parent ? 'Change Parent' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
