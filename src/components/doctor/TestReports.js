// src/components/doctor/TestReports.js
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
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Assessment,
  Upload,
  Download,
  Delete,
  CloudUpload,
  Description
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase';

function TestReports({ doctorInfo }) {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newReport, setNewReport] = useState({
    patient_id: '',
    report_name: '',
    report_type: 'Blood Test',
    description: '',
    test_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (doctorInfo?.id) {
      fetchReports();
      fetchPatients();
    }
  }, [doctorInfo]);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('test_reports')
      .select(`*, patient:patients(user:users(name))`)
      .eq('doctor_id', doctorInfo.id)
      .order('created_at', { ascending: false });
    if (!error) setReports(data || []);
  };

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select(`*, user:users(name)`);
    if (!error) setPatients(data || []);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showSnackbar('File size must be less than 10MB', 'error');
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadReport = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showSnackbar('Please select a file', 'error');
      return;
    }

    setUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${doctorInfo.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('test-reports')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('test-reports')
        .getPublicUrl(filePath);

      // Insert report record in database
      const { error: insertError } = await supabase
        .from('test_reports')
        .insert([{
          ...newReport,
          doctor_id: doctorInfo.id,
          file_url: publicUrl,
          file_name: selectedFile.name,
          file_size: selectedFile.size
        }]);

      if (insertError) throw insertError;

      setOpenUploadDialog(false);
      setNewReport({
        patient_id: '',
        report_name: '',
        report_type: 'Blood Test',
        description: '',
        test_date: new Date().toISOString().split('T')[0]
      });
      setSelectedFile(null);
      fetchReports();
      showSnackbar('Test report uploaded successfully!');
    } catch (error) {
      showSnackbar('Error: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const deleteReport = async (reportId, fileUrl) => {
    try {
      // Extract file path from URL
      const filePath = fileUrl.split('/test-reports/')[1];
      
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('test-reports')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete record from database
      const { error: dbError } = await supabase
        .from('test_reports')
        .delete()
        .eq('id', reportId);

      if (dbError) throw dbError;

      fetchReports();
      showSnackbar('Report deleted successfully');
    } catch (error) {
      showSnackbar('Error: ' + error.message, 'error');
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
            Test Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload and manage patient test reports
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => setOpenUploadDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
            boxShadow: '0 4px 15px rgba(30, 93, 188, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
            }
          }}
        >
          Upload New Report
        </Button>
      </Box>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} sm={6} lg={4} key={report.id}>
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
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description sx={{ fontSize: 40, color: '#e91e63' }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: '#e91e63', fontWeight: 600 }}>
                        {report.report_name}
                      </Typography>
                      <Chip label={report.report_type} size="small" color="secondary" />
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Patient:</strong> {report.patient?.user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Test Date:</strong> {new Date(report.test_date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>File:</strong> {report.file_name}
                </Typography>
                {report.description && (
                  <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {report.description}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    href={report.file_url}
                    target="_blank"
                    sx={{ flex: 1 }}
                  >
                    Download
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteReport(report.id, report.file_url)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {reports.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Assessment sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No test reports uploaded yet
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CloudUpload sx={{ mr: 1 }} />
            Upload Test Report
          </Box>
        </DialogTitle>
        <form onSubmit={uploadReport}>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth required>
                <InputLabel>Select Patient</InputLabel>
                <Select
                  value={newReport.patient_id}
                  label="Select Patient"
                  onChange={(e) => setNewReport({...newReport, patient_id: e.target.value})}
                >
                  {patients.map(patient => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.user?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Report Name"
                value={newReport.report_name}
                onChange={(e) => setNewReport({...newReport, report_name: e.target.value})}
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={newReport.report_type}
                  label="Report Type"
                  onChange={(e) => setNewReport({...newReport, report_type: e.target.value})}
                >
                  <MenuItem value="Blood Test">Blood Test</MenuItem>
                  <MenuItem value="X-Ray">X-Ray</MenuItem>
                  <MenuItem value="MRI Scan">MRI Scan</MenuItem>
                  <MenuItem value="CT Scan">CT Scan</MenuItem>
                  <MenuItem value="Ultrasound">Ultrasound</MenuItem>
                  <MenuItem value="ECG">ECG</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Test Date"
                type="date"
                value={newReport.test_date}
                onChange={(e) => setNewReport({...newReport, test_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />

              <TextField
                label="Description (Optional)"
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                multiline
                rows={3}
                fullWidth
              />

              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload />}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Select File
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="caption" color="text.secondary">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </Typography>
                )}
              </Box>

              {uploading && <LinearProgress />}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenUploadDialog(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={uploading || !selectedFile}
              sx={{
                background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)'
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Report'}
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

export default TestReports;
