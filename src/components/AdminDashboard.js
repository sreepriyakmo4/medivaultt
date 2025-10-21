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
  Snackbar,
  Avatar,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import {
  Logout,
  Add,
  Delete,
  Person,
  MedicalServices,
  Dashboard,
  LocalHospital,
  Edit,
  Visibility
} from '@mui/icons-material';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [statistics, setStatistics] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0 });
  const [openAddForm, setOpenAddForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'doctor',
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    specialization: '',
    medical_license_number: '',
    consultation_fee: '150'
  });

  const { logout, user } = useAuth();

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchStatistics();
  }, []);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        user:users(id, username, name, email, phone, created_at)
      `);
    if (!error) setDoctors(data || []);
  };

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        user:users(id, username, name, email, phone, created_at),
        doctor:doctors(id, user:users(name))
      `);
    if (!error) setPatients(data || []);
  };

  const fetchStatistics = async () => {
    const { data: doctorsData } = await supabase.from('doctors').select('id', { count: 'exact' });
    const { data: patientsData } = await supabase.from('patients').select('id', { count: 'exact' });
    const { data: appointmentsData } = await supabase.from('appointments').select('id', { count: 'exact' });
    
    setStatistics({
      totalDoctors: doctorsData?.length || 0,
      totalPatients: patientsData?.length || 0,
      totalAppointments: appointmentsData?.length || 0
    });
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
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone
        }])
        .select()
        .single();

      if (userError) throw userError;

      // If doctor, insert into doctors table
      if (newUser.role === 'doctor') {
        const { error: doctorError } = await supabase
          .from('doctors')
          .insert([{
            user_id: userData.id,
            specialization: newUser.specialization,
            medical_license_number: newUser.medical_license_number,
            consultation_fee: parseFloat(newUser.consultation_fee) || 150.00
          }]);

        if (doctorError) throw doctorError;
      }

      // If patient, insert into patients table
      if (newUser.role === 'patient') {
        const { error: patientError } = await supabase
          .from('patients')
          .insert([{
            user_id: userData.id,
            age: parseInt(newUser.age) || null,
            gender: newUser.gender,
            date_of_birth: null,
            blood_group: null,
            assigned_doctor_id: null
          }]);

        if (patientError) throw patientError;
      }

      setOpenAddForm(false);
      setNewUser({ 
        username: '', 
        password: '', 
        role: 'doctor', 
        name: '', 
        email: '', 
        phone: '', 
        age: '', 
        gender: '',
        specialization: '',
        medical_license_number: '',
        consultation_fee: '150'
      });
      fetchDoctors();
      fetchPatients();
      fetchStatistics();
      showSnackbar(`${newUser.role === 'doctor' ? 'Doctor' : 'Patient'} added successfully!`);
    } catch (error) {
      showSnackbar('Error adding user: ' + error.message, 'error');
    }
  };

  const deleteDoctor = async (doctorId, userId, name) => {
    if (window.confirm(`Are you sure you want to remove Dr. ${name}? This will also delete their user account.`)) {
      try {
        // Delete user (will cascade delete doctor due to foreign key)
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (error) throw error;

        fetchDoctors();
        fetchStatistics();
        showSnackbar('Doctor removed successfully!');
      } catch (error) {
        showSnackbar('Error removing doctor: ' + error.message, 'error');
      }
    }
  };

  const deletePatient = async (patientId, userId, name) => {
    if (window.confirm(`Are you sure you want to remove patient ${name}? This will also delete their user account and all related records.`)) {
      try {
        // Delete user (will cascade delete patient due to foreign key)
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (error) throw error;

        fetchPatients();
        fetchStatistics();
        showSnackbar('Patient removed successfully!');
      } catch (error) {
        showSnackbar('Error removing patient: ' + error.message, 'error');
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)' }}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>
            Welcome, {user?.name}
          </Typography>
          <Button 
            color="inherit" 
            onClick={logout}
            startIcon={<Logout />}
            sx={{ 
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{statistics.totalDoctors}</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Doctors</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <LocalHospital sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{statistics.totalPatients}</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Patients</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <Person sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="bold">{statistics.totalAppointments}</Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Appointments</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <MedicalServices sx={{ fontSize: 32 }} />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Doctors Panel */}
          <Grid item xs={12} lg={6}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalHospital sx={{ mr: 1, color: '#2196f3' }} />
                    <Typography variant="h6" fontWeight="600">Doctors</Typography>
                    <Chip 
                      label={doctors.length} 
                      size="small" 
                      sx={{ ml: 2, bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} 
                    />
                  </Box>
                }
                action={
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                      setNewUser({...newUser, role: 'doctor'});
                      setOpenAddForm(true);
                    }}
                    sx={{ background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)' }}
                  >
                    Add Doctor
                  </Button>
                }
                sx={{ borderBottom: '1px solid #e0e0e0' }}
              />
              <CardContent sx={{ maxHeight: 600, overflowY: 'auto' }}>
                <Stack spacing={2}>
                  {doctors.map(doctor => (
                    <Card key={doctor.id} variant="outlined" sx={{ borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#2196f3', width: 50, height: 50 }}>
                              {doctor.user?.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="600">
                                Dr. {doctor.user?.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {doctor.specialization || 'General Physician'}
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>License:</strong> {doctor.medical_license_number || 'N/A'}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>Fee:</strong> ${doctor.consultation_fee || '150.00'}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>Email:</strong> {doctor.user?.email || 'N/A'}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>Phone:</strong> {doctor.user?.phone || 'N/A'}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>Username:</strong> {doctor.user?.username}
                              </Typography>
                              <Typography variant="caption" color="success.main">
                                Joined: {new Date(doctor.user?.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => deleteDoctor(doctor.id, doctor.user?.id, doctor.user?.name)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  {doctors.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <LocalHospital sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                      <Typography color="text.secondary">No doctors found</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Patients Panel */}
          <Grid item xs={12} lg={6}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, color: '#e91e63' }} />
                    <Typography variant="h6" fontWeight="600">Patients</Typography>
                    <Chip 
                      label={patients.length} 
                      size="small" 
                      sx={{ ml: 2, bgcolor: '#fce4ec', color: '#c2185b', fontWeight: 600 }} 
                    />
                  </Box>
                }
                action={
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                      setNewUser({...newUser, role: 'patient'});
                      setOpenAddForm(true);
                    }}
                    sx={{ background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)' }}
                  >
                    Add Patient
                  </Button>
                }
                sx={{ borderBottom: '1px solid #e0e0e0' }}
              />
              <CardContent sx={{ maxHeight: 600, overflowY: 'auto' }}>
                <Stack spacing={2}>
                  {patients.map(patient => (
                    <Card key={patient.id} variant="outlined" sx={{ borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#e91e63', width: 50, height: 50 }}>
                              {patient.user?.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="600">
                                {patient.user?.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {patient.age || 'N/A'} years • {patient.gender || 'N/A'}
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>Blood Group:</strong> {patient.blood_group || 'N/A'}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>Doctor:</strong> {patient.doctor?.user?.name || 'Not assigned'}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>Email:</strong> {patient.user?.email || 'N/A'}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>Phone:</strong> {patient.user?.phone || 'N/A'}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                <strong>Username:</strong> {patient.user?.username}
                              </Typography>
                              <Typography variant="caption" color="success.main">
                                Registered: {new Date(patient.user?.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => deletePatient(patient.id, patient.user?.id, patient.user?.name)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  {patients.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Person sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                      <Typography color="text.secondary">No patients found</Typography>
                    </Box>
                  )}
                </Stack>
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
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)', color: 'white' }}>
          Add New {newUser.role === 'doctor' ? 'Doctor' : 'Patient'}
        </DialogTitle>
        <form onSubmit={addUser}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
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

              <TextField
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                fullWidth
              />

              <TextField
                label="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                fullWidth
              />

              {newUser.role === 'doctor' && (
                <>
                  <TextField
                    label="Specialization"
                    value={newUser.specialization}
                    onChange={(e) => setNewUser({...newUser, specialization: e.target.value})}
                    placeholder="e.g., Cardiology, Pediatrics"
                    required
                    fullWidth
                  />

                  <TextField
                    label="Medical License Number"
                    value={newUser.medical_license_number}
                    onChange={(e) => setNewUser({...newUser, medical_license_number: e.target.value})}
                    required
                    fullWidth
                  />

                  <TextField
                    label="Consultation Fee ($)"
                    type="number"
                    value={newUser.consultation_fee}
                    onChange={(e) => setNewUser({...newUser, consultation_fee: e.target.value})}
                    inputProps={{ min: 0, step: 0.01 }}
                    fullWidth
                  />
                </>
              )}

              {newUser.role === 'patient' && (
                <>
                  <TextField
                    label="Age"
                    type="number"
                    value={newUser.age}
                    onChange={(e) => setNewUser({...newUser, age: e.target.value})}
                    inputProps={{ min: 0, max: 150 }}
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
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenAddForm(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)' }}
            >
              Add {newUser.role === 'doctor' ? 'Doctor' : 'Patient'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;
