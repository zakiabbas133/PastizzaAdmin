import { useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  useTheme,
  Grid,
  Divider,
  alpha,
} from '@mui/material';

import { motion } from 'framer-motion';

import SaveIcon from '@mui/icons-material/Save';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

import { commonTokens } from '../theme/tokens';

const Settings = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@cheezious.com',
    notifications: true,
    emailUpdates: false,
    twoFactor: false,
  });

  // ============================================================
  // HANDLE FORM CHANGES
  // ============================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));
  };

  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  const handleSave = () => {
    console.log(
      'Settings saved:',
      formData
    );
  };

  // ============================================================
  // PREFERENCE ROW
  // ============================================================

  const PreferenceRow = ({
    icon: Icon,
    title,
    description,
    name,
    checked,
    last = false,
  }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: {
            xs: 'flex-start',
            sm: 'center',
          },
          justifyContent: 'space-between',
          gap: 2,

          py: {
            xs: 1.5,
            sm: 2,
          },

          borderBottom: last
            ? 'none'
            : `1px solid ${theme.palette.divider}`,

          transition:
            'background-color 0.2s ease',

          '&:hover': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              0.025
            ),
          },
        }}
      >
        {/* Left Content */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: {
              xs: 1.25,
              sm: 1.5,
            },
            minWidth: 0,
            flex: 1,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: {
                xs: 38,
                sm: 42,
              },

              height: {
                xs: 38,
                sm: 42,
              },

              flexShrink: 0,

              borderRadius:
                commonTokens.radius.md,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              backgroundColor: alpha(
                theme.palette.primary.main,
                0.1
              ),

              color:
                theme.palette.primary.main,
            }}
          >
            <Icon
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 22,
                },
              }}
            />
          </Box>

          {/* Text */}
          <Box
            sx={{
              minWidth: 0,
              pt: {
                xs: 0.25,
                sm: 0,
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: {
                  xs: '0.8rem',
                  sm: '0.875rem',
                },
                lineHeight: 1.4,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.35,
                fontSize: {
                  xs: '0.68rem',
                  sm: '0.75rem',
                },
                lineHeight: 1.5,
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>

        {/* Switch */}
        <Switch
          name={name}
          checked={checked}
          onChange={handleChange}
          sx={{
            flexShrink: 0,
            mt: {
              xs: 0.25,
              sm: 0,
            },
          }}
        />
      </Box>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        <Box
          sx={{
            mb: {
              xs: 3,
              sm: 4,
              md: commonTokens.spacing.xxl,
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,

              mb: {
                xs: 0.75,
                sm: commonTokens.spacing.md,
              },

              fontSize: {
                xs: '1.65rem',
                sm: '1.9rem',
                md: '2.125rem',
              },

              lineHeight: 1.2,
            }}
          >
            Settings
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: {
                xs: '0.8rem',
                sm: '0.875rem',
              },

              maxWidth: {
                xs: '100%',
                sm: 600,
              },

              lineHeight: 1.6,
            }}
          >
            Manage your account settings and
            preferences.
          </Typography>
        </Box>
      </motion.div>

      {/* ======================================================
          SETTINGS GRID
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
        }}
      >
        {/* ====================================================
            PROFILE
        ==================================================== */}

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
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
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

                transition:
                  'box-shadow 0.25s ease',

                '&:hover': {
                  boxShadow: {
                    xs: 'none',
                    sm: theme.shadows[3],
                  },
                },
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
                {/* Section Header */}
                <Box
                  sx={{
                    mb: {
                      xs: 2.5,
                      sm: 3,
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
                    Profile
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                      fontSize: {
                        xs: '0.7rem',
                        sm: '0.75rem',
                      },
                      lineHeight: 1.5,
                    }}
                  >
                    Update your personal account
                    information.
                  </Typography>
                </Box>

                {/* Full Name */}
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    mb: {
                      xs: 2,
                      sm: commonTokens.spacing.lg,
                    },

                    '& .MuiOutlinedInput-root': {
                      minHeight: {
                        xs: 44,
                        sm: 42,
                      },
                    },
                  }}
                />

                {/* Email */}
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    mb: {
                      xs: 2.5,
                      sm: commonTokens.spacing.lg,
                    },

                    '& .MuiOutlinedInput-root': {
                      minHeight: {
                        xs: 44,
                        sm: 42,
                      },
                    },
                  }}
                />

                {/* Save */}
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  fullWidth
                  sx={{
                    height: {
                      xs: 44,
                      sm: 42,
                    },

                    textTransform: 'none',
                    fontWeight: 600,

                    width: {
                      xs: '100%',
                      sm: 'auto',
                    },

                    px: {
                      sm: 3,
                    },
                  }}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* ====================================================
            PREFERENCES
        ==================================================== */}

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
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
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

                transition:
                  'box-shadow 0.25s ease',

                '&:hover': {
                  boxShadow: {
                    xs: 'none',
                    sm: theme.shadows[3],
                  },
                },
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
                {/* Section Header */}
                <Box
                  sx={{
                    mb: {
                      xs: 1,
                      sm: 1.5,
                      md: 2,
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
                    Preferences
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                      fontSize: {
                        xs: '0.7rem',
                        sm: '0.75rem',
                      },
                      lineHeight: 1.5,
                    }}
                  >
                    Control your notifications and
                    security preferences.
                  </Typography>
                </Box>

                <Divider
                  sx={{
                    mb: {
                      xs: 0,
                      sm: 0.5,
                    },
                  }}
                />

                {/* Notifications */}
                <PreferenceRow
                  icon={
                    NotificationsNoneIcon
                  }
                  title="Enable Notifications"
                  description="Receive notifications about important account activity."
                  name="notifications"
                  checked={
                    formData.notifications
                  }
                />

                {/* Email Updates */}
                <PreferenceRow
                  icon={EmailOutlinedIcon}
                  title="Email Updates"
                  description="Receive product updates, news and announcements."
                  name="emailUpdates"
                  checked={
                    formData.emailUpdates
                  }
                />

                {/* Two Factor */}
                <PreferenceRow
                  icon={SecurityOutlinedIcon}
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account."
                  name="twoFactor"
                  checked={formData.twoFactor}
                  last
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* ======================================================
          SECURITY INFORMATION
      ====================================================== */}

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
          duration: 0.4,
          delay: 0.2,
        }}
      >
        <Box
          sx={{
            mt: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },

            p: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },

            borderRadius:
              commonTokens.radius.md,

            border: `1px solid ${alpha(
              theme.palette.info.main,
              0.25
            )}`,

            backgroundColor: alpha(
              theme.palette.info.main,
              0.05
            ),
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: {
                xs: '0.75rem',
                sm: '0.8rem',
              },

              color:
                theme.palette.info.main,

              mb: 0.5,
            }}
          >
            Security tip
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: {
                xs: '0.68rem',
                sm: '0.75rem',
              },

              lineHeight: 1.6,
            }}
          >
            Enable Two-Factor Authentication
            to add an additional layer of
            security to your administrator
            account.
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Settings;