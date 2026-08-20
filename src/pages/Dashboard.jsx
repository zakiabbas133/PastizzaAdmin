import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { commonTokens } from '../theme/tokens';

// ============================================================
// SAMPLE DATA
// ============================================================

const revenueData = [
  { date: 'Jan 1', revenue: 4000 },
  { date: 'Jan 8', revenue: 3000 },
  { date: 'Jan 15', revenue: 2000 },
  { date: 'Jan 22', revenue: 2780 },
  { date: 'Jan 29', revenue: 1890 },
  { date: 'Feb 5', revenue: 2390 },
  { date: 'Feb 12', revenue: 3490 },
];

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const trafficData = [
  { name: 'Direct', value: 42 },
  { name: 'Organic', value: 31 },
  { name: 'Social', value: 18 },
  { name: 'Referral', value: 9 },
];

const recentOrders = [
  {
    id: 'ORD-10294',
    customer: 'John Smith',
    product: 'Product A',
    amount: '$2,450',
    status: 'Completed',
    date: '2024-01-15',
  },
  {
    id: 'ORD-10293',
    customer: 'Sarah Williams',
    product: 'Product B',
    amount: '$1,890',
    status: 'Pending',
    date: '2024-01-14',
  },
  {
    id: 'ORD-10292',
    customer: 'Michael Brown',
    product: 'Product C',
    amount: '$3,210',
    status: 'Processing',
    date: '2024-01-13',
  },
  {
    id: 'ORD-10291',
    customer: 'Emily Davis',
    product: 'Product A',
    amount: '$1,560',
    status: 'Completed',
    date: '2024-01-12',
  },
];

const recentActivity = [
  {
    title: 'New order received',
    description: 'Order #ORD-10294',
    time: '2 minutes ago',
    type: 'order',
  },
  {
    title: 'New user registered',
    description: 'Sarah Williams',
    time: '14 minutes ago',
    type: 'user',
  },
  {
    title: 'Payment completed',
    description: '$2,450',
    time: '31 minutes ago',
    type: 'payment',
  },
  {
    title: 'New product added',
    description: 'Premium Package',
    time: '1 hour ago',
    type: 'product',
  },
];

// ============================================================
// KPI CARD
// ============================================================

