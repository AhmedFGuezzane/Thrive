// src/components/common/SnackbarAlert.jsx
import React from 'react';
import { Snackbar, Alert, CircularProgress, Box, useTheme } from '@mui/material'; // <-- ADDED useTheme hook
import { alpha } from '@mui/material/styles'; // <-- ADDED alpha utility
import { useCustomTheme } from '../../hooks/useCustomeTheme';


const SnackbarAlert = ({ open, message, severity, onClose, loading = false }) => {
  const theme = useTheme();
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow } = useCustomTheme();

  return (
    <Snackbar
      open={open}
      // If loading, set autoHideDuration to null so it stays open.
      // Otherwise, keep the default 4000ms.
      autoHideDuration={loading ? null : 4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        zIndex: 9999,
      }}
    >
      <Alert
        onClose={loading ? undefined : onClose} // Disable close button if loading
        severity={severity}
        icon={loading ? <CircularProgress size={24} color="inherit" /> : undefined} // Show spinner if loading
        sx={{
          width: '100%',
          // --- UPDATED to use dynamic theme colors for glassmorphism ---
          border: `1px solid ${whiteBorder}`,
          borderRadius: '8px',
          boxShadow: softBoxShadow,
          // --- UPDATED: Use dynamic text color for the entire alert ---
          color: primaryText,
          '& .MuiAlert-icon': {
            color: `${primaryText} !important`, // Use theme color for the icon
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