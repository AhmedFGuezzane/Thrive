// src/pages/user/UserSeance.jsx

import React, { useState, useContext } from 'react';
import { Box, Grid } from '@mui/material';
import { TimerContext } from '../../contexts/TimerContext';
import SeanceDetailsCard from '../../components/UserSeance/SeanceDetailsCard';
import TimerDisplayCard from '../../components/UserSeance/TimerDisplayCard';
import SeanceInactiveState from '../../components/UserSeance/SeanceInactiveState';
import TaskStatusTracker from '../../components/UserSeance/TaskStatusTracker';
import UrgentTasksCard from '../../components/UserSeance/UrgentTasksCard.jsx';
import CreateSeanceDialog from '../../components/common/CreateSeanceDialog';
import SnackbarAlert from '../../components/common/SnackbarAlert';
import PhaseTransitionDialog from '../../components/common/PhaseTransitionDialog';
import { createSeance } from '../../utils/seanceService.jsx';
import TimerBar from '../../components/common/TimerBar.jsx';

export default function UserSeance() {
    const { activeSeanceId, startSeance, phase, loaded } = useContext(TimerContext);

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
    const [snackbarLoading, setSnackbarLoading] = useState(false);

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

    const { startBreak, resumeStudy } = useContext(TimerContext);
    const showDialog = loaded && (phase === 'awaiting_break' || phase === 'awaiting_study');
    const handleDialogConfirm = () => {
        if (phase === 'awaiting_break') startBreak();
        else if (phase === 'awaiting_study') resumeStudy();
    };

    return (
        <Box
            width="98%"
            height="100%"
            mx="auto"
            bgcolor="rgba(255, 255, 255, 0.25)"
            sx={{
                borderRadius: '16px',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}
        >
            <Box flexGrow={1} display="flex" flexDirection="column" height="100%" width="100%" alignItems="center" justifyContent="center" gap={"1rem"} >
                {activeSeanceId ? (
                    <>
                        <Grid container spacing={2} display="flex" sx={{ width: '100%', height: '100%' }}>
                            <Grid width="72%" height="88%">
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap={3}
                                    height="100%"
                                    sx={{
                                        p: 2,
                                        borderRadius: '16px',
                                        alignItems: 'start',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <TimerDisplayCard />
                                    <Box display="flex" width="100%" height = "100%" justifyContent="space-between" gap={"1rem"}>
                                        <TaskStatusTracker />
                                        <UrgentTasksCard />
                                    </Box>
                                </Box>
                                {activeSeanceId && (
                                    <Box sx={{ flexShrink: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <TimerBar onCreateClick={handleDialogOpen} config={formData.pomodoro} />
                                    </Box>
                                )}
                            </Grid>
                            <Grid width="25%" height="100%">
                                <SeanceDetailsCard />
                            </Grid>
                        </Grid>
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

            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                loading={snackbarLoading}
                onClose={handleSnackbarClose}
            />

            <PhaseTransitionDialog
                open={showDialog}
                phase={phase}
                onConfirm={handleDialogConfirm}
            />
        </Box>
    );
}
