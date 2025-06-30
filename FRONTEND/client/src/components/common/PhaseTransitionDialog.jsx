// src/components/common/PhaseTransitionDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../../hooks/useCustomeTheme';

export default function PhaseTransitionDialog({ open, phase, onConfirm }) {
  const theme = useTheme();
    const {
      innerBox, middleBox,outterBox, whiteBorder, softBoxShadow,
      primaryText, secondaryColor, specialText
    } = useCustomTheme();
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
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor:
            theme.palette.mode === outterBox,
          backdropFilter: 'blur(3px)',
          border: `1px solid ${whiteBorder
          }`,
          borderRadius: '16px',
          boxShadow: softBoxShadow,
          px: 3,
          py: 2
        }
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          color: primaryText,
          textAlign: 'center'
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography
          variant="body1"
          sx={{
            color: primaryText,
            textAlign: 'center',
            mb: 2
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: alpha(specialText, 1),
            '&:hover': {
              bgcolor: alpha(specialText, 0.8)
            },
            borderRadius: '10px',
            color: secondaryColor,
            fontWeight: 'bold',
            px: 4
          }}
        >
          {button}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
