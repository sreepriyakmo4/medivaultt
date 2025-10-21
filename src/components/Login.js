// src/components/Login.js
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your username/email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier.trim(), password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials');
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Unexpected error while logging in');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container
        component="main"
        maxWidth="sm"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 460,
            mx: 'auto',
            borderRadius: 3,
            boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
            overflow: 'visible',
            p: 4,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Heart icon now INSIDE the card */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  mb: 2,
                }}
              >
                <Heart size={26} />
              </Box>
            </Box>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Welcome to MediVault
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Sign in to access your medical records securely
              </Typography>
            </Box>

            {/* Role Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <ToggleButtonGroup
                value={roleSelection}
                exclusive
                onChange={(_, val) => {
                  if (val) setRoleSelection(val);
                }}
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    px: 3,
                    fontWeight: 500,
                  },
                }}
              >
                <ToggleButton value="patient">Patient</ToggleButton>
                <ToggleButton value="doctor">Doctor</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: 'center', mb: 2, fontWeight: 600 }}
            >
              {roleSelection === 'doctor' ? 'Doctor Login' : 'Patient Login'}
            </Typography>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="username or email"
                sx={{ mb: 2 }}
                autoComplete="username"
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                sx={{ mb: 1.5 }}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
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
                  py: 1.25,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: 'none',
                }}
              >
                {loading ? 'Signing In...' : 'Login'}
              </Button>

              <Typography
                variant="body2"
                textAlign="center"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Don’t have an account?{' '}
                <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
