import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { commonTokens } from '../theme/tokens';
import Sidebar from './Sidebar';
import Header from './Header';

const AppShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // On mobile, default to closed sidebar
  const effectiveSidebarOpen = isMobile ? false : sidebarOpen;

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleMenuClick = () => {
    setSidebarOpen((previous) => !previous);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Header
          onMenuClick={handleMenuClick}
          sidebarOpen={sidebarOpen}
        />

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              flex: 1,
              padding: {
                xs: commonTokens.spacing.md,
                sm: commonTokens.spacing.lg,
                md: commonTokens.spacing.xl,
              },
              maxWidth: '1920px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;
