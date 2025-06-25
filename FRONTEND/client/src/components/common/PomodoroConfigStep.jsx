// src/components/UserHome/PomodoroConfigStep.jsx
import React from 'react';
import {
  Box, Grid, TextField, Typography, Divider
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SwitchCard from './SwitchCard';

export default function PomodoroConfigStep({ formData, handlePomodoroChange }) {
  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto', pr: 2 }}>
      <Grid container spacing={2}>
        {[
          { label: "Durée Séance (s)", name: "duree_seance" },
          { label: "Pause Courte (s)", name: "duree_pause_courte" },
          { label: "Pause Longue (s)", name: "duree_pause_longue" },
          { label: "Cycles avant pause longue", name: "nbre_pomodoro_avant_pause_longue" },
          { label: "Durée Totale (s)", name: "duree_seance_totale" },
          { label: "Nom Séance Pomodoro", name: "nom_seance" },
          { label: "Thème", name: "theme" },
          { label: "Nom Préconfiguration", name: "nom_preconfiguration" },
        ].map(({ label, name }) => (
          <Grid item xs={12} sm={name.includes('nom') ? 12 : 6} key={name}>
            <TextField
              fullWidth
              label={label}
              name={name}
              value={formData.pomodoro[name]}
              onChange={handlePomodoroChange}
              type={name.startsWith('duree') || name.startsWith('nbre') ? 'number' : 'text'}
              variant="filled"
              InputProps={{
                disableUnderline: true,
                sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)', color: '#333' }
              }}
              InputLabelProps={{ sx: { color: 'rgba(0,0,0,0.6)' } }}
            />
          </Grid>
        ))}

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2, bgcolor: 'rgba(0,0,0,0.1)' }} />
          <Box display="flex" alignItems="center" mb={1.5}>
            <NotificationsActiveIcon sx={{ mr: 1, color: 'rgba(0,0,0,0.7)' }} />
            <Typography variant="h6" fontWeight="bold">Alertes et Automatisation</Typography>
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
