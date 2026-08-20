import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha,
} from '@mui/material';

import { motion } from 'framer-motion';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

import { commonTokens } from '../theme/tokens';

const Help = () => {
  const theme = useTheme();

  // ============================================================
  // FAQ DATA
  // ============================================================

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer:
        'You can reset your password by clicking the "Forgot Password" link on the login page. Follow the instructions sent to your email.',
    },
    {
      question: 'How do I manage users?',
      answer:
        'Navigate to the Users section in the sidebar. From there, you can add, edit, or remove users from your organization.',
    },
    {
      question: 'Can I export reports?',
      answer:
        'Yes! Go to the Reports section and click "Download Report" to export your business reports in PDF or CSV format.',
    },
    {
      question: 'How do I customize my dashboard?',
      answer:
        'You can customize your dashboard by dragging cards, hiding sections, and adjusting the layout to your preference.',
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {/* ======================================================
          HERO / HEADER
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
            width: '100%',
            maxWidth: 800,
            mx: 'auto',

            textAlign: 'center',

            mb: {
              xs: 3,
              sm: 4,
              md: commonTokens.spacing.xxxl,
            },

            px: {
              xs: 0,
              sm: 1,
              md: 2,
            },
          }}
        >
          {/* Help Icon */}
          <Box
            sx={{
              width: {
                xs: 64,
                sm: 76,
                md: 88,
              },

              height: {
                xs: 64,
                sm: 76,
                md: 88,
              },

              mx: 'auto',

              mb: {
                xs: 1.5,
                sm: 2,
                md: commonTokens.spacing.lg,
              },

              borderRadius: '50%',

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
            <HelpIcon
              sx={{
                fontSize: {
                  xs: 34,
                  sm: 42,
                  md: 50,
                },
              }}
            />
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,

              fontSize: {
                xs: '1.65rem',
                sm: '1.9rem',
                md: '2.125rem',
              },

              lineHeight: 1.2,

              mb: {
                xs: 0.75,
                sm: commonTokens.spacing.md,
              },
            }}
          >
            Help & Support
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              width: '100%',
              maxWidth: 600,
              mx: 'auto',

              fontSize: {
                xs: '0.8rem',
                sm: '0.875rem',
              },

              lineHeight: 1.7,

              mb: {
                xs: 2.5,
                sm: 3,
                md: commonTokens.spacing.lg,
              },

              px: {
                xs: 1,
                sm: 0,
              },
            }}
          >
            Find answers to common questions and
            get support for your account.
          </Typography>

          {/* ==================================================
              ACTION BUTTONS
          ================================================== */}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',

              flexDirection: {
                xs: 'column',
                sm: 'row',
              },

              gap: {
                xs: 1.25,
                sm: commonTokens.spacing.md,
              },

              width: {
                xs: '100%',
                sm: 'auto',
              },

              maxWidth: {
                xs: 400,
                sm: 'none',
              },

              mx: 'auto',
            }}
          >
            <Button
              variant="contained"
              startIcon={<SupportAgentIcon />}
              sx={{
                width: {
                  xs: '100%',
                  sm: 'auto',
                },

                minHeight: {
                  xs: 44,
                  sm: 40,
                },

                px: {
                  sm: 2.5,
                },

                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Contact Support
            </Button>

            <Button
              variant="outlined"
              startIcon={<MenuBookOutlinedIcon />}
              sx={{
                width: {
                  xs: '100%',
                  sm: 'auto',
                },

                minHeight: {
                  xs: 44,
                  sm: 40,
                },

                px: {
                  sm: 2.5,
                },

                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              View Documentation
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* ======================================================
          FAQ SECTION
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
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 800,

            mx: 'auto',

            minWidth: 0,

            border: `1px solid ${theme.palette.divider}`,

            overflow: 'hidden',

            boxShadow: {
              xs: 'none',
              sm: theme.shadows[1],
            },
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 1.5,
                sm: 2.5,
                md: 3,
              },

              '&:last-child': {
                pb: {
                  xs: 1.5,
                  sm: 2.5,
                  md: 3,
                },
              },
            }}
          >
            {/* FAQ Header */}
            <Box
              sx={{
                mb: {
                  xs: 1.5,
                  sm: 2,
                  md: commonTokens.spacing.lg,
                },

                px: {
                  xs: 0.5,
                  sm: 0,
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

                  lineHeight: 1.4,
                }}
              >
                Frequently Asked Questions
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
                Find quick answers to the most common
                questions.
              </Typography>
            </Box>

            {/* ==================================================
                FAQ ACCORDIONS
            ================================================== */}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: {
                  xs: 0.75,
                  sm: 1,
                },
              }}
            >
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  defaultExpanded={index === 0}
                  disableGutters
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,

                    borderRadius:
                      `${commonTokens.radius.md}px !important`,

                    overflow: 'hidden',

                    backgroundColor:
                      theme.palette.background
                        .paper,

                    transition:
                      'border-color 0.2s ease, background-color 0.2s ease',

                    '&:before': {
                      display: 'none',
                    },

                    '&.Mui-expanded': {
                      margin: 0,

                      borderColor: alpha(
                        theme.palette.primary.main,
                        0.35
                      ),

                      backgroundColor: alpha(
                        theme.palette.primary.main,
                        0.025
                      ),
                    },

                    '&:hover': {
                      borderColor: alpha(
                        theme.palette.primary.main,
                        0.25
                      ),
                    },
                  }}
                >
                  {/* Question */}
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{
                          fontSize: {
                            xs: 20,
                            sm: 22,
                          },
                        }}
                      />
                    }
                    sx={{
                      minHeight: {
                        xs: 54,
                        sm: 58,
                      },

                      px: {
                        xs: 1.5,
                        sm: 2,
                      },

                      '&.Mui-expanded': {
                        minHeight: {
                          xs: 54,
                          sm: 58,
                        },
                      },

                      '& .MuiAccordionSummary-content':
                      {
                        my: {
                          xs: 1.25,
                          sm: 1.5,
                        },

                        mr: 1,

                        '&.Mui-expanded': {
                          my: {
                            xs: 1.25,
                            sm: 1.5,
                          },
                        },
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,

                        fontSize: {
                          xs: '0.78rem',
                          sm: '0.85rem',
                          md: '0.9rem',
                        },

                        lineHeight: 1.5,

                        wordBreak: 'break-word',
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>

                  {/* Answer */}
                  <AccordionDetails
                    sx={{
                      px: {
                        xs: 1.5,
                        sm: 2,
                      },

                      pt: 0,

                      pb: {
                        xs: 1.75,
                        sm: 2,
                      },
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: '0.72rem',
                          sm: '0.78rem',
                          md: '0.85rem',
                        },

                        lineHeight: 1.7,

                        wordBreak: 'break-word',
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* ======================================================
          BOTTOM SUPPORT MESSAGE
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
          delay: 0.15,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 800,

            mx: 'auto',

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
              theme.palette.primary.main,
              0.2
            )}`,

            backgroundColor: alpha(
              theme.palette.primary.main,
              0.04
            ),

            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,

              fontSize: {
                xs: '0.75rem',
                sm: '0.8rem',
              },

              mb: 0.5,
            }}
          >
            Still need help?
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
            Our support team is always available to
            help you with any questions or issues.
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Help;