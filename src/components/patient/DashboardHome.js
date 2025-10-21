import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  EventAvailable,
  MedicalServices,
  CalendarToday,
  Pending,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase';

function DashboardHome({ patientInfo }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newAppointment, setNewAppointment] = useState({
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    symptoms: ''
  });

  useEffect(() => {
    if (patientInfo?.id) {
      fetchPrescriptions();
      fetchAppointments();
    }
    fetchDoctors();
  }, [patientInfo]);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select(`*, user:users(name)`);
    if (!error) setDoctors(data || []);
  };

  const fetchPrescriptions = async () => {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`*, doctor:doctors(user:users(name))`)
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
      if (!patientInfo?.id) throw new Error('Patient information not found');

      const selectedDoctor = doctors.find(d => d.id == newAppointment.doctor_id);
      if (!selectedDoctor) throw new Error('Selected doctor not found');

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
      setNewAppointment({ doctor_id: '', appointment_date: '', appointment_time: '', symptoms: '' });
      fetchAppointments();
      showSnackbar('Appointment requested successfully!');
    } catch (error) {
      showSnackbar('Error: ' + error.message, 'error');
    }
  };

  const getAppointmentStatusColor = (status) => {
    const colors = { pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'error' };
    return colors[status] || 'default';
  };

  const getAppointmentStatusIcon = (status) => {
    const icons = { pending: <Pending />, confirmed: <CheckCircle />, completed: <CheckCircle />, cancelled: <Cancel /> };
    return icons[status] || <Pending />;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your appointments and prescriptions
        </Typography>
      </Box>

      {/* Quick Action Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<EventAvailable />}
          onClick={() => setOpenAppointmentDialog(true)}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
            boxShadow: '0 4px 15px rgba(30, 93, 188, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              boxShadow: '0 6px 20px rgba(30, 93, 188, 0.4)'
            }
          }}
        >
          Book New Appointment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Prescriptions */}
        <Grid item xs={12} lg={6}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%',
              border: '1px solid #e3f2fd',
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(30, 93, 188, 0.08)'
            }}
          >
            <CardHeader
              sx={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderBottom: '1px solid #e3f2fd'
              }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MedicalServices sx={{ color: '#1976d2' }} />
                  <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                    My Prescriptions
                  </Typography>
                  <Chip 
                    label={prescriptions.length} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#2196f3', 
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Box>
              }
            />
            <CardContent sx={{ maxHeight: 600, overflow: 'auto', p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {prescriptions.map(prescription => (
                  <Paper 
                    key={prescription.id} 
                    elevation={0}
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 2,
                      border: '1px solid #e3f2fd',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(30, 93, 188, 0.12)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }} gutterBottom>
                      {prescription.medicine_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Dr. {prescription.doctor?.user?.name}
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
                        <Chip 
                          label={`$${(prescription.days * prescription.cost_per_day).toFixed(2)}`} 
                          sx={{ 
                            bgcolor: '#4caf50', 
                            color: 'white',
                            fontWeight: 600
                          }} 
                          size="small" 
                        />
                      </Grid>
                    </Grid>
                    {prescription.instructions && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Instructions:</strong> {prescription.instructions}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
                {prescriptions.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <MedicalServices sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                    <Typography color="text.secondary" variant="h6">
                      No prescriptions yet
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Appointments */}
        <Grid item xs={12} lg={6}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%',
              border: '1px solid #e8f5e9',
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(76, 175, 80, 0.08)'
            }}
          >
            <CardHeader
              sx={{
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderBottom: '1px solid #e8f5e9'
              }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ color: '#4caf50' }} />
                  <Typography variant="h6" sx={{ color: '#1b5e20', fontWeight: 600 }}>
                    My Appointments
                  </Typography>
                  <Chip 
                    label={appointments.length} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#4caf50', 
                      color: 'white',
                      fontWeight: 600
                    }} 
                  />
                </Box>
              }
            />
            <CardContent sx={{ maxHeight: 600, overflow: 'auto', p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {appointments.map(appointment => (
                  <Paper 
                    key={appointment.id} 
                    elevation={0}
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 2,
                      border: '1px solid #e8f5e9',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.12)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }} gutterBottom>
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
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              <strong>Fee:</strong> ${appointment.consultation_fee}
                            </Typography>
                          </Grid>
                        </Grid>
                        {appointment.symptoms && (
                          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Symptoms:</strong> {appointment.symptoms}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Chip
                        icon={getAppointmentStatusIcon(appointment.status)}
                        label={appointment.status}
                        color={getAppointmentStatusColor(appointment.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Paper>
                ))}
                {appointments.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CalendarToday sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                    <Typography color="text.secondary" variant="h6">
                      No appointments scheduled
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Book Appointment Dialog */}
      <Dialog 
        open={openAppointmentDialog} 
        onClose={() => setOpenAppointmentDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(30, 93, 188, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventAvailable sx={{ mr: 1 }} />
            Book New Appointment
          </Box>
        </DialogTitle>
        <form onSubmit={scheduleAppointment}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                placeholder="Describe your symptoms..."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenAppointmentDialog(false)} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                }
              }}
            >
              Book Appointment
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default DashboardHome;
