import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Grid,
  Button,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { commonTokens } from '../theme/tokens';
import DownloadIcon from '@mui/icons-material/Download';

const chartData = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3000 },
  { month: 'Mar', value: 2000 },
  { month: 'Apr', value: 2780 },
  { month: 'May', value: 1890 },
  { month: 'Jun', value: 2390 },
];

const data = [
  { month: 'Jan', revenue: 4000, orders: 240 },
  { month: 'Feb', revenue: 3000, orders: 221 },
  { month: 'Mar', revenue: 2000, orders: 229 },
  { month: 'Apr', revenue: 2780, orders: 200 },
  { month: 'May', revenue: 1890, orders: 210 },
  { month: 'Jun', revenue: 2390, orders: 229 },
];

const Analytics = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const chartHeight = isMobile ? 240 : isTablet ? 280 : 320;

  const axisFontSize = isMobile ? 10 : 12;

  const tooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 10,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[4],
  };

  const cardSx = {
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 3,
    overflow: 'hidden',
  };

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            gap: 2,
            mb: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: {
                  xs: '1.75rem',
                  sm: '2rem',
                  md: '2.125rem',
                },
                lineHeight: 1.2,
              }}
            >
              Analytics
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.875rem',
                },
              }}
            >
              Track your business performance and metrics.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              flexShrink: 0,
              width: {
                xs: '100%',
                sm: 'auto',
              },
              minHeight: 42,
              whiteSpace: 'nowrap',
            }}
          >
            Download Report
          </Button>
        </Box>
      </motion.div>

      {/* ================= ANALYTICS CHARTS ================= */}
      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2.5,
          md: 3,
        }}
        sx={{
          width: '100%',
          margin: 0,
        }}
      >
        {/* Revenue Trend */}
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
          sx={{
            minWidth: 0,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1,
            }}
            style={{
              height: '100%',
            }}
          >
            <Card sx={cardSx}>
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                  },
                  '&:last-child': {
                    pb: {
                      xs: 2,
                      sm: 2.5,
                      md: 3,
                    },
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: {
                      xs: 2,
                      md: 3,
                    },
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                    },
                  }}
                >
                  Revenue Trend
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    height: chartHeight,
                  }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: isMobile ? 5 : 15,
                        left: isMobile ? -15 : 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        stroke={
                          theme.palette.text.secondary
                        }
                        tick={{
                          fontSize: axisFontSize,
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        stroke={
                          theme.palette.text.secondary
                        }
                        tick={{
                          fontSize: axisFontSize,
                        }}
                        tickLine={false}
                        axisLine={false}
                        width={
                          isMobile ? 35 : 50
                        }
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                        cursor={{
                          stroke: theme.palette.divider,
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                          theme.palette.primary.main
                        }
                        strokeWidth={
                          isMobile ? 2 : 3
                        }
                        dot={{
                          r: isMobile ? 3 : 4,
                          fill: theme.palette.primary
                            .main,
                        }}
                        activeDot={{
                          r: 6,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* User Growth */}
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
          sx={{
            minWidth: 0,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.2,
            }}
            style={{
              height: '100%',
            }}
          >
            <Card sx={cardSx}>
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                  },
                  '&:last-child': {
                    pb: {
                      xs: 2,
                      sm: 2.5,
                      md: 3,
                    },
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: {
                      xs: 2,
                      md: 3,
                    },
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                    },
                  }}
                >
                  User Growth
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    height: chartHeight,
                  }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: isMobile ? 5 : 15,
                        left: isMobile ? -15 : 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        stroke={
                          theme.palette.text.secondary
                        }
                        tick={{
                          fontSize: axisFontSize,
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        stroke={
                          theme.palette.text.secondary
                        }
                        tick={{
                          fontSize: axisFontSize,
                        }}
                        tickLine={false}
                        axisLine={false}
                        width={
                          isMobile ? 35 : 50
                        }
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                        cursor={{
                          fill: theme.palette.action
                            .hover,
                        }}
                      />

                      <Bar
                        dataKey="value"
                        fill={
                          theme.palette.secondary.main
                        }
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* ================= REPORTS HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mt: {
              xs: 4,
              md: 5,
            },
            mb: {
              xs: 3,
              md: 4,
            },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: {
                  xs: '1.75rem',
                  sm: '2rem',
                  md: '2.125rem',
                },
              }}
            >
              Reports
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Generate and download business reports.
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* ================= MONTHLY PERFORMANCE ================= */}
      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2.5,
          md: 3,
        }}
        sx={{
          width: '100%',
          margin: 0,
        }}
      >
        <Grid
          size={12}
          sx={{
            minWidth: 0,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
            }}
            style={{
              width: '100%',
            }}
          >
            <Card sx={cardSx}>
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                  },
                  '&:last-child': {
                    pb: {
                      xs: 2,
                      sm: 2.5,
                      md: 3,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: {
                      xs: 'flex-start',
                      sm: 'center',
                    },
                    justifyContent: 'space-between',
                    flexDirection: {
                      xs: 'column',
                      sm: 'row',
                    },
                    gap: 1,
                    mb: {
                      xs: 2,
                      md: 3,
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: {
                        xs: '1rem',
                        sm: '1.1rem',
                      },
                    }}
                  >
                    Monthly Performance
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    height: {
                      xs: 260,
                      sm: 300,
                      md: 340,
                    },
                  }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={data}
                      margin={{
                        top: 5,
                        right: isMobile ? 5 : 20,
                        left: isMobile ? -15 : 0,
                        bottom: 5,
                      }}
                      barGap={isMobile ? 4 : 8}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        stroke={
                          theme.palette.text.secondary
                        }
                        tick={{
                          fontSize: axisFontSize,
                        }}
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        stroke={
                          theme.palette.text.secondary
                        }
                        tick={{
                          fontSize: axisFontSize,
                        }}
                        tickLine={false}
                        axisLine={false}
                        width={
                          isMobile ? 35 : 50
                        }
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                      />

                      <Bar
                        dataKey="revenue"
                        name="Revenue"
                        fill={
                          theme.palette.primary.main
                        }
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                        maxBarSize={
                          isMobile ? 20 : 35
                        }
                      />

                      <Bar
                        dataKey="orders"
                        name="Orders"
                        fill={
                          theme.palette.secondary.main
                        }
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                        maxBarSize={
                          isMobile ? 20 : 35
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;