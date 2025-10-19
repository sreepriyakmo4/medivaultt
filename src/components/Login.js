// src/components/Login.js
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
  Divider,
  Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Login() {
  const [identifier, setIdentifier] = useState(''); // username or email
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState('patient'); // UI only
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      // success: redirect user to dashboard route
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Unexpected error while logging in');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Container component="main" maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Logo size="large" showText={true} />
        </Box>

        <Card elevation={0} sx={{ width: '100%', maxWidth: 400, mx: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
              <Typography variant="h6" sx={{ cursor: 'pointer', fontWeight: roleSelection === 'doctor' ? 700 : 400 }} onClick={() => setRoleSelection('doctor')}>Doctor</Typography>
              <Typography variant="h6" sx={{ cursor: 'pointer', fontWeight: roleSelection === 'patient' ? 700 : 400 }} onClick={() => setRoleSelection('patient')}>Patient</Typography>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              {roleSelection === 'doctor' ? 'Doctor Login' : 'Patient Login'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="username or email"
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
                placeholder="Your password"
                sx={{ mb: 3 }}
              />

              {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

              <Divider sx={{ my: 3 }} />

              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 1, mb: 3 }}>
                {loading ? 'Signing In...' : 'Login'}
              </Button>

              <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 1 }}>
                Don't have an account? <MuiLink component={Link} to="/register">Register here</MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
