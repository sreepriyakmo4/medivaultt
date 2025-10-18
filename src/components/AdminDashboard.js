import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Logout,
  Add,
  Delete,
  Person,
  MedicalServices
} from '@mui/icons-material';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'doctor',
    name: '',
    age: '',
    gender: ''
  });

  const { logout, user } = useAuth();

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'doctor');
    if (!error) setDoctors(data || []);
  };

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        doctor:users(name)
      `);
    if (!error) setPatients(data || []);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      // Insert into users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{
          username: newUser.username,
          password: newUser.password,
          role: newUser.role,
          name: newUser.name
        }])
        .select()
        .single();

      if (userError) throw userError;

      // If patient, also insert into patients table
      if (newUser.role === 'patient') {
        const { error: patientError } = await supabase
          .from('patients')
          .insert([{
            name: newUser.name,
            age: parseInt(newUser.age) || null,
            gender: newUser.gender,
            doctor_id: doctors[0]?.id // Assign to first doctor by default
          }]);

        if (patientError) throw patientError;
      }

      setOpenAddForm(false);
      setNewUser({ username: '', password: '', role: 'doctor', name: '', age: '', gender: '' });
      fetchDoctors();
      fetchPatients();
      showSnackbar('User added successfully!');
    } catch (error) {
      showSnackbar('Error adding user: ' + error.message, 'error');
    }
  };

  const deleteUser = async (id, role, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;

        if (role === 'doctor' || role === 'patient') {
          fetchDoctors();
          fetchPatients();
        }
        showSnackbar('User removed successfully!');
      } catch (error) {
        showSnackbar('Error removing user: ' + error.message, 'error');
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <MedicalServices sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.8 }}>
            Welcome, {user?.name}
          </Typography>
          <Button 
            color="inherit" 
            onClick={logout}
            startIcon={<Logout />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Doctors Panel */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} />
                    Doctors
                    <Chip 
                      label={doctors.length} 
                      size="small" 
                      color="primary" 
                      sx={{ ml: 2 }} 
                    />
                  </Box>
                }
                action={
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenAddForm(true)}
                  >
                    Add User
                  </Button>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {doctors.map(doctor => (
                    <Card key={doctor.id} variant="outlined">
                      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6" component="div">
                              {doctor.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Username: {doctor.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Joined: {new Date(doctor.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => deleteUser(doctor.id, 'doctor', doctor.name)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  {doctors.length === 0 && (
                    <Typography color="text.secondary" textAlign="center" py={3}>
                      No doctors found
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Patients Panel */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MedicalServices sx={{ mr: 1 }} />
                    Patients
                    <Chip 
                      label={patients.length} 
                      size="small" 
                      color="secondary" 
                      sx={{ ml: 2 }} 
                    />
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {patients.map(patient => (
                    <Card key={patient.id} variant="outlined">
                      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="h6" component="div">
                          {patient.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Age: {patient.age || 'N/A'} | Gender: {patient.gender || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Doctor: {patient.doctor?.name || 'Not assigned'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Record Created: {new Date(patient.created_at).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                  {patients.length === 0 && (
                    <Typography color="text.secondary" textAlign="center" py={3}>
                      No patients found
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Add User Dialog */}
      <Dialog 
        open={openAddForm} 
        onClose={() => setOpenAddForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New User</DialogTitle>
        <form onSubmit={addUser}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  label="Role"
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="patient">Patient</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                required
                fullWidth
              />

              <TextField
                label="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
                fullWidth
              />

              {newUser.role === 'patient' && (
                <>
                  <TextField
                    label="Age"
                    type="number"
                    value={newUser.age}
                    onChange={(e) => setNewUser({...newUser, age: e.target.value})}
                    fullWidth
                  />

                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={newUser.gender}
                      label="Gender"
                      onChange={(e) => setNewUser({...newUser, gender: e.target.value})}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddForm(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Add User
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;