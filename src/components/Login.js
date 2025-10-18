import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Alert,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    const loginRole = isAdmin ? 'admin' : role;
    const result = await login(username, password, loginRole);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleAdminAccess = () => {
    setIsAdmin(!isAdmin);
    if (!isAdmin) {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Logo size="large" showText={true} />
        </Box>

        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            mx: 'auto'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Role Selection */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
              <Typography 
                variant="h6" 
                onClick={() => setRole('doctor')}
                sx={{ 
                  cursor: 'pointer',
                  fontWeight: role === 'doctor' ? 700 : 400,
                  color: role === 'doctor' ? '#1976d2' : 'text.primary',
                  borderBottom: role === 'doctor' ? '2px solid #1976d2' : 'none',
                  pb: 0.5
                }}
              >
                Doctor
              </Typography>
              <Typography 
                variant="h6" 
                onClick={() => setRole('patient')}
                sx={{ 
                  cursor: 'pointer',
                  fontWeight: role === 'patient' ? 700 : 400,
                  color: role === 'patient' ? '#1976d2' : 'text.primary',
                  borderBottom: role === 'patient' ? '2px solid #1976d2' : 'none',
                  pb: 0.5
                }}
              >
                Patient
              </Typography>
            </Box>

            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                textAlign: 'center',
                mb: 3
              }}
            >
              {role === 'doctor' ? 'Doctor Login' : 'Patient Login'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isAdmin ? 'Default: admin' : (role === 'doctor' ? 'Default: doctor1' : 'Default: patient1')}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isAdmin ? 'Default: admin123' : (role === 'doctor' ? 'Default: doctor123' : 'Default: patient123')}
                variant="outlined"
                sx={{ mb: 3 }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  mb: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 1,
                  fontWeight: 600,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Login'}
              </Button>

              <Typography 
                variant="caption" 
                textAlign="center" 
                color="text.secondary"
                sx={{ 
                  display: 'block',
                  mb: 2
                }}
              >
                Demo credentials shown in placeholders
              </Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAdmin}
                    onChange={handleAdminAccess}
                    sx={{
                      color: '#1976d2',
                      '&.Mui-checked': {
                        color: '#1976d2',
                      },
                    }}
                  />
                }
                label="Admin Access"
                sx={{ 
                  width: '100%', 
                  justifyContent: 'center',
                  mt: 1
                }}
              />

              {isAdmin && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mt: 2,
                    borderRadius: 1
                  }}
                >
                  Admin credentials have been filled. Click Login to continue.
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Login;