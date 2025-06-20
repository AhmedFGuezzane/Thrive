import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarAlert = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
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
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
