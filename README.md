# Beads - Linear-Style Issue Tracker

A lightweight, embeddable issue tracking system with a beautiful Linear-inspired interface, connected to the original [beads CLI](https://github.com/steveyegge/beads). Built specifically for AI coding agents to track work across long-horizon tasks.

**Key Features:**

- 🎨 Beautiful Linear-style web UI for humans
- 🤖 Native CLI support for AI agents (`bd` commands)
- 🔄 Shared data store - UI and CLI work together
- 📦 Lightweight and embeddable
- 🌳 Git-versioned issue tracking

## Features

✨ **Core Functionality**

- Hash-based issue IDs (bd-a1b2, bd-c3d4, etc.) to prevent collisions
- Four issue statuses: Open, In Progress, Blocked, Closed
- Priority levels (P0-P4) and issue types (Bug, Feature, Task, Epic)
- Title and description editing for all issues
- Dependency tracking (blocks, parent/child, related, discovered-from)
- Ready work detection (issues with no open blockers)

🎨 **Linear-Style Interface**

- Clean, minimal design with keyboard shortcuts
- Status-based views (All, Backlog, Active, Ready, Done)
- Real-time search and filtering
- Side panel for issue details with dependency navigation
- Quick issue creation (⌘K / Ctrl+K)
- Welcome banner for new users

💾 **Lightweight Storage**

- Dual storage mode: Bridge server (primary) with LocalStorage fallback
- Easy to embed in existing projects
- Export/import capability
- Works offline with LocalStorage mode

## Quick Start

### Prerequisites

# 1. Beads CLI (required - check if you already have this using bd --version # Should return version info)

curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash

# 2. Node.js 18+ (required - check if you already have this)

node --version # Should be v18.11.0 or higher

# 3. npm (required- check if you already have this)

npm --version # Any recent version

### Step-by-Step Integration

# 1. Copy Beads-Specific Files

Copy the entire folders to your project:

# From Beads project root

cp -r server/ /path/to/your-project/
cp -r src/components/beads/ /path/to/your-project/src/components/
cp -r src/hooks/beads/ /path/to/your-project/src/hooks/
cp -r src/services/beads/ /path/to/your-project/src/services/
cp src/types/Beads.types.ts /path/to/your-project/src/types/
cp src/design-tokens.css /path/to/your-project/src/

# 2. Check for Existing Shadcn Components

If you already have src/components/ui/, verify these components exist:

button, dialog, dropdown-menu, select, badge, card, progress, separator, input, textarea, label, form, toast, tooltip, alert
If missing, copy them from the Beads project.

# 3. Merge Configuration Files

Update your existing config files:

.env - Add API URL: VITE_BEADS_API_URL=http://localhost:3001/api

Verify tsconfig.json path alias exists:

{
"compilerOptions": {
"paths": {
"@/_": ["./src/_"]
}
}
}

# 4. Install Dependencies if not already installed:

# Root project

npm install lucide-react sonner react-hook-form @hookform/resolvers zod

# Bridge server

cd server
npm install

# 5. Start the Bridge Server

cd server
npm start

The server should start on http://localhost:3001.

# 6. Integrate into Your App

Full Page Example (e.g., src/pages/Issues.tsx):

import { useState } from 'react';
import { useBeads } from '@/hooks/beads/useBeads';
import { KanbanBoard } from '@/components/beads/KanbanBoard';
import { EpicGroupedList } from '@/components/beads/EpicGroupedList';
import { IssueDetail } from '@/components/beads/IssueDetail';
import { CreateIssueDialog } from '@/components/beads/CreateIssueDialog';
import { WelcomeBanner } from '@/components/beads/WelcomeBanner';
import type { Issue } from '@/types/Beads.types';

export function IssuesPage() {
const {
issues,
loading,
createIssue,
updateIssue,
deleteIssue
} = useBeads();

const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
const [view, setView] = useState<'board' | 'list'>('board');

if (loading) return <div>Loading issues...</div>;

return (
<div className="flex h-screen">
<div className="flex-1">
{issues.length === 0 ? (
<WelcomeBanner onCreateIssue={() => {/_ open dialog _/}} />
) : view === 'board' ? (
<KanbanBoard 
            issues={issues} 
            onIssueClick={setSelectedIssue}
          />
) : (
<EpicGroupedList 
            issues={issues} 
            onIssueClick={setSelectedIssue}
          />
)}
</div>

      {selectedIssue && (
        <IssueDetail
          issue={selectedIssue}
          allIssues={issues}
          onClose={() => setSelectedIssue(null)}
          onUpdate={updateIssue}
          onDelete={deleteIssue}
        />
      )}

      <CreateIssueDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={createIssue}
        existingIssues={issues}
      />
    </div>

);
}

## How It Works

### Architecture Overview

Beads operates in two modes that share the same SQLite database in `.beads/`:

**Web UI Mode (For Humans)**

- Requires **both servers running**: Vite dev server (port 5173) and Bridge server (port 3001)
- Bridge server wraps `bd` CLI commands and exposes them as REST APIs
- All operations are **manual** - users click buttons to save (no auto-save on field changes)
- Data flow: UI → useBeads hook → API client → Bridge server → `bd` CLI → SQLite → Response → Full refresh → UI update
- Expected lag: ~100-400ms per operation due to network round-trips and full issue list refresh
- **No real-time sync**: UI does not automatically reflect CLI changes until page refresh or manual action

**CLI Mode (For AI Agents)**

- Requires **no servers** - works directly with SQLite database
- Changes save **immediately** on each `bd` command execution
- Data flow: `bd` CLI → Direct SQLite update in `.beads/`
- Fast operations: ~10-100ms
- Changes are **not visible** in the web UI until the UI is manually refreshed

### Important Limitations

- **One-way visibility**: CLI changes don't trigger UI updates automatically
- **No optimistic updates**: UI waits for full server confirmation before displaying changes
- **Full refresh on every operation**: All UI actions re-fetch the entire issue list, which may be slow with large datasets

## Usage

### Creating Issues

**Quick Creation Dropdown:**

- Click "New Issue" dropdown to create specific issue types:
  - **New Task** - Default work items
  - **New Feature** - Feature requests
  - **New Bug** - Bug reports
  - **New Epic** - Parent issues for grouping work

**Keyboard Shortcut:**

- Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) to open the create dialog

