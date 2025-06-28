// src/components/common/TimerBar.jsx
import React, { useContext, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import AddIcon from '@mui/icons-material/Add';
import { TimerContext } from '../../contexts/TimerContext';
import PhaseTransitionDialog from './PhaseTransitionDialog';
import StopTimerConfirmDialog from './StopTimerConfirmDialog';
import SnackbarAlert from './SnackbarAlert'; // <-- Import SnackbarAlert
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function TimerBar({ onCreateClick, config }) {
  const theme = useTheme();
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow } = useCustomTheme();

  const {
    phase,
    isPaused,
    timeLeft,
    timeElapsedTotal,
    upcomingBreakType,
    startBreak,
    resumeStudy,
    stopSeance, // This is the function we'll enhance
    pauseTimer,
    resumeTimer,
    loaded,
  } = useContext(TimerContext);

  const [openStopConfirmDialog, setOpenStopConfirmDialog] = useState(false);

  // --- NEW STATE FOR SNACKBAR ALERT ---
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
    loading: false,
  });

  const formatTime = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':');
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'study': return '🟪 Phase : étude';
      case 'break': return upcomingBreakType === 'longue' ? '🟩 Phase : pause longue' : '🟦 Phase : pause courte';
      case 'awaiting_break': return '⏸ Phase : en attente de pause';
      case 'awaiting_study': return '⏸ Phase : en attente de reprise';
      case 'completed': return '✅ Phase : terminée';
      case 'idle': default: return null;
    }
  };

  const isIdle = phase === 'idle';
  const isStudy = phase === 'study';
  const isBreak = phase === 'break';
  const isComplete = phase === 'completed';

  const showPhaseTransitionDialog = loaded && (phase === 'awaiting_break' || phase === 'awaiting_study');

  const handlePhaseTransitionDialogConfirm = () => {
    if (phase === 'awaiting_break') startBreak();
    else if (phase === 'awaiting_study') resumeStudy();
  };

  const handleStopButtonClick = () => {
    setOpenStopConfirmDialog(true);
  };

  const handleStopDialogClose = () => {
    setOpenStopConfirmDialog(false);
  };

  // --- MODIFIED handleStopDialogConfirm TO USE SNACKBAR ---
  const handleStopDialogConfirm = async () => {
    setOpenStopConfirmDialog(false); // Close the confirmation dialog immediately

    setSnackbar({
      open: true,
      message: 'Arrêt de la séance en cours...',
      severity: 'info',
      loading: true,
    });

    try {
      // Assuming stopSeance is an async function or you'd wrap it in a Promise
      await Promise.resolve(stopSeance()); // Wrap stopSeance in Promise.resolve if it's not async

      setSnackbar({
        open: true,
        message: 'Séance arrêtée avec succès !',
        severity: 'success',
        loading: false,
      });
    } catch (error) {
      console.error("Erreur lors de l'arrêt de la séance:", error);
      setSnackbar({
        open: true,
        message: "Échec de l'arrêt de la séance. Veuillez réessayer.",
        severity: 'error',
        loading: false,
      });
    }
  };

  // Handler to close the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box
        width="30rem"
        height="5.5rem"
        mx="auto"
        sx={{
          backdropFilter: 'blur(10px)',
          border: `1px solid ${whiteBorder}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          mt: 3,
          color: primaryText
        }}
      >
        {/* Left: Info */}
        <Box>
          {!isIdle && (
            <>
              <Typography variant="h6" fontWeight="medium" sx={{ color: primaryText }}>
                Temps écoulé : {formatTime(timeElapsedTotal)}
              </Typography>
              <Typography variant="body2" fontStyle="italic" sx={{ color: primaryText }}>
                {getPhaseLabel()}
              </Typography>

              {phase === 'study' && (
                <Typography variant="body2" fontStyle="italic" sx={{ color: primaryText }}>
                  Prochaine pause {upcomingBreakType} dans : {formatTime(timeLeft)}
                </Typography>
              )}

              {phase === 'break' && (
                <Typography variant="body2" fontStyle="italic" sx={{ color: primaryText }}>
                  Prochaine séance d’étude dans : {formatTime(timeLeft)}
                </Typography>
              )}
            </>
          )}

          {isIdle && (
            <Typography variant="body2" fontStyle="italic" sx={{ color: primaryText }}>
              Aucune séance active. Cliquez pour en créer une.
            </Typography>
          )}
        </Box>

        {/* Right: Controls */}
        <Box display="flex" alignItems="center">
          {isIdle && (
            <Tooltip title="Créer une séance">
              <IconButton
                onClick={onCreateClick}
                sx={{
                  color: theme.palette.primary.contrastText,
                  bgcolor: alpha(specialText, 1),
                  '&:hover': { bgcolor: alpha(specialText, 0.6) },
                  borderRadius: '50%',
                  p: 1,
                  ml: 2
                }}
              >
                <AddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          )}

          {(isStudy || isBreak) && (
            <Tooltip title={isPaused ? 'Reprendre' : 'Pause'}>
              <IconButton
                onClick={isPaused ? resumeTimer : pauseTimer}
                sx={{
                  color: primaryText,
                  bgcolor: alpha(secondaryColor, 0.4),
                  '&:hover': { bgcolor: alpha(specialColor, 0.6) },
                  borderRadius: '50%',
                  p: 1,
                  ml: 2
                }}
              >
                {isPaused
                  ? <PlayArrowIcon fontSize="large" />
                  : <PauseIcon fontSize="large" />}
              </IconButton>
            </Tooltip>
          )}

          {!isIdle && !isComplete && (
            <Tooltip title="Arrêter la séance">
              <IconButton
                onClick={handleStopButtonClick}
                sx={{
                  color: theme.palette.error.contrastText,
                  bgcolor: alpha(theme.palette.error.main, 0.4),
                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.6) },
                  borderRadius: '50%',
                  p: 1,
                  ml: 1
                }}
              >
                <StopIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <PhaseTransitionDialog open={showPhaseTransitionDialog} phase={phase} onConfirm={handlePhaseTransitionDialogConfirm} />

      <StopTimerConfirmDialog
        open={openStopConfirmDialog}
        onClose={handleStopDialogClose}
        onConfirm={handleStopDialogConfirm}
      />

      {/* --- RENDER THE SNACKBAR ALERT --- */}
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        loading={snackbar.loading}
        onClose={handleSnackbarClose}
      />
    </>
  );
}