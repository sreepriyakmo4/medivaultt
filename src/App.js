// src/App.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import './App.css';

// Create theme with MediVault blue colors
const theme = createTheme({
  palette: {
    primary: { 
      main: '#1e5dbc', // MediVault primary blue
      light: '#4a7fd6',
      dark: '#1548a3'
    },
    secondary: { 
      main: '#2196f3',
      light: '#4dabf5',
      dark: '#1976d2'
    },
    success: {
      main: '#4caf50'
    },
    error: {
      main: '#f44336'
    },
    warning: {
      main: '#ff9800'
    },
    info: {
      main: '#00bcd4'
    },
    background: {
      default: '#f8f9fc',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)'
          }
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
          transition: 'all 0.3s ease'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16
        }
      }
    }
  },
  shape: {
    borderRadius: 12
  }
});

/**
 * PrivateRoute Component
 * Protects routes based on authentication and role
 */
function PrivateRoute({ children, user, requiredRole }) {
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If a specific role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          {/* Landing page - show for unauthenticated users */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Public Authentication Routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          {/* Protected Admin Dashboard */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute user={user} requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Doctor Dashboard with nested routes */}
          {/* Nested routes: /doctor, /doctor/appointments, /doctor/prescriptions, /doctor/test-reports */}
          <Route
            path="/doctor/*"
            element={
              <PrivateRoute user={user} requiredRole="doctor">
                <DoctorDashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Patient Dashboard with nested routes */}
          {/* Nested routes: /patient, /patient/expenses, /patient/reports */}
          <Route
            path="/patient/*"
            element={
              <PrivateRoute user={user} requiredRole="patient">
                <PatientDashboard />
              </PrivateRoute>
            }
          />

          {/* Dashboard redirect route - automatically redirects based on user role */}
          <Route
            path="/dashboard"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : user.role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : user.role === 'doctor' ? (
                <Navigate to="/doctor" replace />
              ) : user.role === 'patient' ? (
                <Navigate to="/patient" replace />
              ) : (
                // Fallback for any unexpected role
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Fallback route - redirect any unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
