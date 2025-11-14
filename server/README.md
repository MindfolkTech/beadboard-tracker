# Beads Bridge Server

Lightweight Express server that connects the Linear-style web UI to the original `bd` CLI.

## Prerequisites

1. **Install beads CLI:**
   ```bash
   curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
   ```

2. **Initialize beads in your project:**
   ```bash
   bd init
   ```

## Installation

```bash
cd server
npm install
```

## Usage

### Start the server:
```bash
npm start
```

### Development mode (auto-reload):
```bash
npm run dev
```

The server runs on `http://localhost:3001` by default. Change the port with:
```bash
BEADS_PORT=3002 npm start
```

## How It Works

1. The server wraps `bd` CLI commands and exposes them as REST APIs
2. All `bd` commands are executed with `--json` flag for structured output
3. The web UI makes HTTP requests to this server
4. AI agents continue using `bd` CLI directly - both read/write to the same `.beads/` database

## API Endpoints

- `GET /health` - Health check
- `GET /api/issues` - List all issues
- `GET /api/issues/:id` - Get single issue
- `POST /api/issues` - Create issue
- `PATCH /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue
- `POST /api/issues/:id/dependencies` - Add dependency
- `GET /api/ready` - Get ready issues (no blockers)

## Environment Variables

- `BEADS_PORT` - Server port (default: 3001)

## Integration with Web UI

The web UI automatically connects to `http://localhost:3001/api` by default. To use a different URL, set:

```bash
VITE_BEADS_API_URL=http://localhost:3002/api
```

## For AI Agents

AI agents should use `bd` CLI directly:

```bash
# List ready work
bd ready --json

# Claim an issue
bd assign bd-a1b2 "AI Agent Name"

# Start work
bd update bd-a1b2 --status in_progress

# Complete work
bd update bd-a1b2 --status done
```

No need to interact with the server - the CLI and web UI share the same database.
