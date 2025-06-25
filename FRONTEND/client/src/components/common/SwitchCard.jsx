// src/components/UserHome/SwitchCard.jsx
import React from 'react';
import { Box, Typography, Switch } from '@mui/material';

const switchStyle = {
  bgcolor: 'rgba(255,255,255,0.2)',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)',
  p: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  height: '100%',
  width: '100%'
};

export default function SwitchCard({ label, name, checked, onChange }) {
  return (
    <Box sx={switchStyle}>
      <Typography variant="body2">{label}</Typography>
      <Switch
        checked={checked}
        onChange={onChange}
        name={name}
        color="secondary"
      />
    </Box>
  );
}
