// src/hooks/useSnackbar.js
import { useState, useCallback } from 'react'; // Import useCallback

export const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  // Memoize showSnackbar so its reference doesn't change unless its dependencies change.
  // With an empty dependency array [], this function is created only once.
  const showSnackbar = useCallback((message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []); // Empty dependency array ensures stability

  // Memoize handleSnackbarClose as well for consistency, though it's less critical here.
  const handleSnackbarClose = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []); // Empty dependency array ensures stability

  return { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose };
};