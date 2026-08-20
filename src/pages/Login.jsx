import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  Tooltip,
  Stack,
} from '@mui/material';

import { motion } from 'framer-motion';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleAltOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { commonTokens } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

// ============================================================
// FLOATING METRIC CARD
// ============================================================

const FloatingMetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  delay = 0,
  position,
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        ...position,
      }}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
      >
        <Box
          sx={{
            width: {
              xs: 180,
              md: 210,
            },

            p: 2,

            borderRadius: commonTokens.radius.lg,

            backgroundColor: alpha(
              theme.palette.background.paper,
              theme.palette.mode === 'dark' ? 0.72 : 0.86
            ),

            border: `1px solid ${alpha(
              theme.palette.divider,
              0.8
            )}`,

            backdropFilter: 'blur(18px)',

            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 20px 50px ${alpha('#000', 0.3)}`
                : `0 20px 50px ${alpha('#000', 0.08)}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>

            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: commonTokens.radius.md,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  0.1
                ),
                color: theme.palette.primary.main,
              }}
            >
              <Icon fontSize="small" />
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: '1.45rem',
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 1,
            }}
          >
            <ArrowUpwardIcon
              sx={{
                fontSize: 14,
                color: theme.palette.success.main,
              }}
            />

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.success.main,
                fontWeight: 700,
              }}
            >
              {change}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              this month
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// DECORATIVE CHART
// ============================================================

