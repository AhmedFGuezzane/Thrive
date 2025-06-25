// src/components/common/TimerBar.jsx
import React, { useContext } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import AddIcon from '@mui/icons-material/Add';
import { TimerContext } from '../../contexts/TimerContext';
import PhaseTransitionDialog from './PhaseTransitionDialog';

// Changed from named export to default export
export default function TimerBar({ onCreateClick, config }) {
  const {
    phase,
    isPaused,
    timeLeft,
    timeElapsedTotal,
    upcomingBreakType,
    startBreak,
    resumeStudy,
    stopSeance,
    pauseTimer,
    resumeTimer,
    loaded,
  } = useContext(TimerContext);

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

  // Show dialog only if loaded is true to avoid immediate popup on reload
  const showDialog = loaded && (phase === 'awaiting_break' || phase === 'awaiting_study');

  const handleDialogConfirm = () => {
    if (phase === 'awaiting_break') startBreak();
    else if (phase === 'awaiting_study') resumeStudy();
  };

  return (
    <>
      <Box
        width="30rem"
        height="5.5rem"
        mx="auto"
        sx={{
          backgroundColor: 'rgba(200, 160, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          mt: 3,
          color: '#fff'
        }}
      >
        {/* Left: Info */}
        <Box>
          {!isIdle && (
            <>
              <Typography variant="h6" fontWeight="medium">
                ⏱ Temps écoulé : {formatTime(timeElapsedTotal)}
              </Typography>
              <Typography variant="body2" fontStyle="italic" color="rgba(255,255,255,0.8)">
                {getPhaseLabel()}
              </Typography>

              {phase === 'study' && (
                <Typography variant="body2" fontStyle="italic" color="rgba(255,255,255,0.6)">
                  🧘 Prochaine pause {upcomingBreakType} dans : {formatTime(timeLeft)}
                </Typography>
              )}

              {phase === 'break' && (
                <Typography variant="body2" fontStyle="italic" color="rgba(255,255,255,0.6)">
                  🟪 Prochaine séance d’étude dans : {formatTime(timeLeft)}
                </Typography>
              )}
            </>
          )}

          {isIdle && (
            <Typography variant="body2" fontStyle="italic" color="rgba(255,255,255,0.8)">
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
                  color: '#fff',
                  bgcolor: 'rgba(128, 0, 128, 0.4)',
                  '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.6)' },
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
                  color: '#fff',
                  bgcolor: 'rgba(128, 0, 128, 0.4)',
                  '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.6)' },
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
                onClick={stopSeance}
                sx={{
                  color: '#fff',
                  bgcolor: 'rgba(255, 99, 71, 0.4)',
                  '&:hover': { bgcolor: 'rgba(255, 99, 71, 0.6)' },
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

      {/* Phase Transition Dialog */}
      <PhaseTransitionDialog open={showDialog} phase={phase} onConfirm={handleDialogConfirm} />
    </>
  );
}
