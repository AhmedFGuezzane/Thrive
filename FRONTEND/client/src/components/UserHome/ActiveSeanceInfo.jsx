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
import { useTranslation } from 'react-i18next';

import TimerIcon from '@mui/icons-material/Timer';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import LoopIcon from '@mui/icons-material/Loop';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventNoteIcon from '@mui/icons-material/EventNote';

export default function ActiveSeanceInfo({ onCreateSeanceClick }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const outerBox = theme.palette.custom.box.outer;
  const innerBox = theme.palette.custom.box.inner;
  const middleBox = theme.palette.custom.box.middleBox;

  const primaryColor = theme.palette.custom.color.primary;
  const specialColor = theme.palette.custom.color.special;

  const specialText = theme.palette.custom.text.special;
  const secondaryText = theme.palette.custom.text.secondary;
  const primaryText = theme.palette.custom.text.primary;

  const whiteBorder = theme.palette.custom.border.white;
  const softBoxShadow = theme.palette.custom.boxShadow.soft;

  const { pomodoroConfig, timeElapsedTotal, phase, timeLeft } = useContext(TimerContext);

  const [currentTimerViewIndex, setCurrentTimerViewIndex] = useState(0);

  const formatTime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':');
  };

  const getNextPhaseInfo = () => {
    if (!pomodoroConfig) return { label: t('activeSeance.status.na'), value: '00:00:00' };
    switch (phase) {
      case 'study': return { label: t('activeSeance.status.next_break'), value: formatTime(timeLeft) };
      case 'break': return { label: t('activeSeance.status.next_study'), value: formatTime(timeLeft) };
      case 'awaiting_break': return { label: t('activeSeance.status.ready_for'), value: t('activeSeance.status.break') };
      case 'awaiting_study': return { label: t('activeSeance.status.ready_for'), value: t('activeSeance.status.study') };
      case 'completed': return { label: t('activeSeance.status.status'), value: t('activeSeance.status.done') };
      case 'idle':
      default: return { label: t('activeSeance.status.idle'), value: '00:00:00' };
    }
  };

  const timerViews = [
    { label: t('activeSeance.timer.elapsed'), value: formatTime(timeElapsedTotal), icon: <HourglassFullIcon /> },
    {
      label: t('activeSeance.timer.remaining_total'),
      value: formatTime(pomodoroConfig ? pomodoroConfig.duree_seance_totale - timeElapsedTotal : 0),
      icon: <ScheduleIcon />
    },
    {
      label: getNextPhaseInfo().label,
      value: getNextPhaseInfo().value,
      icon: getNextPhaseInfo().label.includes(t('activeSeance.status.ready_for')) ? <PlayCircleOutlineIcon /> : <TimerIcon />
    }
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
          color: specialText,
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
          color: specialText,
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  const InfoPill = ({ label, value, icon }) => (
    <Box sx={{
      bgcolor: innerBox,
      backdropFilter: 'blur(8px)',
      border: `1px solid ${whiteBorder}`,
      borderRadius: '12px',
      p: '10px 15px',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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
        backgroundColor: middleBox,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${whiteBorder}`,
        borderRadius: '16px',
        p: 3,
        textAlign: 'center',
        color: primaryText,
        boxShadow: softBoxShadow,
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
          width: '100%',
          gap: 2,
          p: 3,
          bgcolor: innerBox,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${whiteBorder}`,
          borderRadius: '12px',
          boxShadow: softBoxShadow,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
          },
        }}>
          <Typography variant="h5" fontWeight="bold">
            {t('activeSeance.no_active')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            {t('activeSeance.no_active_sub')}
          </Typography>
          <Button
            variant="contained"
            onClick={onCreateSeanceClick}
            sx={{
              fontWeight: 'bold',
              borderRadius: '8px',
              bgcolor: alpha(specialText, 1),
              px: 3,
              py: 1.2,
              '&:hover': {
                bgcolor: alpha(specialText, 0.8),
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {t('activeSeance.create_button')}
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ flexBasis: 'auto', mb: 2 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              bgcolor: innerBox,
              borderRadius: '12px',
              border: `1px solid ${whiteBorder}`,
              boxShadow: softBoxShadow,
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
              <Grid item width="40%"><InfoPill label={t('activeSeance.theme')} value={pomodoroConfig.theme || 'N/A'} icon={<EventNoteIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label={t('activeSeance.study_duration')} value={formatTime(pomodoroConfig.duree_seance)} icon={<TimerIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label={t('activeSeance.short_break')} value={formatTime(pomodoroConfig.duree_pause_courte)} icon={<TimerIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label={t('activeSeance.long_break')} value={formatTime(pomodoroConfig.duree_pause_longue)} icon={<TimerIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label={t('activeSeance.cycles_before_long')} value={pomodoroConfig.nbre_pomodoro_avant_pause_longue} icon={<LoopIcon />} /></Grid>
              <Grid item width="40%"><InfoPill label={t('activeSeance.total_duration')} value={formatTime(pomodoroConfig.duree_seance_totale)} icon={<HourglassFullIcon />} /></Grid>
            </Grid>
          </Box>

          <Box sx={{ flexBasis: 'auto', p: 1, pt: 0, mt: 'auto' }}>
            <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center' }}>
              {t('activeSeance.more_coming')}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
