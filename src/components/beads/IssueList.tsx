import { Issue } from '@/lib/beads/types';
import { IssueRow } from './IssueRow';

interface IssueListProps {
  issues: Issue[];
  selectedId?: string;
  onSelectIssue: (issue: Issue) => void;
  emptyMessage?: string;
}

export function IssueList({ issues, selectedId, onSelectIssue, emptyMessage = 'No issues found' }: IssueListProps) {
  if (issues.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {issues.map(issue => (
        <IssueRow
          key={issue.id}
          issue={issue}
          isSelected={selectedId === issue.id}
          onClick={() => onSelectIssue(issue)}
        />
      ))}
    </div>
  );
}
