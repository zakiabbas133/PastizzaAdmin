import { useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Typography,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import { useTheme as useCustomTheme } from '../theme';
import { commonTokens } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const Header = ({ onMenuClick, sidebarOpen }) => {
  const theme = useTheme();
  const { mode, toggleTheme } = useCustomTheme();
  const { logout } = useAuth();
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleUserClick = (event) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: commonTokens.zIndex.sticky,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${commonTokens.spacing.md} ${commonTokens.spacing.lg}`,
          height: '64px',
        }}
      >
        {/* Left side - Menu & Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: commonTokens.spacing.lg }}>
          <Tooltip title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            <IconButton
              onClick={onMenuClick}
              size="small"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          {/* Search */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: commonTokens.radius.md,
              border: `1px solid ${theme.palette.divider}`,
              padding: `4px ${commonTokens.spacing.md}`,
              gap: commonTokens.spacing.md,
              width: '280px',
              transition: commonTokens.transitions.base,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
              '&:focus-within': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', fontSize: '18px' }} />
            <InputBase
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                '& input': {
                  padding: 0,
                  fontSize: commonTokens.typography.fontSize.sm,
                },
              }}
            />
          </Box>
        </Box>

        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: commonTokens.spacing.md }}>
          {/* Theme Toggle */}
          <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <Tooltip title="Profile">
            <IconButton
              onClick={handleUserClick}
              size="small"
              sx={{
                padding: '4px',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.secondary.main,
                  fontSize: commonTokens.typography.fontSize.sm,
                }}
              >
                AD
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Menu
            anchorEl={userAnchor}
            open={Boolean(userAnchor)}
            onClose={handleUserClose}
            PaperProps={{
              sx: {
                width: '200px',
              },
            }}
          >
            <MenuItem>
              <PersonIcon sx={{ marginRight: commonTokens.spacing.md, fontSize: '18px' }} />
              Profile
            </MenuItem>
            <MenuItem>
              <SettingsIcon sx={{ marginRight: commonTokens.spacing.md, fontSize: '18px' }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>
              <LogoutIcon sx={{ marginRight: commonTokens.spacing.md, fontSize: '18px' }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
