import React, { useContext, useState } from 'react';
import { Box, Typography, Button, Grid, IconButton, useTheme } from '@mui/material';
import { TimerContext } from '../../contexts/TimerContext';

// Import icons for session details and navigation
import TimerIcon from '@mui/icons-material/Timer';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import LoopIcon from '@mui/icons-material/Loop';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Modern arrows
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // Modern arrows
import ScheduleIcon from '@mui/icons-material/Schedule'; // For estimated time
import EventNoteIcon from '@mui/icons-material/EventNote'; // For cycles before long break

export default function ActiveSeanceInfo({ onCreateSeanceClick, glassHomeBg, glassHomeBorderColor }) {
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

  // --- Styled Components (for clarity and reusability) ---

  // Enhanced BigTimerDisplay
  const BigTimerDisplay = ({ label, value }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1, // Allow it to take available space
      }}
    >
      <Typography
        variant="subtitle1" // Slightly smaller label
        fontWeight="bold"
        sx={{
          color: 'primary.main', // Use theme color for consistency
          opacity: 0.8,
          mb: 0.5,
          textTransform: 'uppercase', // Make it pop
          letterSpacing: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h3" // Main timer number
        fontWeight="extraBold" // Assuming you have 'extraBold' in theme or use 700+
        sx={{
          color: 'primary.dark', // Deeper primary for numbers
          lineHeight: 1, // Tighter line height
          textShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow
          [theme.breakpoints.down('sm')]: {
            variant: 'h4', // Smaller on small screens
          },
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  // Enhanced InfoPill
  const InfoPill = ({ label, value, icon }) => (
    <Box
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.25)', // Slightly more opaque for better content visibility
        backdropFilter: 'blur(8px)', // Increased blur
        border: '1px solid rgba(255, 255, 255, 0.4)', // Stronger border
        borderRadius: '16px', // Softer pill shape
        p: '10px 15px', // Adjusted padding
        display: 'flex',
        alignItems: 'center',
        gap: 1.5, // More space between icon and text
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // More prominent shadow
        color: 'text.primary', // Use theme text color
        width: '100%',
        minHeight: '50px', // A bit taller
        transition: 'background-color 0.3s ease-in-out', // Smooth hover
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.35)',
        }
      }}
    >
      {icon && React.cloneElement(icon, { sx: { fontSize: 24, color: 'primary.main', flexShrink: 0 } })}
      <Typography variant="body2" fontWeight="medium" sx={{ color: 'text.secondary', flexShrink: 0 }}>
        {label}:
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', flexGrow: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}
      </Typography>
    </Box>
  );

  // --- Helper Functions ---
  const getNextPhaseInfo = () => {
    if (!pomodoroConfig) return { label: 'N/A', value: '00:00:00' };

    switch (phase) {
      case 'study':
        return { label: 'Prochaine Pause dans', value: formatTime(timeLeft) };
      case 'break':
        return { label: 'Prochaine Étude dans', value: formatTime(timeLeft) };
      case 'awaiting_break':
        return { label: 'Prêt pour', value: 'La Pause' };
      case 'awaiting_study':
        return { label: 'Prêt pour', value: "L'Étude" };
      case 'completed':
        return { label: 'Statut', value: 'Terminée' };
      case 'idle':
      default:
        return { label: 'Inactif', value: '00:00:00' };
    }
  };

  const nextPhaseInfo = getNextPhaseInfo();

  const timerViews = [
    { label: "Temps Total Écoulé", value: formatTime(timeElapsedTotal), icon: <HourglassFullIcon /> },
    { label: "Temps Restant (Séance)", value: formatTime(pomodoroConfig ? pomodoroConfig.duree_seance_totale - timeElapsedTotal : 0), icon: <ScheduleIcon /> },
    { label: nextPhaseInfo.label, value: nextPhaseInfo.value, icon: nextPhaseInfo.label.includes('Prêt') ? <PlayCircleOutlineIcon /> : <TimerIcon /> }
  ];

  const handlePrevTimerView = () => {
    setCurrentTimerViewIndex((prevIndex) =>
      (prevIndex - 1 + timerViews.length) % timerViews.length
    );
  };

  const handleNextTimerView = () => {
    setCurrentTimerViewIndex((prevIndex) =>
      (prevIndex + 1) % timerViews.length
    );
  };

  const currentTimerView = timerViews[currentTimerViewIndex];

  return (
    <Box
      flexGrow={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: glassHomeBg,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${glassHomeBorderColor}`,
        borderRadius: '16px', // Consistent with other main components
        p: 2,
        textAlign: 'center',
        color: '#333',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)', // Stronger shadow
      }}
    >
      {!pomodoroConfig ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 2,
            p: 3,
            bgcolor: 'rgba(255, 240, 245, 0.7)', // Lighter background for idle state
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ color: 'primary.dark' }}>
            Aucune séance active
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Commencez une nouvelle session pour suivre votre progression !
          </Typography>
          <Button
            variant="contained"
            onClick={onCreateSeanceClick}
            sx={{
              bgcolor: 'primary.main', // Use theme primary
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
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            bgcolor: 'rgba(255, 240, 245, 0.6)',
            backdropFilter: 'blur(12px)', // Slightly more blur for inner glass effect
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '12px', // Softer inner corners
            p: 3, // Increased padding for more breathing room
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.18)', // More prominent inner shadow
          }}
        >
          {/* Top Section: Main Title & Navigable Timer */}
          <Box sx={{ flexBasis: 'auto', mb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: 'primary.dark',
                mb: 1,
                letterSpacing: '0.8px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}
            >
              Séance Active: {pomodoroConfig.nom_seance || 'N/A'}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                p: 1.5, // Padding inside timer box
              }}
            >
              <IconButton onClick={handlePrevTimerView} sx={{ color: 'primary.main', '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.08)' } }}>
                <ChevronLeftIcon fontSize="large" />
              </IconButton>

              <BigTimerDisplay
                label={currentTimerView.label}
                value={currentTimerView.value}
                icon={currentTimerView.icon} // Pass icon to BigTimerDisplay
              />

              <IconButton onClick={handleNextTimerView} sx={{ color: 'primary.main', '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.08)' } }}>
                <ChevronRightIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>

          {/* Middle Section: Detailed Info Pills */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mb: 2 }}> {/* Added overflow and right padding for scrollbar */}
            <Grid container spacing={1.5} justifyContent="center" alignItems="stretch">
              <Grid item xs={12} sm={6}>
                <InfoPill label="Type de Séance" value={pomodoroConfig.type_seance || 'N/A'} icon={<PlayCircleOutlineIcon />} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoPill label="Thème" value={pomodoroConfig.theme || 'N/A'} icon={<EventNoteIcon />} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoPill label="Durée Étude" value={formatTime(pomodoroConfig.duree_seance)} icon={<TimerIcon />} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoPill label="Durée Pause Courte" value={formatTime(pomodoroConfig.duree_pause_courte)} icon={<TimerIcon />} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoPill label="Durée Pause Longue" value={formatTime(pomodoroConfig.duree_pause_longue)} icon={<TimerIcon />} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoPill label="Cycles avant Pause Longue" value={pomodoroConfig.nbre_pomodoro_avant_pause_longue} icon={<LoopIcon />} />
              </Grid>
              <Grid item xs={12}>
                <InfoPill label="Durée Totale de la Séance" value={formatTime(pomodoroConfig.duree_seance_totale)} icon={<HourglassFullIcon />} />
              </Grid>
            </Grid>
          </Box>

          {/* Bottom Section: Placeholder */}
          <Box sx={{ flexBasis: 'auto', p: 1, pt: 0, mt: 'auto' }}>
            <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', display: 'block' }}>
              Plus de détails à venir...
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}