// src/App.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAuth } from './context/AuthContext';

import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// Create theme with medical blue colors
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#0288d1' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

/**
 * PrivateRoute
 * - requiredRole: optional string 'admin'|'doctor'|'patient'
 * - If user not logged in -> navigate to /login
 * - If requiredRole provided but user.role !== requiredRole -> navigate to /login (or could show "Unauthorized")
 */
function PrivateRoute({ children, user, requiredRole }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
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

          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          {/* Protected dashboard routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute user={user} requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <PrivateRoute user={user} requiredRole="doctor">
                <DoctorDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/patient"
            element={
              <PrivateRoute user={user} requiredRole="patient">
                <PatientDashboard />
              </PrivateRoute>
            }
          />

          {/* convenience dashboard route - navigates user to their dashboard based on role */}
          <Route
            path="/dashboard"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : user.role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : user.role === 'doctor' ? (
                <Navigate to="/doctor" replace />
              ) : (
                <Navigate to="/patient" replace />
              )
            }
          />

          {/* fallback 404 -> go to root which already redirects appropriately */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
