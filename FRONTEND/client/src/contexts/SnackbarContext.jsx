import React, { createContext, useState, useCallback, useContext } from 'react';
import SnackbarAlert from '../components/common/SnackbarAlert';

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [loading, setLoading] = useState(false);

  const showSnackbar = useCallback((msg, sev = 'info', isLoading = false) => {
    setMessage(msg);
    setSeverity(sev);
    setLoading(isLoading);
    setOpen(true);
  }, []);

  const closeSnackbar = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setLoading(false);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
      {children}
      <SnackbarAlert
        open={open}
        message={message}
        severity={severity}
        loading={loading}
        onClose={closeSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
