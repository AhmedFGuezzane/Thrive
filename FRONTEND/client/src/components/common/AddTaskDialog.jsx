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
  useTheme,
  colors, // <-- ADDED useTheme hook
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // <-- ADDED alpha utility
import SwitchCard from './SwitchCard'; // Assuming SwitchCard is available

import { useCustomTheme } from '../../hooks/useCustomeTheme';



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
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow } = useCustomTheme();



  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          // --- UPDATED to use dynamic theme colors for the dialog background ---
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
              // --- UPDATED: Use dynamic background and text color ---
              bgcolor: innerBox,
              boxShadow: softBoxShadow,
              color: theme.palette.text.primary,
            },
          }}
          InputLabelProps={{
            sx: {
              // --- UPDATED: Use dynamic label color ---
              color: primaryText,
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
              bgcolor: innerBox,
              boxShadow: softBoxShadow,
              color: theme.palette.text.primary,
            },
          }}
          InputLabelProps={{
            sx: {
              // --- UPDATED: Use dynamic label color ---
              color: primaryText,
            },
          }}
        />
        <FormControl
          fullWidth
          margin="dense"
          variant="filled"
          sx={{
            borderRadius: '8px',
            boxShadow: softBoxShadow,
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
              color: primaryText,
              boxShadow: softBoxShadow,
              bgcolor: innerBox, // This colors the input field background
            }}
            inputProps={{ sx: { borderRadius: '8px' } }}
            // --- ADD THIS PROP FOR DROPDOWN STYLING ---
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "white", // Set the background color of the dropdown menu
                  borderRadius: '8px', // Apply border-radius to the dropdown menu if desired
                },
              },
            }}
          >
            {[1, 2, 3, 4, 5].map((importance) => (
              <MenuItem
                key={importance}
                value={importance}
                // You might also want to set text color for menu items if primaryText is too light/dark
                sx={{ color: primaryText }}
              >
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
            boxShadow: softBoxShadow,
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
              color: primaryText,
              bgcolor: innerBox
            }}
            inputProps={{ sx: { borderRadius: '8px' } }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'white', 
                  borderRadius: '8px', 
                },
              },
            }}
          >
            <MenuItem
              value="en attente"
              // Optional: Set text color for menu items to ensure good contrast
              sx={{ color: theme.palette.text.primary }}
            >
              En attente
            </MenuItem>
            <MenuItem
              value="en cours"
              // Optional: Set text color for menu items
              sx={{ color: theme.palette.text.primary }}
            >
              En cours
            </MenuItem>
            <MenuItem
              value="terminée"
              // Optional: Set text color for menu items
              sx={{ color: theme.palette.text.primary }}
            >
              Complétée
            </MenuItem>
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
              color: primaryText,
            },
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              borderRadius: '8px',
              // --- UPDATED: Use dynamic background and text color ---
              boxShadow: softBoxShadow,
              bgcolor: innerBox,
              color: primaryText,
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
        <Button onClick={onClose} sx={{ color: specialText }}>
          Annuler
        </Button>
        <Button
          onClick={onAddTask}
          variant="contained"
          sx={{
            // --- UPDATED: Use dynamic button colors ---
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
  );
}