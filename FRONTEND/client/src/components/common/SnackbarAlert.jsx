import React from 'react';
import { Snackbar, Alert, CircularProgress, Box } from '@mui/material';

const SnackbarAlert = ({ open, message, severity, onClose, loading = false }) => {
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
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          color: '#fff',
          '& .MuiAlert-icon': {
            color: 'rgba(255, 255, 255, 0.8) !important',
          },
          '& .MuiAlert-message': {
            color: '#fff',
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