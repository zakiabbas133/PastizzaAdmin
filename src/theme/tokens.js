// Design System Color Tokens
// This file defines all color tokens for both light and dark themes
// These tokens ensure visual consistency across the application

export const lightTokens = {
  // Primary brand colors
  primary: {
    main: '#2563eb', // Blue
    light: '#3b82f6',
    lighter: '#60a5fa',
    dark: '#1e40af',
    darker: '#1e3a8a',
    contrast: '#ffffff',
  },

  // Secondary colors
  secondary: {
    main: '#8b5cf6', // Purple
    light: '#a78bfa',
    lighter: '#c4b5fd',
    dark: '#7c3aed',
    darker: '#6d28d9',
    contrast: '#ffffff',
  },

  // Accent color
  accent: {
    main: '#06b6d4', // Cyan
    light: '#22d3ee',
    lighter: '#67e8f9',
    dark: '#0891b2',
    darker: '#164e63',
  },

  // Semantic colors
  success: {
    main: '#10b981',
    light: '#34d399',
    lighter: '#a7f3d0',
    dark: '#059669',
    darker: '#047857',
    bg: '#f0fdf4',
    text: '#065f46',
  },

  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    lighter: '#fcd34d',
    dark: '#d97706',
    darker: '#b45309',
    bg: '#fffbeb',
    text: '#92400e',
  },

  error: {
    main: '#ef4444',
    light: '#f87171',
    lighter: '#fecaca',
    dark: '#dc2626',
    darker: '#991b1b',
    bg: '#fef2f2',
    text: '#7f1d1d',
  },

  info: {
    main: '#3b82f6',
    light: '#60a5fa',
    lighter: '#bfdbfe',
    dark: '#1e40af',
    darker: '#1e3a8a',
    bg: '#eff6ff',
    text: '#0c2340',
  },

  // Backgrounds and surfaces
  background: {
    main: '#f9fafb', // Very light gray
    secondary: '#f3f4f6',
    tertiary: '#e5e7eb',
  },

  surface: {
    main: '#ffffff',
    hover: '#f9fafb',
    active: '#f3f4f6',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
  },

  // Text colors
  text: {
    primary: '#111827', // Near black
    secondary: '#4b5563', // Gray
    tertiary: '#9ca3af', // Light gray
    disabled: '#d1d5db',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
  },

  // Additional surfaces
  card: '#ffffff',
  cardHover: '#f9fafb',
  sidebar: '#ffffff',
  header: '#ffffff',

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    subtle: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    elevated: '0 12px 24px -6px rgba(0, 0, 0, 0.12)',
  },
};

export const darkTokens = {
  // Primary brand colors
  primary: {
    main: '#3b82f6', // Lighter blue for dark mode
    light: '#60a5fa',
    lighter: '#93c5fd',
    dark: '#1e40af',
    darker: '#1e3a8a',
    contrast: '#ffffff',
  },

  // Secondary colors
  secondary: {
    main: '#a78bfa', // Lighter purple for dark mode
    light: '#c4b5fd',
    lighter: '#ddd6fe',
    dark: '#7c3aed',
    darker: '#6d28d9',
    contrast: '#ffffff',
  },

  // Accent color
  accent: {
    main: '#22d3ee', // Lighter cyan for dark mode
    light: '#67e8f9',
    lighter: '#a5f3fc',
    dark: '#0891b2',
    darker: '#164e63',
  },

  // Semantic colors
  success: {
    main: '#34d399',
    light: '#6ee7b7',
    lighter: '#a7f3d0',
    dark: '#059669',
    darker: '#047857',
    bg: '#064e3b',
    text: '#86efac',
  },

  warning: {
    main: '#fbbf24',
    light: '#fcd34d',
    lighter: '#fef08a',
    dark: '#d97706',
    darker: '#b45309',
    bg: '#78350f',
    text: '#fde047',
  },

  error: {
    main: '#f87171',
    light: '#fca5a5',
    lighter: '#fecaca',
    dark: '#dc2626',
    darker: '#991b1b',
    bg: '#7f1d1d',
    text: '#fca5a5',
  },

  info: {
    main: '#60a5fa',
    light: '#93c5fd',
    lighter: '#bfdbfe',
    dark: '#1e40af',
    darker: '#1e3a8a',
    bg: '#0c2340',
    text: '#93c5fd',
  },

  // Backgrounds and surfaces
  background: {
    main: '#0f172a', // Deep dark blue-gray
    secondary: '#1e293b', // Slightly lighter
    tertiary: '#334155', // Even lighter
  },

  surface: {
    main: '#1e293b', // Primary surface
    hover: '#334155',
    active: '#475569',
    border: '#334155',
    borderLight: '#475569',
  },

  // Text colors
  text: {
    primary: '#f1f5f9', // Almost white
    secondary: '#cbd5e1', // Light gray
    tertiary: '#94a3b8', // Medium gray
    disabled: '#64748b',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
  },

  // Additional surfaces
  card: '#1e293b',
  cardHover: '#334155',
  sidebar: '#0f172a',
  header: '#1e293b',

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #a78bfa 100%)',
    success: 'linear-gradient(135deg, #34d399 0%, #22d3ee 100%)',
    warning: 'linear-gradient(135deg, #fbbf24 0%, #fb923c 100%)',
    subtle: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
    elevated: '0 12px 24px -6px rgba(0, 0, 0, 0.4)',
  },
};

// Common tokens that work for both themes
export const commonTokens = {
  // Spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },

  // Border radius
  radius: {
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Typography
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Fira Code", "Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      lg: '15px',
      xl: '16px',
      '2xl': '18px',
      '3xl': '20px',
      '4xl': '24px',
      '5xl': '28px',
      '6xl': '32px',
      '7xl': '36px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    offcanvas: 1050,
    modal: 1060,
    popover: 1070,
    tooltip: 1080,
  },

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '768px',
    md: '1024px',
    lg: '1280px',
    xl: '1440px',
    xxl: '1920px',
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};
