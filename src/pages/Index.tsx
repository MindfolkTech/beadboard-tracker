import { useState, useEffect } from 'react';
import { useBeads } from '@/hooks/use-beads';
import { KanbanBoard } from '@/components/beads/KanbanBoard';
import { EpicGroupedList } from '@/components/beads/EpicGroupedList';
import { IssueDetail } from '@/components/beads/IssueDetail';
import { CreateIssueDialog } from '@/components/beads/CreateIssueDialog';
import { WelcomeBanner } from '@/components/beads/WelcomeBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Zap, List, LayoutGrid } from 'lucide-react';
import { Issue } from '@/lib/beads/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ViewType = 'list' | 'board';

const Index = () => {
  const {
    issues,
    loading,
    createIssue,
    updateIssue,
    closeIssue,
    deleteIssue,
    getReadyIssues,
    getIssuesByStatus,
  } = useBeads();

  const [activeView, setActiveView] = useState<ViewType>('board');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get filtered issues based on search
  const getFilteredIssues = (): Issue[] => {
    if (!searchQuery.trim()) {
      return issues;
    }

    const query = searchQuery.toLowerCase();
    return issues.filter(
      issue =>
        issue.id.toLowerCase().includes(query) ||
        issue.title.toLowerCase().includes(query) ||
        issue.description?.toLowerCase().includes(query)
    );
  };

  const filteredIssues = getFilteredIssues();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to create issue
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCreateDialogOpen(true);
      }

      // Escape to close detail panel
      if (e.key === 'Escape') {
        setSelectedIssue(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateIssue = async (data: Parameters<typeof createIssue>[0]) => {
    const newIssue = await createIssue(data);
    setSelectedIssue(newIssue);
  };

  const handleUpdateStatus = (id: string, status: Issue['status']) => {
    updateIssue(id, { status });
    if (status === 'done') {
      closeIssue(id);
    }
    // Refresh selected issue
    const updated = issues.find(i => i.id === id);
    if (updated) {
      setSelectedIssue({ ...updated, status });
    }
  };

  const handleDelete = (id: string) => {
    deleteIssue(id);
    setSelectedIssue(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-warm-white">
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
                <Input
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-warm-white border-border"
                />
              </div>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-btn-primary text-btn-primary-foreground hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Issue
                <kbd className="ml-2 text-xs opacity-70">⌘K</kbd>
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-border bg-[hsl(var(--surface))]">
            <button
              onClick={() => setActiveView('list')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                activeView === 'list'
                  ? 'bg-garden-green text-white'
                  : 'text-text-muted hover:text-text-primary hover:bg-[hsl(var(--surface-accent))]'
              )}
            >
              <List className="h-4 w-4" />
              All Issues
            </button>
            <button
              onClick={() => setActiveView('board')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                activeView === 'board'
                  ? 'bg-garden-green text-white'
                  : 'text-text-muted hover:text-text-primary hover:bg-[hsl(var(--surface-accent))]'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Board
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeView === 'list' ? (
              <EpicGroupedList
                issues={filteredIssues}
                onSelectIssue={setSelectedIssue}
                selectedIssueId={selectedIssue?.id}
              />
            ) : (
              <KanbanBoard
                issues={filteredIssues}
                onSelectIssue={setSelectedIssue}
                selectedIssueId={selectedIssue?.id}
              />
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedIssue && (
          <div className="w-[480px] border-l border-border">
            <IssueDetail
              issue={selectedIssue}
              allIssues={issues}
              onClose={() => setSelectedIssue(null)}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              onNavigate={setSelectedIssue}
            />
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <CreateIssueDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateIssue}
      />
    </div>
  );
};

export default Index;
