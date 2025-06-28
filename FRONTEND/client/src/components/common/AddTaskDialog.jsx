// src/components/UserHome/AddTaskDialog.jsx
import React, { useContext } from 'react';
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
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SwitchCard from './SwitchCard';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { SnackbarContext } from '../../contexts/SnackbarContext';

export default function AddTaskDialog({
  open,
  onClose,
  newTaskData,
  onNewTaskChange,
  onAddTask,
  getImportanceDisplay,
  getStatusDisplay,
  activeSeanceExists,
  addToActiveSeance,
  onToggleAddToActiveSeance,
  loading,
}) {
  const theme = useTheme();
  const {
    innerBox, middleBox, whiteBorder, softBoxShadow,
    primaryText, specialText
  } = useCustomTheme();

  const { snackbarOpen, snackbarMessage, snackbarSeverity, handleSnackbarClose } = useContext(SnackbarContext);

  return (
    <>
      <Dialog
        open={open && !loading} // ✅ hide entire dialog if loading
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: middleBox,
            backdropFilter: 'blur(9px)',
            border: `1px solid ${whiteBorder}`,
            borderRadius: '16px',
            boxShadow: softBoxShadow,
          },
        }}
      >
        <DialogTitle textAlign="center" sx={{ fontWeight: 'bold', color: primaryText }}>
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
                bgcolor: innerBox,
                boxShadow: softBoxShadow,
                color: theme.palette.text.primary,
              },
            }}
            InputLabelProps={{ sx: { color: primaryText } }}
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
                bgcolor: innerBox,
                boxShadow: softBoxShadow,
                color: theme.palette.text.primary,
              },
            }}
            InputLabelProps={{ sx: { color: primaryText } }}
          />
          <FormControl fullWidth margin="dense" variant="filled" sx={{ borderRadius: '8px', boxShadow: softBoxShadow }}>
            <InputLabel>Importance</InputLabel>
            <Select
              name="importance"
              value={newTaskData.importance}
              onChange={onNewTaskChange}
              disableUnderline
              sx={{
                borderRadius: '8px',
                color: primaryText,
                bgcolor: innerBox,
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "white",
                    borderRadius: '8px',
                  },
                },
              }}
            >
              {[1, 2, 3, 4, 5].map((importance) => (
                <MenuItem key={importance} value={importance} sx={{ color: primaryText }}>
                  {getImportanceDisplay(importance).label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" variant="filled" sx={{ borderRadius: '8px', boxShadow: softBoxShadow }}>
            <InputLabel>Statut</InputLabel>
            <Select
              name="statut"
              value={newTaskData.statut}
              onChange={onNewTaskChange}
              disableUnderline
              sx={{
                borderRadius: '8px',
                color: primaryText,
                bgcolor: innerBox,
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'white',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <MenuItem value="en attente" sx={{ color: theme.palette.text.primary }}>En attente</MenuItem>
              <MenuItem value="en cours" sx={{ color: theme.palette.text.primary }}>En cours</MenuItem>
              <MenuItem value="terminée" sx={{ color: theme.palette.text.primary }}>Complétée</MenuItem>
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
            InputLabelProps={{ shrink: true, sx: { color: primaryText } }}
            InputProps={{
              disableUnderline: true,
              sx: {
                borderRadius: '8px',
                bgcolor: innerBox,
                boxShadow: softBoxShadow,
                color: primaryText,
              },
            }}
          />

          <Box mt={2}>
            <SwitchCard
              label="Ajouter à la séance active"
              name="add_to_active_seance"
              checked={addToActiveSeance}
              onChange={onToggleAddToActiveSeance}
              disabled={!activeSeanceExists}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} sx={{ color: specialText }}>
            Annuler
          </Button>
          <Button
            onClick={onAddTask}
            variant="contained"
            sx={{
              bgcolor: alpha(specialText, 1),
              '&:hover': { bgcolor: alpha(specialText, 0.8) },
              borderRadius: '8px',
              color: "white",
            }}
          >
            Ajouter Tâche
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
