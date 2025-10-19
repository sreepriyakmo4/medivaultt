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
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const roles = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' }
];

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
  const [username, setUsername] = useState('');
  const [name, setName] = useState(''); // full name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');

  // patient-only
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // doctor-only (optional)
  const [specialization, setSpecialization] = useState('');
  const [consultationFee, setConsultationFee] = useState('');

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

    if (role === 'patient' && (!age || !gender || !bloodGroup)) {
      setError('Please fill age, gender and blood group for patients.');
      return;
    }

    setLoading(true);
    try {
      const patientDetails = role === 'patient' ? {
        age: age ? parseInt(age, 10) : null,
        gender,
        blood_group: bloodGroup,
        date_of_birth: dateOfBirth || null
      } : null;

      const doctorDetails = role === 'doctor' ? {
        specialization,
        consultation_fee: consultationFee ? parseFloat(consultationFee) : null
      } : null;

      const res = await registerUser({
        username,
        password,
        name,
        email,
        role,
        patientDetails,
        doctorDetails
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
      setError(err.message || 'Unexpected error');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Logo size="large" showText />
        </Box>

        <Card sx={{ border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
              Create an account
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
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

              <TextField
                select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
                margin="normal"
              >
                {roles.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>

              {role === 'patient' && (
                <>
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
                    <Select value={gender} label="Gender" onChange={(e) => setGender(e.target.value)}>
                      {genders.map(g => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Blood Group</InputLabel>
                    <Select value={bloodGroup} label="Blood Group" onChange={(e) => setBloodGroup(e.target.value)}>
                      {bloodGroups.map(b => <MenuItem key={b.value} value={b.value}>{b.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                </>
              )}

              {role === 'doctor' && (
                <>
                  <TextField
                    label="Specialization"
                    fullWidth
                    margin="normal"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                  <TextField
                    label="Consultation fee"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                  />
                </>
              )}

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