const KPICard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  const theme = useTheme();

  const isPositive = change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        height: '100%',
      }}
    >
      <Card
        sx={{
          height: '100%',
          minWidth: 0,
          position: 'relative',
          overflow: 'hidden',

          background: `linear-gradient(
            135deg,
            ${alpha(color, 0.1)} 0%,
            ${alpha(color, 0.05)} 100%
          )`,

          border: `1px solid ${theme.palette.divider}`,

          transition: 'transform 0.25s ease, box-shadow 0.25s ease',

          '&:hover': {
            transform: {
              xs: 'none',
              sm: 'translateY(-3px)',
            },
            boxShadow: theme.shadows[4],
          },

          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: {
              xs: 70,
              sm: 90,
              md: 100,
            },
            height: {
              xs: 70,
              sm: 90,
              md: 100,
            },
            background: `radial-gradient(
              circle,
              ${alpha(color, 0.12)} 0%,
              transparent 70%
            )`,
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
            pointerEvents: 'none',
          },
        }}
      >
        <CardContent
          sx={{
            height: '100%',
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
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 1.5,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Content */}
            <Box
              sx={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: '0.75rem',
                    sm: commonTokens.typography.fontSize.sm,
                  },
                  lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  mt: {
                    xs: 1,
                    sm: 1.5,
                  },
                  fontWeight: 700,
                  fontSize: {
                    xs: '1.5rem',
                    sm: '1.75rem',
                    md: '2rem',
                  },
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                }}
              >
                {value}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: {
                    xs: 'flex-start',
                    sm: 'center',
                  },
                  flexWrap: 'wrap',
                  gap: {
                    xs: 0.75,
                    sm: 1,
                  },
                  mt: {
                    xs: 1,
                    sm: 1.5,
                  },
                }}
              >
                <Chip
                  icon={
                    isPositive ? (
                      <ArrowUpwardIcon />
                    ) : (
                      <TrendingDownIcon />
                    )
                  }
                  label={`${isPositive ? '+' : ''}${change}%`}
                  size="small"
                  sx={{
                    height: {
                      xs: 24,
                      sm: 26,
                    },
                    fontSize: {
                      xs: '0.7rem',
                      sm: '0.75rem',
                    },
                    backgroundColor: isPositive
                      ? alpha(theme.palette.success.main, 0.15)
                      : alpha(theme.palette.error.main, 0.15),
                    color: isPositive
                      ? theme.palette.success.main
                      : theme.palette.error.main,

                    '& .MuiChip-icon': {
                      fontSize: {
                        xs: 14,
                        sm: 16,
                      },
                      color: 'inherit',
                    },
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: '0.65rem',
                      sm: '0.7rem',
                    },
                  }}
                >
                  vs last month
                </Typography>
              </Box>
            </Box>

            {/* Icon */}
            <Box
              sx={{
                flexShrink: 0,
                width: {
                  xs: 38,
                  sm: 44,
                  md: 48,
                },
                height: {
                  xs: 38,
                  sm: 44,
                  md: 48,
                },
                backgroundColor: alpha(color, 0.15),
                borderRadius: {
                  xs: 2,
                  md: commonTokens.radius.lg,
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                sx={{
                  fontSize: {
                    xs: 21,
                    sm: 25,
                    md: 28,
                  },
                  color,
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [timePeriod, setTimePeriod] = useState('7d');

  const chartColors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
  };

  // ----------------------------------------------------------
  // Responsive chart configuration
  // ----------------------------------------------------------

  const revenueChartHeight = isMobile
    ? 230
    : isTablet
      ? 270
      : 320;

  const salesChartHeight = isMobile
    ? 220
    : isTablet
      ? 240
      : 260;

  const trafficChartHeight = isMobile
    ? 210
    : isTablet
      ? 230
      : 250;

  const axisFontSize = isMobile ? 9 : 11;

  const axisWidth = isMobile ? 35 : 50;

  // ----------------------------------------------------------
  // Shared chart styles
  // ----------------------------------------------------------

  const tooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: commonTokens.radius.md,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[4],
  };

  const chartMargin = {
    top: 5,
    right: isMobile ? 5 : 15,
    left: isMobile ? -15 : 0,
    bottom: 5,
  };

  // ----------------------------------------------------------
  // Status
  // ----------------------------------------------------------

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';

      case 'Pending':
        return 'warning';

      case 'Processing':
        return 'info';

      case 'Cancelled':
        return 'error';

      default:
        return 'default';
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {/* ======================================================
          WELCOME SECTION
      ====================================================== */}

      <Box
        sx={{
          mb: {
            xs: 3,
            sm: 4,
            md: commonTokens.spacing.xxxl,
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: {
                xs: 0.75,
                sm: 1,
                md: commonTokens.spacing.md,
              },
              fontSize: {
                xs: '1.65rem',
                sm: '1.9rem',
                md: '2.125rem',
              },
              lineHeight: 1.2,
            }}
          >
            Good morning, Admin
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
            Here's what's happening with your business today.
          </Typography>
        </motion.div>
      </Box>

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2,
          md: 3,
        }}
        sx={{
          width: '100%',
          margin: 0,
          mb: {
            xs: 3,
            sm: 4,
            md: commonTokens.spacing.xxxl,
          },
        }}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
          sx={{
            minWidth: 0,
          }}
        >
          <KPICard
            title="Total Revenue"
            value="$128,430"
            change={18.4}
            icon={TrendingUpIcon}
            color={theme.palette.primary.main}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
          sx={{
            minWidth: 0,
          }}
        >
          <KPICard
            title="Total Orders"
            value="1,240"
            change={12.3}
            icon={ShoppingCartIcon}
            color={theme.palette.success.main}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
          sx={{
            minWidth: 0,
          }}
        >
          <KPICard
            title="Active Users"
            value="8,542"
            change={-2.4}
            icon={PeopleIcon}
            color={theme.palette.info.main}
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
          sx={{
            minWidth: 0,
          }}
        >
          <KPICard
            title="Conversion Rate"
            value="3.2%"
            change={5.2}
            icon={ArrowUpwardIcon}
            color={theme.palette.secondary.main}
          />
        </Grid>
      </Grid>

      {/* ======================================================
          REVENUE + TRAFFIC
      ====================================================== */}

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
          mb: {
            xs: 3,
            sm: 4,
            md: commonTokens.spacing.xxxl,
          },
        }}
      >
        {/* ----------------------------------------------------
            Revenue
        ---------------------------------------------------- */}

        <Grid
          size={{
            xs: 12,
            md: 8,
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
            <Card
              sx={{
                height: '100%',
                minWidth: 0,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
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
                {/* Header */}
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
                    gap: {
                      xs: 1.5,
                      sm: 2,
                    },
                    mb: {
                      xs: 2,
                      md: commonTokens.spacing.lg,
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
                    Revenue
                  </Typography>

                  {/* Period buttons */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: {
                        xs: 0.5,
                        sm: 1,
                      },
                      width: {
                        xs: '100%',
                        sm: 'auto',
                      },
                    }}
                  >
                    {['7d', '30d', '90d', '1y'].map(
                      (period) => (
                        <Button
                          key={period}
                          variant={
                            timePeriod === period
                              ? 'contained'
                              : 'outlined'
                          }
                          size="small"
                          onClick={() =>
                            setTimePeriod(period)
                          }
                          sx={{
                            flex: {
                              xs: 1,
                              sm: 'initial',
                            },
                            minWidth: {
                              xs: 0,
                              sm: 52,
                            },
                            height: {
                              xs: 32,
                              sm: 34,
                            },
                            px: {
                              xs: 1,
                              sm: 1.5,
                            },
                            textTransform: 'none',
                            fontSize: {
                              xs: '0.7rem',
                              sm: commonTokens.typography
                                .fontSize.xs,
                            },
                          }}
                        >
                          {period}
                        </Button>
                      )
                    )}
                  </Box>
                </Box>

                {/* Chart */}
                <Box
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    height: revenueChartHeight,
                  }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={revenueData}
                      margin={chartMargin}
                    >
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={
                              chartColors.primary
                            }
                            stopOpacity={0.3}
                          />

                          <stop
                            offset="95%"
                            stopColor={
                              chartColors.primary
                            }
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={
                          theme.palette.divider
                        }
                        vertical={false}
                      />

                      <XAxis
                        dataKey="date"
                        stroke={
                          theme.palette.text.secondary
                        }
                        tick={{
                          fontSize: axisFontSize,
                        }}
                        tickLine={false}
                        axisLine={false}
                        interval={
                          isMobile ? 1 : 0
                        }
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
                        width={axisWidth}
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                        cursor={{
                          stroke:
                            theme.palette.divider,
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={
                          chartColors.primary
                        }
                        strokeWidth={
                          isMobile ? 2 : 3
                        }
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        activeDot={{
                          r: isMobile ? 4 : 6,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* ----------------------------------------------------
            Traffic Sources
        ---------------------------------------------------- */}

        <Grid
          size={{
            xs: 12,
            md: 4,
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
            <Card
              sx={{
                height: '100%',
                minWidth: 0,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
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
                      xs: 1,
                      md: commonTokens.spacing.lg,
                    },
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                    },
                  }}
                >
                  Traffic Sources
                </Typography>

                {/* Pie */}
                <Box
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    height: trafficChartHeight,
                  }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={trafficData}
                        cx="50%"
                        cy="50%"
                        innerRadius={
                          isMobile ? 48 : 60
                        }
                        outerRadius={
                          isMobile ? 72 : 90
                        }
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {trafficData.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                [
                                  chartColors.primary,
                                  chartColors.secondary,
                                  chartColors.success,
                                  chartColors.error,
                                ][index]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        contentStyle={tooltipStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                {/* Legend */}
                <Box
                  sx={{
                    mt: {
                      xs: 1,
                      sm: 2,
                    },
                  }}
                >
                  {trafficData.map(
                    (item, index) => (
                      <Box
                        key={item.name}
                        sx={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems: 'center',
                          mb: {
                            xs: 1,
                            sm: 1.25,
                            md: 1.5,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems:
                              'center',
                            gap: {
                              xs: 1,
                              sm: 1.25,
                            },
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              flexShrink: 0,
                              borderRadius:
                                '50%',
                              backgroundColor:
                                [
                                  chartColors.primary,
                                  chartColors.secondary,
                                  chartColors.success,
                                  chartColors.error,
                                ][index],
                            }}
                          />

                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: {
                                xs: '0.75rem',
                                sm: '0.8rem',
                              },
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            fontSize: {
                              xs: '0.75rem',
                              sm: '0.8rem',
                            },
                          }}
                        >
                          {item.value}%
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* ======================================================
          SALES + ACTIVITY
      ====================================================== */}

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
          mb: {
            xs: 3,
            sm: 4,
            md: commonTokens.spacing.xxxl,
          },
        }}
      >
        {/* ----------------------------------------------------
            Sales Chart
        ---------------------------------------------------- */}

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
              delay: 0.3,
            }}
            style={{
              height: '100%',
            }}
          >
            <Card
              sx={{
                height: '100%',
                minWidth: 0,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
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
                      md: commonTokens.spacing.lg,
                    },
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                    },
                  }}
                >
                  Sales Overview
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    height: salesChartHeight,
                  }}
                >
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={salesData}
                      margin={chartMargin}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={
                          theme.palette.divider
                        }
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
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
                        width={axisWidth}
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                        cursor={{
                          fill: alpha(
                            chartColors.secondary,
                            0.08
                          ),
                        }}
                      />

                      <Bar
                        dataKey="sales"
                        fill={
                          chartColors.secondary
                        }
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                        maxBarSize={
                          isMobile ? 28 : 42
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* ----------------------------------------------------
            Recent Activity
        ---------------------------------------------------- */}

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
              delay: 0.4,
            }}
            style={{
              height: '100%',
            }}
          >
            <Card
              sx={{
                height: '100%',
                minWidth: 0,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
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
                      md: commonTokens.spacing.lg,
                    },
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                    },
                  }}
                >
                  Recent Activity
                </Typography>

                <Box>
                  {recentActivity.map(
                    (activity, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          gap: {
                            xs: 1.25,
                            sm: commonTokens
                              .spacing.md,
                          },
                          p: {
                            xs: 1.25,
                            sm: commonTokens
                              .spacing.md,
                          },

                          borderLeft: `3px solid ${theme.palette.primary.main}`,

                          mb:
                            index <
                              recentActivity.length - 1
                              ? {
                                xs: 1,
                                sm: 1.5,
                              }
                              : 0,

                          borderRadius:
                            commonTokens.radius.sm,

                          backgroundColor:
                            alpha(
                              theme.palette.primary
                                .main,
                              0.05
                            ),

                          transition:
                            'background-color 0.2s ease',

                          '&:hover': {
                            backgroundColor:
                              alpha(
                                theme.palette.primary
                                  .main,
                                0.09
                              ),
                          },
                        }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              fontSize: {
                                xs: '0.75rem',
                                sm: '0.8rem',
                              },
                              lineHeight: 1.4,
                            }}
                          >
                            {activity.title}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              fontSize: {
                                xs: '0.68rem',
                                sm: '0.72rem',
                              },
                              mt: 0.25,
                            }}
                          >
                            {activity.description}
                          </Typography>

                          <Typography
                            variant="caption"
                            display="block"
                            color="text.disabled"
                            sx={{
                              mt: 0.5,
                              fontSize: {
                                xs: '0.62rem',
                                sm: '0.68rem',
                              },
                            }}
                          >
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* ======================================================
          RECENT ORDERS
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.5,
        }}
      >
        <Card
          sx={{
            width: '100%',
            minWidth: 0,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
          }}
        >
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
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                mb: {
                  xs: 2,
                  md: commonTokens.spacing.lg,
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
                Recent Orders
              </Typography>

              <Button
                variant="text"
                size="small"
                sx={{
                  flexShrink: 0,
                  minWidth: 'auto',
                  textTransform: 'none',
                  fontSize: {
                    xs: '0.7rem',
                    sm: '0.8rem',
                  },
                }}
              >
                View All
              </Button>
            </Box>

            {/* Table wrapper */}
            <TableContainer
              sx={{
                width: '100%',
                overflowX: 'auto',

                '&::-webkit-scrollbar': {
                  height: 5,
                },

                '&::-webkit-scrollbar-thumb': {
                  backgroundColor:
                    theme.palette.divider,
                  borderRadius: 10,
                },
              }}
            >
              <Table
                sx={{
                  minWidth: {
                    xs: 750,
                    sm: 800,
                  },
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: alpha(
                        theme.palette.primary.main,
                        0.05
                      ),
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        fontSize: {
                          xs: '0.7rem',
                          sm: '0.8rem',
                        },
                        py: {
                          xs: 1.25,
                          sm: 1.5,
                        },
                      }}
                    >
                      Order ID
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        fontSize: {
                          xs: '0.7rem',
                          sm: '0.8rem',
                        },
                      }}
                    >
                      Customer
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        fontSize: {
                          xs: '0.7rem',
                          sm: '0.8rem',
                        },
                      }}
                    >
                      Product
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        fontSize: {
                          xs: '0.7rem',
                          sm: '0.8rem',
                        },
                      }}
                    >
                      Amount
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        fontSize: {
                          xs: '0.7rem',
                          sm: '0.8rem',
                        },
                      }}
                    >
                      Status
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        fontSize: {
                          xs: '0.7rem',
                          sm: '0.8rem',
                        },
                      }}
                    >
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        '&:hover': {
                          backgroundColor:
                            alpha(
                              theme.palette.primary
                                .main,
                              0.05
                            ),
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          color:
                            theme.palette.primary
                              .main,
                          whiteSpace: 'nowrap',
                          fontSize: {
                            xs: '0.7rem',
                            sm: '0.8rem',
                          },
                        }}
                      >
                        {order.id}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: 'nowrap',
                          fontSize: {
                            xs: '0.7rem',
                            sm: '0.8rem',
                          },
                        }}
                      >
                        {order.customer}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: 'nowrap',
                          fontSize: {
                            xs: '0.7rem',
                            sm: '0.8rem',
                          },
                        }}
                      >
                        {order.product}
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          fontSize: {
                            xs: '0.7rem',
                            sm: '0.8rem',
                          },
                        }}
                      >
                        {order.amount}
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Chip
                          label={order.status}
                          color={getStatusColor(
                            order.status
                          )}
                          variant="outlined"
                          size="small"
                          sx={{
                            height: {
                              xs: 24,
                              sm: 28,
                            },
                            fontSize: {
                              xs: '0.65rem',
                              sm: '0.7rem',
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          whiteSpace: 'nowrap',
                          fontSize: {
                            xs: '0.7rem',
                            sm: '0.8rem',
                          },
                        }}
                      >
                        {order.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Dashboard;