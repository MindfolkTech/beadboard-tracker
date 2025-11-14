import { useState, useEffect, lazy, Suspense } from 'react';
import { useBeads } from '@/hooks/beads/useBeads';
import { KanbanBoard } from '@/components/beads/KanbanBoard';
import { EpicGroupedList } from '@/components/beads/EpicGroupedList';
import { WelcomeBanner } from '@/components/beads/WelcomeBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Zap, List, LayoutGrid, ChevronDown, FileText, Bug, Sparkles, Package } from '@/lib/icons';
import type { Issue, IssueType, Priority } from '@/types/Beads.types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Lazy load heavy components
const IssueDetail = lazy(() => import('@/components/beads/IssueDetail').then(m => ({ default: m.IssueDetail })));
const CreateIssueDialog = lazy(() => import('@/components/beads/CreateIssueDialog').then(m => ({ default: m.CreateIssueDialog })));
type ViewType = 'list' | 'board';
const Index = () => {
  const {
    issues,
    loading,
    createIssue,
    updateIssue,
    closeIssue,
    deleteIssue,
    addDependency,
    removeDependency
  } = useBeads();
  const [activeView, setActiveView] = useState<ViewType>('board');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [createDialogConfig, setCreateDialogConfig] = useState<{
    open: boolean;
    defaultType?: IssueType;
  }>({
    open: false
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Get filtered issues based on search
  const getFilteredIssues = (): Issue[] => {
    if (!searchQuery.trim()) {
      return issues;
    }
    const query = searchQuery.toLowerCase();
    return issues.filter(issue => issue.id.toLowerCase().includes(query) || issue.title.toLowerCase().includes(query) || issue.description?.toLowerCase().includes(query));
  };
  const filteredIssues = getFilteredIssues();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to create issue
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCreateDialogConfig({
          open: true
        });
      }

      // Escape to close detail panel
      if (e.key === 'Escape') {
        setSelectedIssue(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const openCreateDialog = (defaultType?: IssueType) => {
    setCreateDialogConfig({
      open: true,
      defaultType
    });
  };
  const handleCreateIssue = async (data: {
    title: string;
    description?: string;
    type: IssueType;
    priority: Priority;
    assignee?: string;
    parentId?: string;
  }) => {
    const {
      parentId,
      ...issueData
    } = data;
    const newIssue = await createIssue(issueData);

    // If parent selected, add dependency
    if (parentId) {
      await addDependency(newIssue.id, {
        type: 'parent',
        targetId: parentId
      });
    }
    setSelectedIssue(newIssue);
    setCreateDialogConfig({
      open: false
    });
  };
  const handleAssignParent = async (issueId: string, parentId: string) => {
    try {
      await addDependency(issueId, {
        type: 'parent',
        targetId: parentId
      });
      toast.success('Parent assigned');

      // Refresh selected issue
      const updated = issues.find(i => i.id === issueId);
      if (updated) setSelectedIssue(updated);
    } catch (error) {
      toast.error('Failed to assign parent');
    }
  };
  const handleRemoveParent = async (issueId: string, parentId: string) => {
    try {
      await removeDependency(issueId, parentId);
      toast.success('Parent removed');
    } catch (error) {
      toast.error('Failed to remove parent');
    }
  };
  const handleUpdateStatus = (id: string, status: Issue['status']) => {
    updateIssue(id, {
      status
    });
    if (status === 'closed') {
      closeIssue(id);
    }
    // Refresh selected issue
    const updated = issues.find(i => i.id === id);
    if (updated) {
      setSelectedIssue({
        ...updated,
        status
      });
    }
  };
  const handleDelete = (id: string) => {
    deleteIssue(id);
    setSelectedIssue(null);
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-muted">Loading...</p>
      </div>;
  }
  return <div className="flex flex-col h-screen bg-warm-white">
      <WelcomeBanner />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[hsl(var(--warm-white))]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-garden-green" />
                <h1 className="text-xl font-semibold text-text-primary">Beads</h1>
              </div>
              <span className="text-sm text-text-muted">Issue Tracker</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input placeholder="Search issues..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 w-64 bg-warm-white border-border" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-btn-primary text-btn-primary-foreground hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Issue
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border">
                  <DropdownMenuItem onClick={() => openCreateDialog('task')}>
                    <FileText className="mr-2 h-4 w-4" />
                    New Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openCreateDialog('feature')}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    New Feature
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openCreateDialog('bug')}>
                    <Bug className="mr-2 h-4 w-4" />
                    New Bug
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openCreateDialog('epic')}>
                    <Package className="mr-2 h-4 w-4" />
                    New Epic
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-border bg-warm-white">
            <button onClick={() => setActiveView('list')} className={cn('flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors', activeView === 'list' ? 'bg-garden-green text-btn-primary-text' : 'text-text-muted hover:text-text-primary hover:bg-surface-accent')}>
              <List className="h-4 w-4" />
              All Issues
            </button>
            <button onClick={() => setActiveView('board')} className={cn('flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors', activeView === 'board' ? 'bg-garden-green text-btn-primary-text' : 'text-text-muted hover:text-text-primary hover:bg-surface-accent')}>
              <LayoutGrid className="h-4 w-4" />
              Board
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeView === 'list' ? <EpicGroupedList issues={filteredIssues} onSelectIssue={setSelectedIssue} selectedIssueId={selectedIssue?.id} /> : <KanbanBoard issues={filteredIssues} onSelectIssue={setSelectedIssue} selectedIssueId={selectedIssue?.id} />}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedIssue && <div className="w-[480px] border-l border-border">
            <Suspense fallback={<div className="w-full h-full bg-surface animate-pulse" />}>
              <IssueDetail issue={selectedIssue} allIssues={issues} onClose={() => setSelectedIssue(null)} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} onNavigate={setSelectedIssue} onAssignParent={handleAssignParent} onRemoveParent={handleRemoveParent} />
            </Suspense>
          </div>}
      </div>

      {/* Create Dialog */}
      <Suspense fallback={null}>
        <CreateIssueDialog open={createDialogConfig.open} onOpenChange={open => setCreateDialogConfig({
        open,
        defaultType: undefined
      })} onCreate={handleCreateIssue} allIssues={issues} defaultType={createDialogConfig.defaultType} />
      </Suspense>
    </div>;
};
export default Index;