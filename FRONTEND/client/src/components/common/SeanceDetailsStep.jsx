// src/components/UserHome/SeanceDetailsStep.jsx
import React from 'react';
import { Box, TextField } from '@mui/material';

export default function SeanceDetailsStep({ formData, handleFormChange }) {
  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
      <TextField
        fullWidth
        margin="normal"
        label="Type de séance"
        name="type_seance"
        value={formData.type_seance}
        onChange={handleFormChange}
        variant="filled"
        InputProps={{
          disableUnderline: true,
          sx: {
            borderRadius: '8px',
            bgcolor: 'rgba(255,255,255,0.2)',
            color: '#333'
          }
        }}
        InputLabelProps={{ sx: { color: 'rgba(0,0,0,0.6)' } }}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Nom de la séance"
        name="nom"
        value={formData.nom}
        onChange={handleFormChange}
        variant="filled"
        InputProps={{
          disableUnderline: true,
          sx: {
            borderRadius: '8px',
            bgcolor: 'rgba(255,255,255,0.2)',
            color: '#333'
          }
        }}
        InputLabelProps={{ sx: { color: 'rgba(0,0,0,0.6)' } }}
      />
    </Box>
  );
}
