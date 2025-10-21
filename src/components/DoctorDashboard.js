// src/components/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Paper,
  Button
} from '@mui/material';
import {
  People,
  CalendarToday,
  Assignment,
  Assessment,
  Menu as MenuIcon,
  ChevronLeft,
  Logout,
  MedicalServices
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

// Import child components
import MyPatients from './doctor/MyPatients';
import MyAppointments from './doctor/MyAppointments';
import TestReports from './doctor/TestReports';
import PrescriptionsPage from './doctor/PrescriptionsPage';
import Logo from './Logo';

const drawerWidth = 280;

function DoctorDashboard() {
  const [open, setOpen] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  const fetchDoctorData = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (!error) setDoctorInfo(data);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'My Patients', icon: <People />, path: '/doctor' },
    { text: 'My Appointments', icon: <CalendarToday />, path: '/doctor/appointments' },
    { text: 'Prescriptions', icon: <MedicalServices />, path: '/doctor/prescriptions' },
    { text: 'Test Reports', icon: <Assessment />, path: '/doctor/test-reports' }
  ];

  const displayDoctorId = () => {
    if (!doctorInfo?.medical_license_number) return 'Not Set';
    return doctorInfo.medical_license_number;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
          boxShadow: '0 4px 20px rgba(30, 93, 188, 0.3)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Logo size={45} />
            <Box sx={{ ml: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                MediVault
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                Medical Records
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>
            Welcome, Dr. {user?.name}
          </Typography>

          <Button
            color="inherit"
            onClick={logout}
            startIcon={<Logout />}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
              borderRadius: 2,
              px: 2
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1a1f3a 0%, #0d1526 100%)',
            color: 'white',
            borderRight: 'none'
          }
        }}
      >
        <Toolbar />
        
        {/* Doctor Profile Section in Sidebar */}
        <Box sx={{ p: 3, mt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(30, 93, 188, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              textAlign: 'center'
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: '#2196f3',
                fontSize: '2rem',
                fontWeight: 'bold',
                border: '3px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
              Dr. {user?.name}
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Medical License: {displayDoctorId()}
            </Typography>

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />

            {/* Doctor Details */}
            <List dense sx={{ textAlign: 'left' }}>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <MedicalServices sx={{ color: '#2196f3', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Specialization
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {doctorInfo?.specialization || 'Not specified'}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Assignment sx={{ color: '#4caf50', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Consultation Fee
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      ${doctorInfo?.consultation_fee || 'N/A'}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mx: 2 }} />

        {/* Navigation Menu */}
        <List sx={{ px: 2, mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.1)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: open ? 0 : `-${drawerWidth}px`,
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            }),
          bgcolor: '#f8f9fc',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<MyPatients doctorInfo={doctorInfo} />} />
          <Route path="/appointments" element={<MyAppointments doctorInfo={doctorInfo} />} />
          <Route path="/prescriptions" element={<PrescriptionsPage doctorInfo={doctorInfo} />} />
          <Route path="/test-reports" element={<TestReports doctorInfo={doctorInfo} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default DoctorDashboard;
