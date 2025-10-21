// src/components/doctor/PrescriptionsPage.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  MedicalServices
} from '@mui/icons-material';
import { supabase } from '../../utils/supabase';

function PrescriptionsPage({ doctorInfo }) {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    if (doctorInfo?.id) {
      fetchPrescriptions();
    }
  }, [doctorInfo]);

  const fetchPrescriptions = async () => {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`*, patient:patients(user:users(name))`)
      .eq('doctor_id', doctorInfo.id)
      .order('created_at', { ascending: false });
    if (!error) setPrescriptions(data || []);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#1a237e' }}>
          My Prescriptions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View all prescriptions you've written
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {prescriptions.map((prescription) => (
          <Grid item xs={12} sm={6} lg={4} key={prescription.id}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                    {prescription.medicine_name}
                  </Typography>
                  <Chip
                    label={`$${(prescription.days * prescription.cost_per_day).toFixed(2)}`}
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Patient:</strong> {prescription.patient?.user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Dosage:</strong> {prescription.dosage}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Frequency:</strong> {prescription.frequency}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Duration:</strong> {prescription.days} days
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Cost/Day:</strong> ${prescription.cost_per_day}
                </Typography>

                {prescription.instructions && (
                  <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600">
                      Instructions:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {prescription.instructions}
                    </Typography>
                  </Box>
                )}

                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Prescribed on: {new Date(prescription.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {prescriptions.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <MedicalServices sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No prescriptions written yet
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default PrescriptionsPage;
