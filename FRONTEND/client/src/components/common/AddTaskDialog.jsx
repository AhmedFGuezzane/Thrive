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
  Box, // Import Box for layout
} from '@mui/material';
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
  addToActiveSeance,  // New state for the switch
  onToggleAddToActiveSeance, // New handler for the switch
}) {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(255, 240, 245, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
          color: '#333'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Ajouter une nouvelle tâche</DialogTitle>
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
            sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)', color: '#333' }
          }}
          InputLabelProps={{ sx: { color: 'rgba(0,0,0,0.6)' } }}
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
            sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)', color: '#333' }
          }}
          InputLabelProps={{ sx: { color: 'rgba(0,0,0,0.6)' } }}
        />
        <FormControl fullWidth margin="dense" variant="filled" sx={{ borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)', '& .MuiFilledInput-root': { borderRadius: '8px' } }}>
          <InputLabel>Importance</InputLabel>
          <Select
            name="importance"
            value={newTaskData.importance}
            onChange={onNewTaskChange}
            label="Importance"
            disableUnderline
            sx={{ borderRadius: '8px', color: '#333' }}
            inputProps={{ sx: { borderRadius: '8px' } }}
          >
            {[1, 2, 3, 4, 5].map((importance) => (
              <MenuItem key={importance} value={importance}>
                {getImportanceDisplay(importance).label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense" variant="filled" sx={{ borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)', '& .MuiFilledInput-root': { borderRadius: '8px' } }}>
          <InputLabel>Statut</InputLabel>
          <Select
            name="statut"
            value={newTaskData.statut}
            onChange={onNewTaskChange}
            label="Statut"
            disableUnderline
            sx={{ borderRadius: '8px', color: '#333' }}
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
          InputLabelProps={{ shrink: true, sx: { color: 'rgba(0,0,0,0.6)' } }}
          InputProps={{
            disableUnderline: true,
            sx: { borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.2)', color: '#333' }
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
        <Button onClick={onClose} sx={{ color: '#555' }}>Annuler</Button>
        <Button
          onClick={onAddTask}
          variant="contained"
          sx={{
            bgcolor: 'rgba(128, 0, 128, 0.5)',
            '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.7)' },
            borderRadius: '8px'
          }}
        >
          Ajouter Tâche
        </Button>
      </DialogActions>
    </Dialog>
  );
}
