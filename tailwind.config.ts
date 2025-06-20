import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        // === Neat Design System Colors ===
        // Primary Purple Gradient
        primary: {
          50: '#faf5ff',   // hsl(270, 100%, 98%)
          100: '#f3e8ff',  // hsl(270, 87%, 95%)
          200: '#e9d5ff',  // hsl(270, 95%, 90%)
          300: '#d8b4fe',  // hsl(270, 93%, 82%)
          400: '#c084fc',  // hsl(270, 90%, 70%)
          500: '#a855f7',  // hsl(270, 85%, 60%) - Primary brand
          600: '#9333ea',  // hsl(270, 80%, 50%) - Active states
          700: '#7c3aed',  // hsl(270, 75%, 42%)
          800: '#6b21a8',  // hsl(270, 70%, 35%)
          900: '#581c87',  // hsl(270, 65%, 28%)
          950: '#3b0764',  // hsl(270, 60%, 18%)
          // Legacy HSL variables for backward compatibility
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Secondary Blue Gradient  
        secondary: {
          50: '#eff6ff',   // hsl(220, 100%, 98%)
          100: '#dbeafe',  // hsl(220, 87%, 95%)
          200: '#bfdbfe',  // hsl(220, 95%, 90%)
          300: '#93c5fd',  // hsl(220, 93%, 82%)
          400: '#60a5fa',  // hsl(220, 90%, 70%)
          500: '#3b82f6',  // hsl(220, 85%, 60%) - Secondary brand
          600: '#2563eb',  // hsl(220, 80%, 50%)
          700: '#1d4ed8',  // hsl(220, 75%, 42%)
          800: '#1e40af',  // hsl(220, 70%, 35%)
          900: '#1e3a8a',  // hsl(220, 65%, 28%)
          950: '#172554',  // hsl(220, 60%, 18%)
          // Legacy HSL variables for backward compatibility
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Semantic Colors
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          // Legacy HSL variables for backward compatibility
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          // Legacy HSL variables for backward compatibility
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Legacy shadcn/ui colors for backward compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--surface-foreground))",
          elevated: "hsl(var(--surface-elevated))",
          hover: "hsl(var(--surface-hover))",
        },
        hover: "hsl(var(--hover))",
        active: "hsl(var(--active))",
        focus: "hsl(var(--focus))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
        },
        "form-background": "hsl(var(--form-background))",
        "form-field": {
          background: "hsl(var(--form-field-background))",
          border: "hsl(var(--form-field-border))",
          hover: "hsl(var(--form-field-hover))",
        },
        status: {
          active: "hsl(var(--status-active))",
          inactive: "hsl(var(--status-inactive))",
          pending: "hsl(var(--status-pending))",
          error: "hsl(var(--status-error))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // === Neat Design System Extensions ===
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      // Neat Spacing (8pt grid)
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },
      // Neat Shadows
      boxShadow: {
        'neat-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'neat-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'neat-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'neat-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'primary': '0 4px 12px rgba(139, 92, 246, 0.15)',
        'success': '0 4px 12px rgba(34, 197, 94, 0.15)',
        'warning': '0 4px 12px rgba(251, 146, 60, 0.15)',
        'error': '0 4px 12px rgba(239, 68, 68, 0.15)',
      },
      // Neat Transitions
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'neat-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'neat-in': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'neat-in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'neat-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // === Neat Design System Keyframes ===
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(1rem)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          'from': { transform: 'translateX(100%)' },
          'to': { transform: 'translateX(0)' },
        },
        pulseNeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        bounceNeat: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // === Neat Design System Animations ===
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-neat': 'pulseNeat 2s infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'bounce-neat': 'bounceNeat 1s infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
