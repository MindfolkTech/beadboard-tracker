# Beads - Linear-Style Issue Tracker

A lightweight, embeddable issue tracking system designed for AI coding agents, inspired by [steveyegge/beads](https://github.com/steveyegge/beads) and styled after Linear's clean interface.

## Features

✨ **Core Functionality**
- Hash-based issue IDs (bd-a1b2, bd-c3d4, etc.) to prevent collisions
- Four issue states: Open, In Progress, Done
- Priority levels (P0-P3) and issue types (Bug, Feature, Task, Epic)
- Dependency tracking (blocks, parent/child, related, discovered-from)
- Ready work detection (issues with no open blockers)

🎨 **Linear-Style Interface**
- Clean, minimal design with keyboard shortcuts
- Status-based views (All, Backlog, Active, Ready, Done)
- Real-time search and filtering
- Side panel for issue details
- Quick issue creation (⌘K / Ctrl+K)

💾 **Lightweight Storage**
- LocalStorage-based (no backend required)
- Easy to embed in existing projects
- Export/import capability
- Works offline

## Quick Start

### For Development

```bash
npm install
npm run dev
```

### For Embedding

1. Copy the beads system:
   - `src/lib/beads/` - Core types, storage, and utilities
   - `src/hooks/use-beads.ts` - React hook for state management
   - `src/components/beads/` - UI components

2. Install dependencies:
   ```bash
   npm install lucide-react sonner
   ```

3. Import and use:
   ```tsx
   import { useBeads } from '@/hooks/use-beads';
   import { IssueList } from '@/components/beads/IssueList';

   function MyApp() {
     const { issues, createIssue, updateIssue } = useBeads();
     // ... your implementation
   }
   ```

## Usage

### Creating Issues

Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) to open the create dialog, or click the "New Issue" button.

### Viewing Issues

- **All** - View all issues
- **Backlog** - Open issues waiting to be started
- **Active** - Issues currently in progress
- **Ready** - Issues with no blockers, ready to work on
- **Done** - Completed issues

### Issue Details

Click any issue to open the detail panel on the right, where you can:
- View full description and metadata
- See dependencies (blockers, blocked, parent/children)
- Update status or delete
- Navigate related issues

### Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Create new issue
- `Escape` - Close detail panel

## Design System

The interface uses a sage green color palette with warm whites, following accessibility standards:

- **Primary**: Sage green (#5E8C77) for actions and emphasis
- **Surface**: Warm white (#FCF9F6) for backgrounds
- **Text**: Multi-level hierarchy with clear contrast
- **Tags**: Color-coded by type (Bug, Feature, Task, Epic)

## For AI Agents

This system is designed to be used by AI coding agents. Agents can:

1. **Track discovered work** - Create issues for bugs or improvements found during development
2. **Manage dependencies** - Link related work and blockers
3. **Query ready work** - Use `getReadyIssues()` to find unblocked tasks
4. **Maintain context** - Keep long-term development plans organized

## Data Structure

Issues are stored as JSONL in LocalStorage. Each issue contains:

```typescript
{
  id: string;              // bd-a1b2
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'done';
  type: 'bug' | 'feature' | 'task' | 'epic';
  priority: 0 | 1 | 2 | 3; // 0 is highest
  assignee?: string;
  dependencies: Dependency[];
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  closedAt?: number;
}
```

## Export/Import

To backup or transfer issues:

```typescript
// Export
const issues = storage.getIssues();
const json = JSON.stringify(issues, null, 2);

// Import
storage.saveIssues(JSON.parse(json));
```

## License

MIT - Feel free to embed and modify for your projects
