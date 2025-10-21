// src/components/LandingPage.jsx
import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as UsersIcon,
  Description as FileTextIcon,
  Medication as PillIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as DollarIcon,
  Settings as SettingsIcon,
  Favorite as HeartIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
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

// SIMPLIFIED HEADER COMPONENT
function Header({ onLoginClick, onRegisterClick, onAboutClick, onContactClick }) {
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

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
          <Button 
            disableRipple 
            onClick={onAboutClick}
            sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}
          >
            About
          </Button>
          <Button 
            disableRipple 
            onClick={onContactClick}
            sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 600 }}
          >
            Contact
          </Button>
        </Box>

        {/* Action Buttons */}
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
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [openContactDialog, setOpenContactDialog] = useState(false);

  const handleAbout = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContact = () => {
    setOpenContactDialog(true);
  };

  const handleCloseContact = () => {
    setOpenContactDialog(false);
  };

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      {/* HEADER */}
      <Header 
        onLoginClick={() => navigate('/login')} 
        onRegisterClick={() => navigate('/register')} 
        onAboutClick={handleAbout}
        onContactClick={handleContact}
      />

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

      {/* FEATURES */}
      <Box id="features" sx={{ py: { xs: 10, md: 12 }, bgcolor: '#F9FAFB' }}>
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

      {/* CONTACT DIALOG */}
      <Dialog open={openContactDialog} onClose={handleCloseContact} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon />
            <Typography variant="h6" fontWeight="bold">Contact MediVault Team</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: '#1a237e' }}>
            Get in Touch
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Our dedicated team is here to help you with any questions, support, or feedback. 
            Reach out to us through any of the following channels.
          </Typography>

          {/* Team Members */}
          <Grid container spacing={3}>
            {/* Sohin */}
            <Grid item xs={12} md={6} lg={3}>
              <Card elevation={0} sx={{ border: '1px solid #e3f2fd', borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: '#2196f3', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      S
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">Sohin</Typography>
                    <Chip label="Lead Developer" size="small" sx={{ mt: 0.5, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                    <Typography variant="body2">+91 9947683493</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>sohin@medivault.co.in</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sreepriya */}
            <Grid item xs={12} md={6} lg={3}>
              <Card elevation={0} sx={{ border: '1px solid #e8f5e9', borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: '#4caf50', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      SP
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">Sreepriya</Typography>
                    <Chip label="Project Manager" size="small" sx={{ mt: 0.5, bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                    <Typography variant="body2">+91 9988888899</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>sreepriya@medivault.co.in</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sreesutha */}
            <Grid item xs={12} md={6} lg={3}>
              <Card elevation={0} sx={{ border: '1px solid #fce4ec', borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: '#e91e63', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      SS
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">Sreesutha</Typography>
                    <Chip label="UI/UX Designer" size="small" sx={{ mt: 0.5, bgcolor: '#fce4ec', color: '#c2185b', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                    <Typography variant="body2">+91 0000923444</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>sreesutha@medivault.co.in</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sneha */}
            <Grid item xs={12} md={6} lg={3}>
              <Card elevation={0} sx={{ border: '1px solid #fff3e0', borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: '#ff9800', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      SN
                    </Avatar>
                    <Typography variant="h6" fontWeight="600">Sneha</Typography>
                    <Chip label="HR Manager" size="small" sx={{ mt: 0.5, bgcolor: '#fff3e0', color: '#e65100', fontWeight: 600 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                    <Typography variant="body2">+91 99999984839</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>sneha@medivault.co.in</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* General Contact Info */}
          <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: '#1a237e' }}>
              General Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <EmailIcon sx={{ color: '#2196f3', fontSize: 24 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">General Inquiries</Typography>
                    <Typography variant="body2" fontWeight="600">support@medivault.co.in</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PhoneIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Support Hotline</Typography>
                    <Typography variant="body2" fontWeight="600">+91 9947683493</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ fontSize: 24 }}>🌐</Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Website</Typography>
                    <Typography variant="body2" fontWeight="600">
                      <a href="https://medivault.co.in" target="_blank" rel="noopener noreferrer" style={{ color: '#2196f3', textDecoration: 'none' }}>
                        medivault.co.in
                      </a>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Business Hours */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
              📞 Business Hours
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monday - Friday: 9:00 AM - 6:00 PM IST
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saturday: 10:00 AM - 4:00 PM IST
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sunday: Closed
            </Typography>
          </Box>

          {/* Call to Action */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              💡 <strong>Need immediate assistance?</strong> Contact Sohin directly at +91 9947683493 for urgent support or technical queries.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => window.open('mailto:support@medivault.co.in')}
            variant="outlined"
            sx={{ borderColor: '#2196f3', color: '#2196f3' }}
          >
            Send Email
          </Button>
          <Button 
            onClick={handleCloseContact} 
            variant="contained" 
            sx={{ background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
