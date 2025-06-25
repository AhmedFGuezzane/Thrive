import React, { useState, useContext, useEffect, useMemo } from 'react';
import {
  Box,
  CircularProgress,
} from "@mui/material";
import { DragDropContext } from '@hello-pangea/dnd';

import { TimerContext } from '../../contexts/TimerContext';
import TimerBar from '../../components/common/TimerBar';
import { fetchAllTasksForUser, updateTaskStatus, updateTask } from '../../utils/taskService.jsx';
import SnackbarAlert from '../../components/common/SnackbarAlert';
import AddTaskDialog from '../../components/common/AddTaskDialog';
import TaskDetailsDialog from '../../components/UserTasks/TaskDetailsDialog'; // Path confirmed
import { useTaskManagement } from '../../hooks/useTaskManagement.js';
import { getImportanceDisplay, getStatusDisplay } from '../../utils/taskUtils.js';

// New components
import UserTasksFilterBar from '../../components/UserTasks/UserTasksFilterBar';
import TaskBoard from '../../components/UserTasks/TaskBoard';

export default function UserTasks() {
  const { activeSeanceId } = useContext(TimerContext);
  const activeSeanceExists = !!activeSeanceId;

  const glassPageBg = 'rgba(255, 240, 245, 0.2)';
  const glassBorderColor = 'rgba(255, 255, 255, 0.1)';

  const [allUserTasks, setAllUserTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  // NEW: Add a state for Snackbar loading
  const [snackbarLoading, setSnackbarLoading] = useState(false); // <--- NEW STATE

  // Modified showSnackbar to accept a loading parameter
  const showSnackbar = (message, severity, loading = false) => { // <--- MODIFIED
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarLoading(loading); // <--- SET LOADING STATE
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
    setSnackbarLoading(false); // <--- RESET LOADING STATE ON CLOSE
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');
  const [taskViewMode, setTaskViewMode] = useState('all_tasks');

  const primaryFetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await fetchAllTasksForUser();
      setAllUserTasks(fetchedTasks);
    } catch (error) {
      showSnackbar(`Erreur lors de la récupération des tâches: ${error.message}`, 'error');
      setAllUserTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    primaryFetchTasks();
  }, []);

  const {
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    newTaskData,
    handleNewTaskChange,
    handleAddTask,
    addToActiveSeance,
    onToggleAddToActiveSeance,
  } = useTaskManagement(activeSeanceId, primaryFetchTasks, showSnackbar); // `showSnackbar` passed here

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      // TaskDetailsDialog already shows "Mise à jour de la tâche..."
      // So, this function's responsibility is to complete the flow with success/error.
      await updateTask(taskId, updatedData);
      showSnackbar("Tâche mise à jour avec succès", "success"); // This will dismiss the loading snackbar
      await primaryFetchTasks();
    } catch (error) {
      showSnackbar(`Erreur: ${error.message}`, "error"); // This will dismiss the loading snackbar
    }
  };

  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);

  const handleViewDetailsClick = (task) => {
    setSelectedTaskDetails(task);
    setIsTaskDetailsDialogOpen(true);
  };

  const handleCloseTaskDetailsDialog = () => {
    setIsTaskDetailsDialogOpen(false);
    setSelectedTaskDetails(null);
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const finishColumnId = destination.droppableId;

    // Optimistic UI Update: Update the UI immediately
    setAllUserTasks(prevAllTasks => {
      const updatedAllTasks = prevAllTasks.map(task =>
        task.id === draggableId ? { ...task, statut: finishColumnId } : task
      );
      return updatedAllTasks;
    });

    // 1. Show "Updating status..." progress message for drag-and-drop
    showSnackbar(`Mise à jour du statut...`, 'info', true); // <--- NEW: Progress message for drag-drop

    try {
      await updateTaskStatus(draggableId, finishColumnId);
      // 2. On success, show "Task moved successfully!" message
      showSnackbar(`Tâche déplacée vers "${getStatusDisplay(finishColumnId).label}"`, 'success');
    } catch (error) {
      console.error("Error updating task status:", error);
      // 3. On error, show "Error updating status" and revert UI
      showSnackbar(`Erreur lors de la mise à jour du statut: ${error.message}`, 'error');
      primaryFetchTasks(); // Revert to original state on error
    }
  };

  const displayedTasks = useMemo(() => {
    let tasksToFilter = allUserTasks;

    if (taskViewMode === 'current_seance' && activeSeanceId) {
      tasksToFilter = tasksToFilter.filter(task => task.seance_etude_id === activeSeanceId);
    }

    let furtherFiltered = tasksToFilter;
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      furtherFiltered = furtherFiltered.filter(task =>
        task.titre.toLowerCase().includes(lowerCaseSearchTerm) ||
        (task.description && task.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    if (selectedImportance !== '') {
      const importanceValue = parseInt(selectedImportance);
      furtherFiltered = furtherFiltered.filter(task => task.importance === importanceValue);
    }

    const categorized = {
      'en attente': furtherFiltered.filter(task => String(task.statut).toLowerCase() === 'en attente'),
      'en cours': furtherFiltered.filter(task => String(task.statut).toLowerCase() === 'en cours'),
      'terminée': furtherFiltered.filter(task => String(task.statut).toLowerCase() === 'terminée' || String(task.statut).toLowerCase() === 'complétée' || String(task.statut).toLowerCase() === 'complete'),
    };
    return categorized;
  }, [allUserTasks, taskViewMode, activeSeanceId, searchTerm, selectedImportance]);

  return (
    <Box
      width="98%"
      height="100%"
      mx="auto"
      sx={{
        backgroundColor: glassPageBg,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${glassBorderColor}`,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#333',
        position: 'relative',
      }}
    >
      <UserTasksFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedImportance={selectedImportance}
        setSelectedImportance={setSelectedImportance}
        taskViewMode={taskViewMode}
        setTaskViewMode={setTaskViewMode}
        activeSeanceExists={activeSeanceExists}
        onAddTaskClick={() => setIsAddTaskDialogOpen(true)}
        onRefreshClick={primaryFetchTasks}
        loading={loading}
        getImportanceDisplay={getImportanceDisplay}
      />

      <Box flexGrow={1} width="100%" display="flex" flexDirection="row" gap={2} pb={2} minHeight={0}>
        {loading && !Object.values(displayedTasks).flat().length ? (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: 'rgba(128, 0, 128, 0.7)' }} />
          </Box>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <TaskBoard
              displayedTasks={displayedTasks}
              onViewDetailsClick={handleViewDetailsClick}
              getImportanceDisplay={getImportanceDisplay}
              getStatusDisplay={getStatusDisplay}
            />
          </DragDropContext>
        )}
      </Box>

      <TimerBar />

      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        loading={snackbarLoading} // <--- NEW PROP: Pass loading state
        onClose={handleSnackbarClose}
      />

      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        newTaskData={newTaskData}
        onNewTaskChange={handleNewTaskChange}
        onAddTask={handleAddTask}
        getImportanceDisplay={getImportanceDisplay}
        getStatusDisplay={getStatusDisplay}
        activeSeanceExists={activeSeanceExists}
        addToActiveSeance={addToActiveSeance}
        onToggleAddToActiveSeance={onToggleAddToActiveSeance}
      />

      <TaskDetailsDialog
        open={isTaskDetailsDialogOpen}
        onClose={handleCloseTaskDetailsDialog}
        taskDetails={selectedTaskDetails}
        onUpdateTask={handleUpdateTask}
        getImportanceDisplay={getImportanceDisplay}
        getStatusDisplay={getStatusDisplay}
        showSnackbar={showSnackbar} // <--- NEW PROP: Pass showSnackbar to TaskDetailsDialog
      />
    </Box>
  );
}