import { cn } from '@/lib/utils';

type ViewType = 'all' | 'backlog' | 'active' | 'ready' | 'done';

interface StatusTabsProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  counts: Record<ViewType, number>;
}

export function StatusTabs({ activeView, onViewChange, counts }: StatusTabsProps) {
  const tabs: { label: string; value: ViewType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Backlog', value: 'backlog' },
    { label: 'Active', value: 'active' },
    { label: 'Ready', value: 'ready' },
    { label: 'Done', value: 'done' },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-border px-4">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onViewChange(tab.value)}
          className={cn(
            'px-4 py-2.5 text-sm font-medium transition-colors relative',
            activeView === tab.value
              ? 'text-text-primary'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          {tab.label}
          <span className="ml-2 text-xs text-text-muted">
            {counts[tab.value]}
          </span>
          {activeView === tab.value && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-garden-green" />
          )}
        </button>
      ))}
    </div>
  );
}
