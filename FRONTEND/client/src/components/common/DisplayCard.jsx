// src/components/UserHome/DisplayCard.jsx
import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const cardStyle = {
  bgcolor: 'rgba(255,255,255,0.2)',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)',
  p: 2,
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

export default function DisplayCard({ title, icon, children }) {
  return (
    <Box sx={cardStyle}>
      <Box display="flex" alignItems="center" mb={1.5}>
        {icon && React.cloneElement(icon, { sx: { mr: 1, color: 'rgba(0,0,0,0.7)' } })}
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
      </Box>
      <Divider sx={{ mb: 1.5, bgcolor: 'rgba(0,0,0,0.1)' }} />
      {children}
    </Box>
  );
}
