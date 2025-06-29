// src/components/common/PhaseTransitionDialog.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export default function PhaseTransitionDialog({ open, phase, onConfirm }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const getDialogContent = () => {
    if (phase === 'awaiting_break') {
      return {
        title: t('phaseDialog.awaiting_break.title'),
        message: t('phaseDialog.awaiting_break.message'),
        button: t('phaseDialog.awaiting_break.button')
      };
    }
    if (phase === 'awaiting_study') {
      return {
        title: t('phaseDialog.awaiting_study.title'),
        message: t('phaseDialog.awaiting_study.message'),
        button: t('phaseDialog.awaiting_study.button')
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
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(14px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'}`,
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          px: 3,
          py: 2
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.8),
            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 1) },
            borderRadius: '10px',
            color: theme.palette.primary.contrastText,
            fontWeight: 'bold'
          }}
        >
          {button}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
