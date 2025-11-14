import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Core brand colors
        'jovial-jade': 'hsl(var(--jovial-jade))',
        'garden-green': 'hsl(var(--garden-green))',
        'elated-emerald': 'hsl(var(--elated-emerald))',
        
        // Surface & background
        'warm-white': 'hsl(var(--warm-white))',
        'surface': 'hsl(var(--surface))',
        'surface-accent': 'hsl(var(--surface-accent))',
        
        // Text & border
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-muted': 'hsl(var(--text-muted))',
        'ink-slate': 'hsl(var(--ink-slate))',
        'on-dark': 'hsl(var(--on-dark))',
        'text-black': 'hsl(var(--text-black))',
        'border': 'hsl(var(--border))',
        
        // Button colors
        'btn-primary': {
          DEFAULT: 'hsl(var(--btn-primary-bg))',
          foreground: 'hsl(var(--btn-primary-text))',
        },
        'btn-secondary': {
          DEFAULT: 'hsl(var(--btn-secondary-bg))',
          foreground: 'hsl(var(--btn-secondary-text))',
        },
        'btn-accent': {
          DEFAULT: 'hsl(var(--btn-accent-bg))',
          foreground: 'hsl(var(--btn-accent-text))',
        },
        
        // Tag system
        'tag-personality': {
          DEFAULT: 'hsl(var(--tag-personality-bg))',
          foreground: 'hsl(var(--tag-personality-text))',
        },
        'tag-modality': {
          DEFAULT: 'hsl(var(--tag-modality-bg))',
          foreground: 'hsl(var(--tag-modality-text))',
        },
        'tag-specialty': {
          DEFAULT: 'hsl(var(--tag-specialty-bg))',
          foreground: 'hsl(var(--tag-specialty-text))',
        },
        'tag-language': {
          DEFAULT: 'hsl(var(--tag-language-bg))',
          foreground: 'hsl(var(--tag-language-text))',
        },
        
        // Status colors
        'status-blocked': 'hsl(var(--status-blocked))',
        'status-blocked-bg': 'hsl(var(--status-blocked-bg))',
        'status-ready': 'hsl(var(--status-ready))',
        'status-ready-bg': 'hsl(var(--status-ready-bg))',
        'status-in-progress': 'hsl(var(--status-in-progress))',
        'status-in-progress-bg': 'hsl(var(--status-in-progress-bg))',
        'status-closed': 'hsl(var(--status-closed))',
        'status-closed-bg': 'hsl(var(--status-closed-bg))',
        
        // Issue type colors
        'type-bug': 'hsl(var(--type-bug))',
        'type-bug-bg': 'hsl(var(--type-bug-bg))',
        'type-feature': 'hsl(var(--type-feature))',
        'type-feature-bg': 'hsl(var(--type-feature-bg))',
        'type-task': 'hsl(var(--type-task))',
        'type-task-bg': 'hsl(var(--type-task-bg))',
        'type-epic': 'hsl(var(--type-epic))',
        'type-epic-bg': 'hsl(var(--type-epic-bg))',
        
        // Overlay
        'modal-backdrop': 'hsl(var(--modal-backdrop))',
        
        // System messages
        'success': {
          DEFAULT: 'hsl(var(--success-bg))',
          foreground: 'hsl(var(--success-text))',
        },
        'warning': {
          DEFAULT: 'hsl(var(--warning-bg))',
          foreground: 'hsl(var(--warning-text))',
        },
        'error': {
          DEFAULT: 'hsl(var(--error-bg))',
          foreground: 'hsl(var(--error-text))',
        },
        'info': {
          DEFAULT: 'hsl(var(--info-bg))',
          foreground: 'hsl(var(--info-text))',
        },
        
        // Legacy mappings for shadcn compatibility
        background: "hsl(var(--warm-white))",
        foreground: "hsl(var(--text-primary))",
        primary: {
          DEFAULT: "hsl(var(--jovial-jade))",
          foreground: "hsl(var(--on-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--surface-accent))",
          foreground: "hsl(var(--text-primary))",
        },
        muted: {
          DEFAULT: "hsl(var(--surface-accent))",
          foreground: "hsl(var(--text-muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--garden-green))",
          foreground: "hsl(var(--on-dark))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
