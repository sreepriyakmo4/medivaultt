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
  Chip,
  Button
} from '@mui/material';
import {
  Dashboard,
  Receipt,
  Assessment,
  Menu as MenuIcon,
  ChevronLeft,
  Logout,
  Person,
  Cake,
  Bloodtype,
  Male,
  Female,
  Transgender
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

// Import child components
import DashboardHome from './patient/DashboardHome';
import ExpensesPage from './patient/ExpensesPage';
import ReportsPage from './patient/ReportsPage';
import Logo from './Logo'; // Import the Logo component

const drawerWidth = 280;

function PatientDashboard() {
  const [open, setOpen] = useState(true);
  const [patientInfo, setPatientInfo] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchPatientData();
  }, [user]);

  const fetchPatientData = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (!error) setPatientInfo(data);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/patient' },
    { text: 'Expenses', icon: <Receipt />, path: '/patient/expenses' },
    { text: 'Reports', icon: <Assessment />, path: '/patient/reports' }
  ];

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male': return <Male sx={{ color: '#1976d2' }} />;
      case 'female': return <Female sx={{ color: '#e91e63' }} />;
      default: return <Transgender sx={{ color: '#9c27b0' }} />;
    }
  };

  const displayPatientId = () => {
    if (!patientInfo?.id) return 'N/A';
    const idString = String(patientInfo.id);
    return idString.length > 8 ? `${idString.substring(0, 8)}...` : idString;
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
            Welcome, {user?.name}
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
        
        {/* Patient Profile Section in Sidebar */}
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
              {user?.name}
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Patient ID: {displayPatientId()}
            </Typography>

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />

            {/* Patient Details List */}
            <List dense sx={{ textAlign: 'left' }}>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Cake sx={{ color: '#2196f3', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Age
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {patientInfo?.age || 'Not specified'}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {getGenderIcon(patientInfo?.gender)}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Gender
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {patientInfo?.gender || 'Not specified'}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Bloodtype sx={{ color: '#f44336', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Blood Group
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                      {patientInfo?.blood_group || 'Not specified'}
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
          <Route path="/" element={<DashboardHome patientInfo={patientInfo} />} />
          <Route path="/expenses" element={<ExpensesPage patientInfo={patientInfo} />} />
          <Route path="/reports" element={<ReportsPage patientInfo={patientInfo} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default PatientDashboard;
