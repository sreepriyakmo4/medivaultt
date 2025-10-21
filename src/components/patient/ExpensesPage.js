import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Receipt,
  MedicalServices,
  LocalHospital,
  AttachMoney
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase';

function ExpensesPage({ patientInfo }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (patientInfo?.id) {
      fetchPrescriptions();
      fetchAppointments();
    }
  }, [patientInfo]);

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
        doctor:doctors(user:users(name), specialization)
      `)
      .eq('patient_id', patientInfo.id)
      .eq('status', 'completed')
      .order('appointment_date', { ascending: false });
    if (!error) setAppointments(data || []);
  };

  const calculateMedicineCost = () => {
    return prescriptions.reduce((total, p) => total + (p.days * p.cost_per_day), 0);
  };

  const calculateConsultationCost = () => {
    return appointments.reduce((total, a) => total + (a.consultation_fee || 0), 0);
  };

  const calculateTotalExpense = () => {
    return calculateMedicineCost() + calculateConsultationCost();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
          Expenses & Billing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your medical expenses and billing history
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)', 
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(30, 93, 188, 0.3)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                    Total Expenses
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    ${calculateTotalExpense().toFixed(2)}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 70, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)', 
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(233, 30, 99, 0.3)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                    Medicine Cost
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    ${calculateMedicineCost().toFixed(2)}
                  </Typography>
                </Box>
                <MedicalServices sx={{ fontSize: 70, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              background: 'linear-gradient(135deg, #00bcd4 0%, #4dd0e1 100%)', 
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 188, 212, 0.3)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                    Consultation Fees
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    ${calculateConsultationCost().toFixed(2)}
                  </Typography>
                </Box>
                <LocalHospital sx={{ fontSize: 70, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Breakdown */}
      <Grid container spacing={3}>
        {/* Medicine Expenses */}
        <Grid item xs={12} lg={6}>
          <Card 
            elevation={0}
            sx={{
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
                    Medicine Expenses
                  </Typography>
                </Box>
              }
            />
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Medicine</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Days</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Cost/Day</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prescriptions.map((p) => (
                      <TableRow 
                        key={p.id}
                        sx={{ 
                          '&:hover': { bgcolor: '#f5f5f5' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>{p.medicine_name}</TableCell>
                        <TableCell>{p.days}</TableCell>
                        <TableCell>${p.cost_per_day}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`$${(p.days * p.cost_per_day).toFixed(2)}`}
                            sx={{ 
                              bgcolor: '#4caf50', 
                              color: 'white',
                              fontWeight: 600
                            }}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {prescriptions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No medicine expenses</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Consultation Expenses */}
        <Grid item xs={12} lg={6}>
          <Card 
            elevation={0}
            sx={{
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
                  <LocalHospital sx={{ color: '#4caf50' }} />
                  <Typography variant="h6" sx={{ color: '#1b5e20', fontWeight: 600 }}>
                    Consultation Expenses
                  </Typography>
                </Box>
              }
            />
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Fee</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((a) => (
                      <TableRow 
                        key={a.id}
                        sx={{ 
                          '&:hover': { bgcolor: '#f5f5f5' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell>Dr. {a.doctor?.user?.name}</TableCell>
                        <TableCell>{new Date(a.appointment_date).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`$${a.consultation_fee}`}
                            sx={{ 
                              bgcolor: '#2196f3', 
                              color: 'white',
                              fontWeight: 600
                            }}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {appointments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No consultation expenses</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ExpensesPage;
