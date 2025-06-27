// src/components/UserHome/ActiveSeanceInfo.jsx
import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { TimerContext } from '../../contexts/TimerContext';

import TimerIcon from '@mui/icons-material/Timer';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import LoopIcon from '@mui/icons-material/Loop';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventNoteIcon from '@mui/icons-material/EventNote';

export default function ActiveSeanceInfo({ onCreateSeanceClick }) {
  const { pomodoroConfig, timeElapsedTotal, phase, timeLeft } = useContext(TimerContext);
  const theme = useTheme();
  const [currentTimerViewIndex, setCurrentTimerViewIndex] = useState(0);

  const formatTime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':');
  };

  const getNextPhaseInfo = () => {
    if (!pomodoroConfig) return { label: 'N/A', value: '00:00:00' };
    switch (phase) {
      case 'study': return { label: 'Prochaine Pause dans', value: formatTime(timeLeft) };
      case 'break': return { label: 'Prochaine Étude dans', value: formatTime(timeLeft) };
      case 'awaiting_break': return { label: 'Prêt pour', value: 'La Pause' };
      case 'awaiting_study': return { label: 'Prêt pour', value: "L'Étude" };
      case 'completed': return { label: 'Statut', value: 'Terminée' };
      case 'idle':
      default: return { label: 'Inactif', value: '00:00:00' };
    }
  };

  const timerViews = [
    { label: "Temps Total Écoulé", value: formatTime(timeElapsedTotal), icon: <HourglassFullIcon /> },
    { label: "Temps Restant (Séance)", value: formatTime(pomodoroConfig ? pomodoroConfig.duree_seance_totale - timeElapsedTotal : 0), icon: <ScheduleIcon /> },
    { label: getNextPhaseInfo().label, value: getNextPhaseInfo().value, icon: getNextPhaseInfo().label.includes('Prêt') ? <PlayCircleOutlineIcon /> : <TimerIcon /> }
  ];

  const BigTimerDisplay = ({ label, value }) => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    }}>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{
          opacity: 0.8,
          mb: 0.5,
          textTransform: 'uppercase',
          letterSpacing: 1,
          color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'primary.main',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h3"
        fontWeight="extraBold"
        sx={{
          lineHeight: 1,
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          [theme.breakpoints.down('sm')]: {
            variant: 'h4',
          },
          color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'primary.dark',
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  const InfoPill = ({ label, value, icon }) => (
    <Box sx={{
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'}`,
      borderRadius: '12px',
      p: '10px 15px',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      color: 'text.primary',
      width: '100%',
      minHeight: '50px',
    }}>
      {icon && React.cloneElement(icon, {
        sx: { fontSize: 24, color: theme.palette.text.primary, flexShrink: 0 }
      })}
      <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.secondary', flexShrink: 0 }}>
        {label}:
      </Typography>
      <Typography variant="body1" sx={{
        color: 'text.primary',
        flexGrow: 1,
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {value}
      </Typography>
    </Box>
  );

  const currentTimerView = timerViews[currentTimerViewIndex];

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        p: 2,
        textAlign: 'center',
        color: theme.palette.text.primary,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
      }}
    >
      {!pomodoroConfig ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50%',
          gap: 2,
          p: 3,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'}`,
          borderRadius: '12px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        }}>
          <Typography variant="h5" fontWeight="bold">
            Aucune séance active
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Commencez une nouvelle session pour suivre votre progression !
          </Typography>
          <Button
            variant="contained"
            onClick={onCreateSeanceClick}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 'bold',
              borderRadius: '8px',
              px: 3,
              py: 1.2,
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Créer une séance
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ flexBasis: 'auto', mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ textAlign: 'center', mb: 1 }}>
              Séance Active: {pomodoroConfig.nom_seance || 'N/A'}
            </Typography>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              p: 1.5,
            }}>
              <IconButton onClick={() => setCurrentTimerViewIndex((i) => (i - 1 + timerViews.length) % timerViews.length)}>
                <ChevronLeftIcon fontSize="large" />
              </IconButton>
              <BigTimerDisplay label={currentTimerView.label} value={currentTimerView.value} />
              <IconButton onClick={() => setCurrentTimerViewIndex((i) => (i + 1) % timerViews.length)}>
                <ChevronRightIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>

          <Box justifyContent="space-between" width="100%" display="flex" sx={{ overflowY: 'auto', pr: 1, mb: 2 }}>
            <Grid container width="100%" display="flex" justifyContent="center" spacing={1.5}>
              <Grid item width="40%"><InfoPill label="Thème" value={pomodoroConfig.theme || 'N/A'} icon={<EventNoteIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label="Durée Étude" value={formatTime(pomodoroConfig.duree_seance)} icon={<TimerIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label="Durée Pause Courte" value={formatTime(pomodoroConfig.duree_pause_courte)} icon={<TimerIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label="Durée Pause Longue" value={formatTime(pomodoroConfig.duree_pause_longue)} icon={<TimerIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label="Cycles avant Pause Longue" value={pomodoroConfig.nbre_pomodoro_avant_pause_longue} icon={<LoopIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label="Durée Totale de la Séance" value={formatTime(pomodoroConfig.duree_seance_totale)} icon={<HourglassFullIcon />} /></Grid>
            </Grid>
          </Box>

          <Box sx={{ flexBasis: 'auto', p: 1, pt: 0, mt: 'auto' }}>
            <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center' }}>
              Plus de détails à venir...
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}