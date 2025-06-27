import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, CircularProgress, useTheme } from '@mui/material'; // <-- ADDED useTheme hook

import SnackbarAlert from '../../components/common/SnackbarAlert';
import CreateSeanceDialog from '../../components/common/CreateSeanceDialog';
import TaskList from '../../components/UserHome/TaskList';
import TimerBar from '../../components/common/TimerBar';
import { TimerContext } from '../../contexts/TimerContext';
// CORRECTED IMPORT: Ensure it's a named import from the .jsx file
import { createSeance } from '../../utils/seanceService.jsx';
import StudyTips from '../../components/UserHome/StudyTips';
import ActiveSeanceInfo from '../../components/UserHome/ActiveSeanceInfo';



export default function UserHome() {
  // Use the global theme hook to access the palette

  const theme = useTheme();

  // Destructure activeSeanceId from TimerContext
  const { startSeance, activeSeanceId } = useContext(TimerContext);

  // --- REPLACED HARDCODED COLORS WITH DYNAMIC THEME PALETTE COLORS ---
  // The background for a glassmorphism card should be the 'paper' color from the theme
  const glassHomeBg = theme.palette.background.paper;


  // The border color should be dynamic for better visibility in light/dark mode
  const glassHomeBorderColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';



  const outerBox = theme.palette.custom.box.outer;
  const innerBox = theme.palette.custom.box.inner;

  const whiteBorder = theme.palette.custom.border.white;
  // ----------------------------------------------------------------------

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  // NEW: Add a state for Snackbar loading
  const [snackbarLoading, setSnackbarLoading] = useState(false);

  // Modified showSnackbar to accept a loading parameter
  const showSnackbar = (message, severity, loading = false) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarLoading(loading);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
    setSnackbarLoading(false);
  };

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
    // 1. Show "Creating your session..." progress message
    showSnackbar('Création de votre session...', 'info', true);

    try {
      const createdSeance = await createSeance(formData);

      let newSeanceId = null;
      if (createdSeance && createdSeance.id) {
        newSeanceId = createdSeance.id;
      } else {
        console.warn("Created seance object did not contain an ID directly:", createdSeance);
        // If ID is missing but creation seems okay, still show a warning but don't prevent flow
        showSnackbar('Session créée, mais ID non reçu. Veuillez rafraîchir.', 'warning');
      }

      // 2. On success, show "Session created successfully!" message
      showSnackbar('Session créée avec succès !', 'success');

      startSeance(formData.pomodoro, newSeanceId);
      handleDialogClose();
    } catch (err) {
      // 3. On error, show "Error creating session" message
      showSnackbar(`Erreur lors de la création de la session : ${err.message}`, 'error');
    }
  };


  return (
    <Box
      width="98%"
      height="100%"
      mx="auto"
      sx={{
        // --- UPDATED to use dynamic theme colors ---
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
        color: theme.palette.text.primary, // <-- Use theme text color for contrast
        position: 'relative'
      }}
    >
      <Box flexGrow={1} display="flex"  flexDirection="row" width="100%" height="88%" gap={2} pb={2}>

        {/* Adjusted Box for TaskList */}
        <Box
          flexGrow={1}
          minHeight={0}
          display="flex"
          flexDirection="column"
        >
          {/* TaskList component - will now correctly scroll if its content overflows */}
          {/* Ensure seanceId prop is correctly passed to TaskList if it's dependent on a session */}
          {/* NEW: Pass showSnackbar to TaskList if it also manages task details updates */}
          <TaskList seanceId={activeSeanceId} showSnackbar={showSnackbar} />
        </Box>

        {/* Adjusted Box for StudyTips and ActiveSeanceInfo */}
        <Box width="50%" height="100%" display="flex" flexDirection="column" gap={2}>
          {/* StudyTips component */}
          <StudyTips />

          {/* ActiveSeanceInfo component */}
          <ActiveSeanceInfo
            onCreateSeanceClick={handleDialogOpen}
            // --- Pass the dynamic colors down to the child component ---
            //glassHomeBg="{glassHomeBg}"
            //glassHomeBorderColor={glassHomeBorderColor}
          />
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

      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        loading={snackbarLoading}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}