// src/components/LandingPage.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Paper,
  Avatar,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  People as UsersIcon,
  Description as FileTextIcon,
  Medication as PillIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as DollarIcon,
  Settings as SettingsIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Tailwind-like color tokens
const COLORS = {
  blue: { light: '#EFF6FF', main: '#2563EB', border: '#BFDBFE' },
  green: { light: '#ECFDF5', main: '#059669', border: '#A7F3D0' },
  purple: { light: '#F5F3FF', main: '#7C3AED', border: '#DDD6FE' },
  orange: { light: '#FFF7ED', main: '#F97316', border: '#FED7AA' },
  yellow: { light: '#FEFCE8', main: '#EAB308', border: '#FEF08A' },
  red: { light: '#FEF2F2', main: '#DC2626', border: '#FCA5A5' },
};

const features = [
  {
    icon: UsersIcon,
    title: 'User Management',
    desc: 'Comprehensive user management for patients, doctors, and administrators with role-based access control.',
    color: COLORS.blue,
  },
  {
    icon: FileTextIcon,
    title: 'Health Records',
    desc: 'Secure digital storage of medical history, lab results, allergies, and vaccination records.',
    color: COLORS.green,
  },
  {
    icon: PillIcon,
    title: 'Prescriptions & Medications',
    desc: 'Track prescriptions, medication schedules, drug interactions, and automated reminders.',
    color: COLORS.purple,
  },
  {
    icon: CalendarIcon,
    title: 'Appointments & Scheduling',
    desc: 'Seamless appointment booking, calendar management, and consultation tracking.',
    color: COLORS.orange,
  },
  {
    icon: DollarIcon,
    title: 'Finance Management',
    desc: 'Track medical expenses, insurance claims, and healthcare spending with detailed analytics.',
    color: COLORS.yellow,
  },
  {
    icon: SettingsIcon,
    title: 'Administration & Analytics',
    desc: 'Powerful admin tools, system monitoring, audit logs, and comprehensive reporting.',
    color: COLORS.red,
  },
];

function Header({ onLoginClick, onRegisterClick }) {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
          <Avatar
            sx={{
              bgcolor: 'transparent',
              width: 44,
              height: 44,
              border: `2px solid ${COLORS.blue.border}`,
              boxShadow: 'none',
            }}
          >
            <HeartIcon sx={{ fontSize: 22, color: COLORS.blue.main }} />
          </Avatar>

          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}
            >
              MediVault
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Secure health records
            </Typography>
          </Box>
        </Box>

        {/* Nav (keeps compact on small screens) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
          <Button disableRipple sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}>
            Home
          </Button>
          <Button disableRipple sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}>
            Features
          </Button>
          <Button disableRipple sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}>
            Pricing
          </Button>
          <Button disableRipple sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}>
            Docs
          </Button>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onLoginClick}
            sx={{
              borderColor: 'rgba(0,0,0,0.08)',
              color: 'text.primary',
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              py: 0.8,
            }}
          >
            Sign In
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={onRegisterClick}
            sx={{
              backgroundColor: COLORS.blue.main,
              color: 'white',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 0.8,
              '&:hover': { backgroundColor: '#1e40af' },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      {/* Header */}
      <Header onLoginClick={() => navigate('/login')} onRegisterClick={() => navigate('/register')} />

      {/* HERO */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #3730A3 100%)',
          color: 'white',
          py: { xs: 8, md: 14 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.12)',
                width: 80,
                height: 80,
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              }}
            >
              <HeartIcon sx={{ fontSize: 44, color: 'white' }} />
            </Avatar>
          </Box>

          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Welcome to MediVault
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 780,
              mx: 'auto',
              mb: 5,
            }}
          >
            Your comprehensive medical record management system designed to securely store, manage,
            and track your health information with advanced analytics and seamless collaboration.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: '#2563EB',
                fontWeight: 700,
                px: 5,
                py: 1.5,
                '&:hover': { backgroundColor: '#EFF6FF' },
              }}
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.6)',
                fontWeight: 700,
                px: 5,
                py: 1.5,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
              }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* FEATURES: centered CSS Grid - 3 columns on md+, 2 on sm, 1 on xs */}
      <Box sx={{ py: { xs: 10, md: 12 }, bgcolor: '#F9FAFB' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Platform Features"
              sx={{
                bgcolor: '#DBEAFE',
                color: '#1E40AF',
                fontWeight: 700,
                mb: 2,
                px: 2.5,
                py: 0.5,
                borderRadius: 6,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Everything you need for healthcare management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              MediVault provides a complete suite of tools to manage every aspect of your healthcare journey,
              from patient records to financial tracking.
            </Typography>
          </Box>

          {/* CSS Grid wrapper */}
          <Box
            sx={{
              maxWidth: 1100,
              mx: 'auto',
              display: 'grid',
              gap: { xs: 3, md: 4 },
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
              },
              alignItems: 'stretch',
            }}
          >
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    bgcolor: 'white',
                    border: '1px solid #E5E7EB',
                    transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(16,24,40,0.08)',
                      transform: 'translateY(-6px)',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    minHeight: 200,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    {/* colored rounded-square badge */}
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${f.color.border}`,
                        bgcolor: f.color.light,
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ color: f.color.main, fontSize: 26 }} />
                    </Box>

                    {/* text column */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {f.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {f.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
