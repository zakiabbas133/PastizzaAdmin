import { Box, Typography, Button } from '@mui/material';
import { commonTokens } from '../theme/tokens';

const PageHeader = ({
  title,
  description = '',
  action = null,
  actionLabel = 'Action',
  actionIcon = null,
}) => {

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: commonTokens.spacing.xxl,
        flexWrap: 'wrap',
        gap: commonTokens.spacing.lg,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            marginBottom: description ? commonTokens.spacing.md : 0,
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        )}
      </Box>

      {action && (
        <Button
          variant="contained"
          onClick={action}
          startIcon={actionIcon}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
