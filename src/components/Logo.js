// src/components/Logo.js
import React from 'react';
import { Box, keyframes } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Logo = ({ size = 40, animated = false }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #1e5dbc 0%, #2196f3 100%)',
        borderRadius: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(30, 93, 188, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        animation: animated ? `${pulse} 2s ease-in-out infinite` : 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none'
        }
      }}
    >
      <FavoriteIcon
        sx={{
          fontSize: size * 0.55,
          color: 'white',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          zIndex: 1
        }}
      />
    </Box>
  );
};

export default Logo;
