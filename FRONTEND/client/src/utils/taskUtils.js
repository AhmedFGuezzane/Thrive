export const getImportanceDisplay = (importance) => {
  switch (importance) {
    case 1:
      return { label: 'Urgent', bgColor: '#ef5350', textColor: '#ffffff' };
    case 2:
      return { label: 'Haute', bgColor: '#ff9800', textColor: '#ffffff' };
    case 3:
      return { label: 'Moyenne', bgColor: '#2196f3', textColor: '#ffffff' };
    case 4:
      return { label: 'Basse', bgColor: '#4caf50', textColor: '#ffffff' };
    case 5:
      return { label: 'Très Basse', bgColor: '#9c27b0', textColor: '#ffffff' };
    default:
      return { label: 'N/A', bgColor: '#9e9e9e', textColor: '#ffffff' };
  }
};

export const getStatusDisplay = (status) => {
  if (!status) {
    return { label: 'Inconnu', bgColor: '#9e9e9e', textColor: '#fff' };
  }
  const normalizedStatus = String(status).trim().toLowerCase();
  switch (normalizedStatus) {
    case 'terminée':
    case 'complétée':
    case 'complete':
      return { label: 'Complétée', bgColor: '#9c27b0', textColor: '#ffffff' };
    case 'en cours':
    case 'in progress':
      return { label: 'En cours', bgColor: '#4caf50', textColor: '#ffffff' };
    case 'en attente':
    case 'pending':
      return { label: 'En attente', bgColor: '#ffc107', textColor: '#000000' };
    default:
      return { label: status, bgColor: '#9e9e9e', textColor: '#ffffff' };
  }
};