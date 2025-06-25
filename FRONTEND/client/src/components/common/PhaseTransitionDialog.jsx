// src/components/common/PhaseTransitionDialog.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button
} from '@mui/material';

export default function PhaseTransitionDialog({ open, phase, onConfirm }) {
  const getDialogContent = () => {
    if (phase === 'awaiting_break') {
      return {
        title: '🎓 Étude terminée',
        message: 'Tu as complété ta séance. Veux-tu commencer ta pause ?',
        button: 'Commencer la pause'
      };
    }
    if (phase === 'awaiting_study') {
      return {
        title: '🧘 Pause terminée',
        message: 'Reviens en force ! Prêt pour la prochaine séance d’étude ?',
        button: 'Reprendre l’étude'
      };
    }
    return { title: '', message: '', button: '' };
  };

  const { title, message, button } = getDialogContent();

  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(255, 240, 245, 0.7)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          px: 3,
          py: 2
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ color: '#444', mb: 2 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: 'rgba(128, 0, 128, 0.5)',
            '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.7)' },
            borderRadius: '10px',
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          {button}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
