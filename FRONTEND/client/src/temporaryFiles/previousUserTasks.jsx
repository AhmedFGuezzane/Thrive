import React, { useState, useContext, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { TimerContext } from '../../contexts/TimerContext';
import TimerBar from '../../components/common/TimerBar';
import { fetchAllTasksForUser, updateTaskStatus } from '../../utils/taskService.jsx'
import SnackbarAlert from '../../components/common/SnackbarAlert';
import AddTaskDialog from '../../components/common/AddTaskDialog';
import TaskDetailsDialog from '../../components/UserTasks/TaskDetailsDialog';
import { useTaskManagement } from '../../hooks/useTaskManagement.js';

import { updateTask } from '../../utils/taskService.jsx';

const getImportanceDisplay = (importance) => {
  switch (importance) {
    case 1:
      return { label: 'Urgent', bgColor: '#ef5350', textColor: '#ffffff' };
    case 2:
      return { label: 'Haute', bgColor: '#ff9800', textColor: '#ffffff' };
    case 3:
      return { label: 'Moyenne', bgColor: '#2196f3', textColor: '#ffffff' };
    case 4:
      return { label: 'Basse', bgColor: '#4caf50', textColor: '#ffffff' };
    case 5:
      return { label: 'Très Basse', bgColor: '#9c27b0', textColor: '#ffffff' };
    default:
      return { label: 'N/A', bgColor: '#9e9e9e', textColor: '#ffffff' };
  }
};



const getStatusDisplay = (status) => {
  if (!status) {
    return { label: 'Inconnu', bgColor: '#9e9e9e', textColor: '#fff' };
  }
  const normalizedStatus = String(status).trim().toLowerCase();
  switch (normalizedStatus) {
    case 'terminée':
    case 'complétée':
    case 'complete':
      return { label: 'Complétée', bgColor: '#9c27b0', textColor: '#ffffff' };
    case 'en cours':
    case 'in progress':
      return { label: 'En cours', bgColor: '#4caf50', textColor: '#ffffff' };
    case 'en attente':
    case 'pending':
      return { label: 'En attente', bgColor: '#ffc107', textColor: '#000000' };
    default:
      return { label: status, bgColor: '#9e9e9e', textColor: '#ffffff' };
  }
};


export default function UserTasks() {
  const { pomodoroConfig, activeSeanceId } = useContext(TimerContext);
  const activeSeanceExists = !!activeSeanceId;

  const glassPageBg = 'rgba(255, 240, 245, 0.2)';
  const glassBorderColor = 'rgba(255, 255, 255, 0.1)';

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

  const handleViewDetailsClick = (event, task) => {
    event.stopPropagation();
    setSelectedTaskDetails(task);
    setIsTaskDetailsDialogOpen(true);
  };

  const handleCloseTaskDetailsDialog = () => {
    setIsTaskDetailsDialogOpen(false);
    setSelectedTaskDetails(null);
  };

  const [allUserTasks, setAllUserTasks] = useState([]);
  const [loading, setLoading] = useState(false);

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


  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const startColumnId = source.droppableId;
    const finishColumnId = destination.droppableId;

    setAllUserTasks(prevAllTasks => {
        const updatedAllTasks = prevAllTasks.map(task => 
            task.id === draggableId ? { ...task, statut: finishColumnId } : task
        );
        return updatedAllTasks;
    });

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

    const categorized = {
      'en attente': furtherFiltered.filter(task => String(task.statut).toLowerCase() === 'en attente'),
      'en cours': furtherFiltered.filter(task => String(task.statut).toLowerCase() === 'en cours'),
      'terminée': furtherFiltered.filter(task => String(task.statut).toLowerCase() === 'terminée' || String(task.statut).toLowerCase() === 'complétée' || String(task.statut).toLowerCase() === 'complete'),
    };
    return categorized;
  }, [allUserTasks, taskViewMode, activeSeanceId, searchTerm, selectedImportance]);


  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '8px',
    background: isDragging ? 'rgba(128, 0, 128, 0.7)' : 'rgba(255, 255, 255, 0.15)',
    color: isDragging ? '#fff' : '#333',
    border: isDragging ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    flexShrink: 0,
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'rgba(200, 160, 255, 0.3)' : 'rgba(255, 240, 245, 0.15)',
    padding: '8px',
    borderRadius: '12px',
    flexGrow: 1,
    minHeight: '100px',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
    msOverflowStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
  });


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
      <Box
        sx={{
          width: '100%',
          mb: 3,
          p: 1.5,
          bgcolor: 'rgba(255, 240, 245, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          alignItems: 'center',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        <TextField
          fullWidth={false}
          variant="outlined"
          size="small"
          placeholder="Rechercher tâche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flexGrow: 1, minWidth: '150px', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px',
            '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }, '&.Mui-focused fieldset': { borderColor: 'rgba(128, 0, 128, 0.7)' }, color: '#333' },
            '& .MuiInputBase-input::placeholder': { color: 'rgba(0,0,0,0.6)' },
          }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(0,0,0,0.5)' }} /></InputAdornment>) }}
        />
        <FormControl
          variant="outlined" size="small"
          sx={{
            minWidth: 120, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px',
            '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }, '&.Mui-focused fieldset': { borderColor: 'rgba(128, 0, 128, 0.7)' }, color: '#333' },
            '& .MuiInputLabel-root': { color: 'rgba(0,0,0,0.6)' }, flexShrink: 0,
          }}
        >
          <InputLabel>Importance</InputLabel>
          <Select value={selectedImportance} onChange={(e) => setSelectedImportance(e.target.value)} label="Importance">
            <MenuItem value="">Toutes</MenuItem>
            {[1, 2, 3, 4, 5].map((importance) => (<MenuItem key={importance} value={importance}>{getImportanceDisplay(importance).label}</MenuItem>))}
          </Select>
        </FormControl>

        {/* New View Mode Select */}
        <FormControl
          variant="outlined" size="small"
          sx={{
            minWidth: 120, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px',
            '& .MuiOutlinedInput-root': { borderRadius: '8px', '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }, '&.Mui-focused fieldset': { borderColor: 'rgba(128, 0, 128, 0.7)' }, color: '#333' },
            flexShrink: 0,
          }}
        >
          <InputLabel>Mode Vue</InputLabel>
          <Select value={taskViewMode} onChange={(e) => setTaskViewMode(e.target.value)} label="Mode Vue">
            <MenuItem value="all_tasks">Toutes les tâches</MenuItem>
            <MenuItem value="current_seance" disabled={!activeSeanceExists}>
              Tâches de la séance active
            </MenuItem>
          </Select>
        </FormControl>

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
        <IconButton onClick={primaryFetchTasks} disabled={loading} sx={{ color: 'rgba(128, 0, 128, 0.9)', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px', p: '8px', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, }}>
          {loading ? (<CircularProgress size={20} sx={{ color: 'rgba(128, 0, 128, 0.7)' }} />) : (<RefreshIcon fontSize="small" />)}
        </IconButton>
      </Box>

      <Box flexGrow={1} width="100%" display="flex" flexDirection="row" gap={2} pb={2} minHeight={0}>
        {loading && !Object.values(displayedTasks).flat().length ? (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: 'rgba(128, 0, 128, 0.7)' }} />
          </Box>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.entries(displayedTasks).map(([columnId, columnTasks]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                    sx={{
                      border: `1px solid ${glassBorderColor}`,
                      boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      flexBasis: '33%',
                      minWidth: '200px',
                      p: 2,
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': { display: 'none' },
                      msOverflowStyle: 'none',
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#333" mb={2} sx={{ textTransform: 'capitalize' }}>
                      {columnId.replace('en attente', 'En attente').replace('en cours', 'En cours').replace('terminée', 'Terminée')}
                    </Typography>
                    {columnTasks.length === 0 && ( 
                      <Typography variant="body2" color="#777" sx={{ textAlign: 'center', p: 2 }}>
                        Aucune tâche ici.
                      </Typography>
                    )}
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                              <Typography variant="body1" fontWeight="bold" color="#333" sx={{ flexGrow: 1, mr: 1 }}>
                                {task.titre}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={(event) => handleViewDetailsClick(event, task)}
                                sx={{ color: 'rgba(0,0,0,0.6)' }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Chip
                                label={getImportanceDisplay(task.importance).label}
                                size="small"
                                sx={{
                                  backgroundColor: getImportanceDisplay(task.importance).bgColor,
                                  color: getImportanceDisplay(task.importance).textColor,
                                  fontWeight: 'bold',
                                  borderRadius: '6px',
                                  opacity: 0.9,
                                  height: '24px',
                                  px: '8px',
                                }}
                              />
                              <Chip
                                label={getStatusDisplay(task.statut).label}
                                size="small"
                                sx={{
                                  backgroundColor: getStatusDisplay(task.statut).bgColor,
                                  color: getStatusDisplay(task.statut).textColor,
                                  fontWeight: 'bold',
                                  borderRadius: '6px',
                                  opacity: 0.9,
                                  height: '24px',
                                  px: '8px',
                                }}
                              />
                            </Box>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        )}
      </Box>

      <TimerBar />

      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
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
      />
    </Box>
  );
}
