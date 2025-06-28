import React, { useState, useContext, useCallback } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';

import { useTaskManagement } from '../../hooks/useTaskManagement';
import SnackbarAlert from '../../components/common/SnackbarAlert';
import AddTaskDialog from '../common/AddTaskDialog';
import TaskFilterBar from './TaskFilterBar';
import TaskItem from './TaskItem';
import { TimerContext } from '../../contexts/TimerContext';
import { getImportanceDisplay as getImportanceDisplayUtil, getStatusDisplay as getStatusDisplayUtil } from '../../utils/taskUtils';

import { useCustomTheme } from '../../hooks/useCustomeTheme'; 

export default function TaskList({ seanceId, sx }) {
  const theme = useTheme();
  // --- RESTORED ORIGINAL THEME ACCESS AND DESTRUCTURING ---
  const { innerBox, outerBox, middleBox, primaryColor, specialColor, secondaryColor, whiteColor, blackColor, specialText, secondaryText, primaryText, whiteBorder, blackBorder, specialBorder, softBoxShadow} = useCustomTheme();
  // --------------------------------------------------------

  const { activeSeanceId } = useContext(TimerContext);

  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [snackbarLoading, setSnackbarLoading] = useState(false);

  const showSnackbar = useCallback((message, severity, loading = false) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarLoading(loading);
    setSnackbarOpen(true);
  }, [setSnackbarMessage, setSnackbarSeverity, setSnackbarLoading, setSnackbarOpen]);

  const handleSnackbarClose = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
    setSnackbarLoading(false);
  }, [setSnackbarOpen, setSnackbarLoading]);

  const handleExpandClick = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const {
    filteredTasks: tasks,
    loading,
    primaryFetchTasks: refreshTasks,
    searchTerm,
    setSearchTerm,
    selectedImportance,
    setSelectedImportance,
    selectedStatus,
    setSelectedStatus,
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    newTaskData,
    handleNewTaskChange,
    handleAddTask,
    addToActiveSeance,
    onToggleAddToActiveSeance,
  } = useTaskManagement(seanceId || activeSeanceId, showSnackbar, 'by_seance');

  const getImportanceDisplay = (importance) => getImportanceDisplayUtil(importance, theme);
  const getStatusDisplay = (status) => getStatusDisplayUtil(status, theme);
  
  return (
    <Box
      width="100%"
      sx={{
        flexGrow: 1,
        minHeight: 0,
        height: '100%',
        // --- USING RESTORED THEME VARIABLES ---
        backdropFilter: 'blur(8px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        borderRadius: '12px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        color: primaryText, // Assuming primaryText is the correct text color
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
        {loading && tasks.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress sx={{ color: specialColor }} />
          </Box>
        ) : tasks.length === 0 ? (
          <Typography variant="body2" color={secondaryText} sx={{ textAlign: 'center', mt: 2 }}>
            Aucune tâche trouvée pour les critères sélectionnés.
          </Typography>
        ) : (
          tasks.map((task) => (
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

      {/* 3. Add New Task Dialog Component */}
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

      {/* 4. Snackbar Alert */}
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