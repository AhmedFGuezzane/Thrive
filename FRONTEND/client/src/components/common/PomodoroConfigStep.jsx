// src/components/UserHome/PomodoroConfigStep.jsx
import React from 'react';
import {
  Box, Grid, TextField, Typography, Divider, useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SwitchCard from './SwitchCard';

export default function PomodoroConfigStep({ formData, handlePomodoroChange }) {
  const theme = useTheme();

  // Helper function to convert seconds to minutes for display
  const secondsToMinutes = (seconds) => {
    return Math.round(seconds / 60); // Round to nearest minute for display
  };

  // Helper function to handle change for time fields (convert minutes to seconds internally)
  const handleTimeChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For time-related fields, convert the input minutes to seconds before calling handlePomodoroChange
    if (['duree_seance', 'duree_pause_courte', 'duree_pause_longue', 'duree_seance_totale'].includes(name)) {
      // Ensure value is a number before multiplying
      const minutes = Number(value);
      // Pass the converted value (in seconds) to the parent handler
      handlePomodoroChange({ target: { name, value: minutes * 60, type: 'number' } });
    } else {
      // For other fields, call the original handler directly
      handlePomodoroChange(e);
    }
  };


  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto', pr: 2 }}>
      <Grid container spacing={2}>
        {[
          // --- UPDATED LABELS TO INDICATE MINUTES ---
          { label: "Durée Séance (min)", name: "duree_seance" },
          { label: "Pause Courte (min)", name: "duree_pause_courte" },
          { label: "Pause Longue (min)", name: "duree_pause_longue" },
          { label: "Cycles avant pause longue", name: "nbre_pomodoro_avant_pause_longue" },
          { label: "Durée Totale (min)", name: "duree_seance_totale" },
          { label: "Nom Séance Pomodoro", name: "nom_seance" },
          { label: "Thème", name: "theme" },
          { label: "Nom Préconfiguration", name: "nom_preconfiguration" },
        ].map(({ label, name }) => (
          <Grid item xs={12} sm={name.includes('nom') ? 12 : 6} key={name}>
            <TextField
              fullWidth
              label={label}
              name={name}
              // --- DISPLAY VALUE IN MINUTES IF IT'S A DURATION FIELD ---
              value={['duree_seance', 'duree_pause_courte', 'duree_pause_longue', 'duree_seance_totale'].includes(name)
                ? secondsToMinutes(formData.pomodoro[name])
                : formData.pomodoro[name]}
              // --- USE handleTimeChange FOR DURATION FIELDS ---
              onChange={['duree_seance', 'duree_pause_courte', 'duree_pause_longue', 'duree_seance_totale'].includes(name)
                ? handleTimeChange
                : handlePomodoroChange}
              type={name.startsWith('duree') || name.startsWith('nbre') ? 'number' : 'text'}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                sx: {
                  borderRadius: '8px',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
                  color: theme.palette.text.primary,
                }
              }}
              InputLabelProps={{
                sx: {
                  color: theme.palette.text.secondary
                }
              }}
            />
          </Grid>
        ))}

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }} />
          <Box display="flex" alignItems="center" mb={1.5}>
            <NotificationsActiveIcon sx={{ mr: 1, color: theme.palette.text.primary }} />
            <Typography variant="h6" fontWeight="bold" color={theme.palette.text.primary}>
              Alertes et Automatisation
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Démarrage auto" name="auto_demarrage" checked={formData.pomodoro.auto_demarrage} onChange={handlePomodoroChange} /></Grid>
            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Alerte sonore" name="alerte_sonore" checked={formData.pomodoro.alerte_sonore} onChange={handlePomodoroChange} /></Grid>
            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Notification" name="notification" checked={formData.pomodoro.notification} onChange={handlePomodoroChange} /></Grid>
            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Vibration" name="vibration" checked={formData.pomodoro.vibration} onChange={handlePomodoroChange} /></Grid>
            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Suivi du temps total" name="suivi_temps_total" checked={formData.pomodoro.suivi_temps_total} onChange={handlePomodoroChange} /></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}