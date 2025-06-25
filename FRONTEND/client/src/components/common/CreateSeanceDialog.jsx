// src/components/UserHome/CreateSeanceDialog.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Stepper, Step, StepLabel, Button, Typography, Box
} from '@mui/material';

import SeanceDetailsStep from './SeanceDetailsStep';
import PomodoroConfigStep from './PomodoroConfigStep';
import SeanceReviewStep from './SeanceReviewStep';

export default function CreateSeanceDialog({
  open,
  onClose,
  activeStep,
  setActiveStep,
  formData,
  setFormData,
  handleFormChange,
  handlePomodoroChange,
  handleSubmit // ✅ this comes from parent (UserHome)
}) {
  const steps = ['Détails de la séance', 'Configuration Pomodoro', 'Confirmation'];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <SeanceDetailsStep formData={formData} handleFormChange={handleFormChange} />;
      case 1:
        return <PomodoroConfigStep formData={formData} handlePomodoroChange={handlePomodoroChange} />;
      case 2:
        return <SeanceReviewStep formData={formData} />;
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(255, 240, 245, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
          color: '#333'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Créer une nouvelle séance</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 1, pb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '.Mui-active': { fontWeight: 'bold' },
                  '.Mui-completed': { fontWeight: 'bold' }
                }}
              >
                <Typography fontWeight="medium">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStep()}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#555' }}>Annuler</Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep !== 0 && (
          <Button onClick={handleBack} sx={{ mr: 1, color: '#555' }}>Précédent</Button>
        )}
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          sx={{
            bgcolor: 'rgba(128, 0, 128, 0.5)',
            '&:hover': { bgcolor: 'rgba(128, 0, 128, 0.7)' },
            borderRadius: '8px'
          }}
        >
          {activeStep === steps.length - 1 ? 'Confirmer et Créer' : 'Suivant'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
