import React from 'react';
import { Box, Typography } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

const Logo = ({ size = 'medium', showText = true }) => {
  const sizes = {
    small: { icon: 24, text: 'h6' },
    medium: { icon: 32, text: 'h5' },
    large: { icon: 48, text: 'h3' }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: sizes[size].icon + 16,
          height: sizes[size].icon + 16,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
        }}
      >
        <LocalHospital 
          sx={{ 
            fontSize: sizes[size].icon, 
            color: 'white'
          }} 
        />
      </Box>
      {showText && (
        <Typography 
          variant={sizes[size].text}
          sx={{
            color: '#1976d2',
            fontWeight: 'bold',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          MediVault
        </Typography>
      )}
    </Box>
  );
};

export default Logo;