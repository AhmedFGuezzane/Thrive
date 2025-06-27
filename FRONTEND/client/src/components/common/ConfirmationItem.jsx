// src/components/UserHome/ConfirmationItem.jsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material'; // <-- ADDED useTheme hook

export default function ConfirmationItem({ label, value }) {
  // Use the global theme hook to access the palette
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          textTransform: 'capitalize',
          fontWeight: 'bold',
          color: theme.palette.text.primary, // <-- Explicitly set the color from the theme
        }}
      >
        {label.replace(/_/g, ' ')}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {typeof value === 'boolean' ? (value ? 'Activé' : 'Désactivé') : value}
      </Typography>
    </Box>
  );
}