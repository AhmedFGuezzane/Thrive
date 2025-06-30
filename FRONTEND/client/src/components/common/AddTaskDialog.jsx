import React, { useContext, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import SwitchCard from './SwitchCard';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { SnackbarContext } from '../../contexts/SnackbarContext';

export default function AddTaskDialog({
  open,
  onClose,
  newTaskData,
  onNewTaskChange,
  onAddTask,
  getImportanceDisplay,
  getStatusDisplay,
  activeSeanceExists,
  addToActiveSeance,
  onToggleAddToActiveSeance,
  loading,
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    innerBox, middleBox, whiteBorder, softBoxShadow,
    primaryText, specialText
  } = useCustomTheme();

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (!value || value === '') {
      return t('addTask.validation.required');
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onNewTaskChange(e);
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = () => {
    const newErrors = {
      titre: validateField('titre', newTaskData.titre),
      description: validateField('description', newTaskData.description),
      importance: validateField('importance', newTaskData.importance),
      statut: validateField('statut', newTaskData.statut),
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err);
    if (!hasErrors) {
      onAddTask();
    }
  };

  return (
    <Dialog
      open={open && !loading}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: middleBox,
          backdropFilter: 'blur(9px)',
          border: `1px solid ${whiteBorder}`,
          borderRadius: '16px',
          boxShadow: softBoxShadow,
        },
      }}
    >
      <DialogTitle textAlign="center" sx={{ fontWeight: 'bold', color: primaryText }}>
        {t("addTask.title")}
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          name="titre"
          label={t("addTask.fields.title")}
          type="text"
          fullWidth
          variant="filled"
          value={newTaskData.titre}
          onChange={handleChange}
          error={!!errors.titre}
          helperText={errors.titre}
          InputProps={{
            disableUnderline: true,
            sx: {
              borderRadius: '8px',
              bgcolor: innerBox,
              boxShadow: softBoxShadow,
              color: theme.palette.text.primary,
            },
          }}
          InputLabelProps={{ sx: { color: primaryText } }}
        />

        <TextField
          required
          margin="dense"
          name="description"
          label={t("addTask.fields.description")}
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="filled"
          value={newTaskData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          InputProps={{
            disableUnderline: true,
            sx: {
              borderRadius: '8px',
              bgcolor: innerBox,
              boxShadow: softBoxShadow,
              color: theme.palette.text.primary,
            },
          }}
          InputLabelProps={{ sx: { color: primaryText } }}
        />

        <FormControl
          required
          fullWidth
          margin="dense"
          variant="filled"
          error={!!errors.importance}
          sx={{ borderRadius: '8px', boxShadow: softBoxShadow }}
        >
          <InputLabel>{t("addTask.fields.importance")}</InputLabel>
          <Select
            name="importance"
            value={newTaskData.importance}
            onChange={handleChange}
            disableUnderline
            sx={{
              borderRadius: '8px',
              color: primaryText,
              bgcolor: innerBox,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: "white",
                  borderRadius: '8px',
                },
              },
            }}
          >
            {[1, 2, 3, 4, 5].map((importance) => (
              <MenuItem key={importance} value={importance} sx={{ color: primaryText }}>
                {getImportanceDisplay(importance).label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          required
          fullWidth
          margin="dense"
          variant="filled"
          error={!!errors.statut}
          sx={{ borderRadius: '8px', boxShadow: softBoxShadow }}
        >
          <InputLabel>{t("addTask.fields.status")}</InputLabel>
          <Select
            name="statut"
            value={newTaskData.statut}
            onChange={handleChange}
            disableUnderline
            sx={{
              borderRadius: '8px',
              color: primaryText,
              bgcolor: innerBox,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'white',
                  borderRadius: '8px',
                },
              },
            }}
          >
            <MenuItem value="en attente" sx={{ color: theme.palette.text.primary }}>
              {t("statuses.pending")}
            </MenuItem>
            <MenuItem value="en cours" sx={{ color: theme.palette.text.primary }}>
              {t("statuses.in_progress")}
            </MenuItem>
            <MenuItem value="terminée" sx={{ color: theme.palette.text.primary }}>
              {t("statuses.completed")}
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          name="date_fin"
          label={t("addTask.fields.deadline")}
          type="date"
          fullWidth
          variant="filled"
          value={newTaskData.date_fin}
          onChange={onNewTaskChange}
          InputLabelProps={{ shrink: true, sx: { color: primaryText } }}
          InputProps={{
            disableUnderline: true,
            sx: {
              borderRadius: '8px',
              bgcolor: innerBox,
              boxShadow: softBoxShadow,
              color: primaryText,
            },
          }}
        />

        <Box mt={2}>
          <SwitchCard
            label={t("addTask.fields.addToSeance")}
            name="add_to_active_seance"
            checked={addToActiveSeance}
            onChange={onToggleAddToActiveSeance}
            disabled={!activeSeanceExists}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: specialText }}>
          {t("common.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: alpha(specialText, 1),
            '&:hover': { bgcolor: alpha(specialText, 0.8) },
            borderRadius: '8px',
            color: "white",
          }}
        >
          {t("addTask.add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
