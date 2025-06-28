import React, { useState, useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import { TimerContext } from '../../contexts/TimerContext';
import { useSnackbar } from '../../contexts/SnackbarContext'; // ✅ use global snackbar

import SeanceDetailsCard from '../../components/UserSeance/SeanceDetailsCard';
import TimerDisplayCard from '../../components/UserSeance/TimerDisplayCard';
import SeanceInactiveState from '../../components/UserSeance/SeanceInactiveState';
import TaskStatusTracker from '../../components/UserSeance/TaskStatusTracker';
import UrgentTasksCard from '../../components/UserSeance/UrgentTasksCard.jsx';
import CreateSeanceDialog from '../../components/common/CreateSeanceDialog';
import TimerBar from '../../components/common/TimerBar.jsx';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { createSeance } from '../../utils/seanceService.jsx';

export default function UserSeance() {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar(); // ✅ hook
  const {
    innerBox, outerBox, middleBox, primaryColor, specialColor,
    secondaryColor, whiteColor, blackColor, specialText,
    secondaryText, primaryText, whiteBorder, blackBorder,
    specialBorder, softBoxShadow
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
    showSnackbar('Création de votre session...', 'info', true);
    try {
      const createdSeance = await createSeance(formData);
      let newSeanceId = createdSeance?.id || null;
      if (!newSeanceId) {
        console.warn("Created seance object did not contain an ID directly:", createdSeance);
        showSnackbar('Session créée, mais ID non reçu. Veuillez rafraîchir.', 'warning');
      }
      showSnackbar('Session créée avec succès !', 'success');
      startSeance(formData.pomodoro, newSeanceId);
      handleDialogClose();
    } catch (err) {
      showSnackbar(`Erreur lors de la création de la session : ${err.message}`, 'error');
    }
  };

  return (
    <Box
      width="98%"
      height="100%"
      mx="auto"
      sx={{
        backgroundColor: outerBox,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: theme.palette.text.primary,
        position: 'relative'
      }}
    >
      <Box flexGrow={1} display="flex" height="100%" width="100%" alignItems="center" justifyContent="center" gap="1rem">
        {activeSeanceId ? (
          <>
            <Box
              display="flex"
              flexDirection="column"
              width="75%"
              height="100%"
              gap={3}
              sx={{
                borderRadius: '16px',
                alignItems: 'start',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <TimerDisplayCard />

              <Box display="flex" width="100%" height="100%" gap={2}>
                <TaskStatusTracker />
                <UrgentTasksCard />
              </Box>

              <Box sx={{ flexShrink: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <TimerBar onCreateClick={handleDialogOpen} config={formData.pomodoro} />
              </Box>
            </Box>

            <Box
              width="25%"
              sx={{
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
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
