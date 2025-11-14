import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { IssueType, Priority, Issue } from '@/lib/beads/types';

interface CreateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allIssues: Issue[];
  defaultType?: IssueType;
  onCreate: (data: {
    title: string;
    description?: string;
    type: IssueType;
    priority: Priority;
    assignee?: string;
    parentId?: string;
  }) => void;
}

export function CreateIssueDialog({ open, onOpenChange, onCreate, allIssues, defaultType }: CreateIssueDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<IssueType>(defaultType || 'task');
  const [priority, setPriority] = useState<Priority>(2);
  const [assignee, setAssignee] = useState('');
  const [parentId, setParentId] = useState<string>('__none__');

  // Update type when defaultType changes
  useEffect(() => {
    if (defaultType) {
      setType(defaultType);
    }
  }, [defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      priority,
      assignee: assignee.trim() || undefined,
      parentId: parentId && parentId !== '__none__' ? parentId : undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setType(defaultType || 'task');
    setPriority(2);
    setAssignee('');
    setParentId('__none__');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border max-w-full h-screen w-screen m-0 rounded-none flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Create New Issue</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-text-secondary">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Issue title..."
              className="bg-surface border-border"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-text-secondary">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details..."
              className="bg-surface border-border min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-text-secondary">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as IssueType)}>
                <SelectTrigger className="bg-surface border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-text-secondary">Priority</Label>
              <Select value={priority.toString()} onValueChange={(v) => setPriority(Number(v) as Priority)}>
                <SelectTrigger className="bg-surface border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">P0 - Urgent</SelectItem>
                  <SelectItem value="1">P1 - High</SelectItem>
                  <SelectItem value="2">P2 - Medium</SelectItem>
                  <SelectItem value="3">P3 - Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee" className="text-text-secondary">Assignee</Label>
            <Input
              id="assignee"
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              placeholder="Username..."
              className="bg-surface border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent" className="text-text-secondary">Parent Epic (optional)</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger className="bg-surface border-border">
                <SelectValue placeholder="No parent" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="__none__">No parent</SelectItem>
                {allIssues
                  .filter(i => i.type === 'epic')
                  .map(epic => (
                    <SelectItem key={epic.id} value={epic.id}>
                      📦 {epic.id} - {epic.title}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-text-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="bg-btn-primary text-btn-primary-foreground hover:opacity-90"
            >
              Create Issue
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
