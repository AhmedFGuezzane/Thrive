import React, { useState, useEffect } from 'react';
import {
    Box, IconButton, Tooltip, Typography, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, Stepper, Step, StepLabel, TextField,
    FormControlLabel, Switch, Grid, Divider
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';


export default function App() { // Renamed to App for standalone preview
    // Define glassmorphism colors for UserHome
    const glassHomeBg = 'rgba(255, 240, 245, 0.2)'; // Light pastel pink/lavender for transparency
    const glassHomeBorderColor = 'rgba(255, 255, 255, 0.1)'; // Subtle border

    // State for the timer
    const [time, setTime] = useState(0); // Time in seconds
    const [isRunning, setIsRunning] = useState(false); // Timer running status

    // State for the dialog and form
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

    // UPDATED: Added a third step for confirmation
    const steps = ['Détails de la séance', 'Configuration Pomodoro', 'Confirmation'];

    // Effect to manage the timer interval
    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isRunning]);

    // Timer control functions
    const handlePlayPause = () => setIsRunning(prev => !prev);
    const handleStop = () => {
        setIsRunning(false);
        setTime(0);
    };

    // Time formatting function
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [hours, minutes, seconds].map(unit => String(unit).padStart(2, '0')).join(':');
    };
    
    // Dialog and form handlers
    const handleDialogOpen = () => setDialogOpen(true);
    const handleDialogClose = () => {
        setDialogOpen(false);
        // Delay resetting the step to avoid seeing the first step on close animation
        setTimeout(() => setActiveStep(0), 300);
    };
    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePomodoroChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData(prev => ({
            ...prev,
            pomodoro: { ...prev.pomodoro, [name]: type === 'checkbox' ? checked : value }
        }));
    };

    const handleSubmit = () => {
        console.log("Form Submitted:", JSON.stringify(formData, null, 2));
        handleDialogClose();
    };

    // Glassmorphism styles for the timer bar
    const glassTimerBarBg = 'rgba(200, 160, 255, 0.3)';
    const glassTimerBarBorderColor = 'rgba(255, 255, 255, 0.2)';

    // Function to render form content based on the active step
    const getStepContent = (step) => {
        switch (step) {
            case 0: // Step 1: Session Details
                return (
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                        <TextField fullWidth margin="normal" label="Type de séance" name="type_seance" value={formData.type_seance} onChange={handleFormChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }} />
                        <TextField fullWidth margin="normal" label="Nom de la séance" name="nom" value={formData.nom} onChange={handleFormChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }}/>
                    </Box>
                );
            case 1: // Step 2: Pomodoro Config
                return (
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2, maxHeight: '55vh', overflowY: 'auto', pr: 2 }}>
                        <Grid container spacing={2}>
                            {/* Text Fields */}
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Durée Séance (s)" name="duree_seance" type="number" value={formData.pomodoro.duree_seance} onChange={handlePomodoroChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Pause Courte (s)" name="duree_pause_courte" type="number" value={formData.pomodoro.duree_pause_courte} onChange={handlePomodoroChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Pause Longue (s)" name="duree_pause_longue" type="number" value={formData.pomodoro.duree_pause_longue} onChange={handlePomodoroChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Cycles avant pause longue" name="nbre_pomodoro_avant_pause_longue" type="number" value={formData.pomodoro.nbre_pomodoro_avant_pause_longue} onChange={handlePomodoroChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Durée Totale (s)" name="duree_seance_totale" type="number" value={formData.pomodoro.duree_seance_totale} onChange={handlePomodoroChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Nom Séance Pomodoro" name="nom_seance" value={formData.pomodoro.nom_seance} onChange={handlePomodoroChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Thème" name="theme" value={formData.pomodoro.theme} onChange={handlePomodoroChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Nom Préconfiguration" name="nom_preconfiguration" value={formData.pomodoro.nom_preconfiguration} onChange={handlePomodoroChange} variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)' } }} /></Grid>
                            {/* Switches */}
                            <Grid item xs={12} sm={6}><FormControlLabel control={<Switch checked={formData.pomodoro.auto_demarrage} onChange={handlePomodoroChange} name="auto_demarrage" color="secondary"/>} label="Démarrage auto" /></Grid>
                            <Grid item xs={12} sm={6}><FormControlLabel control={<Switch checked={formData.pomodoro.alerte_sonore} onChange={handlePomodoroChange} name="alerte_sonore" color="secondary"/>} label="Alerte sonore" /></Grid>
                            <Grid item xs={12} sm={6}><FormControlLabel control={<Switch checked={formData.pomodoro.notification} onChange={handlePomodoroChange} name="notification" color="secondary"/>} label="Notification" /></Grid>
                            <Grid item xs={12} sm={6}><FormControlLabel control={<Switch checked={formData.pomodoro.vibration} onChange={handlePomodoroChange} name="vibration" color="secondary"/>} label="Vibration" /></Grid>
                            <Grid item xs={12}><FormControlLabel control={<Switch checked={formData.pomodoro.suivi_temps_total} onChange={handlePomodoroChange} name="suivi_temps_total" color="secondary"/>} label="Suivi du temps total" /></Grid>
                        </Grid>
                    </Box>
                );
            case 2: // UPDATED: Step 3: Confirmation with enhanced visuals
                return (
                    <Box sx={{ mt: 2, maxHeight: '55vh', overflowY: 'auto', pr: 1 }}>
                        <Grid container spacing={2}>
                            {/* Session Details Card */}
                            <Grid item xs={12}>
                                <Box p={2} sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <Box display="flex" alignItems="center" mb={1.5}>
                                        <InfoOutlinedIcon sx={{ mr: 1, color: 'rgba(0,0,0,0.7)'}} />
                                        <Typography variant="h6" fontWeight="bold">Récapitulatif</Typography>
                                    </Box>
                                    <Divider sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.3)' }} />
                                    <Typography variant="body1"><strong>Type:</strong> {formData.type_seance}</Typography>
                                    <Typography variant="body1"><strong>Nom:</strong> {formData.nom}</Typography>
                                </Box>
                            </Grid>

                            {/* Pomodoro Details Card */}
                            <Grid item xs={12}>
                                <Box p={2} sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <Box display="flex" alignItems="center" mb={1.5}>
                                        <TimerOutlinedIcon sx={{ mr: 1, color: 'rgba(0,0,0,0.7)' }} />
                                        <Typography variant="h6" fontWeight="bold">Détails Pomodoro</Typography>
                                    </Box>
                                    <Divider sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.3)' }} />
                                    <Grid container spacing={1}>
                                    {Object.entries(formData.pomodoro).map(([key, value]) => (
                                        <Grid item xs={12} sm={6} key={key}>
                                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                <strong>{key.replace(/_/g, ' ')}:</strong>
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {typeof value === 'boolean' ? (value ? 'Activé' : 'Désactivé') : value}
                                            </Typography>
                                        </Grid>
                                    ))}
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Box width="98%" height="100%" mx="auto" sx={{ backgroundColor: glassHomeBg, backdropFilter: 'blur(8px)', border: `1px solid ${glassHomeBorderColor}`, boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', borderRadius: '16px', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', color: '#333', position: 'relative' }}>
            {/* Main content area */}
            <Box flexGrow={1} display="flex" flexDirection="row" width="100%" gap={2} pb={2}>
                {/* Left Column: Tasks */}
                <Box width="50%" height="100%" sx={{ backgroundColor: glassHomeBg, backdropFilter: 'blur(8px)', border: `1px solid ${glassHomeBorderColor}`, boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', borderRadius: '12px', p: 2, display: 'flex', flexDirection: 'column', gap: 1, overflow: 'auto' }}>
                    <Typography variant="h6" fontWeight="bold" color="#333" mb={1}>My Tasks</Typography>
                    {[...Array(10)].map((_, index) => (
                        <Box key={index} sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', mb: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#444' }}>
                            <Typography variant="body1">Task {index + 1}: Study React</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Due: 2024-12-{15 + index}</Typography>
                        </Box>
                    ))}
                </Box>
                {/* Right Column */}
                <Box width="50%" height="100%" display="flex" flexDirection="column" gap={2}>
                    <Box flexGrow={1} height="50%" sx={{ backgroundColor: glassHomeBg, backdropFilter: 'blur(8px)', border: `1px solid ${glassHomeBorderColor}`, boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', borderRadius: '12px', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight="bold" color="#333" mb={1}>Study Tips</Typography>
                        <Typography variant="body2" color="#555">"Break your study sessions into smaller, manageable chunks. Use the Pomodoro Technique!"</Typography>
                    </Box>
                    <Box flexGrow={1} height="50%" sx={{ backgroundColor: glassHomeBg, backdropFilter: 'blur(8px)', border: `1px solid ${glassHomeBorderColor}`, boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', borderRadius: '12px', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={handleDialogOpen} sx={{ bgcolor: 'rgba(128, 0, 128, 0.4)', '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.6)' } }}>
                            Creer seance
                        </Button>
                    </Box>
                </Box>
            </Box>
            {/* Timer Bar */}
            <Box width="22rem" height="4rem" mx="auto" sx={{ backgroundColor: glassTimerBarBg, backdropFilter: 'blur(10px)', border: `1px solid ${glassTimerBarBorderColor}`, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mt: 3, color: '#fff' }}>
                <Typography variant="h5" fontWeight="medium">{formatTime(time)}</Typography>
                <Box display="flex" alignItems="center">
                    <Tooltip title={isRunning ? "Pause" : "Start"}><IconButton onClick={handlePlayPause} sx={{ color: '#fff', bgcolor: 'rgba(128, 0, 128, 0.4)', '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.6)' }, borderRadius: '50%', p: 1, ml: 2 }}>{isRunning ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}</IconButton></Tooltip>
                    <Tooltip title="Stop"><IconButton onClick={handleStop} sx={{ color: '#fff', bgcolor: 'rgba(255, 99, 71, 0.4)', '&:hover': { bgcolor: 'rgba(255, 99, 71, 0.6)' }, borderRadius: '50%', p: 1, ml: 1 }}> <StopIcon fontSize="large" /> </IconButton></Tooltip>
                </Box>
            </Box>
            {/* NEW/UPDATED: Glassmorphism Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth
                PaperProps={{ sx: { 
                    backgroundColor: 'rgba(255, 240, 245, 0.7)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
                    color: '#333'
                }}}
            >
                <DialogTitle sx={{ fontWeight: 'bold' }}>Créer une nouvelle séance</DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep} sx={{ pt: 1, pb: 3}}>
                        {steps.map((label) => <Step key={label}><StepLabel sx={{'.Mui-active': {fontWeight: 'bold'}, '.Mui-completed': {fontWeight: 'bold'}}}><Typography fontWeight="medium">{label}</Typography></StepLabel></Step>)}
                    </Stepper>
                    {getStepContent(activeStep)}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleDialogClose} sx={{ color: '#555' }}>Annuler</Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {activeStep !== 0 && (<Button onClick={handleBack} sx={{ mr: 1, color: '#555' }}>Précédent</Button>)}
                    <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} sx={{ bgcolor: 'rgba(128, 0, 128, 0.5)', '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.7)' }, borderRadius: '8px' }}>
                        {activeStep === steps.length - 1 ? 'Confirmer et Créer' : 'Suivant'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
