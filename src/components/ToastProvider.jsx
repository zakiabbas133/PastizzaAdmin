import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { commonTokens } from '../theme/tokens';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const showSuccess = useCallback((message, duration = 4000) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message, duration = 4000) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const showWarning = useCallback((message, duration = 4000) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration = 4000) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer = ({ toasts, onClose }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: commonTokens.spacing.lg,
        right: commonTokens.spacing.lg,
        zIndex: commonTokens.zIndex.tooltip,
        display: 'flex',
        flexDirection: 'column',
        gap: commonTokens.spacing.md,
        pointerEvents: 'none',
        '& > *': {
          pointerEvents: 'auto',
        },
      }}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </Box>
  );
};

// Individual Toast Item
const ToastItem = ({ toast, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: '20px' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: '20px' }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: '20px' }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: '20px' }} />;
      default:
        return null;
    }
  };

  return (
    <Snackbar
      open={true}
      autoHideDuration={toast.duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={toast.type}
        icon={getIcon(toast.type)}
        sx={{
          minWidth: '300px',
          borderRadius: commonTokens.radius.md,
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export { ToastProvider as default };
export { ToastProvider };
