// src/components/doctor/MyPatients.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
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
  Alert,
  Chip,
  Avatar
} from '@mui/material';
import {
  MedicalServices,
  Person,
  Cake,
  Bloodtype,
  Male,
  Female,
  Transgender
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase';

function MyPatients({ doctorInfo }) {
  const [patients, setPatients] = useState([]);
  const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newPrescription, setNewPrescription] = useState({
    medicine_name: '',
    dosage: '',
    frequency: 'Once daily',
    days: 1,
    cost_per_day: 0,
    instructions: ''
  });

  useEffect(() => {
    if (doctorInfo?.id) {
      fetchPatients();
    }
  }, [doctorInfo]);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select(`*, user:users(name)`)
      .eq('assigned_doctor_id', doctorInfo.id);
    if (!error) setPatients(data || []);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePrescribe = (patient) => {
    setSelectedPatient(patient);
    setOpenPrescriptionDialog(true);
  };

  const prescribeMedicine = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert([{
          ...newPrescription,
          doctor_id: doctorInfo.id,
          patient_id: selectedPatient.id
        }]);

      if (error) throw error;

      setOpenPrescriptionDialog(false);
      setNewPrescription({
        medicine_name: '',
        dosage: '',
        frequency: 'Once daily',
        days: 1,
        cost_per_day: 0,
        instructions: ''
      });
      showSnackbar('Prescription added successfully!');
    } catch (error) {
      showSnackbar('Error: ' + error.message, 'error');
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male': return <Male sx={{ color: '#1976d2' }} />;
      case 'female': return <Female sx={{ color: '#e91e63' }} />;
      default: return <Transgender sx={{ color: '#9c27b0' }} />;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
          My Patients
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and prescribe medicines to your assigned patients
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {patients.map((patient) => (
          <Grid item xs={12} sm={6} lg={4} key={patient.id}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e3f2fd',
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(30, 93, 188, 0.08)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 20px rgba(30, 93, 188, 0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: '#2196f3',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      mr: 2
                    }}
                  >
                    {patient.user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                      {patient.user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {String(patient.id).substring(0, 8)}...
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Cake sx={{ fontSize: 18, color: '#2196f3' }} />
                      <Typography variant="body2">
                        {patient.age || 'N/A'} years
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getGenderIcon(patient.gender)}
                      <Typography variant="body2">
                        {patient.gender || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Bloodtype sx={{ fontSize: 18, color: '#f44336' }} />
                      <Typography variant="body2">
                        Blood Group: {patient.blood_group || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<MedicalServices />}
                  onClick={() => handlePrescribe(patient)}
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                    }
                  }}
                >
                  Write Prescription
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {patients.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Person sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No patients assigned yet
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Prescription Dialog */}
      <Dialog open={openPrescriptionDialog} onClose={() => setOpenPrescriptionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MedicalServices sx={{ mr: 1 }} />
            Write Prescription for {selectedPatient?.user?.name}
          </Box>
        </DialogTitle>
        <form onSubmit={prescribeMedicine}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenPrescriptionDialog(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)'
              }}
            >
              Prescribe Medicine
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MyPatients;
