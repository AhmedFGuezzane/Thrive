// src/components/UserHome/TaskList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { fetchTasksBySeanceId } from '../../utils/taskService.jsx';
import { useTaskManagement } from '../../hooks/useTaskManagement';
import SnackbarAlert from '../../components/common/SnackbarAlert';
import AddTaskDialog from '../common/AddTaskDialog';
import TaskFilterBar from './TaskFilterBar'; // <-- NEW IMPORT
import TaskItem from './TaskItem'; // <-- NEW IMPORT
import { TimerContext } from '../../contexts/TimerContext';
import { getImportanceDisplay as getImportanceDisplayUtil, getStatusDisplay as getStatusDisplayUtil } from '../../utils/taskUtils';

export default function TaskList({ seanceId, sx }) {
  const theme = useTheme();
  
          const outerBox = theme.palette.custom.box.outer;
      const innerBox = theme.palette.custom.box.inner;
      const middleBox = theme.palette.custom.box.middleBox;
    
      const primaryColor = theme.palette.custom.color.primary;
      const specialColor = theme.palette.custom.color.special;
      const secondaryColor = theme.palette.custom.color.secondary;
    
     const specialText = theme.palette.custom.text.special;
      const secondaryText = theme.palette.custom.text.secondary;
      const primaryText = theme.palette.custom.text.primary;
    
      const whiteBorder = theme.palette.custom.border.white;
      const blackBorder = theme.palette.custom.border.black;
      const specialBorder = theme.palette.custom.border.special;
    
      const softBoxShadow = theme.palette.custom.boxShadow.soft;


  const { activeSeanceId } = useContext(TimerContext); // <-- Use activeSeanceId from context

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [snackbarLoading, setSnackbarLoading] = useState(false);

  const showSnackbar = (message, severity, loading = false) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarLoading(loading);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
    setSnackbarLoading(false);
  };

  const handleExpandClick = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const refreshTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await fetchTasksBySeanceId(seanceId || activeSeanceId);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      showSnackbar("Erreur lors du chargement des tâches.", "error");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Use the custom hook for task management
  const {
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    newTaskData,
    handleNewTaskChange,
    handleAddTask,
    addToActiveSeance,
    onToggleAddToActiveSeance,
  } = useTaskManagement(seanceId || activeSeanceId, refreshTasks, showSnackbar);

  // Use useEffect to fetch tasks when seanceId changes
  useEffect(() => {
    refreshTasks();
  }, [seanceId, activeSeanceId]);

  // Use the utility functions from a separate file to keep logic out of render
  const getImportanceDisplay = (importance) => getImportanceDisplayUtil(importance, theme);
  const getStatusDisplay = (status) => getStatusDisplayUtil(status, theme);
  
  // Filter tasks based on search term and dropdowns
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchTerm === '' ||
      task.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesImportance =
      selectedImportance === '' || task.importance === parseInt(selectedImportance);

    const matchesStatus =
      selectedStatus === '' || String(task.statut).toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesImportance && matchesStatus;
  });

  return (
    <Box
      width="100%"
      sx={{
        flexGrow: 1,
        minHeight: 0,
        height: '100%',
        backgroundColor: "middleBox",
        backdropFilter: 'blur(8px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        borderRadius: '12px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        color: theme.palette.text.primary,
        ...sx,
      }}
    >
      {/* 1. Filter Bar Component */}
      <TaskFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedImportance={selectedImportance}
        setSelectedImportance={setSelectedImportance}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        refreshTasks={refreshTasks}
        loading={loading}
        setIsAddTaskDialogOpen={setIsAddTaskDialogOpen}
        getImportanceDisplay={getImportanceDisplay}
      />

      {/* 2. Scrollable Task List */}
      <Box
      
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
        }}
      >
        {loading && !tasks.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress sx={{ color: specialColor }} />
          </Box>
        ) : filteredTasks.length === 0 ? (
          <Typography variant="body2" color={secondaryText} sx={{ textAlign: 'center', mt: 2 }}>
            Aucune tâche trouvée pour les critères sélectionnés.
          </Typography>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isExpanded={task.id === expandedTaskId}
              onExpandClick={handleExpandClick}
              getImportanceDisplay={getImportanceDisplay}
              getStatusDisplay={getStatusDisplay}
            />
          ))
        )}
      </Box>

      {/* 3. Add New Task Dialog Component (already componentized) */}
      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        newTaskData={newTaskData}
        onNewTaskChange={handleNewTaskChange}
        onAddTask={handleAddTask}
        getImportanceDisplay={getImportanceDisplay}
        getStatusDisplay={getStatusDisplay}
        addToActiveSeance={addToActiveSeance}
        onToggleAddToActiveSeance={onToggleAddToActiveSeance}
        activeSeanceExists={!!activeSeanceId}
      />

      {/* 4. Snackbar Alert (already componentized) */}
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        loading={snackbarLoading}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}