**Creation Form Fields:**

- Title (required)
- Description (markdown supported)
- Type: Task, Feature, Bug, or Epic
- Priority: P0 (highest) through P4
- Assignee (optional)
- Parent Epic (optional) - Assign to an existing epic for organization

### Parent/Epic Management

**Assigning Parents During Creation:**

- Select a parent epic from the "Parent Epic" dropdown when creating any issue
- Only epics appear in the parent selection list
- Creates a hierarchical relationship for better organization

**Managing Parents After Creation:**

- Open an issue's detail panel
- Click "Assign to Epic" to assign a parent epic
- Click "Change Parent" to switch to a different epic
- Click "Remove Parent" to unlink from the current epic
- System prevents circular dependencies automatically

**Epic Benefits:**

- Group related issues together
- Track progress across multiple issues
- View completion percentage in list view
- Organize work hierarchically

### View Modes

**Board View (Kanban):**

- Visual columns for Blocked, Ready, In Progress, and Closed statuses
- Compact card view with key information
- Ideal for workflow visualization

**List View (Epic-Grouped):**

- Issues grouped under their parent epics
- Expandable/collapsible epic sections
- Progress bars showing epic completion percentage
- Orphaned issues (no parent) listed separately
- Ideal for hierarchical project views

### Viewing Issues

- **All** - View all issues
- **Backlog** - Open issues waiting to be started
- **Active** - Issues currently in progress
- **Ready** - Issues with no blockers, ready to work on
- **Closed** - Completed issues

### Issue Details

Click any issue to open the detail panel on the right, where you can:

- View full description and metadata
- See dependencies (blockers, blocked, parent/children)
- Update status or delete
- Navigate related issues

### Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Create new issue
- `Escape` - Close detail panel or dialogs
- Click issue IDs in dependencies to navigate between related issues

## Design System

The interface uses a sage green color palette with warm whites, following accessibility standards:

- **Primary**: Sage green (#5E8C77) for actions and emphasis
- **Surface**: Warm white (#FCF9F6) for backgrounds
- **Text**: Multi-level hierarchy with clear contrast
- **Tags**: Color-coded by type (Bug, Feature, Task, Epic)

## For AI Agents

### Using the CLI Directly

AI agents should use the `bd` CLI commands directly. The web UI will automatically reflect changes:

```bash
# List ready work (no blockers)
bd ready --json

# Create a new issue
bd create "Fix authentication bug" -t bug -p 1 -d "Users can't login"

# Create an epic for grouping work
bd create "User Authentication Epic" -t epic -p 1 -d "Complete auth overhaul"

# Assign an issue
bd update bd-a1b2 --assignee "AI Agent Name" --json

# Start working on an issue
bd update bd-a1b2 --status in_progress --json

# Mark issue as closed (completed)
bd close bd-a1b2 --reason "Completed" --json
# OR
bd update bd-a1b2 --status closed --json

# Update title and description
bd update bd-a1b2 --title "New title" -d "Updated description"

# Update multiple fields at once
bd update bd-a1b2 --status in_progress -p 0 --title "Critical fix"

# Add a parent dependency (assign to epic)
bd dep add bd-a1b2 bd-epic1 --type parent

# Add a blocker dependency
bd dep add bd-a1b2 bd-c3d4 --type blocks

# Remove a dependency
bd dep remove bd-a1b2 bd-c3d4

# Show issue details
bd show bd-a1b2 --json
```

### For Humans

Humans use the beautiful Linear-style web interface to:

- View all issues at a glance
- Search and filter by status, priority, type
- See dependency graphs
- Create and update issues visually
- Track agent progress

Both the CLI and web UI read/write to the same `.beads/` database, so everyone stays in sync.

## Data Structure

Issues are stored in `.beads/beads.db` (SQLite) and synced via git as JSONL. The structure:

```typescript
{
  id: string;              // bd-a1b2
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'blocked' | 'closed';
  type: 'bug' | 'feature' | 'task' | 'epic';
  priority: 0 | 1 | 2 | 3 | 4; // 0 is highest (P0-P4)
  assignee?: string;
  dependencies: Dependency[];
  labels?: string[];
  createdAt: number;
  updatedAt: number;
  closedAt?: number;
}
```

## Export/Import

### Export Issues (CLI)

```bash
bd export issues.json
```

### Import Issues (CLI)

```bash
bd import issues.json
```

### Backup Data

The `.beads/` directory contains all your data:

- `beads.db` - SQLite database (local)
- `*.jsonl` - Git-synced records

Simply commit `.beads/` to git to backup and share with your team.

## License

MIT - Feel free to embed and modify for your projects

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
