// src/components/UserHome/CreateSeanceDialog.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Stepper, Step, StepLabel, Button, Typography, Box, useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import SeanceDetailsStep from './SeanceDetailsStep';
import PomodoroConfigStep from './PomodoroConfigStep';
import SeanceReviewStep from './SeanceReviewStep';

import { useCustomTheme } from '../../hooks/useCustomeTheme';

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
        const theme = useTheme();
      const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();
      
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
          // --- UPDATED to use dynamic theme colors for the dialog background ---
          
          backdropFilter: 'blur(12px)',
          border: `1px solid ${whiteBorder}`,
          borderRadius: '16px',
          boxShadow: softBoxShadow,
          color: primaryText, // <-- Use dynamic text color
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', textAlign:"center", color: primaryText }}>
        Créer une nouvelle séance
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 1, pb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  // --- UPDATED: Ensure stepper labels are readable ---
                  '.Mui-active': { fontWeight: 'bold', color: specialText },
                  '.Mui-completed': { fontWeight: 'bold', color: theme.palette.text.primary },
                  '.MuiStepLabel-label': { color: theme.palette.text.primary },
                  '.MuiStepLabel-label.Mui-disabled': { color: theme.palette.text.secondary },
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
        <Button onClick={onClose} sx={{ color: specialText }}>
          Annuler
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep !== 0 && (
          <Button onClick={handleBack} sx={{ mr: 1, color: theme.palette.text.secondary }}>
            Précédent
          </Button>
        )}
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          sx={{
            // --- UPDATED: Use dynamic button colors ---
            bgcolor: alpha(specialText, 1),
            '&:hover': { bgcolor: alpha(specialText, 0.8) },
            borderRadius: '8px',
            color: secondaryText,
          }}
        >
          {activeStep === steps.length - 1 ? 'Confirmer et Créer' : 'Suivant'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}