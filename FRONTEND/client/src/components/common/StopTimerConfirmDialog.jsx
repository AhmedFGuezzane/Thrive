import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // If you use alpha for button colors
import { useCustomTheme } from '../../hooks/useCustomeTheme'; // Assuming you need this for custom colors

export default function StopTimerConfirmDialog({ open, onClose, onConfirm }) {
  const theme = useTheme();
  const { middleBox, whiteBorder, softBoxShadow, primaryText } = useCustomTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: middleBox,
          backdropFilter: 'blur(9px)',
          border: `1px solid ${whiteBorder}`,
          borderRadius: '16px',
          boxShadow: softBoxShadow,
          color: primaryText, // Ensure text inside dialog uses primaryText
        },
      }}
    >
      <DialogTitle sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
        Arrêter la séance ?
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: theme.palette.text.secondary }}>
          Êtes-vous sûr de vouloir arrêter la séance en cours ? Si vous arrêtez, le timer sera réinitialisé et vous devrez en créer un nouveau pour relancer une séance.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          Annuler
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            // Use your theme's error color for a destructive action
            bgcolor: alpha(theme.palette.error.main, 0.8),
            '&:hover': { bgcolor: alpha(theme.palette.error.main, 1) },
            borderRadius: '8px',
            color: theme.palette.error.contrastText,
          }}
        >
          Arrêter
        </Button>
      </DialogActions>
    </Dialog>
  );
}