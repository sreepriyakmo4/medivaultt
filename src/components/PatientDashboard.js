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
  TextField,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  Logout,
  Person,
  MedicalServices,
  CalendarToday,
  AttachMoney,
  LocalHospital,
  Receipt,
  EventAvailable,
  Schedule,
  HealthAndSafety,
  Bloodtype,
  Cake,
  Male,
  Female,
  Transgender,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

function PatientDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [newAppointment, setNewAppointment] = useState({
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    symptoms: ''
  });

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchPatientData();
    fetchDoctors();
  }, [user]);

  useEffect(() => {
    if (patientInfo?.id) {
      fetchPrescriptions();
      fetchAppointments();
    }
  }, [patientInfo]);

  const fetchPatientData = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (!error) setPatientInfo(data);
  };

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        user:users(name)
      `);
    if (!error) setDoctors(data || []);
  };

  const fetchPrescriptions = async () => {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:doctors(
          user:users(name)
        )
      `)
      .eq('patient_id', patientInfo.id)
      .order('created_at', { ascending: false });
    if (!error) setPrescriptions(data || []);
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctors(
          user:users(name),
          consultation_fee,
          specialization
        )
      `)
      .eq('patient_id', patientInfo.id)
      .order('appointment_date', { ascending: true });
    if (!error) setAppointments(data || []);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const scheduleAppointment = async (e) => {
    e.preventDefault();
    try {
      if (!patientInfo?.id) {
        throw new Error('Patient information not found');
      }

      // Get selected doctor's consultation fee
      const selectedDoctor = doctors.find(d => d.id == newAppointment.doctor_id);
      if (!selectedDoctor) {
        throw new Error('Selected doctor not found');
      }

      const { error } = await supabase
        .from('appointments')
        .insert([{
          doctor_id: newAppointment.doctor_id,
          patient_id: patientInfo.id,
          appointment_date: newAppointment.appointment_date,
          appointment_time: newAppointment.appointment_time,
          symptoms: newAppointment.symptoms,
          consultation_fee: selectedDoctor.consultation_fee,
          status: 'pending'
        }]);

      if (error) throw error;

      setOpenAppointmentDialog(false);
      setNewAppointment({
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        symptoms: ''
      });
      fetchAppointments();
      showSnackbar('Appointment requested successfully! The doctor will confirm your appointment.');
    } catch (error) {
      showSnackbar('Error scheduling appointment: ' + error.message, 'error');
    }
  };

  const calculateMedicineCost = () => {
    return prescriptions.reduce((total, prescription) => {
      return total + (prescription.days * prescription.cost_per_day);
    }, 0);
  };

  const calculateConsultationCost = () => {
    return appointments
      .filter(apt => apt.status === 'completed')
      .reduce((total, appointment) => {
        return total + (appointment.consultation_fee || 0);
      }, 0);
  };

  const calculateTotalExpense = () => {
    return calculateMedicineCost() + calculateConsultationCost();
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getAppointmentStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Pending />;
      case 'confirmed': return <CheckCircle />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      default: return <Pending />;
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male': return <Male />;
      case 'female': return <Female />;
      default: return <Transgender />;
    }
  };

  // Fixed: Safely handle patient ID display
  const displayPatientId = () => {
    if (!patientInfo?.id) return 'N/A';
    
    // Convert to string and take first 8 characters
    const idString = String(patientInfo.id);
    return idString.length > 8 ? `${idString.substring(0, 8)}...` : idString;
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <LocalHospital sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient Dashboard
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
          {/* Patient Information & Actions */}
          <Grid item xs={12} md={4}>
            {/* Patient Profile Card */}
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Patient ID: {displayPatientId()}
                </Typography>

                <List dense sx={{ textAlign: 'left' }}>
                  <ListItem>
                    <ListItemIcon>
                      <Cake color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Age" 
                      secondary={patientInfo?.age || 'Not specified'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {getGenderIcon(patientInfo?.gender)}
                    </ListItemIcon>
                    <ListItemText 
                      primary="Gender" 
                      secondary={patientInfo?.gender || 'Not specified'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Bloodtype color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Blood Group" 
                      secondary={patientInfo?.blood_group || 'Not specified'} 
                    />
                  </ListItem>
                </List>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<EventAvailable />}
                  onClick={() => setOpenAppointmentDialog(true)}
                  sx={{ mt: 2, width: '100%' }}
                >
                  Book New Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Expense Summary */}
            <Card elevation={3}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Receipt sx={{ mr: 1 }} />
                    Expense Summary
                  </Box>
                }
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MedicalServices color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        Medicine Cost
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="bold">
                      ${calculateMedicineCost().toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalHospital color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        Consultation Fees
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="bold">
                      ${calculateConsultationCost().toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                      Total Expenses
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${calculateTotalExpense().toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Prescriptions */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: 'fit-content' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MedicalServices sx={{ mr: 1 }} />
                    My Prescriptions
                    <Chip 
                      label={prescriptions.length} 
                      size="small" 
                      color="primary" 
                      sx={{ ml: 2 }} 
                    />
                  </Box>
                }
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {prescriptions.map(prescription => (
                    <Paper key={prescription.id} variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="div" color="primary" gutterBottom>
                            {prescription.medicine_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Prescribed by: Dr. {prescription.doctor?.user?.name}
                          </Typography>
                          
                          <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Dosage:</strong> {prescription.dosage}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Frequency:</strong> {prescription.frequency}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Duration:</strong> {prescription.days} days
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Cost/Day:</strong> ${prescription.cost_per_day}
                              </Typography>
                            </Grid>
                          </Grid>
                          
                          {prescription.instructions && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Instructions:</strong> {prescription.instructions}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Chip 
                          label={`$${(prescription.days * prescription.cost_per_day).toFixed(2)}`}
                          color="success"
                          variant="filled"
                          size="medium"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Prescribed on: {new Date(prescription.created_at).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  ))}
                  {prescriptions.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <MedicalServices sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography color="text.secondary" variant="h6" gutterBottom>
                        No Prescriptions Yet
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Your prescriptions will appear here once prescribed by a doctor.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Appointments */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: 'fit-content' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1 }} />
                    My Appointments
                    <Chip 
                      label={appointments.length} 
                      size="small" 
                      color="secondary" 
                      sx={{ ml: 2 }} 
                    />
                  </Box>
                }
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {appointments.map(appointment => (
                    <Paper key={appointment.id} variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="div" color="primary" gutterBottom>
                            Dr. {appointment.doctor?.user?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {appointment.doctor?.specialization}
                          </Typography>
                          
                          <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Time:</strong> {appointment.appointment_time}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Fee:</strong> ${appointment.consultation_fee}
                              </Typography>
                            </Grid>
                          </Grid>
                          
                          {appointment.symptoms && (
                            <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Symptoms:</strong> {appointment.symptoms}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Chip 
                            icon={getAppointmentStatusIcon(appointment.status)}
                            label={appointment.status}
                            color={getAppointmentStatusColor(appointment.status)}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                  {appointments.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CalendarToday sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography color="text.secondary" variant="h6" gutterBottom>
                        No Appointments Yet
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        Schedule your first appointment to get started.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Book Appointment Dialog */}
      <Dialog 
        open={openAppointmentDialog} 
        onClose={() => setOpenAppointmentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventAvailable sx={{ mr: 1 }} />
            Book New Appointment
          </Box>
        </DialogTitle>
        <form onSubmit={scheduleAppointment}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  value={newAppointment.doctor_id}
                  label="Select Doctor"
                  onChange={(e) => setNewAppointment({...newAppointment, doctor_id: e.target.value})}
                >
                  {doctors.map(doctor => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.user?.name} - {doctor.specialization} (${doctor.consultation_fee})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Appointment Date"
                type="date"
                value={newAppointment.appointment_date}
                onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />

              <TextField
                label="Appointment Time"
                type="time"
                value={newAppointment.appointment_time}
                onChange={(e) => setNewAppointment({...newAppointment, appointment_time: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />

              <TextField
                label="Symptoms (Optional)"
                value={newAppointment.symptoms}
                onChange={(e) => setNewAppointment({...newAppointment, symptoms: e.target.value})}
                multiline
                rows={3}
                fullWidth
                placeholder="Describe your symptoms, concerns, or reason for visit..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAppointmentDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<EventAvailable />}>
              Book Appointment
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
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

export default PatientDashboard;