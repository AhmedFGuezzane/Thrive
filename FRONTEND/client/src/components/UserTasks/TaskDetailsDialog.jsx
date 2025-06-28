import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  useTheme,
  alpha,
  IconButton
} from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const theme = useTheme();
  const {
    innerBox, outerBox, middleBox, primaryColor, specialColor,
    secondaryColor, whiteColor, blackColor, specialText, secondaryText,
    primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow
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

  const handleCheckboxChange = (e) => {
    setIsLinkedToActiveSeance(e.target.checked);
  };

  const handleSave = async () => {
    if (!editedTaskData.titre) {
      showSnackbar("Le titre de la tâche est requis.", "error");
      return;
    }

    if (editedTaskData.date_fin) {
      const today = new Date().setHours(0, 0, 0, 0);
      const selectedDate = new Date(editedTaskData.date_fin).setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showSnackbar("La date de fin ne peut pas être dans le passé.", "error");
        return;
      }
    }

    try {
      showSnackbar("Mise à jour de la tâche...", "info", true);
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
      showSnackbar("Tâche mise à jour !", "success");
      setIsEditMode(false);
      onClose();
    } catch (error) {
      showSnackbar(`Erreur lors de l'enregistrement: ${error.message}`, "error");
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await handleDeleteTask(editedTaskData.id);
      setDeleteDialogOpen(false);
      onClose();
    } catch (error) {
      showSnackbar(`Erreur lors de la suppression: ${error.message}`, "error");
    }
  };

  if (!taskDetails) return null;

  const inputSx = {
    borderRadius: '8px',
    bgcolor: innerBox,
    color: primaryText,
    '& .MuiFilledInput-root': {
      borderRadius: '8px',
      bgcolor: innerBox,
      '&:hover': { bgcolor: `${innerBox} !important` },
      '&.Mui-focused': { bgcolor: `${innerBox} !important` },
    },
    disableUnderline: true,
  };

  const inputLabelSx = {
    color: primaryText,
    fontWeight: 'medium',
  };

  const ReadOnlyPill = ({ label, value, icon }) => (
    <Box
      sx={{
        bgcolor: innerBox,
        backdropFilter: 'blur(5px)',
        border: whiteBorder,
        borderRadius: '8px',
        p: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        boxShadow: softBoxShadow,
        color: primaryText,
        width: '100%',
        minHeight: '56px',
        boxSizing: 'border-box',
        justifyContent: 'flex-start',
      }}
    >
      {icon && React.cloneElement(icon, { sx: { fontSize: 24, color: primaryText, flexShrink: 0 } })}
      <Typography variant="body2" fontWeight="bold" sx={{ color: primaryText, flexShrink: 0, mr: 0.5 }}>
        {label}:
      </Typography>
      <Typography variant="body1" sx={{ color: primaryText, flexGrow: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: middleBox,
            backdropFilter: 'blur(30px)',
            border: `1px solid ${whiteBorder}`,
            borderRadius: '16px',
            boxShadow: softBoxShadow,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pb: 1, color: primaryText }}>
          Modifier la tâche
          <Typography variant="subtitle1" sx={{ color: primaryText }}>"{taskDetails.titre}"</Typography>
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <IconButton onClick={() => setIsEditMode(prev => !prev)} sx={{ color: primaryText }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setDeleteDialogOpen(true)} sx={{ color: primaryText }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            pt: 2,
            pb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 3 },
            alignItems: 'flex-start',
            overflowY: 'auto',
            color: primaryText,
          }}
        >
          <Box sx={{ flexBasis: { xs: '100%', md: '66%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="titre"
              label="Titre de la tâche"
              fullWidth
              variant="filled"
              value={editedTaskData.titre || ''}
              onChange={handleFieldChange}
              disabled={!isEditMode}
              InputProps={{ disableUnderline: true, sx: inputSx }}
              InputLabelProps={{ sx: inputLabelSx }}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="filled"
              value={editedTaskData.description || ''}
              onChange={handleFieldChange}
              disabled={!isEditMode}
              InputProps={{ disableUnderline: true, sx: inputSx }}
              InputLabelProps={{ sx: inputLabelSx }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled" sx={inputSx} disabled={!isEditMode}>
                  <InputLabel sx={inputLabelSx}>Importance</InputLabel>
                  <Select
                    name="importance"
                    value={editedTaskData.importance || ''}
                    onChange={handleFieldChange}
                    disableUnderline
                    sx={{ color: primaryText }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: middleBox,
                          border: `1px solid ${whiteBorder}`,
                          color: primaryText,
                        }
                      }
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((importance) => (
                      <MenuItem key={importance} value={importance}>
                        {getImportanceDisplay(importance).label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled" sx={inputSx} disabled={!isEditMode}>
                  <InputLabel sx={inputLabelSx}>Statut</InputLabel>
                  <Select
                    name="statut"
                    value={editedTaskData.statut || ''}
                    onChange={handleFieldChange}
                    disableUnderline
                    sx={{ color: primaryText }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: middleBox,
                          border: `1px solid ${whiteBorder}`,
                          color: primaryText,
                        }
                      }
                    }}
                  >
                    <MenuItem value="en attente">En attente</MenuItem>
                    <MenuItem value="en cours">En cours</MenuItem>
                    <MenuItem value="terminée">Complétée</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              name="date_fin"
              label="Date de fin"
              type="date"
              fullWidth
              variant="filled"
              value={editedTaskData.date_fin || ''}
              onChange={handleFieldChange}
              disabled={!isEditMode}
              InputLabelProps={{ shrink: true, sx: inputLabelSx }}
              InputProps={{ disableUnderline: true, sx: inputSx }}
            />
            <TextField
              name="duree_estimee"
              label="Durée estimée (s)"
              type="number"
              fullWidth
              variant="filled"
              value={editedTaskData.duree_estimee || ''}
              onChange={handleFieldChange}
              disabled={!isEditMode}
              InputLabelProps={{ sx: inputLabelSx }}
              InputProps={{ disableUnderline: true, sx: inputSx }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isLinkedToActiveSeance}
                  onChange={handleCheckboxChange}
                  disabled={!activeSeanceId || !isEditMode}
                  sx={{ color: primaryText }}
                />
              }
              label="Ajouter à la séance active"
              sx={{ color: primaryText, mt: 1 }}
            />
          </Box>

          <Box sx={{ flexBasis: { xs: '100%', md: '33%' }, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <ReadOnlyPill label="Priorité" value={editedTaskData.priorite || 'N/A'} icon={<PriorityHighIcon />} />
            <ReadOnlyPill label="Est Terminée" value={editedTaskData.est_terminee ? 'Oui' : 'Non'} icon={<CheckCircleOutlineIcon />} />
            <ReadOnlyPill label="Date de création" value={editedTaskData.date_creation ? new Date(editedTaskData.date_creation).toLocaleDateString() : 'N/A'} icon={<CalendarTodayIcon />} />
            <ReadOnlyPill label="Date de début" value={editedTaskData.date_debut ? new Date(editedTaskData.date_debut).toLocaleDateString() : 'N/A'} icon={<CalendarTodayIcon />} />
            <ReadOnlyPill label="Durée Réelle" value={editedTaskData.duree_reelle ? `${editedTaskData.duree_reelle}s` : 'N/A'} icon={<TimerIcon />} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center', gap: 2 }}>
          <Button onClick={onClose} sx={{ color: primaryText }}>Annuler</Button>
          <Button
            onClick={handleSave}
            disabled={!isEditMode}
            variant="contained"
            sx={{
              bgcolor: alpha(specialColor, 1),
              color: whiteColor,
              '&:hover': { bgcolor: alpha(specialColor, 0.8) },
              borderRadius: '8px'
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirmed}
        content={{
          title: "Supprimer la tâche",
          text: "Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.",
          confirmButtonText: "Supprimer",
          confirmButtonColor: "error"
        }}
      />
    </>
  );
}
