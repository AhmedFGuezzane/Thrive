import React, { useState, useEffect } from 'react';
import {
    Box, IconButton, Tooltip, Typography, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, Stepper, Step, StepLabel, TextField,
    FormControlLabel, Switch, Grid, Divider, InputBase, Snackbar, Alert
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

/**
 * A reusable component for displaying snackbar alerts with glassmorphism style.
 * @param {object} props - The component props.
 * @param {boolean} props.open - Whether the snackbar is visible.
 * @param {string} props.message - The message to display.
 * @param {'success'|'error'|'info'|'warning'} props.severity - The alert severity.
 * @param {function} props.onClose - The function to call when the snackbar is closed.
 * @returns {JSX.Element}
 */
const SnackbarAlert = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          color: '#fff',
          '& .MuiAlert-icon': {
            color: 'rgba(255, 255, 255, 0.8) !important',
          },
          '& .MuiAlert-message': {
            color: '#fff',
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default function UserHome() {
    // Define glassmorphism colors for the main component
    const glassHomeBg = 'rgba(255, 240, 245, 0.2)';
    const glassHomeBorderColor = 'rgba(255, 255, 255, 0.1)';

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

    // State for Snackbar alerts
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const steps = ['Détails de la séance', 'Configuration Pomodoro', 'Confirmation'];

    /**
     * Shows a snackbar message with a specific severity.
     * @param {string} message - The message to display.
     * @param {'success'|'error'|'info'|'warning'} severity - The severity of the message.
     */
    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    /**
     * Handles closing the snackbar.
     * @param {React.SyntheticEvent | Event} event - The event source of the callback.
     * @param {string} [reason] - The reason for the close event.
     */
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

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
        setTimeout(() => setActiveStep(0), 300); // Reset step after closing animation
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

    // Handles form submission to the backend API with snackbar feedback
    const handleSubmit = async () => {
        showSnackbar('Creating your session...', 'info');
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                showSnackbar('Authentication Error: Please log in again.', 'error');
                return;
            }

            // Decode the JWT to extract client_id
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            const client_id = decodedPayload.sub;

            // Calculate start and end dates
            const date_debut = new Date();
            const date_fin = new Date(date_debut.getTime() + Number(formData.pomodoro.duree_seance_totale) * 1000);

            // Construct the request payload
            const payload = {
                client_id,
                type_seance: formData.type_seance,
                nom: formData.nom,
                date_debut: date_debut.toISOString(),
                date_fin: date_fin.toISOString(),
                statut: "en_cours",
                est_complete: false,
                interruptions: 0,
                nbre_pomodoro_effectues: 0,
                pomodoro: {
                    ...formData.pomodoro,
                    duree_seance: Number(formData.pomodoro.duree_seance),
                    duree_pause_courte: Number(formData.pomodoro.duree_pause_courte),
                    duree_pause_longue: Number(formData.pomodoro.duree_pause_longue),
                    nbre_pomodoro_avant_pause_longue: Number(formData.pomodoro.nbre_pomodoro_avant_pause_longue),
                    duree_seance_totale: Number(formData.pomodoro.duree_seance_totale),
                }
            };

            // Send POST request to the backend
            const response = await fetch('http://localhost:5010/seances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Session created successfully:", result);
                showSnackbar('Session created successfully!', 'success');
                handleDialogClose();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

        } catch (error) {
            console.error("Failed to create session:", error);
            showSnackbar(`Error: ${error.message || 'Could not connect to the server.'}`, 'error');
        }
    };

    // Glassmorphism styles for the timer bar
    const glassTimerBarBg = 'rgba(200, 160, 255, 0.3)';
    const glassTimerBarBorderColor = 'rgba(255, 255, 255, 0.2)';

    // Helper component for displaying items in the confirmation step
    const ConfirmationItem = ({ label, value }) => (
        <Box>
            <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                {label.replace(/_/g, ' ')}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                {typeof value === 'boolean' ? (value ? 'Activé' : 'Désactivé') : value}
            </Typography>
        </Box>
    );
    
    // Common card style for the confirmation step
    const cardStyle = { 
        bgcolor: 'rgba(255,255,255,0.2)', 
        borderRadius: '12px', 
        border: '1px solid rgba(255,255,255,0.2)',
        p: 2
    };

    // Custom component for editable fields in Step 2
    const EditableCard = ({ label, name, value, onChange, type = "text" }) => (
      <Box
        sx={{
          bgcolor: "rgba(235, 225, 240, 0.7)",
          borderRadius: "12px",
          p: 1.5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.2, textTransform: 'uppercase', fontSize: '0.6rem' }}>
          {label}
        </Typography>
        <InputBase
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          fullWidth
          sx={{
            fontSize: "1.2rem",
            fontWeight: "500",
            color: "#333",
            "& .MuiInputBase-input": { p: 0 },
          }}
        />
      </Box>
    );

    // Custom component for switches in Step 2
    const SwitchCard = ({ label, name, checked, onChange }) => (
      <Box sx={{
        bgcolor: "rgba(235, 225, 240, 0.7)",
        borderRadius: "12px",
        p: '8px 16px',
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
          <Typography variant="body2">{label}</Typography>
          <Switch
            checked={checked}
            onChange={onChange}
            name={name}
            color="secondary"
          />
      </Box>
    );

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
            case 1: // Step 2: Pomodoro Configuration
                return (
                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto', pr: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}><EditableCard label="Durée Séance (s)" name="duree_seance" value={formData.pomodoro.duree_seance} onChange={handlePomodoroChange} type="number"/></Grid>
                            <Grid item xs={12} sm={4}><EditableCard label="Pause Courte (s)" name="duree_pause_courte" value={formData.pomodoro.duree_pause_courte} onChange={handlePomodoroChange} type="number"/></Grid>
                            <Grid item xs={12} sm={4}><EditableCard label="Pause Longue (s)" name="duree_pause_longue" value={formData.pomodoro.duree_pause_longue} onChange={handlePomodoroChange} type="number"/></Grid>
                            
                            <Grid item xs={12} sm={4}><EditableCard label="Cycles avant pause longue" name="nbre_pomodoro_avant_pause_longue" value={formData.pomodoro.nbre_pomodoro_avant_pause_longue} onChange={handlePomodoroChange} type="number"/></Grid>
                            <Grid item xs={12} sm={4}><EditableCard label="Durée Totale (s)" name="duree_seance_totale" value={formData.pomodoro.duree_seance_totale} onChange={handlePomodoroChange} type="number"/></Grid>
                            <Grid item xs={12} sm={4}><EditableCard label="Nom Séance Pomodoro" name="nom_seance" value={formData.pomodoro.nom_seance} onChange={handlePomodoroChange}/></Grid>

                            <Grid item xs={12} sm={4}><EditableCard label="Thème" name="theme" value={formData.pomodoro.theme} onChange={handlePomodoroChange}/></Grid>
                            <Grid item xs={12} sm={8}><EditableCard label="Nom Préconfiguration" name="nom_preconfiguration" value={formData.pomodoro.nom_preconfiguration} onChange={handlePomodoroChange}/></Grid>

                            <Grid item xs={12}><Divider sx={{mt: 1, mb: 1}}/></Grid>
                            
                            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Démarrage auto" name="auto_demarrage" checked={formData.pomodoro.auto_demarrage} onChange={handlePomodoroChange}/></Grid>
                            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Alerte sonore" name="alerte_sonore" checked={formData.pomodoro.alerte_sonore} onChange={handlePomodoroChange}/></Grid>
                            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Notification" name="notification" checked={formData.pomodoro.notification} onChange={handlePomodoroChange}/></Grid>
                            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Vibration" name="vibration" checked={formData.pomodoro.vibration} onChange={handlePomodoroChange}/></Grid>
                            <Grid item xs={12} sm={6} md={4}><SwitchCard label="Suivi du temps total" name="suivi_temps_total" checked={formData.pomodoro.suivi_temps_total} onChange={handlePomodoroChange}/></Grid>
                        </Grid>
                    </Box>
                );
            case 2: // Step 3: Confirmation
                return (
                     <Box sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto', pr: 1.5 }}>
                         <Grid container spacing={2}>
                             <Grid item xs={12}>
                                 <Box sx={cardStyle}>
                                     <Box display="flex" alignItems="center" mb={1.5}><InfoOutlinedIcon sx={{ mr: 1, color: 'rgba(0,0,0,0.7)'}} /><Typography variant="h6" fontWeight="bold">Détails de la Séance</Typography></Box>
                                     <Divider sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.3)' }} />
                                     <ConfirmationItem label="Type de séance" value={formData.type_seance} />
                                     <ConfirmationItem label="Nom de la séance" value={formData.nom} />
                                 </Box>
                             </Grid>
                             
                             <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                                 <Box sx={{...cardStyle, flexGrow: 1}}>
                                     <Box display="flex" alignItems="center" mb={1.5}><HourglassTopIcon sx={{ mr: 1, color: 'rgba(0,0,0,0.7)'}} /><Typography variant="h6" fontWeight="bold">Durées</Typography></Box>
                                     <Divider sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.3)' }} />
                                     <ConfirmationItem label="Séance" value={`${formData.pomodoro.duree_seance}s`} />
                                     <ConfirmationItem label="Pause courte" value={`${formData.pomodoro.duree_pause_courte}s`} />
                                     <ConfirmationItem label="Pause longue" value={`${formData.pomodoro.duree_pause_longue}s`} />
                                 </Box>
                             </Grid>
                              <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                                 <Box sx={{...cardStyle, flexGrow: 1}}>
                                     <Box display="flex" alignItems="center" mb={1.5}><TuneIcon sx={{ mr: 1, color: 'rgba(0,0,0,0.7)'}} /><Typography variant="h6" fontWeight="bold">Configuration</Typography></Box>
                                     <Divider sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.3)' }} />
                                      <ConfirmationItem label="Cycles" value={formData.pomodoro.nbre_pomodoro_avant_pause_longue} />
                                      <ConfirmationItem label="Nom du Thème" value={formData.pomodoro.theme} />
                                     <ConfirmationItem label="Préconfiguration" value={formData.pomodoro.nom_preconfiguration} />
                                 </Box>
                             </Grid>

                             <Grid item xs={12}>
                                 <Box sx={cardStyle}>
                                      <Box display="flex" alignItems="center" mb={1.5}><NotificationsActiveIcon sx={{ mr: 1, color: 'rgba(0,0,0,0.7)'}} /><Typography variant="h6" fontWeight="bold">Alertes et Automatisation</Typography></Box>
                                     <Divider sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.3)' }} />
                                     <Grid container spacing={1}>
                                         <Grid item xs={6} sm={4}><ConfirmationItem label="Démarrage auto" value={formData.pomodoro.auto_demarrage} /></Grid>
                                         <Grid item xs={6} sm={4}><ConfirmationItem label="Alerte sonore" value={formData.pomodoro.alerte_sonore} /></Grid>
                                         <Grid item xs={6} sm={4}><ConfirmationItem label="Notification" value={formData.pomodoro.notification} /></Grid>
                                         <Grid item xs={6} sm={4}><ConfirmationItem label="Vibration" value={formData.pomodoro.vibration} /></Grid>
                                         <Grid item xs={6} sm={4}><ConfirmationItem label="Suivi total" value={formData.pomodoro.suivi_temps_total} /></Grid>
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
            {/* Dialog for creating a new session */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth
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

            {/* Snackbar for alerts */}
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />
        </Box>
    );
}
