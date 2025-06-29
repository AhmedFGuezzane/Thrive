// Import React to use React.createElement
import React from 'react';

// Import the necessary icons from Material UI
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error'; // For the exclamation mark
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ConstructionIcon from '@mui/icons-material/Construction';
import { CircularProgress } from '@mui/material';

export const getImportanceDisplay = (importance) => {
  switch (importance) {
    case 1:
      // Urgent: Return the ErrorIcon for the exclamation mark and the color
      return { label: 'Urgent', color: '#ef5350' };
    case 2:
      // Haute: Return only the color
      return { label: 'Haute', color: '#ff9800' };
    case 3:
      // Moyenne: Return only the color
      return { label: 'Moyenne', color: '#2196f3' };
    case 4:
      // Basse: Return only the color
      return { label: 'Basse', color: '#ffc107' };
    case 5:
      // Très Basse: Return only the color
      return { label: 'Très Basse', color: '#4caf50' };
    default:
      // N/A: Return only the color
      return { label: 'N/A', color: '#9e9e9e' };
  }
};

export const getStatusDisplay = (status) => {
  if (!status) {
    return { label: 'Inconnu', icon: React.createElement(HelpOutlineIcon, { fontSize: 'small' }), color: '#9e9e9e' };
  }
  const normalizedStatus = String(status).trim().toLowerCase();
  switch (normalizedStatus) {
    case 'terminée':
    case 'complétée':
    case 'complete':
      return { label: 'Complétée', icon: React.createElement(CheckCircleOutlineIcon, { fontSize: 'small' }), color: '#4caf50' };
    case 'en cours':
    case 'in progress':
      return { label: 'En cours', icon: React.createElement(ConstructionIcon, { size: 16 }), color: '#ffc107' };
    case 'en attente':
    case 'pending':
      return { label: 'En attente', icon: React.createElement(AccessTimeIcon, { fontSize: 'small' }), color: '#ff9800' };
    default:
      return { label: status, icon: React.createElement(HelpOutlineIcon, { fontSize: 'small' }), color: '#9e9e9e' };
  }
};