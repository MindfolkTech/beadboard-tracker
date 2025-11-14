import { X, Zap } from '@/lib/icons';
import { useState } from 'react';

export function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('beads_welcome_dismissed') === 'true';
  });

  const handleDismiss = () => {
    localStorage.setItem('beads_welcome_dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="bg-success p-4 border-b border-border">
      <div className="max-w-4xl mx-auto flex items-start gap-4">
        <Zap className="h-5 w-5 text-success-text flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-success-text mb-1">
            Welcome to Beads!
          </h3>
          <p className="text-sm text-success-text opacity-90">
            A lightweight issue tracker designed for AI coding agents. Press <kbd className="px-1.5 py-0.5 rounded bg-surface-accent text-xs font-mono">⌘K</kbd> to create an issue, 
            or click any issue to view details. This system is built to be embedded in your existing projects.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-success-text hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
