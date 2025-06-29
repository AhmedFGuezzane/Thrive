// src/pages/user/UserSeance.jsx
import React, { useState, useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TimerContext } from '../../contexts/TimerContext';
import { useSnackbar } from '../../contexts/SnackbarContext';

import SeanceDetailsCard from '../../components/UserSeance/SeanceDetailsCard';
import TimerDisplayCard from '../../components/UserSeance/TimerDisplayCard';
import SeanceInactiveState from '../../components/UserSeance/SeanceInactiveState';
import TaskStatusTracker from '../../components/UserSeance/TaskStatusTracker';
import UrgentTasksCard from '../../components/UserSeance/UrgentTasksCard.jsx';
import CreateSeanceDialog from '../../components/common/CreateSeanceDialog';
import TimerBar from '../../components/common/TimerBar.jsx';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useSeanceManagement } from '../../hooks/useSeanceManagement';

export default function UserSeance() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { addSeance } = useSeanceManagement();
  const {
    innerBox, outerBox, whiteBorder
  } = useCustomTheme();
  const { activeSeanceId, startSeance } = useContext(TimerContext);

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
    showSnackbar(t('session.creating'), 'info', true);
    try {
      const createdSeance = await addSeance(formData);
      const newSeanceId = createdSeance?.id || null;
      if (!newSeanceId) {
        showSnackbar(t('session.missing_id'), 'warning');
      }
      showSnackbar(t('session.success'), 'success');
      startSeance(formData.pomodoro, newSeanceId);
      handleDialogClose();
    } catch (err) {
      showSnackbar(t('session.error', { message: err.message }), 'error');
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
      <Box flexGrow={1} display="flex" width="100%" height="100%" alignItems="center" justifyContent="center" gap="1rem">
        {activeSeanceId ? (
          <>
            <Box display="flex" flexDirection="column" width="75%" height="100%" gap={3}>
              <TimerDisplayCard />
              <Box display="flex" width="100%" height="100%" gap={2}>
                <TaskStatusTracker />
                <UrgentTasksCard />
              </Box>
              <Box sx={{ flexShrink: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <TimerBar onCreateClick={handleDialogOpen} config={formData.pomodoro} />
              </Box>
            </Box>
            <Box width="25%" height="100%">
              <SeanceDetailsCard />
            </Box>
          </>
        ) : (
          <SeanceInactiveState onCreateSeanceClick={handleDialogOpen} />
        )}
      </Box>

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
