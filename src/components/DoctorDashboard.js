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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  Logout,
  LocalHospital,
  CalendarToday,
  Person,
  MedicalServices,
  CheckCircle,
  Cancel,
  Assignment
} from '@mui/icons-material';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState('appointments');
  
  const [newPrescription, setNewPrescription] = useState({
    patient_id: '',
    medicine_name: '',
    dosage: '',
    frequency: 'Once daily',
    days: 1,
    cost_per_day: 0,
    instructions: ''
  });

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDoctorData();
    fetchAllPatients();
    fetchMyPrescriptions();
    fetchMyAppointments();
  }, [user]);

  const fetchDoctorData = async () => {
    // Get doctor ID from doctors table
    const { data: doctorData, error } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (!error && doctorData) {
      // Fetch patients assigned to this doctor
      const { data: patientData } = await supabase
        .from('patients')
        .select(`
          *,
          user:users(name)
        `)
        .eq('assigned_doctor_id', doctorData.id);
      
      setPatients(patientData || []);
    }
  };

  const fetchAllPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        user:users(name)
      `);
    if (!error) setAllPatients(data || []);
  };

  const fetchMyPrescriptions = async () => {
    // First get doctor ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!doctorError && doctorData) {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          patient:patients(
            user:users(name)
          )
        `)
        .eq('doctor_id', doctorData.id)
        .order('created_at', { ascending: false });
      if (!error) setPrescriptions(data || []);
    }
  };

  const fetchMyAppointments = async () => {
    // First get doctor ID
    const { data: doctorData, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!doctorError && doctorData) {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(
            user:users(name)
          )
        `)
        .eq('doctor_id', doctorData.id)
        .order('appointment_date', { ascending: true });
      if (!error) setAppointments(data || []);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const prescribeMedicine = async (e) => {
    e.preventDefault();
    try {
      // First get doctor ID
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (doctorError) throw doctorError;

      const { error } = await supabase
        .from('prescriptions')
        .insert([{
          ...newPrescription,
          doctor_id: doctorData.id
        }]);

      if (error) throw error;

      setOpenPrescriptionDialog(false);
      setNewPrescription({
        patient_id: '',
        medicine_name: '',
        dosage: '',
        frequency: 'Once daily',
        days: 1,
        cost_per_day: 0,
        instructions: ''
      });
      fetchMyPrescriptions();
      showSnackbar('Prescription added successfully!');
    } catch (error) {
      showSnackbar('Error prescribing medicine: ' + error.message, 'error');
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: status })
        .eq('id', appointmentId);

      if (error) throw error;

      fetchMyAppointments();
      showSnackbar(`Appointment marked as ${status}`);
    } catch (error) {
      showSnackbar('Error updating appointment: ' + error.message, 'error');
    }
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

  const calculateTotalPrescriptions = () => {
    return prescriptions.length;
  };

  const calculateTotalAppointments = () => {
    return appointments.length;
  };

  const calculateCompletedAppointments = () => {
    return appointments.filter(apt => apt.status === 'completed').length;
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <LocalHospital sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Doctor Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.8 }}>
            Welcome, Dr. {user?.name}
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
        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Person color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="primary" gutterBottom>
                  {patients.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Assigned Patients
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <CalendarToday color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="secondary" gutterBottom>
                  {calculateTotalAppointments()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <MedicalServices color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="success.main" gutterBottom>
                  {calculateTotalPrescriptions()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prescriptions Written
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<MedicalServices />}
            onClick={() => setOpenPrescriptionDialog(true)}
          >
            Write New Prescription
          </Button>
        </Box>

        {/* Tabs for different sections */}
        <Card elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab icon={<CalendarToday />} label="Appointments" value="appointments" />
              <Tab icon={<Person />} label="My Patients" value="patients" />
              <Tab icon={<MedicalServices />} label="Prescriptions" value="prescriptions" />
            </Tabs>
          </Box>

          {/* Appointments Tab - CENTERED */}
          {tabValue === 'appointments' && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3} justifyContent="center">
                {appointments.map(appointment => (
                  <Grid item xs={12} sm={10} md={6} lg={4} key={appointment.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card variant="outlined" sx={{ width: '100%', maxWidth: 400 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {appointment.patient?.user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Date: {new Date(appointment.appointment_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Time: {appointment.appointment_time}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fee: ${appointment.consultation_fee}
                        </Typography>
                        {appointment.symptoms && (
                          <Typography variant="body2" color="text.secondary">
                            Symptoms: {appointment.symptoms}
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 2 }}>
                          <Chip 
                            label={appointment.status || 'pending'}
                            color={getAppointmentStatusColor(appointment.status)}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            disabled={appointment.status === 'confirmed' || appointment.status === 'completed'}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            disabled={appointment.status === 'completed'}
                          >
                            Complete
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            disabled={appointment.status === 'cancelled'}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {appointments.length === 0 && (
                  <Grid item xs={12}>
                    <Typography color="text.secondary" textAlign="center" py={3}>
                      No appointments scheduled
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Patients Tab - CENTERED */}
          {tabValue === 'patients' && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3} justifyContent="center">
                {patients.map(patient => (
                  <Grid item xs={12} sm={10} md={6} lg={4} key={patient.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card variant="outlined" sx={{ width: '100%', maxWidth: 400 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {patient.user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Age: {patient.age || 'N/A'} | Gender: {patient.gender || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Blood Group: {patient.blood_group || 'N/A'}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<MedicalServices />}
                          onClick={() => {
                            setNewPrescription(prev => ({ ...prev, patient_id: patient.id }));
                            setOpenPrescriptionDialog(true);
                          }}
                          sx={{ mt: 2 }}
                          fullWidth
                        >
                          Write Prescription
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {patients.length === 0 && (
                  <Grid item xs={12}>
                    <Typography color="text.secondary" textAlign="center" py={3}>
                      No patients assigned yet
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Prescriptions Tab - CENTERED */}
          {tabValue === 'prescriptions' && (
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3} justifyContent="center">
                {prescriptions.map(prescription => (
                  <Grid item xs={12} sm={10} md={6} lg={4} key={prescription.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card variant="outlined" sx={{ width: '100%', maxWidth: 400 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="h6" component="div">
                              {prescription.medicine_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Patient: {prescription.patient?.user?.name}
                            </Typography>
                            <Typography variant="body2">
                              Dosage: {prescription.dosage} ({prescription.frequency})
                            </Typography>
                            <Typography variant="body2">
                              Duration: {prescription.days} days
                            </Typography>
                            <Typography variant="body2">
                              Cost per day: ${prescription.cost_per_day}
                            </Typography>
                            {prescription.instructions && (
                              <Typography variant="body2">
                                Instructions: {prescription.instructions}
                              </Typography>
                            )}
                          </Box>
                          <Chip 
                            label={`$${(prescription.days * prescription.cost_per_day).toFixed(2)}`}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Prescribed on: {new Date(prescription.created_at).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {prescriptions.length === 0 && (
                  <Grid item xs={12}>
                    <Typography color="text.secondary" textAlign="center" py={3}>
                      No prescriptions written yet
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Card>
      </Container>

      {/* Prescription Dialog */}
      <Dialog 
        open={openPrescriptionDialog} 
        onClose={() => setOpenPrescriptionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MedicalServices sx={{ mr: 1 }} />
            Write New Prescription
          </Box>
        </DialogTitle>
        <form onSubmit={prescribeMedicine}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>Select Patient</InputLabel>
                <Select
                  value={newPrescription.patient_id}
                  label="Select Patient"
                  onChange={(e) => setNewPrescription({...newPrescription, patient_id: e.target.value})}
                >
                  {allPatients.map(patient => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.user?.name} 
                      {patient.age && ` (Age: ${patient.age})`}
                      {patient.gender && `, ${patient.gender}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Medicine Name"
                value={newPrescription.medicine_name}
                onChange={(e) => setNewPrescription({...newPrescription, medicine_name: e.target.value})}
                required
                fullWidth
              />

              <TextField
                label="Dosage (e.g., 500mg)"
                value={newPrescription.dosage}
                onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={newPrescription.frequency}
                  label="Frequency"
                  onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                >
                  <MenuItem value="Once daily">Once daily</MenuItem>
                  <MenuItem value="Twice daily">Twice daily</MenuItem>
                  <MenuItem value="Three times daily">Three times daily</MenuItem>
                  <MenuItem value="Four times daily">Four times daily</MenuItem>
                  <MenuItem value="As needed">As needed</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Duration (Days)"
                type="number"
                value={newPrescription.days}
                onChange={(e) => setNewPrescription({...newPrescription, days: parseInt(e.target.value) || 1})}
                inputProps={{ min: 1 }}
                required
                fullWidth
              />

              <TextField
                label="Cost per day ($)"
                type="number"
                step="0.01"
                value={newPrescription.cost_per_day}
                onChange={(e) => setNewPrescription({...newPrescription, cost_per_day: parseFloat(e.target.value) || 0})}
                required
                fullWidth
              />

              <TextField
                label="Instructions (Optional)"
                value={newPrescription.instructions}
                onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                multiline
                rows={3}
                fullWidth
                placeholder="Additional instructions for the patient..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPrescriptionDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<MedicalServices />}>
              Prescribe Medicine
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

export default DoctorDashboard;