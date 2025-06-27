// src/components/UserSeance/SeanceDetailsCard.jsx
import React, { useContext } from 'react';
import { Box, Typography, Grid, Divider, useTheme } from '@mui/material'; // <-- ADDED useTheme hook
import { TimerContext } from '../../contexts/TimerContext';
import ConfirmationItem from '../common/ConfirmationItem';
import DisplayCard from '../common/DisplayCard';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function SeanceDetailsCard() {
  const { pomodoroConfig } = useContext(TimerContext);

    const theme = useTheme();
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();
  

  if (!pomodoroConfig) {
    return null; // Don't render if there's no active seance
  }

  const formatTime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return '0s';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
  };

  return (
    <Box
      sx={{
        borderRadius: '16px',
        p: 3,
        // --- UPDATED to use dynamic theme colors for glassmorphism ---
        bgcolor: middleBox ,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        overflowY: 'auto',
        width: '100%',
        height:'100%',
        boxSizing: 'border-box',
      }}
    >
      <Grid container spacing={3} alignItems="stretch" justifyContent='space-between'>
        {/* Durations Card */}
        <Grid width = "100%">
          {/* Note: The nested DisplayCard component will also need its styles updated to be theme-aware if it uses hardcoded colors. */}
          <DisplayCard title="Durées" icon={<HourglassTopIcon />}>
            <ConfirmationItem label="Séance" value={formatTime(pomodoroConfig.duree_seance)} />
            <ConfirmationItem label="Pause courte" value={formatTime(pomodoroConfig.duree_pause_courte)} />
            <ConfirmationItem label="Pause longue" value={formatTime(pomodoroConfig.duree_pause_longue)} />
            <ConfirmationItem label="Durée Totale" value={formatTime(pomodoroConfig.duree_seance_totale)} />
          </DisplayCard>
        </Grid>
        
        {/* General Details Card */}
        <Grid width = "100%">
          <DisplayCard title="Détails" icon={<InfoOutlinedIcon />}>
            <ConfirmationItem label="Type de séance" value={pomodoroConfig.type_seance} />
            <ConfirmationItem label="Nom de la séance" value={pomodoroConfig.nom_seance} />
            <ConfirmationItem label="Nom préconfiguration" value={pomodoroConfig.nom_preconfiguration} />
            <ConfirmationItem label="Thème" value={pomodoroConfig.theme} />
          </DisplayCard>
        </Grid>
        
        {/* Alerts and Automation Card */}
        <Grid width = "100%">
          <DisplayCard title="Alertes et Automatisation" icon={<NotificationsActiveIcon />}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}><ConfirmationItem label="Démarrage auto" value={pomodoroConfig.auto_demarrage} /></Grid>
              <Grid item xs={6} sm={4}><ConfirmationItem label="Alerte sonore" value={pomodoroConfig.alerte_sonore} /></Grid>
              <Grid item xs={6} sm={4}><ConfirmationItem label="Notification" value={pomodoroConfig.notification} /></Grid>
              <Grid item xs={6} sm={4}><ConfirmationItem label="Vibration" value={pomodoroConfig.vibration} /></Grid>
              <Grid item xs={6} sm={4}><ConfirmationItem label="Suivi du temps total" value={pomodoroConfig.suivi_temps_total} /></Grid>
            </Grid>
          </DisplayCard>
        </Grid>
      </Grid>
    </Box>
  );
}