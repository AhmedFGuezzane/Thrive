
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
import { alpha } from '@mui/material/styles';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

export default function StopTimerConfirmDialog({ open, onClose, onConfirm }) {
  const theme = useTheme();
  const { middleBox, whiteBorder, softBoxShadow, primaryText } = useCustomTheme();
  const { t } = useTranslation();

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
          color: primaryText,
        },
      }}
    >
      <DialogTitle sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
        {t("stopTimerDialog.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: theme.palette.text.secondary }}>
          {t("stopTimerDialog.content")}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          {t("stopTimerDialog.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: alpha(theme.palette.error.main, 0.8),
            '&:hover': { bgcolor: alpha(theme.palette.error.main, 1) },
            borderRadius: '8px',
            color: theme.palette.error.contrastText,
          }}
        >
          {t("stopTimerDialog.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
