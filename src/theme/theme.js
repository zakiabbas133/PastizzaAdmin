import { createTheme } from '@mui/material/styles';
import { lightTokens, darkTokens, commonTokens } from './tokens';

const createCustomTheme = (mode = 'light') => {
  const tokens = mode === 'light' ? lightTokens : darkTokens;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: tokens.primary.main,
        light: tokens.primary.light,
        dark: tokens.primary.dark,
        contrastText: tokens.primary.contrast,
      },
      secondary: {
        main: tokens.secondary.main,
        light: tokens.secondary.light,
        dark: tokens.secondary.dark,
        contrastText: tokens.secondary.contrast,
      },
      success: {
        main: tokens.success.main,
        light: tokens.success.light,
        dark: tokens.success.dark,
      },
      warning: {
        main: tokens.warning.main,
        light: tokens.warning.light,
        dark: tokens.warning.dark,
      },
      error: {
        main: tokens.error.main,
        light: tokens.error.light,
        dark: tokens.error.dark,
      },
      info: {
        main: tokens.info.main,
        light: tokens.info.light,
        dark: tokens.info.dark,
      },
      background: {
        default: tokens.background.main,
        paper: tokens.surface.main,
      },
      text: {
        primary: tokens.text.primary,
        secondary: tokens.text.secondary,
        disabled: tokens.text.disabled,
      },
      divider: tokens.surface.border,
    },
    typography: {
      fontFamily: commonTokens.typography.fontFamily.primary,
      fontSize: 14,
      fontWeightLight: commonTokens.typography.fontWeight.light,
      fontWeightRegular: commonTokens.typography.fontWeight.normal,
      fontWeightMedium: commonTokens.typography.fontWeight.medium,
      fontWeightBold: commonTokens.typography.fontWeight.bold,
      h1: {
        fontSize: commonTokens.typography.fontSize['7xl'],
        fontWeight: commonTokens.typography.fontWeight.bold,
        lineHeight: commonTokens.lineHeight.tight,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: commonTokens.typography.fontSize['6xl'],
        fontWeight: commonTokens.typography.fontWeight.bold,
        lineHeight: commonTokens.lineHeight.tight,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: commonTokens.typography.fontSize['5xl'],
        fontWeight: commonTokens.typography.fontWeight.bold,
        lineHeight: commonTokens.lineHeight.snug,
      },
      h4: {
        fontSize: commonTokens.typography.fontSize['4xl'],
        fontWeight: commonTokens.typography.fontWeight.bold,
        lineHeight: commonTokens.lineHeight.snug,
      },
      h5: {
        fontSize: commonTokens.typography.fontSize['3xl'],
        fontWeight: commonTokens.typography.fontWeight.semibold,
        lineHeight: commonTokens.lineHeight.snug,
      },
      h6: {
        fontSize: commonTokens.typography.fontSize['2xl'],
        fontWeight: commonTokens.typography.fontWeight.semibold,
        lineHeight: commonTokens.lineHeight.normal,
      },
      subtitle1: {
        fontSize: commonTokens.typography.fontSize.xl,
        fontWeight: commonTokens.typography.fontWeight.medium,
        lineHeight: commonTokens.lineHeight.normal,
      },
      subtitle2: {
        fontSize: commonTokens.typography.fontSize.lg,
        fontWeight: commonTokens.typography.fontWeight.medium,
        lineHeight: commonTokens.lineHeight.normal,
      },
      body1: {
        fontSize: commonTokens.typography.fontSize.base,
        lineHeight: commonTokens.lineHeight.normal,
      },
      body2: {
        fontSize: commonTokens.typography.fontSize.sm,
        lineHeight: commonTokens.lineHeight.normal,
      },
      button: {
        fontSize: commonTokens.typography.fontSize.base,
        fontWeight: commonTokens.typography.fontWeight.medium,
        textTransform: 'none',
        letterSpacing: '0',
      },
      caption: {
        fontSize: commonTokens.typography.fontSize.xs,
        lineHeight: commonTokens.lineHeight.normal,
      },
    },
    shape: {
      borderRadius: parseInt(commonTokens.radius.md),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: commonTokens.radius.md,
            textTransform: 'none',
            fontWeight: commonTokens.typography.fontWeight.medium,
            transition: commonTokens.transitions.base,
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            boxShadow: tokens.shadows.base,
            '&:hover': {
              boxShadow: tokens.shadows.md,
            },
          },
          outlined: {
            borderColor: tokens.surface.border,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.card,
            borderColor: tokens.surface.border,
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: tokens.shadows.base,
            transition: commonTokens.transitions.base,
            '&:hover': {
              boxShadow: tokens.shadows.md,
              backgroundColor: tokens.cardHover,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation0: {
            boxShadow: 'none',
          },
          elevation1: {
            boxShadow: tokens.shadows.base,
          },
          elevation2: {
            boxShadow: tokens.shadows.md,
          },
          elevation3: {
            boxShadow: tokens.shadows.lg,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: commonTokens.radius.md,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: commonTokens.radius.md,
            transition: commonTokens.transitions.base,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.primary.main,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.header,
            color: tokens.text.primary,
            boxShadow: tokens.shadows.sm,
            borderBottom: `1px solid ${tokens.surface.border}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: tokens.sidebar,
            borderRight: `1px solid ${tokens.surface.border}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: commonTokens.radius.md,
            margin: `0 ${commonTokens.spacing.md}`,
            '&.Mui-selected': {
              backgroundColor: tokens.primary.main,
              color: tokens.text.onPrimary,
              '&:hover': {
                backgroundColor: tokens.primary.dark,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: commonTokens.radius.md,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: commonTokens.radius.lg,
            boxShadow: tokens.shadows.xl,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: commonTokens.radius.lg,
            boxShadow: tokens.shadows.xl,
            marginTop: commonTokens.spacing.md,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
            fontSize: commonTokens.typography.fontSize.xs,
            borderRadius: commonTokens.radius.md,
          },
        },
      },
    },
  });
};

export default createCustomTheme;
