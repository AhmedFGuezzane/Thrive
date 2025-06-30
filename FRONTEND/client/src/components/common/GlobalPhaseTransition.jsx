
import React, { useContext } from 'react';
import { TimerContext } from '../../contexts/TimerContext';
import PhaseTransitionDialog from './PhaseTransitionDialog';

export default function GlobalPhaseTransition() {
  const timer = useContext(TimerContext);

  if (!timer) return null;

  const { phase, startBreak, resumeStudy, loaded } = timer;

  const showDialog = loaded && (phase === 'awaiting_break' || phase === 'awaiting_study');

  const handleDialogConfirm = () => {
    if (phase === 'awaiting_break') startBreak();
    else if (phase === 'awaiting_study') resumeStudy();
  };

  return (
    <PhaseTransitionDialog
      open={showDialog}
      phase={phase}
      onConfirm={handleDialogConfirm}
    />
  );
}
