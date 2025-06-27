// src/components/UserHome/AddTaskDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useTheme, // <-- ADDED useTheme hook
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // <-- ADDED alpha utility
import SwitchCard from './SwitchCard'; // Assuming SwitchCard is available

export default function AddTaskDialog({
  open,
  onClose,
  newTaskData,
  onNewTaskChange,
  onAddTask,
  getImportanceDisplay,
  getStatusDisplay,
  activeSeanceExists, // New prop to determine if active session exists
  addToActiveSeance, // New state for the switch
  onToggleAddToActiveSeance, // New handler for the switch
}) {
  // Use the global theme hook to access the palette
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          // --- UPDATED to use dynamic theme colors for the dialog background ---
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'}`,
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
          color: theme.palette.text.primary, // <-- Use dynamic text color
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        Ajouter une nouvelle tâche
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="titre"
          label="Titre de la tâche"
          type="text"
          fullWidth
          variant="filled"
          value={newTaskData.titre}
          onChange={onNewTaskChange}
          InputProps={{
            disableUnderline: true,
            sx: {
              borderRadius: '8px',
              // --- UPDATED: Use dynamic background and text color ---
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              color: theme.palette.text.primary,
            },
          }}
          InputLabelProps={{
            sx: {
              // --- UPDATED: Use dynamic label color ---
              color: theme.palette.text.secondary,
            },
          }}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="filled"
          value={newTaskData.description}
          onChange={onNewTaskChange}
          InputProps={{
            disableUnderline: true,
            sx: {
              borderRadius: '8px',
              // --- UPDATED: Use dynamic background and text color ---
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              color: theme.palette.text.primary,
            },
          }}
          InputLabelProps={{
            sx: {
              // --- UPDATED: Use dynamic label color ---
              color: theme.palette.text.secondary,
            },
          }}
        />
        <FormControl
          fullWidth
          margin="dense"
          variant="filled"
          sx={{
            borderRadius: '8px',
            // --- UPDATED: Use dynamic background color ---
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
            '& .MuiFilledInput-root': { borderRadius: '8px' },
          }}
        >
          <InputLabel>Importance</InputLabel>
          <Select
            name="importance"
            value={newTaskData.importance}
            onChange={onNewTaskChange}
            label="Importance"
            disableUnderline
            sx={{
              borderRadius: '8px',
              // --- UPDATED: Use dynamic text color ---
              color: theme.palette.text.primary,
            }}
            inputProps={{ sx: { borderRadius: '8px' } }}
          >
            {[1, 2, 3, 4, 5].map((importance) => (
              <MenuItem key={importance} value={importance}>
                {getImportanceDisplay(importance).label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          margin="dense"
          variant="filled"
          sx={{
            borderRadius: '8px',
            // --- UPDATED: Use dynamic background color ---
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
            '& .MuiFilledInput-root': { borderRadius: '8px' },
          }}
        >
          <InputLabel>Statut</InputLabel>
          <Select
            name="statut"
            value={newTaskData.statut}
            onChange={onNewTaskChange}
            label="Statut"
            disableUnderline
            sx={{
              borderRadius: '8px',
              // --- UPDATED: Use dynamic text color ---
              color: theme.palette.text.primary,
            }}
            inputProps={{ sx: { borderRadius: '8px' } }}
          >
            <MenuItem value="en attente">En attente</MenuItem>
            <MenuItem value="en cours">En cours</MenuItem>
            <MenuItem value="terminée">Complétée</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="date_fin"
          label="Date de fin (optionnel)"
          type="date"
          fullWidth
          variant="filled"
          value={newTaskData.date_fin}
          onChange={onNewTaskChange}
          InputLabelProps={{
            shrink: true,
            sx: {
              // --- UPDATED: Use dynamic label color ---
              color: theme.palette.text.secondary,
            },
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              borderRadius: '8px',
              // --- UPDATED: Use dynamic background and text color ---
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              color: theme.palette.text.primary,
            },
          }}
        />

        {/* New SwitchCard for associating with active session */}
        <Box mt={2}>
          <SwitchCard
            label="Ajouter à la séance active"
            name="add_to_active_seance"
            checked={addToActiveSeance}
            onChange={onToggleAddToActiveSeance}
            disabled={!activeSeanceExists} // Disable if no active session
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          Annuler
        </Button>
        <Button
          onClick={onAddTask}
          variant="contained"
          sx={{
            // --- UPDATED: Use dynamic button colors ---
            bgcolor: alpha(theme.palette.primary.main, 0.8),
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 1) },
            borderRadius: '8px',
            color: theme.palette.primary.contrastText,
          }}
        >
          Ajouter Tâche
        </Button>
      </DialogActions>
    </Dialog>
  );
}