// src/components/UserHome/TaskList.jsx
import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  useTheme, // THEME
  Collapse,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { alpha } from '@mui/material/styles'; // alpha

import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ScheduleIcon from '@mui/icons-material/Schedule';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

// Import the new AddTaskDialog component
import AddTaskDialog from '../common/AddTaskDialog';
// Import the new taskService functions
import { fetchTasksBySeanceId } from '../../utils/taskService.jsx';
// Import the new custom hook
import { useTaskManagement } from '../../hooks/useTaskManagement';
// Import SnackbarAlert
import SnackbarAlert from '../../components/common/SnackbarAlert';
// Import TimerContext to get activeSeanceId
import { TimerContext } from '../../contexts/TimerContext';

export default function TaskList({ seanceId, sx }) {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Snackbar state for local messages (e.g., from filters, not task management)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleExpandClick = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  // The refreshTasks function is used as the onTaskAdded callback for the hook
  const refreshTasks = async () => {
    setLoading(true);
    // Modified to call fetchTasksBySeanceId if seanceId is available, otherwise fetchAllTasksForUser (if this TaskList is used universally)
    // For this context, it seems TaskList is always tied to a seanceId
    const fetchedTasks = await fetchTasksBySeanceId(seanceId);
    setTasks(fetchedTasks);
    setLoading(false);
  };

  // Use the custom hook for task management
  const {
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    newTaskData,
    handleNewTaskChange,
    handleAddTask,
    addToActiveSeance, // Get from hook
    onToggleAddToActiveSeance, // Get from hook
  } = useTaskManagement(seanceId, refreshTasks, showSnackbar); // Pass seanceId to the hook


  useEffect(() => {
    refreshTasks(); // Call refreshTasks on mount and when seanceId changes
  }, [seanceId]); // Dependency array for useEffect


  const getImportanceDisplay = (importance) => {
    let bgColor, textColor, icon;
    switch (importance) {
      case 1: // Urgent
        bgColor = theme.palette.error.main; // Red
        icon = <KeyboardDoubleArrowUpIcon fontSize="small" />;
        break;
      case 2: // Haute
        bgColor = theme.palette.warning.main; // Orange
        icon = <KeyboardArrowUpIcon fontSize="small" />;
        break;
      case 3: // Moyenne
        bgColor = theme.palette.info.main; // Blue
        icon = <HorizontalRuleIcon fontSize="small" />;
        break;
      case 4: // Basse
        bgColor = theme.palette.success.main; // Green
        icon = <KeyboardArrowDownIcon fontSize="small" />;
        break;
      case 5: // Très Basse
        bgColor = theme.palette.secondary.main; // Purple
        icon = <KeyboardDoubleArrowDownIcon fontSize="small" />;
        break;
      default:
        bgColor = theme.palette.grey[500]; // Grey
        icon = null;
    }
    return {
      label:
        importance === 1
          ? 'Urgent'
          : importance === 2
          ? 'Haute'
          : importance === 3
          ? 'Moyenne'
          : importance === 4
          ? 'Basse'
          : importance === 5
          ? 'Très Basse'
          : 'N/A',
      bgColor,
      textColor: theme.palette.getContrastText(bgColor),
      icon,
    };
  };

  const getStatusDisplay = (status) => {
    if (!status) {
      return {
        label: 'Inconnu',
        bgColor: theme.palette.grey[500],
        textColor: theme.palette.getContrastText(theme.palette.grey[500]),
        icon: null,
      };
    }
    const normalizedStatus = status.trim().toLowerCase();
    let bgColor, icon;
    switch (normalizedStatus) {
      case 'terminée':
      case 'complétée':
      case 'complete':
        bgColor = theme.palette.secondary.main; // Purple
        icon = <DoneIcon fontSize="small" />;
        break;
      case 'en cours':
      case 'in progress':
        bgColor = theme.palette.success.main; // Green
        icon = <ScheduleIcon fontSize="small" />;
        break;
      case 'en attente':
      case 'pending':
        bgColor = theme.palette.warning.main; // Amber/Yellow
        icon = <HourglassEmptyIcon fontSize="small" />;
        break;
      default:
        bgColor = theme.palette.grey[500]; // Grey fallback
        icon = null;
    }
    return {
      label:
        normalizedStatus === 'terminée' ||
        normalizedStatus === 'complétée' ||
        normalizedStatus === 'complete'
          ? 'Complétée'
          : normalizedStatus === 'en cours' || normalizedStatus === 'in progress'
          ? 'En cours'
          : normalizedStatus === 'en attente' || normalizedStatus === 'pending'
          ? 'En attente'
          : status,
      bgColor,
      textColor: theme.palette.getContrastText(bgColor),
      icon,
    };
  };


  // Filter tasks based on search term and dropdowns
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === '' ||
      task.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesImportance =
      selectedImportance === '' || task.importance === parseInt(selectedImportance);

    const matchesStatus =
      selectedStatus === '' || task.statut.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesImportance && matchesStatus;
  });

  return (
    <Box
      width="100%"
      sx={{
        flexGrow: 1,
        minHeight: 0,
        height: '100%',
        // --- UPDATED: Main glassmorphism background for a more solid feel ---
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`, // Subtle border
        boxShadow: theme.shadows[2], // Soft shadow
        borderRadius: '12px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        color: theme.palette.text.primary,
        ...sx,
      }}
    >
      {/* Sticky Filter Bar - Adjusted for better visual separation */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10, // Ensure it's above scrolling content
          // --- UPDATED: Filter bar background color for better visibility ---
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)', // Made it more opaque
          backdropFilter: 'blur(10px)', // Slightly less blur to reduce "cluster" effect
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)'}`, // Stronger border
          boxShadow: theme.shadows[3], // More visible shadow
          borderRadius: '8px', // Slightly smaller border radius than main container
          p: 1.5, // Padding for the filter bar
          mb: 2, // Margin below the sticky bar
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens, row on larger
          gap: 1.5,
          alignItems: 'center',
          flexWrap: 'wrap', // Allow items to wrap on smaller screens
        }}
      >
        {/* Search TextField */}
        <TextField
          fullWidth={false}
          variant="outlined"
          size="small"
          placeholder="Rechercher tâche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flexGrow: 1,
            minWidth: '150px',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
              '&:hover fieldset': { borderColor: theme.palette.primary.main },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
              color: theme.palette.text.primary,
            },
            '& .MuiInputBase-input::placeholder': { color: theme.palette.text.secondary },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Importance Select */}
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 120,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
              '&:hover fieldset': { borderColor: theme.palette.primary.main },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
              color: theme.palette.text.primary,
            },
            '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
            flexShrink: 0,
          }}
        >
          <InputLabel>Importance</InputLabel>
          <Select
            value={selectedImportance}
            onChange={(e) => setSelectedImportance(e.target.value)}
            label="Importance"
            // --- NEW: Style the dropdown menu popover for better visibility ---
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                },
              },
            }}
          >
            <MenuItem value="">Toutes</MenuItem>
            {[1, 2, 3, 4, 5].map((importance) => (
              <MenuItem key={importance} value={importance}>
                {getImportanceDisplay(importance).label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Select */}
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 120,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)' },
              '&:hover fieldset': { borderColor: theme.palette.primary.main },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
              color: theme.palette.text.primary,
            },
            '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
            flexShrink: 0,
          }}
        >
          <InputLabel>Statut</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Statut"
            // --- NEW: Style the dropdown menu popover for better visibility ---
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                },
              },
            }}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="en cours">En cours</MenuItem>
            <MenuItem value="en attente">En attente</MenuItem>
            <MenuItem value="terminée">Complétée</MenuItem>
          </Select>
        </FormControl>

        {/* Add Task Button */}
        <IconButton
          onClick={() => setIsAddTaskDialogOpen(true)}
          sx={{
            color: theme.palette.primary.main,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
            p: '8px',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>

        {/* Refresh Button */}
        <IconButton
          onClick={refreshTasks}
          disabled={loading}
          sx={{
            color: theme.palette.primary.main,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
            p: '8px',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: theme.palette.primary.main }} />
          ) : (
            <RefreshIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      {/* Scrollable Box for the actual task list */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          pr: 1,
        }}
      >
        {loading && !tasks.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : filteredTasks.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
            Aucune tâche trouvée pour les critères sélectionnés.
          </Typography>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = task.id === expandedTaskId;
            return (
              <Box
                key={task.id}
                onClick={() => handleExpandClick(task.id)}
                sx={{
                  p: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)', // Increased opacity
                  borderRadius: '12px',
                  mb: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`, // Increased border opacity
                  boxShadow: theme.shadows[1],
                  color: theme.palette.text.primary,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)', // Increased hover opacity
                    boxShadow: theme.shadows[2],
                    transform: 'translateY(-2px)',
                  },
                  flexShrink: 0,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color={theme.palette.text.primary}
                    sx={{ flexGrow: 1, mr: 1 }}
                  >
                    {task.titre}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={getImportanceDisplay(task.importance).label}
                      size="small"
                      icon={getImportanceDisplay(task.importance).icon}
                      sx={{
                        backgroundColor: getImportanceDisplay(task.importance).bgColor,
                        color: getImportanceDisplay(task.importance).textColor,
                        fontWeight: 'bold',
                        borderRadius: '6px',
                        '.MuiChip-icon': { color: 'inherit !important' },
                        opacity: 0.9,
                        height: '24px',
                        px: '8px',
                      }}
                    />
                    {task.statut && (
                      <Chip
                        label={getStatusDisplay(task.statut).label}
                        size="small"
                        icon={getStatusDisplay(task.statut).icon}
                        sx={{
                          backgroundColor: getStatusDisplay(task.statut).bgColor,
                          color: getStatusDisplay(task.statut).textColor,
                          fontWeight: 'bold',
                          borderRadius: '6px',
                          '.MuiChip-icon': { color: 'inherit !important' },
                          opacity: 0.9,
                          height: '24px',
                          px: '8px',
                        }}
                      />
                    )}
                  </Box>
                  <IconButton size="small" sx={{ color: theme.palette.text.primary, ml: 1 }}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.4)}` }}>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 1, whiteSpace: 'pre-wrap' }}
                      >
                        <Typography component="span" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                          Description :{' '}
                        </Typography>
                        {task.description}
                      </Typography>
                    )}
                    <Typography variant="body2" color="textSecondary">
                      <Typography component="span" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                        Autres détails :{' '}
                      </Typography>
                      {task.date_creation &&
                        `Créée le: ${new Date(task.date_creation).toLocaleDateString()} `}
                      {task.date_modification &&
                        `Dernière modification: ${new Date(task.date_modification).toLocaleDateString()}`}
                      {!task.date_creation && !task.date_modification && 'Aucune information supplémentaire.'}
                    </Typography>
                  </Box>
                </Collapse>

                {task.date_fin && (
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary, mt: 1 }}>
                    Échéance : {new Date(task.date_fin).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            );
          })
        )}
      </Box>

      {/* Add New Task Dialog Component */}
      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        newTaskData={newTaskData}
        onNewTaskChange={handleNewTaskChange}
        onAddTask={handleAddTask}
        getImportanceDisplay={getImportanceDisplay}
        getStatusDisplay={getStatusDisplay}
      />
    </Box>
  );
}