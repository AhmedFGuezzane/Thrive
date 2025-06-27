// src/components/UserSeance/TimerDisplayCard.jsx
import React, { useContext } from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material'; // <-- ADDED useTheme hook
import { alpha } from '@mui/material/styles'; // <-- ADDED alpha utility
import { TimerContext } from '../../contexts/TimerContext';

// Import icons for each card
import ScheduleIcon from '@mui/icons-material/Schedule';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import FastForwardIcon from '@mui/icons-material/FastForward';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';


import { useCustomTheme } from '../../hooks/useCustomeTheme';


export default function TimerDisplayCard() {
  const { phase, timeLeft, timeElapsedTotal, pomodoroConfig, upcomingBreakType } = useContext(TimerContext);
  // --- ADDED useTheme hook for dynamic styling ---

  const theme = useTheme();
const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();


  const formatTime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':');
  };

  const getNextPhaseLabel = () => {
    switch (phase) {
      case 'study': return `pause (${upcomingBreakType})`;
      case 'break': return 'étude';
      case 'awaiting_break': return `pause (${upcomingBreakType})`;
      case 'awaiting_study': return 'étude';
      case 'completed': return 'séance';
      case 'idle': default: return 'phase';
    }
  };

  const getTimeUntilNextPhase = () => {
    switch (phase) {
      case 'study':
      case 'break':
        return formatTime(timeLeft);
      case 'awaiting_break':
      case 'awaiting_study':
      case 'completed':
      case 'idle':
      default:
        return '--:--:--';
    }
  };

  const estimatedTimeLeft = pomodoroConfig ? pomodoroConfig.duree_seance_totale - timeElapsedTotal : 0;

  const Card = ({ title, value, icon, subtitle }) => (
    <Box
      sx={{
        // --- UPDATED to use more opaque dynamic theme colors ---
        backgroundColor: innerBox,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        borderRadius: '16px',
        p: 2, // Reduced padding to make the card smaller
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '150px', // Reduced minimum height
        flexGrow: 1,
        height: '100%',
        boxSizing: 'border-box'
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
        flexWrap: 'wrap', // Allows wrapping on smaller screens
      }}
    >
      {/* Card 1: Time Left (Session) */}
      <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
        <Card
          title="Temps Restant (Séance)"
          value={formatTime(estimatedTimeLeft)}
          icon={<HourglassTopIcon />}
        />
      </Box>
      
      {/* Card 2: Time Elapsed (Total) */}
      <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
        <Card
          title="Temps Total Écoulé"
          value={formatTime(timeElapsedTotal)}
          icon={<HourglassFullIcon />}
        />
      </Box>
      
      {/* Card 3: Time Until Next Phase */}
      <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
        <Card
          title={`Temps jusqu'à la prochaine ${getNextPhaseLabel()}`}
          value={getTimeUntilNextPhase()}
          icon={<FastForwardIcon />}
        />
      </Box>
    </Box>
  );
}