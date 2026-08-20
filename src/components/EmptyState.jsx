import { Box, Typography, Button, useTheme, alpha } from '@mui/material';
import { commonTokens } from '../theme/tokens';

const EmptyState = ({
  title = 'No data found',
  description = 'There is no data to display at the moment.',
  icon: Icon = null,
  action = null,
  actionLabel = 'Get started'
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
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        border: `1px dashed ${theme.palette.divider}`,
        minHeight: '300px',
      }}
    >
      {Icon && (
        <Box
          sx={{
            marginBottom: commonTokens.spacing.lg,
            color: theme.palette.text.secondary,
          }}
        >
          <Icon sx={{ fontSize: '64px', opacity: 0.5 }} />
        </Box>
      )}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          marginBottom: commonTokens.spacing.md,
          color: theme.palette.text.primary,
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
          onClick={action}
          size="small"
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
