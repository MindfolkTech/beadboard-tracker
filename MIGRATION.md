# Migration to Original Beads System

This document explains the migration from our custom LocalStorage implementation to integration with the original [steveyegge/beads](https://github.com/steveyegge/beads) CLI system.

## What Changed

### Before (Custom Implementation)
- ✅ Simple LocalStorage-based storage
- ✅ Works entirely in browser
- ❌ No CLI access for AI agents
- ❌ Not git-trackable
- ❌ Single-machine only

### After (Integrated with beads CLI)
- ✅ Full `bd` CLI support for AI agents
- ✅ Git-versioned via `.beads/` directory
- ✅ Multi-machine sync capability
- ✅ SQLite database with JSONL sync
- ✅ Distributed collaboration support
- ⚠️ Requires Node.js bridge server

## Architecture Changes

### Old Architecture
```
Browser → LocalStorage → JSON
```

### New Architecture
```
Browser → Bridge Server → bd CLI → .beads/beads.db
                                  ↓
                              Git JSONL Sync
```

## What Was Archived

The following files were moved to `src/lib/beads-archive/` for reference:
- `storage-localstorage.ts` - Original LocalStorage implementation

## New Components

- `server/` - Express bridge server that wraps `bd` CLI
- `src/lib/beads/api-client.ts` - API client for frontend
- `src/lib/beads/storage.ts` - Updated to use API instead of LocalStorage

## Breaking Changes

1. **Async Operations**: All storage operations are now async
   - `createIssue()` → `await createIssue()`
   - `updateIssue()` → `await updateIssue()`
   - etc.

2. **Server Required**: The bridge server must be running for the UI to work
   ```bash
   cd server && npm start
   ```

3. **beads CLI Required**: Must install `bd` CLI first
   ```bash
   curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
   bd init
   ```

## Migration Path for Existing Data

If you have existing issues in LocalStorage, you can migrate them:

1. **Export from LocalStorage (in browser console):**
   ```javascript
   const issues = JSON.parse(localStorage.getItem('beads_issues'));
   console.log(JSON.stringify(issues, null, 2));
   // Copy the output
   ```

2. **Convert to beads format and import:**
   ```bash
   # Save the JSON to a file: issues.json
   # Then import via CLI (note: may need format adjustments)
   bd import issues.json
   ```

## Benefits of the New System

### For AI Agents
- Direct CLI access without browser interaction
- Programmatic JSON output (`--json` flags)
- Git-based audit trail
- Distributed coordination via git sync
- Optional Agent Mail for real-time updates

### For Humans
- Same beautiful Linear-style UI
- No changes to user experience
- Better data persistence
- Team collaboration via git
- Backup through version control

### For Projects
- Professional issue tracking
- Git-trackable work logs
- Multi-machine development
- AI agent + human collaboration
- Embeddable with standard tools

## Rollback Instructions

If you need to rollback to LocalStorage:

1. Copy `src/lib/beads-archive/storage-localstorage.ts` back to `src/lib/beads/storage.ts`
2. Restore old `src/hooks/use-beads.ts` from git history
3. Remove async/await from hook calls in `src/pages/Index.tsx`
4. Remove `server/` directory

## Support

For issues with:
- **Original beads CLI**: See https://github.com/steveyegge/beads
- **Web UI integration**: Check server logs and browser console
- **Bridge server**: Review `server/README.md`
