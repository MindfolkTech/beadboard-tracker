// Beads Bridge Server - Connects Web UI to bd CLI
// Lightweight Express server that wraps bd commands
import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.BEADS_PORT || 3001;

app.use(cors());
app.use(express.json());

// Execute bd command and return JSON
async function executeBd(args) {
  return new Promise((resolve, reject) => {
    const bd = spawn('bd', [...args, '--json'], {
      cwd: path.join(__dirname, '..'),
    });

    let stdout = '';
    let stderr = '';

    bd.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    bd.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    bd.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `bd command failed with code ${code}`));
        return;
      }

      try {
        const result = stdout.trim() ? JSON.parse(stdout) : {};
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse bd output: ${error.message}`));
      }
    });
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'beads-bridge' });
});

// List all issues
app.get('/api/issues', async (req, res) => {
  try {
    const args = ['list'];
    if (req.query.status) args.push('--status', req.query.status);
    if (req.query.priority) args.push('--priority', req.query.priority);
    if (req.query.assignee) args.push('--assignee', req.query.assignee);
    
    const result = await executeBd(args);
    res.json(result.issues || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single issue
app.get('/api/issues/:id', async (req, res) => {
  try {
    const result = await executeBd(['show', req.params.id]);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Create issue
app.post('/api/issues', async (req, res) => {
  try {
    const { title, description, type, priority, assignee, tags } = req.body;
    const args = ['create', title];
    
    if (description) args.push('-d', description);
    if (type) args.push('-t', type);
    if (priority !== undefined) args.push('-p', priority.toString());
    if (assignee) args.push('-a', assignee);
    if (tags && tags.length) args.push('-l', tags.join(','));
    
    const result = await executeBd(args);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update issue
app.patch('/api/issues/:id', async (req, res) => {
  try {
    const { status, priority, assignee, title, description } = req.body;
    const id = req.params.id;
    
    // Build update args array
    const updateArgs = ['update', id];
    
    if (status) updateArgs.push('-s', status);
    if (priority !== undefined) updateArgs.push('-p', priority.toString());
    if (assignee) updateArgs.push('-a', assignee);
    if (title) updateArgs.push('--title', title);
    if (description) updateArgs.push('-d', description);
    
    // Execute single update command with all changes
    if (updateArgs.length > 2) {
      await executeBd(updateArgs);
    }
    
    // Get updated issue
    const result = await executeBd(['show', id]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete issue
app.delete('/api/issues/:id', async (req, res) => {
  try {
    await executeBd(['delete', req.params.id, '-f']);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add dependency
app.post('/api/issues/:id/dependencies', async (req, res) => {
  try {
    const { type, targetId } = req.body;
    const args = ['link', req.params.id];
    
    switch (type) {
      case 'blocks':
        args.push('--blocks', targetId);
        break;
      case 'parent':
        args.push('--parent', targetId);
        break;
      case 'related':
        args.push('--related', targetId);
        break;
      default:
        throw new Error(`Unknown dependency type: ${type}`);
    }
    
    await executeBd(args);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ready issues
app.get('/api/ready', async (req, res) => {
  try {
    const result = await executeBd(['ready']);
    res.json(result.issues || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Beads Bridge Server running on http://localhost:${PORT}`);
  console.log('Connecting web UI to bd CLI...');
});
