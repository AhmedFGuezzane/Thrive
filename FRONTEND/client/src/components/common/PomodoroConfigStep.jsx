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
  const pomodoro = formData.pomodoro;

  const secondsToMinutes = (seconds) => Math.round(seconds / 60);
  const minutesToSeconds = (minutes) => Math.round(Number(minutes) * 60);

  const getValidationError = (name) => {
    const s = pomodoro;

    const dureeSeanceMin = secondsToMinutes(s.duree_seance);
    const pauseCourteMin = secondsToMinutes(s.duree_pause_courte);
    const pauseLongueMin = secondsToMinutes(s.duree_pause_longue);
    const dureeTotaleMin = secondsToMinutes(s.duree_seance_totale);
    const cyclesAvantPauseLongue = s.nbre_pomodoro_avant_pause_longue;

    const minDureeTotale =
      (s.duree_seance + s.duree_pause_courte) * (cyclesAvantPauseLongue - 1) +
      s.duree_pause_longue;

    if (name === 'duree_pause_courte' && pauseCourteMin < 5) {
      return 'Pause courte doit être d’au moins 5 minutes.';
    }

    if (name === 'duree_pause_longue' && pauseLongueMin < pauseCourteMin * 2) {
      return 'Pause longue doit être au moins 2x la pause courte.';
    }

    if (
      ['duree_pause_courte', 'duree_pause_longue'].includes(name) &&
      secondsToMinutes(s[name]) > dureeSeanceMin
    ) {
      return 'La pause ne peut pas être plus longue que la séance.';
    }

    if (name === 'duree_seance_totale' && s.duree_seance_totale < minDureeTotale) {
      return `Durée totale doit être ≥ ${(minDureeTotale / 60).toFixed(0)} minutes.`;
    }

    return '';
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const minutes = Number(value);
    handlePomodoroChange({ target: { name, value: minutesToSeconds(minutes), type: 'number' } });
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto', pr: 2 }}>
      <Grid container spacing={2}>
        {[
          { label: "Durée Séance (min)", name: "duree_seance" },
          { label: "Pause Courte (min)", name: "duree_pause_courte" },
          { label: "Pause Longue (min)", name: "duree_pause_longue" },
          { label: "Cycles avant pause longue", name: "nbre_pomodoro_avant_pause_longue" },
          { label: "Durée Totale (min)", name: "duree_seance_totale" },
          { label: "Nom Séance Pomodoro", name: "nom_seance" },
          { label: "Thème", name: "theme", disabled: true },
          { label: "Nom Préconfiguration", name: "nom_preconfiguration", disabled: true },
        ].map(({ label, name, disabled = false }) => (
          <Grid item xs={12} sm={name.includes('nom') ? 12 : 6} key={name}>
            <TextField
              fullWidth
              label={label}
              name={name}
              disabled={disabled}
              value={
                ['duree_seance', 'duree_pause_courte', 'duree_pause_longue', 'duree_seance_totale'].includes(name)
                  ? secondsToMinutes(pomodoro[name])
                  : pomodoro[name]
              }
              onChange={
                ['duree_seance', 'duree_pause_courte', 'duree_pause_longue', 'duree_seance_totale'].includes(name)
                  ? handleTimeChange
                  : handlePomodoroChange
              }
              type={name.startsWith('duree') || name.startsWith('nbre') ? 'number' : 'text'}
              variant="filled"
              error={!!getValidationError(name)}
              helperText={getValidationError(name)}
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
            {[
              { label: "Démarrage auto", name: "auto_demarrage" },
              { label: "Alerte sonore", name: "alerte_sonore" },
              { label: "Notification", name: "notification" },
              { label: "Vibration", name: "vibration" },
              { label: "Suivi du temps total", name: "suivi_temps_total" }
            ].map(({ label, name }) => (
              <Grid item xs={12} sm={6} md={4} key={name}>
                <SwitchCard
                  label={label}
                  name={name}
                  checked={pomodoro[name]}
                  onChange={handlePomodoroChange}
                  disabled
                />
              </Grid>
            ))}
          </Grid>
          <Typography variant="body2" fontStyle="italic" color="text.secondary" mt={1}>
            Ces options seront disponibles prochainement.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
