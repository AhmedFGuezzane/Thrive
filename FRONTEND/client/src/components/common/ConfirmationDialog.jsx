// src/components/common/ConfirmationDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

export default function ConfirmationDialog({ open, onClose, onConfirm, content }) {
  const {
    whiteBorder,
    primaryText,
    specialText
  } = useCustomTheme();

  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backdropFilter: 'blur(10px)',
          border: `1px solid ${whiteBorder}`,
        }
      }}
    >
      <DialogTitle sx={{ color: primaryText, fontWeight: 'bold' }}>
        {t(content.title)}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: primaryText }}>
          {t(content.text)}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} sx={{ color: primaryText }}>
          {t("common.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          color={content.confirmButtonColor || 'primary'}
          variant="contained"
          sx={{
            bgcolor: alpha(specialText, 1),
            color: primaryText,
            '&:hover': {
              bgcolor: alpha(specialText, 0.8),
              opacity: 0.9,
            }
          }}
        >
          {t(content.confirmButtonText)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
