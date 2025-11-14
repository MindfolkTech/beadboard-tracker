import { useState } from 'react';
import type { Issue } from '@/types/Beads.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface IssueDetailParentSelectorProps {
  issue: Issue;
  parent: Issue | undefined;
  allIssues: Issue[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignParent: (issueId: string, parentId: string) => Promise<void>;
  onRemoveParent: (issueId: string, parentId: string) => Promise<void>;
}

export function IssueDetailParentSelector({
  issue,
  parent,
  allIssues,
  open,
  onOpenChange,
  onAssignParent,
  onRemoveParent,
}: IssueDetailParentSelectorProps) {
  const [selectedParentId, setSelectedParentId] = useState<string>('');

  const handleParentChange = async () => {
    if (!selectedParentId) return;
    
    try {
      // Remove old parent if exists
      if (parent) {
        await onRemoveParent(issue.id, parent.id);
      }
      
      // Add new parent
      await onAssignParent(issue.id, selectedParentId);
      onOpenChange(false);
      setSelectedParentId('');
      toast.success('Parent updated');
    } catch (error) {
      toast.error('Failed to update parent');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
  );
}
