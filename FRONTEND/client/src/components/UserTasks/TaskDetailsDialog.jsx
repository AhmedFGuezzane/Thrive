
import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Checkbox, FormControlLabel, useTheme, alpha, IconButton
} from '@mui/material';

import {
  CalendarToday as CalendarTodayIcon,
  PriorityHigh as PriorityHighIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Timer as TimerIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { TimerContext } from '../../contexts/TimerContext';
import ConfirmationDialog from '../common/ConfirmationDialog';

export default function TaskDetailsDialog({
  open,
  onClose,
  taskDetails,
  onUpdateTask,
  handleDeleteTask,
  getImportanceDisplay,
  getStatusDisplay,
  showSnackbar,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    innerBox, middleBox, primaryText, whiteColor, specialColor, whiteBorder, softBoxShadow
  } = useCustomTheme();

  const { activeSeanceId } = useContext(TimerContext);
  const [editedTaskData, setEditedTaskData] = useState({});
  const [isLinkedToActiveSeance, setIsLinkedToActiveSeance] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (taskDetails) {
      setEditedTaskData({
        ...taskDetails,
        date_fin: taskDetails.date_fin ? new Date(taskDetails.date_fin).toISOString().split('T')[0] : '',
        statut: String(taskDetails.statut).toLowerCase() || 'en attente',
        priorite: taskDetails.priorite || '',
        duree_estimee: taskDetails.duree_estimee || '',
        duree_reelle: taskDetails.duree_reelle || '',
      });
      setIsLinkedToActiveSeance(taskDetails.seance_etude_id === activeSeanceId && !!activeSeanceId);
      setIsEditMode(false);
    }
  }, [taskDetails, activeSeanceId]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setEditedTaskData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSave = async () => {
    if (!editedTaskData.titre) {
      showSnackbar(t("taskDetails.errors.title_required"), "error");
      return;
    }

    if (editedTaskData.date_fin) {
      const today = new Date().setHours(0, 0, 0, 0);
      const selectedDate = new Date(editedTaskData.date_fin).setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showSnackbar(t("taskDetails.errors.date_past"), "error");
        return;
      }
    }

    try {
      showSnackbar(t("taskDetails.snackbar.updating"), "info", true);
      const payload = {
        ...editedTaskData,
        date_fin: editedTaskData.date_fin ? new Date(editedTaskData.date_fin).toISOString() : null,
        est_terminee: editedTaskData.statut === 'terminée',
        importance: Number(editedTaskData.importance),
        duree_estimee: editedTaskData.duree_estimee ? Number(editedTaskData.duree_estimee) : null,
        duree_reelle: editedTaskData.duree_reelle ? Number(editedTaskData.duree_reelle) : null,
        seance_etude_id: isLinkedToActiveSeance ? activeSeanceId : null,
      };
      await onUpdateTask(editedTaskData.id, payload);
      showSnackbar(t("taskDetails.snackbar.updated"), "success");
      setIsEditMode(false);
      onClose();
    } catch (error) {
      showSnackbar(`${t("taskDetails.errors.update_failed")}: ${error.message}`, "error");
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await handleDeleteTask(editedTaskData.id);
      setDeleteDialogOpen(false);
      onClose();
    } catch (error) {
      showSnackbar(`${t("taskDetails.errors.delete_failed")}: ${error.message}`, "error");
    }
  };

  const ReadOnlyPill = ({ label, value, icon }) => (
    <Box sx={{
      bgcolor: innerBox, border: whiteBorder, borderRadius: '8px',
      p: '12px 16px', display: 'flex', gap: 1, boxShadow: softBoxShadow,
      alignItems: 'center', color: primaryText, minHeight: '56px',
    }}>
      {icon && React.cloneElement(icon, { sx: { fontSize: 24, color: primaryText } })}
      <Typography variant="body2" fontWeight="bold">{label}:</Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );

  if (!taskDetails) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
        PaperProps={{
          sx: {
            backgroundColor: middleBox,
            backdropFilter: 'blur(30px)',
            border: `1px solid ${whiteBorder}`,
            borderRadius: '16px',
            boxShadow: softBoxShadow,
          }
        }}>
        <DialogTitle sx={{ textAlign: 'center', color: primaryText }}>
          {t("taskDetails.title")}
          <Typography variant="subtitle1">"{taskDetails.titre}"</Typography>
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <IconButton onClick={() => setIsEditMode(prev => !prev)} sx={{ color: primaryText }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setDeleteDialogOpen(true)} sx={{ color: primaryText }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', color: primaryText }}>
          <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField name="titre" label={t("taskDetails.fields.title")} variant="filled"
              fullWidth value={editedTaskData.titre || ''} onChange={handleFieldChange}
              disabled={!isEditMode} InputProps={{ disableUnderline: true }} />

            <TextField name="description" label={t("taskDetails.fields.description")} variant="filled"
              fullWidth multiline rows={3} value={editedTaskData.description || ''}
              onChange={handleFieldChange} disabled={!isEditMode} InputProps={{ disableUnderline: true }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled" disabled={!isEditMode}>
                  <InputLabel>{t("taskDetails.fields.importance")}</InputLabel>
                  <Select name="importance" value={editedTaskData.importance || ''}
                    onChange={handleFieldChange}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <MenuItem key={i} value={i}>
                        {getImportanceDisplay(i).label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled" disabled={!isEditMode}>
                  <InputLabel>{t("taskDetails.fields.status")}</InputLabel>
                  <Select name="statut" value={editedTaskData.statut || ''} onChange={handleFieldChange}>
                    <MenuItem value="en attente">{t("task.status.pending")}</MenuItem>
                    <MenuItem value="en cours">{t("task.status.in_progress")}</MenuItem>
                    <MenuItem value="terminée">{t("task.status.completed")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField name="date_fin" label={t("taskDetails.fields.due_date")} type="date"
              fullWidth variant="filled" value={editedTaskData.date_fin || ''}
              onChange={handleFieldChange} disabled={!isEditMode}
              InputLabelProps={{ shrink: true }} InputProps={{ disableUnderline: true }} />

            <TextField name="duree_estimee" label={t("taskDetails.fields.estimated_duration")}
              type="number" fullWidth variant="filled" value={editedTaskData.duree_estimee || ''}
              onChange={handleFieldChange} disabled={!isEditMode}
              InputProps={{ disableUnderline: true }} />

            <FormControlLabel
              control={<Checkbox checked={isLinkedToActiveSeance}
                onChange={e => setIsLinkedToActiveSeance(e.target.checked)}
                disabled={!activeSeanceId || !isEditMode} />}
              label={t("taskDetails.fields.link_to_seance")}
            />
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <ReadOnlyPill label={t("taskDetails.fields.priority")} value={editedTaskData.priorite || 'N/A'} icon={<PriorityHighIcon />} />
            <ReadOnlyPill label={t("taskDetails.fields.is_completed")} value={editedTaskData.est_terminee ? t("general.yes") : t("general.no")} icon={<CheckCircleOutlineIcon />} />
            <ReadOnlyPill label={t("taskDetails.fields.creation_date")} value={editedTaskData.date_creation ? new Date(editedTaskData.date_creation).toLocaleDateString() : 'N/A'} icon={<CalendarTodayIcon />} />
            <ReadOnlyPill label={t("taskDetails.fields.start_date")} value={editedTaskData.date_debut ? new Date(editedTaskData.date_debut).toLocaleDateString() : 'N/A'} icon={<CalendarTodayIcon />} />
            <ReadOnlyPill label={t("taskDetails.fields.actual_duration")} value={editedTaskData.duree_reelle ? `${editedTaskData.duree_reelle}s` : 'N/A'} icon={<TimerIcon />} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={onClose}>{t("general.cancel")}</Button>
          <Button onClick={handleSave} disabled={!isEditMode} variant="contained"
            sx={{
              bgcolor: alpha(specialColor, 1),
              color: whiteColor,
              '&:hover': { bgcolor: alpha(specialColor, 0.8) },
            }}>
            {t("general.save")}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirmed}
        content={{
          title: t("taskDetails.delete.title"),
          text: t("taskDetails.delete.text"),
          confirmButtonText: t("taskDetails.delete.confirm"),
          confirmButtonColor: "error",
        }}
      />
    </>
  );
}
