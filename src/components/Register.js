// src/components/Register.js
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const genders = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];

const bloodGroups = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' }
];

export default function Register() {
  // basic account
  const [username, setUsername] = useState('');
  const [name, setName] = useState(''); // full name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // patient-only fields (required for patients)
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!username.trim() || !password || !name.trim()) {
      setError('Please fill username, name and password.');
      return;
    }

    // patient-required fields validation
    if (!age || !gender || !bloodGroup) {
      setError('Please fill age, gender and blood group for patients.');
      return;
    }

    setLoading(true);
    try {
      const patientDetails = {
        age: age ? parseInt(age, 10) : null,
        gender,
        blood_group: bloodGroup,
        date_of_birth: dateOfBirth || null
      };

      // always register as patient
      const res = await registerUser({
        username,
        password,
        name,
        email,
        role: 'patient',
        patientDetails,
        doctorDetails: null
      });

      if (!res.success) {
        setError(res.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccessMsg('Registration successful! Redirecting to login...');
      setLoading(false);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Unexpected error');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, backgroundColor: '#f9fafb' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: '0 6px 18px rgba(15,23,42,0.06)', overflow: 'visible' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Heart badge inside the card header */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  mb: 2,
                }}
              >
                <Heart size={26} />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Create an account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Join MediVault to manage your medical records securely
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Username"
                required
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                label="Full name"
                required
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label="Email"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                required
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Use a strong password (8+ characters)."
              />

              {/* Role is not shown — always patient */}
              {/* Patient-specific fields */}
              <TextField
                label="Date of birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
              <TextField
                label="Age"
                type="number"
                fullWidth
                margin="normal"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={gender}
                  label="Gender"
                  onChange={(e) => setGender(e.target.value)}
                >
                  {genders.map(g => (
                    <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Blood Group</InputLabel>
                <Select
                  value={bloodGroup}
                  label="Blood Group"
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  {bloodGroups.map(b => (
                    <MenuItem key={b.value} value={b.value}>{b.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {successMsg && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {successMsg}
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
