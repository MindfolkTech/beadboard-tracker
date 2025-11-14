import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { IssueType, Priority, Issue } from '@/types/Beads.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const issueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['bug', 'feature', 'task', 'epic'] as const),
  priority: z.number().min(0).max(4),
  assignee: z.string().optional(),
  parentId: z.string().optional(),
});

type IssueFormData = z.infer<typeof issueSchema>;

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
  const form = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      description: '',
      type: defaultType || 'task',
      priority: 2,
      assignee: '',
      parentId: '__none__',
    },
  });

  // Update type when defaultType changes
  useEffect(() => {
    if (defaultType) {
      form.setValue('type', defaultType);
    }
  }, [defaultType, form]);

  const onSubmit = (data: IssueFormData) => {
    onCreate({
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      type: data.type,
      priority: data.priority as Priority,
      assignee: data.assignee?.trim() || undefined,
      parentId: data.parentId && data.parentId !== '__none__' ? data.parentId : undefined,
    });

    form.reset({
      title: '',
      description: '',
      type: defaultType || 'task',
      priority: 2,
      assignee: '',
      parentId: '__none__',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border max-w-full h-screen w-screen m-0 rounded-none flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Create New Issue</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1 overflow-y-auto">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Issue title..." className="bg-surface border-border" autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Add details..." className="bg-surface border-border min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-secondary">Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-surface border-border">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-text-secondary">Priority</FormLabel>
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger className="bg-surface border-border">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">P0 - Urgent</SelectItem>
                        <SelectItem value="1">P1 - High</SelectItem>
                        <SelectItem value="2">P2 - Medium</SelectItem>
                        <SelectItem value="3">P3 - Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">Assignee</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Username..." className="bg-surface border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-secondary">Parent Epic (optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-surface border-border">
                        <SelectValue placeholder="No parent" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

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
                className="bg-btn-primary text-btn-primary-foreground hover:opacity-90"
              >
                Create Issue
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
