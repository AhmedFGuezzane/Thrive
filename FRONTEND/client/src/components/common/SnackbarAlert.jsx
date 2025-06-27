// src/components/common/SnackbarAlert.jsx
import React from 'react';
import { Snackbar, Alert, CircularProgress, Box, useTheme } from '@mui/material'; // <-- ADDED useTheme hook
import { alpha } from '@mui/material/styles'; // <-- ADDED alpha utility

const SnackbarAlert = ({ open, message, severity, onClose, loading = false }) => {
  const theme = useTheme();

  return (
    <Snackbar
      open={open}
      // If loading, set autoHideDuration to null so it stays open.
      // Otherwise, keep the default 4000ms.
      autoHideDuration={loading ? null : 4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={loading ? undefined : onClose} // Disable close button if loading
        severity={severity}
        icon={loading ? <CircularProgress size={24} color="inherit" /> : undefined} // Show spinner if loading
        sx={{
          width: '100%',
          // --- UPDATED to use dynamic theme colors for glassmorphism ---
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'}`,
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          // --- UPDATED: Use dynamic text color for the entire alert ---
          color: theme.palette.text.primary,
          '& .MuiAlert-icon': {
            color: `${theme.palette.text.primary} !important`, // Use theme color for the icon
          },
          '& .MuiAlert-message': {
            color: 'inherit', // Inherit color from parent Alert
            display: 'flex', // To align message and potential spinner
            alignItems: 'center',
            gap: '8px', // Space between spinner and text
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;