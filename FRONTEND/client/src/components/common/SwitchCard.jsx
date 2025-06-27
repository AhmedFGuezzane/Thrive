// src/components/UserHome/SwitchCard.jsx
import React from 'react';
import { Box, Typography, Switch, useTheme } from '@mui/material'; // <-- ADDED useTheme hook

export default function SwitchCard({ label, name, checked, onChange }) {
  const theme = useTheme();

  // --- Moved switchStyle inside the component to access the theme ---
  const switchStyle = {
    // --- UPDATED to use dynamic theme colors for the glass effect ---
    bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
    borderRadius: '12px',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`,
    p: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    height: '100%',
    width: '100%',
  };

  return (
    <Box sx={switchStyle}>
      <Typography variant="body2" color={theme.palette.text.primary}>{label}</Typography>
      <Switch
        checked={checked}
        onChange={onChange}
        name={name}
        color="secondary" // This will use the theme's secondary color, which is dynamic
      />
    </Box>
  );
}