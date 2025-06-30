import React, { useState, useContext, useMemo, useCallback } from 'react';
import {
  Box,
  CircularProgress,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { useTranslation } from 'react-i18next';
import { TimerContext } from '../../contexts/TimerContext';
import TimerBar from '../../components/common/TimerBar';
import CreateSeanceDialog from '../../components/common/CreateSeanceDialog';
import SnackbarAlert from '../../components/common/SnackbarAlert';
import AddTaskDialog from '../../components/common/AddTaskDialog.jsx'
import TaskDetailsDialog from '../../components/UserTasks/TaskDetailsDialog';
import { useTaskManagement } from '../../hooks/useTaskManagement.js';
import { getImportanceDisplay, getStatusDisplay } from '../../utils/taskUtils.js';

import UserTasksFilterBar from '../../components/UserTasks/UserTasksFilterBar';
import TaskBoard from '../../components/UserTasks/TaskBoard';

import { useCustomTheme } from '../../hooks/useCustomeTheme';
import { createSeance } from '../../utils/seanceService.jsx';

export default function UserTasks() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { outerBox, softBoxShadow, whiteBorder, specialColor, secondaryColor, primaryText } = useCustomTheme();

  const { activeSeanceId, startSeance } = useContext(TimerContext);
  const activeSeanceExists = !!activeSeanceId;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [snackbarLoading, setSnackbarLoading] = useState(false);

  const showSnackbar = useCallback((message, severity, loading = false) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarLoading(loading);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
    setSnackbarLoading(false);
  }, []);

  const {
    groupedTasks: displayedTasks,
    loading,
    primaryFetchTasks,
    searchTerm,
    setSearchTerm,
    selectedImportance,
    setSelectedImportance,
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    newTaskData,
    handleNewTaskChange,
    handleAddTask,
    addToActiveSeance,
    onToggleAddToActiveSeance,
    isTaskDetailsDialogOpen,
    selectedTaskDetails,
    handleViewDetailsClick,
    handleCloseTaskDetailsDialog,
    handleUpdateTask,
    handleUpdateTaskStatus,
    handleDeleteTask,
  } = useTaskManagement(activeSeanceId, showSnackbar, 'all_tasks');

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

   if (destination.droppableId === 'trash') {
  showSnackbar(t('userTasks.snackbar_deleting'), 'info', true);
  await handleDeleteTask(draggableId);
  return;
}

if (destination.droppableId === 'add_to_seance') {
  const activeSeanceId = localStorage.getItem('active_seance_id');
  if (activeSeanceId) {
    showSnackbar(t('userTasks.snackbar_adding_to_seance'), 'info', true);
    await handleUpdateTask(draggableId, { seance_etude_id: activeSeanceId });
  }
  return;
}


    handleUpdateTaskStatus(draggableId, destination.droppableId);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    type_seance: "focus",
    nom: "Deep Work Session",
    pomodoro: {
      duree_seance: 1500, duree_pause_courte: 300, duree_pause_longue: 900,
      nbre_pomodoro_avant_pause_longue: 4, duree_seance_totale: 7200, auto_demarrage: true,
      alerte_sonore: true, notification: true, vibration: false, nom_seance: "Pomodoro Config A",
      theme: "dark", suivi_temps_total: true, nom_preconfiguration: "Standard Focus"
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
    setFormData(prev => ({ ...prev, pomodoro: { ...prev.pomodoro, [name]: newValue } }));
  };

  const handleSubmit = async () => {
    showSnackbar(t('userTasks.snackbar_creating'), 'info', true);
    try {
      const createdSeance = await createSeance(formData);
      let newSeanceId = createdSeance?.id || null;
      if (!newSeanceId) {
        console.warn("Created seance object did not contain an ID directly:", createdSeance);
        showSnackbar(t('userTasks.snackbar_id_missing'), 'warning');
      }
      showSnackbar(t('userTasks.snackbar_created'), 'success');
      startSeance(formData.pomodoro, newSeanceId);
      handleDialogClose();
    } catch (err) {
      showSnackbar(`${t('userTasks.snackbar_error')}: ${err.message}`, 'error');
    }
  };

  const [taskViewMode, setTaskViewMode] = useState('all_tasks');

  const tasksForViewMode = useMemo(() => {
    if (taskViewMode === 'current_seance' && activeSeanceId) {
      const seanceTasks = Object.keys(displayedTasks).reduce((acc, key) => {
        acc[key] = displayedTasks[key].filter(task => task.seance_etude_id === activeSeanceId);
        return acc;
      }, { 'en attente': [], 'en cours': [], 'terminée': [] });
      return seanceTasks;
    }
    return displayedTasks;
  }, [displayedTasks, taskViewMode, activeSeanceId]);

  return (
    <Box
      width="98%"
      height="100%"
      mx="auto"
      sx={{
        backgroundColor: outerBox,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${whiteBorder}`,
        boxShadow: softBoxShadow,
        borderRadius: '16px',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        <DragDropContext onDragEnd={onDragEnd}>
          {loading && Object.values(displayedTasks).flat().length === 0 ? (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress sx={{ color: theme.palette.primary.main }} />
            </Box>
          ) : (
            <TaskBoard
              displayedTasks={tasksForViewMode}
              onViewDetailsClick={handleViewDetailsClick}
              getImportanceDisplay={getImportanceDisplay}
              getStatusDisplay={getStatusDisplay}
              loading={loading}
            />
          )}

          {/* Floating Action Zones */}
<Box sx={{ position: 'fixed', bottom: 24, left: 24, zIndex: 2100 }}>
  <Tooltip title={t('userTasks.deleteTask')} placement="top" arrow>
    <Box>
      <Droppable droppableId="trash">
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              bgcolor: snapshot.isDraggingOver ? 'error.main' : specialColor,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 6,
              transition: '0.2s',
            }}
          >
            <DeleteIcon sx={{ fontSize: 28, color: 'white', pointerEvents: 'none' }} />
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  </Tooltip>
</Box>

{activeSeanceExists && (
  <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2100 }}>
    <Tooltip title={t('userTasks.addToSeance')} placement="top" arrow>
      <Box>
        <Droppable droppableId="add_to_seance">
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                bgcolor: snapshot.isDraggingOver ? 'success.main' : secondaryColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 6,
                transition: '0.2s',
              }}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 28, color: 'white', pointerEvents: 'none' }} />
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Box>
    </Tooltip>
  </Box>
)}


        </DragDropContext>
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
        handleDeleteTask={handleDeleteTask}
        getImportanceDisplay={getImportanceDisplay}
        getStatusDisplay={getStatusDisplay}
        showSnackbar={showSnackbar}
      />
    </Box>
  );
}
