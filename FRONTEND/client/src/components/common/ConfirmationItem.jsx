// src/components/UserHome/ConfirmationItem.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ConfirmationItem({ label, value }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
        {label.replace(/_/g, ' ')}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {typeof value === 'boolean' ? (value ? 'Activé' : 'Désactivé') : value}
      </Typography>
    </Box>
  );
}
