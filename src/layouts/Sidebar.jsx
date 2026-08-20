import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';

import { motion, AnimatePresence } from 'framer-motion';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';

import { commonTokens } from '../theme/tokens';

// ============================================================
// NAVIGATION ITEMS
// ============================================================

const navigationItems = [
  {
    label: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
  },
  {
    label: 'Analytics',
    icon: AnalyticsIcon,
    path: '/analytics',
  },
  {
    label: 'Products',
    icon: InventoryIcon,
    path: '/products',
  },
  {
    label: 'Orders',
    icon: ShoppingCartIcon,
    path: '/orders',
  },
  {
    label: 'Settings',
    icon: SettingsIcon,
    path: '/settings',
  },
];

const supportItems = [
  {
    label: 'Help & Support',
    icon: HelpIcon,
    path: '/help',
  },
];

// ============================================================
// SIDEBAR NAV ITEM
// ============================================================

const SidebarNavItem = ({
  item,
  open,
  isActive,
  onNavigate,
}) => {
  const theme = useTheme();

  const handleClick = () => {
    onNavigate(item.path);
  };

  return (
    <Tooltip
      title={!open ? item.label : ''}
      placement="right"
      arrow
      disableHoverListener={open}
    >
      <ListItemButton
        onClick={handleClick}
        selected={isActive}
        sx={{
          position: 'relative',

          borderRadius: commonTokens.radius.md,

          mx: {
            xs: 1,
            sm: commonTokens.spacing.md,
          },

          my: 0.5,

          px: open ? 1.5 : 1,

          minHeight: 42,

          justifyContent: open
            ? 'flex-start'
            : 'center',

          transition: commonTokens.transitions.base,

          overflow: 'hidden',

          '&.Mui-selected': {
            backgroundColor:
              theme.palette.primary.main,

            color:
              theme.palette.primary.contrastText,

            '&:hover': {
              backgroundColor:
                theme.palette.primary.dark,
            },

            '& .MuiListItemIcon-root': {
              color:
                theme.palette.primary.contrastText,
            },

            '& .notification-badge': {
              backgroundColor:
                theme.palette.background.paper,

              color:
                theme.palette.primary.main,
            },
          },

          '&:hover': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              0.1
            ),
          },

          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        {/* ICON */}

        <ListItemIcon
          sx={{
            minWidth: open ? 36 : 0,

            width: open ? 36 : 'auto',

            display: 'flex',

            justifyContent: 'center',

            alignItems: 'center',

            flexShrink: 0,

            color: 'inherit',

            transition: commonTokens.transitions.base,
          }}
        >
          {React.createElement(item.icon, {
            fontSize: 'small',
          })}
        </ListItemIcon>

        {/* LABEL + BADGE */}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                width: 0,
              }}
              animate={{
                opacity: 1,
                width: 'auto',
              }}
              exit={{
                opacity: 0,
                width: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  minWidth: 0,
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    minWidth: 0,
                    flex: 1,

                    '& .MuiTypography-root': {
                      fontSize:
                        commonTokens.typography.fontSize.sm,

                      fontWeight:
                        commonTokens.typography.fontWeight.medium,

                      whiteSpace: 'nowrap',

                      overflow: 'hidden',

                      textOverflow: 'ellipsis',
                    },
                  }}
                />

                {item.badge && (
                  <Box
                    className="notification-badge"
                    sx={{
                      flexShrink: 0,

                      ml: commonTokens.spacing.md,

                      minWidth: 20,
                      height: 20,

                      display: 'flex',

                      alignItems: 'center',
                      justifyContent: 'center',

                      backgroundColor:
                        theme.palette.error.main,

                      color: '#fff',

                      borderRadius:
                        commonTokens.radius.full,

                      px: 0.6,

                      fontSize:
                        commonTokens.typography.fontSize.xs,

                      fontWeight:
                        commonTokens.typography.fontWeight.bold,
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COLLAPSED BADGE */}

        {!open && item.badge && (
          <Box
            sx={{
              position: 'absolute',

              top: 5,
              right: 5,

              width: 8,
              height: 8,

              borderRadius: '50%',

              backgroundColor:
                theme.palette.error.main,

              border: `2px solid ${theme.palette.background.paper}`,
            }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );
};

// ============================================================
// SIDEBAR
// ============================================================

const Sidebar = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // IMPORTANT:
  // Sidebar determines mobile state itself.
  const isMobile = useMediaQuery(
    theme.breakpoints.down('md')
  );

  const expandedWidth = 280;
  const collapsedWidth = 76;

  const sidebarWidth = open
    ? expandedWidth
    : collapsedWidth;

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleNavigate = (path) => {
    navigate(path);

    if (isMobile && onClose) {
      onClose();
    }
  };

  // ==========================================================
  // LOGO
  // ==========================================================

  const handleLogoClick = () => {
    navigate('/dashboard');

    if (isMobile && onClose) {
      onClose();
    }
  };

  // ==========================================================
  // SIDEBAR CONTENT
  // ==========================================================

  const sidebarContent = (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',

        backgroundColor:
          theme.palette.background.paper,

        color:
          theme.palette.text.primary,
      }}
    >
      {/* LOGO */}

      <Box
        sx={{
          height: 72,

          flexShrink: 0,

          display: 'flex',

          alignItems: 'center',

          justifyContent: open
            ? 'flex-start'
            : 'center',

          px: open
            ? commonTokens.spacing.md
            : 0,

          borderBottom:
            `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',

            alignItems: 'center',

            justifyContent: open
              ? 'flex-start'
              : 'center',

            gap: commonTokens.spacing.md,

            cursor: 'pointer',

            minWidth: 0,

            userSelect: 'none',
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,

              flexShrink: 0,

              borderRadius:
                commonTokens.radius.md,

              background:
                theme.palette.primary.main,

              display: 'flex',

              alignItems: 'center',
              justifyContent: 'center',

              color:
                theme.palette.primary.contrastText,

              fontWeight:
                commonTokens.typography.fontWeight.bold,

              fontSize: 18,

              boxShadow:
                `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.25
                )}`,
            }}
          >
            P
          </Box>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                }}
                transition={{
                  duration: 0.2,
                }}
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight:
                      commonTokens.typography.fontWeight.bold,

                    fontSize:
                      commonTokens.typography.fontSize.lg,

                    whiteSpace: 'nowrap',
                  }}
                >
                  Pastizza
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* MAIN NAVIGATION */}

      <Box
        sx={{
          flex: 1,

          minHeight: 0,

          overflowY: 'auto',
          overflowX: 'hidden',

          py: 1,

          '&::-webkit-scrollbar': {
            width: 5,
          },

          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },

          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(
              theme.palette.text.primary,
              0.15
            ),

            borderRadius: 10,
          },

          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(
              theme.palette.text.primary,
              0.25
            ),
          },

          scrollbarWidth: 'thin',
        }}
      >
        <List
          disablePadding
          sx={{
            width: '100%',
          }}
        >
          {navigationItems.map((item) => {
            const isActive =
              location.pathname === item.path;

            return (
              <SidebarNavItem
                key={item.path}
                item={item}
                open={open}
                isActive={isActive}
                onNavigate={handleNavigate}
              />
            );
          })}
        </List>
      </Box>

      {/* BOTTOM SECTION */}

      <Box
        sx={{
          flex: 0,

          borderTop:
            `1px solid ${theme.palette.divider}`,

          pt: 1,
          pb: 1,
        }}
      >
        <List
          disablePadding
          sx={{
            width: '100%',
          }}
        >
          {supportItems.map((item) => {
            const isActive =
              location.pathname === item.path;

            return (
              <SidebarNavItem
                key={item.path}
                item={item}
                open={open}
                isActive={isActive}
                onNavigate={handleNavigate}
              />
            );
          })}
        </List>
      </Box>
    </Box>
  );

  // ==========================================================
  // MOBILE SIDEBAR
  // ==========================================================

  // ==========================================================
  // MOBILE SIDEBAR
  // ==========================================================

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            {/* ================================================
              BACKDROP
          ================================================= */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                inset: 0,

                backgroundColor:
                  'rgba(0, 0, 0, 0.5)',

                zIndex:
                  commonTokens.zIndex.offcanvas - 1,

                backdropFilter: 'blur(2px)',
              }}
            />

            {/* ================================================
              MOBILE SIDEBAR
          ================================================= */}

            <motion.div
              initial={{
                x: -expandedWidth,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -expandedWidth,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              style={{
                position: 'fixed',

                left: 0,
                top: 0,

                width: expandedWidth,

                height: '100dvh',

                zIndex:
                  commonTokens.zIndex.offcanvas,

                maxWidth: '85vw',

                overflow: 'hidden',

                backgroundColor:
                  theme.palette.background.paper,

                boxShadow:
                  '4px 0 24px rgba(0, 0, 0, 0.15)',
              }}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // ==========================================================
  // DESKTOP SIDEBAR
  // ==========================================================

  return (
    <motion.div
      initial={false}
      animate={{
        width: sidebarWidth,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      style={{
        height: '100%',

        flexShrink: 0,

        overflow: 'hidden',

        borderRight:
          `1px solid ${theme.palette.divider}`,
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,

          flexShrink: 0,

          '& .MuiDrawer-paper': {
            width: sidebarWidth,

            boxSizing: 'border-box',

            position: 'relative',

            height: '100%',

            border: 'none',

            overflow: 'hidden',

            backgroundColor:
              theme.palette.background.paper,

            transition:
              'width 0.3s ease-in-out',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </motion.div>
  );
};

export default Sidebar;