const DecorativeChart = () => {
  const theme = useTheme();

  const points = [
    [0, 115],
    [35, 105],
    [70, 120],
    [105, 78],
    [140, 90],
    [175, 60],
    [210, 70],
    [245, 38],
    [280, 48],
  ];

  const path = points
    .map(([x, y], index) =>
      `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    )
    .join(' ');

  return (
    <Box
      sx={{
        position: 'absolute',
        width: {
          md: 340,
          lg: 390,
        },
        height: 190,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.95,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 160"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="loginChartGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={theme.palette.primary.main}
              stopOpacity="0.28"
            />

            <stop
              offset="100%"
              stopColor={theme.palette.primary.main}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <path
          d={`${path} L 280 160 L 0 160 Z`}
          fill="url(#loginChartGradient)"
        />

        <path
          d={path}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map(([x, y], index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={index === points.length - 1 ? 5 : 3}
            fill={theme.palette.background.paper}
            stroke={theme.palette.primary.main}
            strokeWidth="2"
          />
        ))}
      </svg>
    </Box>
  );
};

// ============================================================
// VISUAL PANEL
// ============================================================

const VisualPanel = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',

        minHeight: {
          md: '100%',
        },

        height: '100%',

        overflow: 'hidden',

        display: {
          xs: 'none',
          md: 'flex',
        },

        flexDirection: 'column',

        justifyContent: 'center',

        px: {
          md: 5,
          lg: 8,
          xl: 10,
        },

        py: 6,

        background: `
          radial-gradient(
            circle at 20% 20%,
            ${alpha(theme.palette.primary.main, 0.18)} 0%,
            transparent 35%
          ),
          radial-gradient(
            circle at 80% 80%,
            ${alpha(theme.palette.secondary.main, 0.14)} 0%,
            transparent 35%
          ),
          ${theme.palette.background.default}
        `,
      }}
    >
      {/* Decorative grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,

          opacity:
            theme.palette.mode === 'dark'
              ? 0.08
              : 0.045,

          backgroundImage: `
            linear-gradient(
              ${theme.palette.text.primary} 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              ${theme.palette.text.primary} 1px,
              transparent 1px
            )
          `,

          backgroundSize: '45px 45px',

          maskImage:
            'linear-gradient(to bottom, black, transparent)',
        }}
      />

      {/* Decorative glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: alpha(
            theme.palette.primary.main,
            0.12
          ),
          filter: 'blur(80px)',
          top: '25%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Brand */}
      <motion.div
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        style={{
          position: 'absolute',
          top: 32,
          left: 40,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,

              borderRadius:
                commonTokens.radius.md,

              backgroundColor:
                theme.palette.primary.main,

              color:
                theme.palette.primary
                  .contrastText,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              fontSize: 20,
              fontWeight: 800,

              boxShadow: `0 8px 25px ${alpha(
                theme.palette.primary.main,
                0.3
              )}`,
            }}
          >
            P
          </Box>

          <Typography
            sx={{
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Pastizza
          </Typography>
        </Box>
      </motion.div>

      {/* Main visual */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          height: 550,
        }}
      >
        {/* Main heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 25,
              left: 0,
              right: 0,
              textAlign: 'center',
              zIndex: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  md: '2.3rem',
                  lg: '3rem',
                },

                lineHeight: 1.1,

                fontWeight: 800,

                letterSpacing: '-0.04em',

                maxWidth: 500,

                mx: 'auto',
              }}
            >
              Powerful insights.
              <br />

              <Box
                component="span"
                sx={{
                  color: theme.palette.primary.main,
                }}
              >
                Beautifully organized.
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 2,

                maxWidth: 480,

                mx: 'auto',

                color:
                  theme.palette.text.secondary,

                lineHeight: 1.7,

                fontSize: '0.95rem',
              }}
            >
              Manage your business, track
              performance, and make smarter
              decisions from one powerful
              workspace.
            </Typography>
          </Box>
        </motion.div>

        {/* Chart card */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 0.35,
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: 220,
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Box
              sx={{
                width: {
                  md: 380,
                  lg: 440,
                },

                height: 220,

                borderRadius:
                  commonTokens.radius.xl,

                backgroundColor: alpha(
                  theme.palette.background.paper,
                  theme.palette.mode === 'dark'
                    ? 0.75
                    : 0.92
                ),

                border: `1px solid ${theme.palette.divider}`,

                backdropFilter: 'blur(20px)',

                boxShadow:
                  theme.palette.mode === 'dark'
                    ? `0 30px 70px ${alpha(
                      '#000',
                      0.35
                    )}`
                    : `0 30px 70px ${alpha(
                      '#000',
                      0.1
                    )}`,

                p: 3,

                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Total Revenue
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      mt: 0.5,
                    }}
                  >
                    $128,430
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 1,
                    py: 0.5,

                    borderRadius:
                      commonTokens.radius.sm,

                    backgroundColor:
                      alpha(
                        theme.palette.success.main,
                        0.1
                      ),

                    color:
                      theme.palette.success.main,

                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  +18.4%
                </Box>
              </Box>

              <DecorativeChart />
            </Box>
          </motion.div>
        </motion.div>

        {/* Floating cards */}

        <FloatingMetricCard
          title="Active Users"
          value="8,542"
          change="+12.3%"
          icon={PeopleOutlineIcon}
          delay={0.5}
          position={{
            left: {
              md: -5,
              lg: 5,
            },
            bottom: 55,
          }}
        />

        <FloatingMetricCard
          title="Total Orders"
          value="1,240"
          change="+8.7%"
          icon={ShoppingCartOutlinedIcon}
          delay={0.65}
          position={{
            right: {
              md: -5,
              lg: 5,
            },
            bottom: 0,
          }}
        />

        {/* Small decorative icon */}
        <motion.div
          animate={{
            rotate: [0, 8, 0, -8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            right: 70,
            top: 155,
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              backgroundColor: alpha(
                theme.palette.primary.main,
                0.1
              ),

              color:
                theme.palette.primary.main,

              border: `1px solid ${alpha(
                theme.palette.primary.main,
                0.2
              )}`,
            }}
          >
            <TrendingUpIcon />
          </Box>
        </motion.div>
      </Box>

      {/* Footer */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 40,
          color: theme.palette.text.disabled,
        }}
      >
        © {new Date().getFullYear()} Cheezious.
        All rights reserved.
      </Typography>
    </Box>
  );
};

// ============================================================
// LOGIN PAGE
// ============================================================

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError('');

    setLoading(true);

    const result = await login(
      formData.username,
      formData.password
    );

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    const destination = location.state?.from?.pathname || '/dashboard';

    navigate(destination, {
      replace: true,
    });
  };

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));

    // Clear field error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validate = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    let valid = true;

    if (!formData.email.trim()) {
      newErrors.email =
        'Username is required.';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password =
        'Password is required.';
      valid = false;
    } else if (
      formData.password.length < 5
    ) {
      newErrors.password =
        'Password must contain at least 6 characters.';
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    const destination = location.state?.from?.pathname || '/dashboard';
    navigate(destination, { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',

        display: 'flex',

        backgroundColor:
          theme.palette.background.default,

        overflow: 'hidden',
      }}
    >
      {/* ====================================================
          DESKTOP VISUAL PANEL
      ==================================================== */}

      <Box
        sx={{
          width: {
            md: '50%',
            lg: '55%',
          },

          minHeight: '100dvh',

          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <VisualPanel />
      </Box>

      {/* ====================================================
          LOGIN SECTION
      ==================================================== */}

      <Box
        sx={{
          width: {
            xs: '100%',
            md: '50%',
            lg: '45%',
          },

          minHeight: '100dvh',

          display: 'flex',

          flexDirection: 'column',

          justifyContent: 'center',

          alignItems: 'center',

          px: {
            xs: 2,
            sm: 4,
            md: 4,
            lg: 6,
          },

          py: {
            xs: 3,
            sm: 4,
          },

          position: 'relative',
        }}
      >
        {/* Mobile Brand */}

        <Box
          sx={{
            display: {
              xs: 'flex',
              md: 'none',
            },

            alignItems: 'center',

            gap: 1.5,

            position: {
              xs: 'relative',
              sm: 'absolute',
            },

            top: {
              sm: 28,
            },

            left: {
              sm: 28,
            },

            alignSelf: {
              xs: 'flex-start',
              sm: 'auto',
            },

            mb: {
              xs: 5,
              sm: 0,
            },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,

              borderRadius:
                commonTokens.radius.md,

              backgroundColor:
                theme.palette.primary.main,

              color:
                theme.palette.primary
                  .contrastText,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              fontWeight: 800,
              fontSize: 18,
            }}
          >
            P
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1.15rem',
            }}
          >
            Pastizza
          </Typography>
        </Box>

        {/* ==================================================
            LOGIN CARD
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{
            width: '100%',
            maxWidth: 440,
          }}
        >
          <Card
            elevation={0}
            sx={{
              width: '100%',

              borderRadius:
                commonTokens.radius.xl,

              border: `1px solid ${theme.palette.divider}`,

              backgroundColor:
                theme.palette.background.paper,

              boxShadow:
                theme.palette.mode === 'dark'
                  ? `0 25px 70px ${alpha(
                    '#000',
                    0.25
                  )}`
                  : `0 25px 70px ${alpha(
                    '#000',
                    0.07
                  )}`,

              overflow: 'hidden',
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2.5,
                  sm: 4,
                },

                '&:last-child': {
                  pb: {
                    xs: 2.5,
                    sm: 4,
                  },
                },
              }}
            >
              {/* Header */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.15,
                  duration: 0.4,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      theme.palette.primary
                        .main,

                    fontWeight: 700,

                    mb: 1,
                  }}
                >
                  Welcome back
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,

                    letterSpacing:
                      '-0.025em',

                    fontSize: {
                      xs: '1.7rem',
                      sm: '2rem',
                    },

                    mb: 1,
                  }}
                >
                  Sign in to your account
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    mb: 3,
                  }}
                >
                  Enter your credentials to
                  access your dashboard.
                </Typography>
              </motion.div>

              {/* Form */}

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
              >
                <Stack spacing={2.2}>
                  {/* Email */}

                  <TextField
                    fullWidth
                    label="Email address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={Boolean(
                      errors.email
                    )}
                    helperText={
                      errors.email
                    }
                    autoComplete="email"
                    placeholder="you@example.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon
                            fontSize="small"
                            color={
                              errors.email
                                ? 'error'
                                : 'inherit'
                            }
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root':
                      {
                        borderRadius:
                          commonTokens.radius.md,
                      },
                    }}
                  />

                  {/* Password */}

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={
                      formData.password
                    }
                    onChange={handleChange}
                    error={Boolean(
                      errors.password
                    )}
                    helperText={
                      errors.password
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon
                            fontSize="small"
                            color={
                              errors.password
                                ? 'error'
                                : 'inherit'
                            }
                          />
                        </InputAdornment>
                      ),

                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip
                            title={
                              showPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                          >
                            <IconButton
                              onClick={() =>
                                setShowPassword(
                                  (prev) =>
                                    !prev
                                )
                              }
                              edge="end"
                              aria-label={
                                showPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                            >
                              {showPassword ? (
                                <VisibilityOffOutlinedIcon fontSize="small" />
                              ) : (
                                <VisibilityOutlinedIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root':
                      {
                        borderRadius:
                          commonTokens.radius.md,
                      },
                    }}
                  />

                  {/* Remember + Forgot */}

                  <Box
                    sx={{
                      display: 'flex',

                      alignItems: {
                        xs: 'flex-start',
                        sm: 'center',
                      },

                      justifyContent:
                        'space-between',

                      gap: 1,

                      flexDirection: {
                        xs: 'column',
                        sm: 'row',
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rememberMe"
                          checked={
                            formData.rememberMe
                          }
                          onChange={
                            handleChange
                          }
                          size="small"
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                        >
                          Remember me
                        </Typography>
                      }
                      sx={{
                        m: 0,
                      }}
                    />

                    <Button
                      type="button"
                      variant="text"
                      size="small"
                      sx={{
                        textTransform:
                          'none',

                        minWidth: 'auto',

                        p: 0,

                        fontWeight: 600,

                        alignSelf: {
                          xs: 'flex-start',
                          sm: 'auto',
                        },
                      }}
                    >
                      Forgot password?
                    </Button>
                  </Box>

                  {/* Login button */}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress
                          size={18}
                          color="inherit"
                        />
                      ) : (
                        <LoginOutlinedIcon />
                      )
                    }
                    sx={{
                      minHeight: 50,

                      borderRadius:
                        commonTokens.radius.md,

                      textTransform:
                        'none',

                      fontWeight: 700,

                      fontSize: '0.95rem',

                      boxShadow: `0 8px 20px ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`,

                      transition:
                        commonTokens.transitions
                          .base,

                      '&:hover': {
                        transform:
                          'translateY(-1px)',

                        boxShadow: `0 12px 25px ${alpha(
                          theme.palette.primary.main,
                          0.3
                        )}`,
                      },

                      '&:active': {
                        transform:
                          'translateY(0)',
                      },
                    }}
                  >
                    {loading
                      ? 'Signing in...'
                      : 'Sign In'}
                  </Button>

                  {/* Divider */}

                  <Divider
                    sx={{
                      my: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.disabled"
                    >
                      or continue with
                    </Typography>
                  </Divider>

                  {/* Google */}

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={
                      <GoogleIcon />
                    }
                    sx={{
                      minHeight: 48,

                      borderRadius:
                        commonTokens.radius.md,

                      textTransform:
                        'none',

                      fontWeight: 600,

                      color:
                        theme.palette.text
                          .primary,

                      borderColor:
                        theme.palette.divider,

                      '&:hover': {
                        backgroundColor:
                          alpha(
                            theme.palette
                              .text.primary,
                            0.04
                          ),

                        borderColor:
                          theme.palette
                            .text.secondary,
                      },
                    }}
                  >
                    Continue with Google
                  </Button>

                  {/* Footer */}

                  <Box
                    sx={{
                      textAlign: 'center',
                      pt: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Don't have an account?{' '}
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          textTransform:
                            'none',

                          p: 0,

                          minWidth:
                            'auto',

                          verticalAlign:
                            'baseline',

                          fontWeight: 700,
                        }}
                      >
                        Contact administrator
                      </Button>
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mobile copyright */}

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            mt: 3,

            display: {
              xs: 'block',
              md: 'none',
            },

            textAlign: 'center',
          }}
        >
          © {new Date().getFullYear()} Cheezious.
          All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;