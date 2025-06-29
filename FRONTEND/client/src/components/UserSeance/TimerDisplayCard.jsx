import React, { useContext } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { TimerContext } from '../../contexts/TimerContext';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import FastForwardIcon from '@mui/icons-material/FastForward';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

export default function TimerDisplayCard() {
  const { phase, timeLeft, timeElapsedTotal, pomodoroConfig, upcomingBreakType } = useContext(TimerContext);
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    innerBox, whiteBorder, softBoxShadow, specialText, primaryText
  } = useCustomTheme();

  const formatTime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':');
  };

  const getNextPhaseLabel = () => {
    switch (phase) {
      case 'study': return t('timerDisplayCard.nextPhase.shortBreak', { type: upcomingBreakType });
      case 'break': return t('timerDisplayCard.nextPhase.study');
      case 'awaiting_break': return t('timerDisplayCard.nextPhase.shortBreak', { type: upcomingBreakType });
      case 'awaiting_study': return t('timerDisplayCard.nextPhase.study');
      case 'completed': return t('timerDisplayCard.nextPhase.session');
      case 'idle':
      default: return t('timerDisplayCard.nextPhase.phase');
    }
  };

  const getTimeUntilNextPhase = () => {
    switch (phase) {
      case 'study':
      case 'break':
        return formatTime(timeLeft);
      default:
        return '--:--:--';
    }
  };

  const estimatedTimeLeft = pomodoroConfig ? pomodoroConfig.duree_seance_totale - timeElapsedTotal : 0;

  const Card = ({ title, value, icon, subtitle }) => (
    <Box
      sx={{
        backgroundColor: innerBox,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        borderRadius: '16px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '150px',
        flexGrow: 1,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {icon && React.cloneElement(icon, { sx: { fontSize: 40, color: specialText, mb: 1 } })}
      <Typography variant="body2" fontWeight="bold" sx={{ color: primaryText, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h2" fontWeight="bold" sx={{ color: specialText, textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" fontStyle="italic" sx={{ mt: 1, color: primaryText }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box
      display="flex"
      gap={2}
      sx={{
        width: '100%',
        height: '30%',
        alignItems: 'stretch',
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
        <Card
          title={t('timerDisplayCard.remainingTime')}
          value={formatTime(estimatedTimeLeft)}
          icon={<HourglassTopIcon />}
        />
      </Box>

      <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
        <Card
          title={t('timerDisplayCard.elapsedTime')}
          value={formatTime(timeElapsedTotal)}
          icon={<HourglassFullIcon />}
        />
      </Box>

      <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
        <Card
          title={`${t('timerDisplayCard.untilNext')} ${getNextPhaseLabel()}`}
          value={getTimeUntilNextPhase()}
          icon={<FastForwardIcon />}
        />
      </Box>
    </Box>
  );
}
