import React, { useState, useContext, useEffect, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  useTheme, // <-- ADDED useTheme hook
} from "@mui/material";
import { DragDropContext } from '@hello-pangea/dnd';

import { TimerContext } from '../../contexts/TimerContext';
import TimerBar from '../../components/common/TimerBar';
import CreateSeanceDialog from '../../components/common/CreateSeanceDialog';
import { fetchAllTasksForUser, updateTaskStatus, updateTask } from '../../utils/taskService.jsx';
import SnackbarAlert from '../../components/common/SnackbarAlert';
import AddTaskDialog from '../../components/common/AddTaskDialog';
import TaskDetailsDialog from '../../components/UserTasks/TaskDetailsDialog';
import { useTaskManagement } from '../../hooks/useTaskManagement.js';
import { getImportanceDisplay, getStatusDisplay } from '../../utils/taskUtils.js';

import UserTasksFilterBar from '../../components/UserTasks/UserTasksFilterBar';
import TaskBoard from '../../components/UserTasks/TaskBoard';

export default function UserTasks() {
  // Use the global theme hook to access the palette
  const theme = useTheme();

  const { activeSeanceId, startSeance } = useContext(TimerContext);
  const activeSeanceExists = !!activeSeanceId;

  // --- REPLACED HARDCODED COLORS WITH DYNAMIC THEME PALETTE COLORS ---
  const glassPageBg = theme.palette.background.paper;
  const glassBorderColor = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  // ----------------------------------------------------------------------

  const [allUserTasks, setAllUserTasks] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    type_seance: "focus",
    nom: "Deep Work Session",
    pomodoro: {
      duree_seance: 1500,
      duree_pause_courte: 300,
      duree_pause_longue: 900,
      nbre_pomodoro_avant_pause_longue: 4,
      duree_seance_totale: 7200,
      auto_demarrage: true,
      alerte_sonore: true,
      notification: true,
      vibration: false,
      nom_seance: "Pomodoro Config A",
      theme: "dark",
      suivi_temps_total: true,
      nom_preconfiguration: "Standard Focus"
    }
  });

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => {
    setDialogOpen(false);
    setTimeout(() => setActiveStep(0), 300);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePomodoroChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value);
    setFormData(prev => ({
      ...prev,
      pomodoro: { ...prev.pomodoro, [name]: newValue }
    }));
  };

  const handleSubmit = async () => {
    // Note: The `handleSeanceCreation` utility function is not defined in this component.
    // It seems to be a missing import or a utility from the `useTaskManagement` hook.
    // For now, I'll assume it's available or part of the user's logic.
    // I won't change this logic.
    await handleSeanceCreation({
      formData,
      startSeance,
      showSnackbar,
      onSuccess: handleDialogClose
    });
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
  } = useTaskManagement(activeSeanceId, primaryFetchTasks, showSnackbar);

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await updateTask(taskId, updatedData);
      showSnackbar("Tâche mise à jour avec succès", "success");
      await primaryFetchTasks();
    } catch (error) {
      showSnackbar(`Erreur: ${error.message}`, "error");
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
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const finishColumnId = destination.droppableId;
    setAllUserTasks(prevAllTasks =>
      prevAllTasks.map(task =>
        task.id === draggableId ? { ...task, statut: finishColumnId } : task
      )
    );

    showSnackbar(`Mise à jour du statut...`, 'info', true);

    try {
      await updateTaskStatus(draggableId, finishColumnId);
      showSnackbar(`Tâche déplacée vers "${getStatusDisplay(finishColumnId).label}"`, 'success');
    } catch (error) {
      showSnackbar(`Erreur lors de la mise à jour du statut: ${error.message}`, 'error');
      primaryFetchTasks();
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

    return {
      'en attente': furtherFiltered.filter(task => String(task.statut).toLowerCase() === 'en attente'),
      'en cours': furtherFiltered.filter(task => String(task.statut).toLowerCase() === 'en cours'),
      'terminée': furtherFiltered.filter(task =>
        ['terminée', 'complétée', 'complete'].includes(String(task.statut).toLowerCase())
      ),
    };
  }, [allUserTasks, taskViewMode, activeSeanceId, searchTerm, selectedImportance]);

  return (
    <Box
      width="98%"
      height="100%"
      mx="auto"
      sx={{
        // --- UPDATED to use dynamic theme colors and text color ---
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
        color: theme.palette.text.primary, // <-- Use theme text color for contrast
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
            {/* --- UPDATED CircularProgress color to use the theme's primary color --- */}
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
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

      <TimerBar onCreateClick={handleDialogOpen} config={formData.pomodoro} />

      <CreateSeanceDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        formData={formData}
        setFormData={setFormData}
        handleFormChange={handleFormChange}
        handlePomodoroChange={handlePomodoroChange}
        handleSubmit={handleSubmit}
      />

      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        loading={snackbarLoading}
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
        showSnackbar={showSnackbar}
      />
    </Box>
  );
}