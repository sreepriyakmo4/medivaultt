// src/components/patient/ReportsPage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import {
  Assessment,
  Download,
  Print,
  CalendarToday,
  CheckCircle,
  Description,
  Visibility
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase';

function ReportsPage({ patientInfo }) {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [testReports, setTestReports] = useState([]);
  const [tabValue, setTabValue] = useState('test-reports');

  useEffect(() => {
    if (patientInfo?.id) {
      fetchData();
    }
  }, [patientInfo]);

  const fetchData = async () => {
    const [appointmentsRes, prescriptionsRes, testReportsRes] = await Promise.all([
      supabase
        .from('appointments')
        .select(`*, doctor:doctors(user:users(name), specialization)`)
        .eq('patient_id', patientInfo.id)
        .order('appointment_date', { ascending: false }),
      supabase
        .from('prescriptions')
        .select(`*, doctor:doctors(user:users(name))`)
        .eq('patient_id', patientInfo.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('test_reports')
        .select(`*, doctor:doctors(user:users(name))`)
        .eq('patient_id', patientInfo.id)
        .order('created_at', { ascending: false })
    ]);

    if (!appointmentsRes.error) setAppointments(appointmentsRes.data || []);
    if (!prescriptionsRes.error) setPrescriptions(prescriptionsRes.data || []);
    if (!testReportsRes.error) setTestReports(testReportsRes.data || []);
  };

  const getStatusColor = (status) => {
    const colors = { pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'error' };
    return colors[status] || 'default';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // You can implement PDF generation here using libraries like jsPDF or html2pdf
    alert('PDF download feature coming soon!');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
            Medical Reports & History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your test reports, appointments, and prescription history
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{
              borderColor: '#2196f3',
              color: '#2196f3',
              '&:hover': {
                borderColor: '#1976d2',
                bgcolor: '#e3f2fd'
              }
            }}
          >
            Print
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            sx={{
              background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
              boxShadow: '0 4px 15px rgba(30, 93, 188, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                boxShadow: '0 6px 20px rgba(30, 93, 188, 0.4)'
              }
            }}
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
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
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', 
                  borderRadius: 2 
                }}>
                  <Description sx={{ color: '#1976d2', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
                    {testReports.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Test Reports
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card 
            elevation={0}
            sx={{
              border: '1px solid #e8f5e9',
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(76, 175, 80, 0.08)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.15)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', 
                  borderRadius: 2 
                }}>
                  <CalendarToday sx={{ color: '#4caf50', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#1b5e20' }}>
                    {appointments.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Appointments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card 
            elevation={0}
            sx={{
              border: '1px solid #fce4ec',
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(233, 30, 99, 0.08)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 20px rgba(233, 30, 99, 0.15)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', 
                  borderRadius: 2 
                }}>
                  <Assessment sx={{ color: '#e91e63', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#880e4f' }}>
                    {prescriptions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prescriptions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card 
            elevation={0}
            sx={{
              border: '1px solid #fff3e0',
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(255, 152, 0, 0.08)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 20px rgba(255, 152, 0, 0.15)'
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', 
                  borderRadius: 2 
                }}>
                  <CheckCircle sx={{ color: '#ff9800', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#e65100' }}>
                    {appointments.filter(a => a.status === 'completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Visits
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different sections */}
      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }
            }}
          >
            <Tab 
              icon={<Description />} 
              iconPosition="start"
              label={`Test Reports (${testReports.length})`} 
              value="test-reports" 
            />
            <Tab 
              icon={<CalendarToday />} 
              iconPosition="start"
              label={`Appointments (${appointments.length})`} 
              value="appointments" 
            />
            <Tab 
              icon={<Assessment />} 
              iconPosition="start"
              label={`Prescriptions (${prescriptions.length})`} 
              value="prescriptions" 
            />
          </Tabs>
        </Box>

        {/* Test Reports Tab */}
        {tabValue === 'test-reports' && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {testReports.map((report) => (
                <Grid item xs={12} sm={6} lg={4} key={report.id}>
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
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            p: 2,
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                            borderRadius: 2
                          }}
                        >
                          <Description sx={{ fontSize: 40, color: '#1976d2' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 0.5 }}>
                            {report.report_name}
                          </Typography>
                          <Chip 
                            label={report.report_type} 
                            size="small" 
                            sx={{ bgcolor: '#2196f3', color: 'white', fontWeight: 600 }}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Uploaded by:</strong> Dr. {report.doctor?.user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Test Date:</strong> {new Date(report.test_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Uploaded on:</strong> {new Date(report.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>File:</strong> {report.file_name}
                        </Typography>
                      </Box>

                      {report.description && (
                        <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="600">
                            Description:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {report.description}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Download />}
                          href={report.file_url}
                          download
                          target="_blank"
                          sx={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                            }
                          }}
                        >
                          Download
                        </Button>
                        <IconButton
                          size="small"
                          href={report.file_url}
                          target="_blank"
                          sx={{
                            border: '1px solid #2196f3',
                            color: '#2196f3',
                            '&:hover': {
                              bgcolor: '#e3f2fd'
                            }
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {testReports.length === 0 && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Description sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No test reports yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your doctor will upload test reports here after your appointments
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Appointments Tab */}
        {tabValue === 'appointments' && (
          <Box sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Symptoms</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Fee</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow 
                      key={apt.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f5f5f5' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>{new Date(apt.appointment_date).toLocaleDateString()}</TableCell>
                      <TableCell>{apt.appointment_time}</TableCell>
                      <TableCell>Dr. {apt.doctor?.user?.name}</TableCell>
                      <TableCell>{apt.doctor?.specialization}</TableCell>
                      <TableCell>{apt.symptoms || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={apt.status} 
                          color={getStatusColor(apt.status)} 
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="right">${apt.consultation_fee}</TableCell>
                    </TableRow>
                  ))}
                  {appointments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No appointment history</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Prescriptions Tab */}
        {tabValue === 'prescriptions' && (
          <Box sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Medicine</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Dosage</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Frequency</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Total Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prescriptions.map((pres) => (
                    <TableRow 
                      key={pres.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f5f5f5' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>{new Date(pres.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {pres.medicine_name}
                        </Typography>
                      </TableCell>
                      <TableCell>{pres.dosage}</TableCell>
                      <TableCell>{pres.frequency}</TableCell>
                      <TableCell>{pres.days} days</TableCell>
                      <TableCell>Dr. {pres.doctor?.user?.name}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`$${(pres.days * pres.cost_per_day).toFixed(2)}`}
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
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No prescription history</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Card>
    </Container>
  );
}

export default ReportsPage;
