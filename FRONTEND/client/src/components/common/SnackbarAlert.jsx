// src/components/common/SnackbarAlert.jsx
import React from 'react';
import {
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { useTranslation } from 'react-i18next';

const SnackbarAlert = ({ open, message, severity, onClose, loading = false }) => {
  const theme = useTheme();
  const {
    whiteBorder,
    softBoxShadow,
    primaryText
  } = useCustomTheme();
  const { t } = useTranslation();

  return (
    <Snackbar
      open={open}
      autoHideDuration={loading ? null : 4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        onClose={loading ? undefined : onClose}
        severity={severity}
        icon={loading ? <CircularProgress size={24} color="inherit" /> : undefined}
        sx={{
          width: '100%',
          border: `1px solid ${whiteBorder}`,
          borderRadius: '8px',
          boxShadow: softBoxShadow,
          color: primaryText,
          '& .MuiAlert-icon': {
            color: `${primaryText} !important`,
          },
          '& .MuiAlert-message': {
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          },
        }}
      >
        {t(message)}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
