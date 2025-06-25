import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

// Import icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LoopIcon from '@mui/icons-material/Loop';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';

// Import TimerContext
import { TimerContext } from '../../contexts/TimerContext';

export default function TaskDetailsDialog({
  open,
  onClose,
  taskDetails,
  onUpdateTask, // This prop handles the actual update and should trigger snackbar from parent
  getImportanceDisplay,
  getStatusDisplay,
  showSnackbar, // <--- NEW PROP: Pass showSnackbar from parent
}) {
  const { activeSeanceId } = useContext(TimerContext);

  const [editedTaskData, setEditedTaskData] = useState({});
  const [isLinkedToActiveSeance, setIsLinkedToActiveSeance] = useState(false);

  useEffect(() => {
    if (taskDetails) {
      setEditedTaskData({
        ...taskDetails,
        date_fin: taskDetails.date_fin ? new Date(taskDetails.date_fin).toISOString().split('T')[0] : '',
        statut: String(taskDetails.statut).toLowerCase() || 'en attente',
        priorite: taskDetails.priorite || '',
        duree_estimee: taskDetails.duree_estimee || '',
        duree_reelle: taskDetails.duree_reelle || '',
      });

      setIsLinkedToActiveSeance(taskDetails.seance_etude_id === activeSeanceId && !!activeSeanceId);
    }
  }, [taskDetails, activeSeanceId]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEditedTaskData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleCheckboxChange = (e) => {
    setIsLinkedToActiveSeance(e.target.checked);
  };

  const handleSave = async () => {
    if (!editedTaskData.titre) {
      showSnackbar("Le titre de la tâche est requis.", "error"); // <--- CHANGED: Use showSnackbar
      return;
    }

    try {
      // Show "Updating task..." message
      showSnackbar("Mise à jour de la tâche...", "info", true); // <--- NEW: Progress message

      const payload = {
        ...editedTaskData,
        date_fin: editedTaskData.date_fin ? new Date(editedTaskData.date_fin).toISOString() : null,
        est_terminee: editedTaskData.statut === 'terminée',
        importance: Number(editedTaskData.importance),
        duree_estimee: editedTaskData.duree_estimee ? Number(editedTaskData.duree_estimee) : null,
        duree_reelle: editedTaskData.duree_reelle ? Number(editedTaskData.duree_reelle) : null,
        seance_etude_id: isLinkedToActiveSeance ? activeSeanceId : null,
      };

      await onUpdateTask(editedTaskData.id, payload); // onUpdateTask will handle its own success/error snackbar
      onClose(); // Close dialog on success
    } catch (error) {
      // onUpdateTask should handle error, but if something fails BEFORE onUpdateTask is called, or onUpdateTask doesn't rethrow
      // this catch block might still be relevant if onUpdateTask itself doesn't use the snackbar.
      // However, ideally, onUpdateTask (in UserTasks.jsx) would manage its own error states, including the snackbar.
      // For now, keep it as a fallback:
      showSnackbar(`Erreur lors de l'enregistrement: ${error.message}`, "error"); // <--- CHANGED: Use showSnackbar
      console.error("Erreur lors de l'enregistrement de la tâche:", error);
    }
  };

  if (!taskDetails) return null;

  const inputSx = {
    borderRadius: '8px',
    bgcolor: 'rgba(255,255,255,0.2)',
    color: '#333',
    '& .MuiFilledInput-root': {
      borderRadius: '8px',
      bgcolor: 'rgba(255,255,255,0.2)',
      '&:hover': { bgcolor: 'rgba(255,255,255,0.3) !important' },
      '&.Mui-focused': { bgcolor: 'rgba(255,255,255,0.2) !important' },
    },
    disableUnderline: true,
  };
  const inputLabelSx = {
    color: 'rgba(0,0,0,0.6)',
    fontWeight: 'medium',
  };

  const ReadOnlyPill = ({ label, value, icon }) => (
    <Box
      sx={{
        bgcolor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '8px',
        p: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        color: '#444',
        width: '100%',
        minHeight: '56px',
        boxSizing: 'border-box',
        justifyContent: 'flex-start',
      }}
    >
      {icon && React.cloneElement(icon, { sx: { fontSize: 24, color: 'rgba(0,0,0,0.6)', flexShrink: 0 } })}
      <Typography variant="body2" fontWeight="bold" sx={{ color: 'rgba(0,0,0,0.6)', flexShrink: 0, mr: 0.5 }}>
        {label}:
      </Typography>
      <Typography variant="body1" sx={{ color: '#333', flexGrow: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(255, 240, 245, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
          color: '#333',
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pb: 1, color: '#333' }}>
        Modifier la tâche
        <Typography variant="subtitle1" color="text.secondary">"{taskDetails.titre}"</Typography>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          pt: 2,
          pb: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 3 },
          alignItems: 'flex-start',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ flexBasis: { xs: '100%', md: 'calc(66.66% - 16px)' }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            margin="normal"
            name="titre"
            label="Titre de la tâche"
            type="text"
            fullWidth
            variant="filled"
            value={editedTaskData.titre || ''}
            onChange={handleFieldChange}
            InputProps={{ disableUnderline: true, sx: inputSx }}
            InputLabelProps={{ sx: inputLabelSx }}
          />
          <TextField
            margin="normal"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="filled"
            value={editedTaskData.description || ''}
            onChange={handleFieldChange}
            InputProps={{ disableUnderline: true, sx: inputSx }}
            InputLabelProps={{ sx: inputLabelSx }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" variant="filled" sx={inputSx}>
                <InputLabel>Importance</InputLabel>
                <Select
                  name="importance"
                  value={editedTaskData.importance || ''}
                  onChange={handleFieldChange}
                  label="Importance"
                  disableUnderline
                  sx={{ color: '#333' }}
                  inputProps={{ sx: { borderRadius: '8px' } }}
                >
                  {[1, 2, 3, 4, 5].map((importance) => (
                    <MenuItem key={importance} value={importance}>
                      {getImportanceDisplay(importance).label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" variant="filled" sx={inputSx}>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="statut"
                  value={editedTaskData.statut || ''}
                  onChange={handleFieldChange}
                  label="Statut"
                  disableUnderline
                  sx={{ color: '#333' }}
                  inputProps={{ sx: { borderRadius: '8px' } }}
                >
                  <MenuItem value="en attente">En attente</MenuItem>
                  <MenuItem value="en cours">En cours</MenuItem>
                  <MenuItem value="terminée">Complétée</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            margin="normal"
            name="date_fin"
            label="Date de fin (optionnel)"
            type="date"
            fullWidth
            variant="filled"
            value={editedTaskData.date_fin || ''}
            onChange={handleFieldChange}
            InputLabelProps={{ shrink: true, sx: inputLabelSx }}
            InputProps={{ disableUnderline: true, sx: inputSx }}
          />
          <TextField
            margin="normal"
            name="duree_estimee"
            label="Durée Estimée (s)"
            type="number"
            fullWidth
            variant="filled"
            value={editedTaskData.duree_estimee || ''}
            onChange={handleFieldChange}
            InputLabelProps={{ sx: inputLabelSx }}
            InputProps={{ disableUnderline: true, sx: inputSx }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isLinkedToActiveSeance}
                onChange={handleCheckboxChange}
                name="link_to_active_seance"
                disabled={!activeSeanceId || (taskDetails.seance_etude_id === activeSeanceId && isLinkedToActiveSeance)} // Disable if already linked to this active seance and checked
                sx={{ color: 'rgba(128, 0, 128, 0.7)' }}
              />
            }
            label="Ajouter à la séance active"
            sx={{
              color: 'rgba(0,0,0,0.7)',
              mt: 1,
              '& .MuiTypography-root': { fontWeight: 'medium' }
            }}
          />
        </Box>

        <Box sx={{ flexBasis: { xs: '100%', md: 'calc(33.33% - 16px)' }, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <ReadOnlyPill label="Priorité" value={editedTaskData.priorite || 'N/A'} icon={<PriorityHighIcon />} />
          <ReadOnlyPill label="Est Terminée" value={editedTaskData.est_terminee ? 'Oui' : 'Non'} icon={<CheckCircleOutlineIcon />} />
          <ReadOnlyPill label="Date de création" value={editedTaskData.date_creation ? new Date(editedTaskData.date_creation).toLocaleDateString() : 'N/A'} icon={<CalendarTodayIcon />} />
          <ReadOnlyPill label="Date de début" value={editedTaskData.date_debut ? new Date(editedTaskData.date_debut).toLocaleDateString() : 'N/A'} icon={<CalendarTodayIcon />} />
          <ReadOnlyPill label="Durée Réelle" value={editedTaskData.duree_reelle ? `${editedTaskData.duree_reelle}s` : 'N/A'} icon={<TimerIcon />} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center', gap: 2 }}>
        <Button onClick={onClose} sx={{ color: '#555' }}>Annuler</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: 'rgba(128, 0, 128, 0.5)',
            '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.7)' },
            borderRadius: '8px'
          }}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}