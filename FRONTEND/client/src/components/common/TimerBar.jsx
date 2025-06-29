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
import SnackbarAlert from './SnackbarAlert';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

export default function TimerBar({ onCreateClick, config }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    innerBox, whiteBorder, specialText, specialColor,
    secondaryColor, primaryText
  } = useCustomTheme();

  const {
    phase, isPaused, timeLeft, timeElapsedTotal,
    upcomingBreakType, startBreak, resumeStudy,
    stopSeance, pauseTimer, resumeTimer, loaded
  } = useContext(TimerContext);

  const [openStopConfirmDialog, setOpenStopConfirmDialog] = useState(false);
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
      case 'study': return t('timer.phase.study');
      case 'break': return upcomingBreakType === 'longue' ? t('timer.phase.longBreak') : t('timer.phase.shortBreak');
      case 'awaiting_break': return t('timer.phase.awaitingBreak');
      case 'awaiting_study': return t('timer.phase.awaitingStudy');
      case 'completed': return t('timer.phase.completed');
      case 'idle':
      default: return null;
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

  const handleStopDialogConfirm = async () => {
    setOpenStopConfirmDialog(false);
    setSnackbar({ open: true, message: t('timer.snackbar.stopping'), severity: 'info', loading: true });

    try {
      await Promise.resolve(stopSeance());
      setSnackbar({ open: true, message: t('timer.snackbar.stopped'), severity: 'success', loading: false });
    } catch (error) {
      console.error("Erreur arrêt séance:", error);
      setSnackbar({ open: true, message: t('timer.snackbar.error'), severity: 'error', loading: false });
    }
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
        {/* Left Info */}
        <Box>
          {!isIdle ? (
            <>
              <Typography variant="h6" fontWeight="medium" sx={{ color: primaryText }}>
                {t('timer.elapsed')}: {formatTime(timeElapsedTotal)}
              </Typography>
              <Typography variant="body2" fontStyle="italic" sx={{ color: primaryText }}>
                {getPhaseLabel()}
              </Typography>
              {isStudy && (
                <Typography variant="body2" fontStyle="italic" sx={{ color: primaryText }}>
                  {t('timer.nextShortBreakIn')} {formatTime(timeLeft)}
                </Typography>
              )}
              {isBreak && (
                <Typography variant="body2" fontStyle="italic" sx={{ color: primaryText }}>
                  {t('timer.nextStudyIn')} {formatTime(timeLeft)}
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" fontStyle="italic" sx={{ color: primaryText }}>
              {t('timer.noActiveSession')}
            </Typography>
          )}
        </Box>

        {/* Controls */}
        <Box display="flex" alignItems="center">
          {isIdle && (
            <Tooltip title={t('timer.actions.create')}>
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
            <Tooltip title={t(isPaused ? 'timer.actions.resume' : 'timer.actions.pause')}>
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
                {isPaused ? <PlayArrowIcon fontSize="large" /> : <PauseIcon fontSize="large" />}
              </IconButton>
            </Tooltip>
          )}

          {!isIdle && !isComplete && (
            <Tooltip title={t('timer.actions.stop')}>
              <IconButton
                onClick={() => setOpenStopConfirmDialog(true)}
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

      <PhaseTransitionDialog
        open={showPhaseTransitionDialog}
        phase={phase}
        onConfirm={handlePhaseTransitionDialogConfirm}
      />

      <StopTimerConfirmDialog
        open={openStopConfirmDialog}
        onClose={() => setOpenStopConfirmDialog(false)}
        onConfirm={handleStopDialogConfirm}
      />

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        loading={snackbar.loading}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </>
  );
}
