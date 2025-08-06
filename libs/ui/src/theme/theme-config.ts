import type { ThemeConfig } from 'antd';

// Color palette
export const colors = {
  // Primary colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Secondary colors
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },

  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
    dark: '#141414',
  },

  // Text colors
  text: {
    primary: '#262626',
    secondary: '#525252',
    tertiary: '#737373',
    disabled: '#a3a3a3',
    inverse: '#ffffff',
  },
} as const;

// Typography scale
export const typography = {
  fontFamily: {
    primary:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing scale
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const;

// Border radius
export const borderRadius = {
  none: '0px',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

// Ant Design theme configuration
export const antdTheme: ThemeConfig = {
  token: {
    // Colors
    colorPrimary: colors.primary[600],
    colorSuccess: colors.success[600],
    colorWarning: colors.warning[600],
    colorError: colors.error[600],
    colorInfo: colors.primary[600],

    // Background colors
    colorBgContainer: colors.background.primary,
    colorBgElevated: colors.background.secondary,
    colorBgLayout: colors.background.tertiary,

    // Text colors
    colorText: colors.text.primary,
    colorTextSecondary: colors.text.secondary,
    colorTextTertiary: colors.text.tertiary,
    colorTextQuaternary: colors.text.disabled,

    // Border colors
    colorBorder: colors.neutral[200],
    colorBorderSecondary: colors.neutral[100],

    // Typography
    fontFamily: typography.fontFamily.primary,
    fontSize: parseInt(typography.fontSize.base),
    fontSizeHeading1: parseInt(typography.fontSize['5xl']),
    fontSizeHeading2: parseInt(typography.fontSize['4xl']),
    fontSizeHeading3: parseInt(typography.fontSize['3xl']),
    fontSizeHeading4: parseInt(typography.fontSize['2xl']),
    fontSizeHeading5: parseInt(typography.fontSize.xl),

    // Border radius
    borderRadius: parseInt(borderRadius.base),
    borderRadiusLG: parseInt(borderRadius.lg),
    borderRadiusSM: parseInt(borderRadius.sm),

    // Spacing
    padding: parseInt(spacing.md),
    paddingLG: parseInt(spacing.lg),
    paddingSM: parseInt(spacing.sm),
    paddingXS: parseInt(spacing.xs),

    // Shadows
    boxShadow: shadows.base,
    boxShadowSecondary: shadows.sm,

    // Animation
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },

  components: {
    Button: {
      borderRadius: parseInt(borderRadius.base),
      fontWeight: typography.fontWeight.medium,
      fontSize: parseInt(typography.fontSize.sm),
      paddingInline: parseInt(spacing.lg),
      paddingBlock: parseInt(spacing.sm),
    },

    Card: {
      borderRadius: parseInt(borderRadius.lg),
      boxShadow: shadows.base,
      paddingLG: parseInt(spacing.lg),
    },

    Input: {
      borderRadius: parseInt(borderRadius.base),
      paddingInline: parseInt(spacing.md),
      paddingBlock: parseInt(spacing.sm),
    },

    Select: {
      borderRadius: parseInt(borderRadius.base),
      paddingInline: parseInt(spacing.md),
      paddingBlock: parseInt(spacing.sm),
    },

    Table: {
      borderRadius: parseInt(borderRadius.lg),
      headerBg: colors.background.secondary,
      headerColor: colors.text.primary,
      rowHoverBg: colors.background.tertiary,
    },

    Modal: {
      borderRadius: parseInt(borderRadius.lg),
      boxShadow: shadows.xl,
    },

    Drawer: {
      boxShadow: shadows.xl,
    },

    Tooltip: {
      borderRadius: parseInt(borderRadius.base),
      boxShadow: shadows.md,
    },

    Notification: {
      borderRadius: parseInt(borderRadius.lg),
      boxShadow: shadows.lg,
    },

    Message: {
      borderRadius: parseInt(borderRadius.base),
      boxShadow: shadows.md,
    },
  },
};

// Export theme utilities
export const getThemeColors = () => colors;
export const getTypography = () => typography;
export const getSpacing = () => spacing;
export const getBorderRadius = () => borderRadius;
export const getShadows = () => shadows;
