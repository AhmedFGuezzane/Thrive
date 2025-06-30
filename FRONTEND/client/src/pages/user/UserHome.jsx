
import React, { useState, useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import CreateSeanceDialog from '../../components/common/CreateSeanceDialog';
import TaskList from '../../components/UserHome/TaskList';
import TimerBar from '../../components/common/TimerBar';
import { TimerContext } from '../../contexts/TimerContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import StudyTips from '../../components/UserHome/StudyTips';
import ActiveSeanceInfo from '../../components/UserHome/ActiveSeanceInfo';
import { useSeanceManagement } from '../../hooks/useSeanceManagement';

export default function UserHome() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { startSeance, activeSeanceId } = useContext(TimerContext);
  const { showSnackbar } = useSnackbar();
  const { addSeance } = useSeanceManagement();

  const outerBox = theme.palette.custom.box.outer;
  const whiteBorder = theme.palette.custom.border.white;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    type_seance: "focus",
    nom: "Deep Work Session",
    pomodoro: {
      duree_seance: 1500,
      duree_pause_courte: 300,
      duree_pause_longue: 900,
      nbre_pomodoro_avant_pause_longue: 4,
      duree_seance_totale: 7200,
      auto_demarrage: true,
      alerte_sonore: true,
      notification: true,
      vibration: false,
      nom_seance: "Pomodoro Config A",
      theme: "dark",
      suivi_temps_total: true,
      nom_preconfiguration: "Standard Focus"
    }
  });

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => {
    setDialogOpen(false);
    setTimeout(() => setActiveStep(0), 300);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePomodoroChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value);
    setFormData(prev => ({
      ...prev,
      pomodoro: { ...prev.pomodoro, [name]: newValue }
    }));
  };

  const handleSubmit = async () => {
    handleDialogClose();
    showSnackbar(t('session.creating'), 'info', true);
    try {
      const createdSeance = await addSeance(formData);
      const newSeanceId = createdSeance?.id || null;
      if (!newSeanceId) {
        showSnackbar(t('session.missing_id'), 'warning');
      }
      showSnackbar(t('session.success'), 'success');
      startSeance(formData.pomodoro, newSeanceId);
    } catch (err) {
      showSnackbar(t('session.error', { message: err.message }), 'error');
      setDialogOpen(true);
    }
  };

  return (
    <Box width="98%" height="100%" mx="auto" sx={{
      backgroundColor: outerBox,
      backdropFilter: 'blur(8px)',
      border: `1px solid ${whiteBorder}`,
      borderRadius: '16px',
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: theme.palette.text.primary,
      position: 'relative'
    }}>
      <Box flexGrow={1} display="flex" flexDirection="row" width="100%" height="88%" gap={2} pb={2}>
        <Box flexGrow={1} minHeight={0} display="flex" flexDirection="column">
          <TaskList seanceId={activeSeanceId} showSnackbar={showSnackbar} />
        </Box>
        <Box width="50%" height="100%" display="flex" flexDirection="column" gap={2}>
          <StudyTips />
          <ActiveSeanceInfo onCreateSeanceClick={handleDialogOpen} />
        </Box>
      </Box>

      <TimerBar onCreateClick={handleDialogOpen} config={formData.pomodoro} />

      <CreateSeanceDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        formData={formData}
        setFormData={setFormData}
        handleFormChange={handleFormChange}
        handlePomodoroChange={handlePomodoroChange}
        handleSubmit={handleSubmit}
      />
    </Box>
  );
}
