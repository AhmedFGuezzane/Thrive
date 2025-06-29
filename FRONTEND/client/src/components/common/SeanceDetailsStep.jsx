// src/components/UserHome/SeanceDetailsStep.jsx
import React from 'react';
import { Box, TextField, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function SeanceDetailsStep({ formData, handleFormChange }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const textFieldInputPropsSx = {
    borderRadius: '8px',
    bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
    color: theme.palette.text.primary,
  };

  const inputLabelPropsSx = {
    color: theme.palette.text.secondary,
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
      <TextField
        fullWidth
        margin="normal"
        label={t("seanceForm.type_seance")}
        name="type_seance"
        value={formData.type_seance}
        onChange={handleFormChange}
        variant="filled"
        InputProps={{
          disableUnderline: true,
          sx: textFieldInputPropsSx,
        }}
        InputLabelProps={{ sx: inputLabelPropsSx }}
      />
      <TextField
        fullWidth
        margin="normal"
        label={t("seanceForm.nom")}
        name="nom"
        value={formData.nom}
        onChange={handleFormChange}
        variant="filled"
        InputProps={{
          disableUnderline: true,
          sx: textFieldInputPropsSx,
        }}
        InputLabelProps={{ sx: inputLabelPropsSx }}
      />
    </Box>
  );
}
