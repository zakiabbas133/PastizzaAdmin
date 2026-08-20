import { Chip } from '@mui/material';

const StatusBadge = ({ status, variant = 'outlined', size = 'small' }) => {
  const theme = useTheme();

  const statusColorMap = {
    active: 'success',
    inactive: 'warning',
    pending: 'info',
    completed: 'success',
    processing: 'info',
    cancelled: 'error',
    suspended: 'error',
    draft: 'default',
  };

  const color = statusColorMap[status?.toLowerCase()] || 'default';

  return (
    <Chip
      label={status}
      color={color}
      variant={variant}
      size={size}
      sx={{
        fontWeight: '600',
        textTransform: 'capitalize',
      }}
    />
  );
};

export default StatusBadge;
