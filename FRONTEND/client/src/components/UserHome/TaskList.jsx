// src/components/UserHome/TaskList.jsx
import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  useTheme,
  Collapse,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';

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
    switch (importance) {
      case 1:
        return {
          label: 'Urgent',
          bgColor: '#ef5350', // Red
          textColor: '#ffffff',
          icon: <KeyboardDoubleArrowUpIcon fontSize="small" />,
        };
      case 2:
        return {
          label: 'Haute',
          bgColor: '#ff9800', // Orange
          textColor: '#ffffff',
          icon: <KeyboardArrowUpIcon fontSize="small" />,
        };
      case 3:
        return {
          label: 'Moyenne',
          bgColor: '#2196f3', // Blue
          textColor: '#ffffff',
          icon: <HorizontalRuleIcon fontSize="small" />,
        };
      case 4:
        return {
          label: 'Basse',
          bgColor: '#4caf50', // Green
          textColor: '#ffffff',
          icon: <KeyboardArrowDownIcon fontSize="small" />,
        };
      case 5:
        return {
          label: 'Très Basse',
          bgColor: '#9c27b0', // Purple
          textColor: '#ffffff',
          icon: <KeyboardDoubleArrowDownIcon fontSize="small" />,
        };
      default:
        return {
          label: 'N/A',
          bgColor: '#9e9e9e', // Grey
          textColor: '#ffffff',
          icon: null,
        };
    }
  };

  const getStatusDisplay = (status) => {
    if (!status) {
      return {
        label: 'Inconnu',
        bgColor: '#9e9e9e',
        textColor: '#fff',
        icon: null,
      };
    }
    const normalizedStatus = status.trim().toLowerCase();
    switch (normalizedStatus) {
      case 'terminée':
      case 'complétée':
      case 'complete':
        return {
          label: 'Complétée',
          bgColor: '#9c27b0', // Purple for Completed
          textColor: '#ffffff',
          icon: <DoneIcon fontSize="small" />,
        };
      case 'en cours':
      case 'in progress':
        return {
          label: 'En cours',
          bgColor: '#4caf50', // Green for In Progress
          textColor: '#ffffff',
          icon: <ScheduleIcon fontSize="small" />,
        };
      case 'en attente':
      case 'pending':
        return {
          label: 'En attente',
          bgColor: '#ffc107', // Amber/Yellow for Pending
          textColor: '#000000',
          icon: <HourglassEmptyIcon fontSize="small" />,
        };
      default:
        return {
          label: status,
          bgColor: '#9e9e9e', // Grey fallback
          textColor: '#ffffff',
          icon: null,
        };
    }
  };


  // Filter tasks based on search term and dropdowns
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' ||
                          task.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesImportance = selectedImportance === '' ||
                              task.importance === parseInt(selectedImportance);

    const matchesStatus = selectedStatus === '' ||
                          task.statut.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesImportance && matchesStatus;
  });

  return (
    <Box
      width="100%"
      sx={{
        flexGrow: 1,
        minHeight: 0,
        height: '100%',
        backgroundColor: 'rgba(255, 240, 245, 0.2)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        color: '#333',
        ...sx,
      }}
    >
      {/* Sticky Filter Bar - Adjusted for better visual separation */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10, // Ensure it's above scrolling content
          bgcolor: 'rgba(255, 240, 245, 0.8)', // Increased opacity for better distinction
          backdropFilter: 'blur(10px)', // Slightly less blur to reduce "cluster" effect
          border: '1px solid rgba(255, 255, 255, 0.5)', // Stronger border
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)', // More visible shadow
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
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
              '&.Mui-focused fieldset': { borderColor: 'rgba(128, 0, 128, 0.7)' },
              color: '#333',
            },
            '& .MuiInputBase-input::placeholder': { color: 'rgba(0,0,0,0.6)' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(0,0,0,0.5)' }} />
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
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
              '&.Mui-focused fieldset': { borderColor: 'rgba(128, 0, 128, 0.7)' },
              color: '#333',
            },
            '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.6)' },
            flexShrink: 0,
          }}
        >
          <InputLabel>Importance</InputLabel>
          <Select
            value={selectedImportance}
            onChange={(e) => setSelectedImportance(e.target.value)}
            label="Importance"
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
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
              '&.Mui-focused fieldset': { borderColor: 'rgba(128, 0, 128, 0.7)' },
              color: '#333',
            },
            '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.6)' },
            flexShrink: 0,
          }}
        >
          <InputLabel>Statut</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Statut"
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
            color: 'rgba(128, 0, 128, 0.9)',
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            p: '8px',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
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
            color: 'rgba(128, 0, 128, 0.9)',
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            p: '8px',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: 'rgba(128, 0, 128, 0.7)' }} />
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
            <CircularProgress sx={{ color: 'rgba(128, 0, 128, 0.7)' }} />
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
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  mb: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                  color: '#333',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  flexShrink: 0,
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#333"
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
                  <IconButton size="small" sx={{ color: '#333', ml: 1 }}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    {task.description && (
                      <Typography variant="body2" color="#444" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                        <Typography component="span" fontWeight="bold" sx={{ color: '#333' }}>
                          Description :{' '}
                        </Typography>
                        {task.description}
                      </Typography>
                    )}
                    <Typography variant="body2" color="#444">
                      <Typography component="span" fontWeight="bold" sx={{ color: '#333' }}>
                        Autres détails :{' '}
                      </Typography>
                      {task.date_creation &&
                        `Créée le: ${new Date(task.date_creation).toLocaleDateString()} `}
                      {task.date_modification &&
                        `Dernière modification: ${new Date(task.date_modification).toLocaleDateString()}`}
                      {!task.date_creation && !task.date_modification &&
                        'Aucune information supplémentaire.'}
                    </Typography>
                  </Box>
                </Collapse>

                {task.date_fin && (
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666', mt: 1 }}>
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
