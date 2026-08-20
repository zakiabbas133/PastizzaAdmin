import { Box, Skeleton, Card, CardContent, Grid, useTheme } from '@mui/material';
import { commonTokens } from '../theme/tokens';

const LoadingState = ({ variant = 'table', count = 4 }) => {
  const theme = useTheme();

  if (variant === 'card-grid') {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Skeleton variant="rectangular" height={200} sx={{ marginBottom: commonTokens.spacing.lg }} />
                <Skeleton variant="text" height={24} sx={{ marginBottom: commonTokens.spacing.md }} />
                <Skeleton variant="text" height={20} width="80%" sx={{ marginBottom: commonTokens.spacing.lg }} />
                <Skeleton variant="rectangular" height={36} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (variant === 'table') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              gap: commonTokens.spacing.lg,
              padding: commonTokens.spacing.lg,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" height={20} sx={{ marginBottom: commonTokens.spacing.md }} />
              <Skeleton variant="text" height={16} width="60%" />
            </Box>
            <Skeleton variant="rectangular" width={100} height={32} />
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'chart') {
    return (
      <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent>
          <Skeleton variant="text" height={24} width="200px" sx={{ marginBottom: commonTokens.spacing.lg }} />
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default LoadingState;
