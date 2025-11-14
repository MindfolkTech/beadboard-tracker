import type { Issue } from '@/types/Beads.types';
import { Separator } from '@/components/ui/separator';

interface DependencySectionProps {
  title: string;
  issues: Issue[];
  onNavigate: (issue: Issue) => void;
  textColorClass?: string;
}

export function DependencySection({ title, issues, onNavigate, textColorClass = 'text-garden-green' }: DependencySectionProps) {
  if (issues.length === 0) return null;

  return (
    <div>
      <Separator className="mb-4" />
      <h3 className="text-sm font-medium text-text-secondary mb-2">{title}</h3>
      <div className="space-y-2">
        {issues.map(issue => (
          <button
            key={issue.id}
            onClick={() => onNavigate(issue)}
            className={`block text-sm ${textColorClass} hover:underline`}
          >
            {issue.id} - {issue.title}
          </button>
        ))}
      </div>
    </div>
  );
}
