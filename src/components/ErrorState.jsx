import { Box, Typography, Button, useTheme, alpha } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { commonTokens } from '../theme/tokens';

const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error while loading this data.',
  action = null,
  actionLabel = 'Try Again'
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: commonTokens.spacing.xxxl,
        textAlign: 'center',
        borderRadius: commonTokens.radius.lg,
        backgroundColor: alpha(theme.palette.error.main, 0.05),
        border: `1px dashed ${theme.palette.error.main}`,
        minHeight: '300px',
      }}
    >
      <Box
        sx={{
          marginBottom: commonTokens.spacing.lg,
          color: theme.palette.error.main,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: '64px', opacity: 0.8 }} />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          marginBottom: commonTokens.spacing.md,
          color: theme.palette.error.main,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          marginBottom: commonTokens.spacing.lg,
          maxWidth: '400px',
        }}
      >
        {description}
      </Typography>

      {action && (
        <Button
          variant="contained"
          color="error"
          onClick={action}
          size="small"
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
