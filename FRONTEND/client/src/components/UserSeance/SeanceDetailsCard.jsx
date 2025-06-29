import React, { useContext } from 'react';
import { Box, Typography, Grid, Divider, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TimerContext } from '../../contexts/TimerContext';
import ConfirmationItem from '../common/ConfirmationItem';
import DisplayCard from '../common/DisplayCard';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function SeanceDetailsCard() {
  const { t } = useTranslation();
  const { pomodoroConfig } = useContext(TimerContext);
  const theme = useTheme();

  const {
    middleBox,
    whiteBorder,
    softBoxShadow
  } = useCustomTheme();

  if (!pomodoroConfig) return null;

  const formatTime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return '0s';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const parts = [];
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
        bgcolor: middleBox,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        overflowY: 'auto',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      <Grid container spacing={3} alignItems="stretch" justifyContent="space-between">
        {/* Durations */}
        <Grid width="100%">
          <DisplayCard title={t('seanceDetails.durations')} icon={<HourglassTopIcon />}>
            <ConfirmationItem label={t('seanceDetails.study')} value={formatTime(pomodoroConfig.duree_seance)} />
            <ConfirmationItem label={t('seanceDetails.short_break')} value={formatTime(pomodoroConfig.duree_pause_courte)} />
            <ConfirmationItem label={t('seanceDetails.long_break')} value={formatTime(pomodoroConfig.duree_pause_longue)} />
            <ConfirmationItem label={t('seanceDetails.total_duration')} value={formatTime(pomodoroConfig.duree_seance_totale)} />
          </DisplayCard>
        </Grid>

        {/* General */}
        <Grid width="100%">
          <DisplayCard title={t('seanceDetails.details')} icon={<InfoOutlinedIcon />}>
            <ConfirmationItem label={t('seanceDetails.type')} value={pomodoroConfig.type_seance} />
            <ConfirmationItem label={t('seanceDetails.name')} value={pomodoroConfig.nom_seance} />
            <ConfirmationItem label={t('seanceDetails.preset_name')} value={pomodoroConfig.nom_preconfiguration} />
            <ConfirmationItem label={t('seanceDetails.theme')} value={pomodoroConfig.theme} />
          </DisplayCard>
        </Grid>

        {/* Automation */}
        <Grid width="100%">
          <DisplayCard title={t('seanceDetails.automation')} icon={<NotificationsActiveIcon />}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}><ConfirmationItem label={t('seanceDetails.auto_start')} value={pomodoroConfig.auto_demarrage} /></Grid>
              <Grid item xs={6} sm={4}><ConfirmationItem label={t('seanceDetails.sound_alert')} value={pomodoroConfig.alerte_sonore} /></Grid>
              <Grid item xs={6} sm={4}><ConfirmationItem label={t('seanceDetails.notification')} value={pomodoroConfig.notification} /></Grid>
              <Grid item xs={6} sm={4}><ConfirmationItem label={t('seanceDetails.vibration')} value={pomodoroConfig.vibration} /></Grid>
              <Grid item xs={6} sm={4}><ConfirmationItem label={t('seanceDetails.track_time')} value={pomodoroConfig.suivi_temps_total} /></Grid>
            </Grid>
          </DisplayCard>
        </Grid>
      </Grid>
    </Box>
  );
}
