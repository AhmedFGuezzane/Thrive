import { useState, useEffect, useMemo, useCallback } from 'react';
import { addTaskToBackend, fetchTasksBySeanceId, fetchAllTasksForUser, updateTaskStatus, updateTask as updateTaskBackend } from '../utils/taskService';

/**
 * Custom hook for managing all task-related logic, including fetching, filtering, adding, and updating tasks.
 * @param {string | null} seanceId The ID of the current active study session, or null for fetching all user tasks.
 * @param {function} showSnackbar A function to display snackbar alerts (message, severity, loading?: boolean).
 * @param {string} fetchMode 'all_tasks' to fetch all user tasks, or 'by_seance' to fetch tasks for a specific seance.
 * @returns {object} An object containing states and handlers for task management.
 */
export const useTaskManagement = (seanceId, showSnackbar, fetchMode = 'all_tasks') => {
  // --- Task Fetching & Filtering State ---
  const [allUserTasks, setAllUserTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // --- Add Task Dialog State ---
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    titre: '',
    description: '',
    importance: 3, // Default to Medium importance
    statut: 'en attente', // Default to 'en attente'
    date_fin: '',
  });
  const [addToActiveSeance, setAddToActiveSeance] = useState(false);

  // --- Task Update/Details Dialog State ---
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);

  // --- Fetching Logic ---
  const primaryFetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      let fetchedTasks;
      if (fetchMode === 'by_seance' && seanceId) {
        // Assume this might return null or undefined if no tasks are found.
        fetchedTasks = await fetchTasksBySeanceId(seanceId);
      } else {
        // Assume this might also return null or undefined.
        fetchedTasks = await fetchAllTasksForUser();
      }
      
      // --- CORRECTED: Ensure state is always set to an array, even if the API returns null/undefined ---
      setAllUserTasks(fetchedTasks ?? []); 
      
    } catch (error) {
      showSnackbar(`Erreur lors de la récupération des tâches: ${error.message}`, 'error');
      // Already handles error, but let's be extra safe here too.
      setAllUserTasks([]); 
    } finally {
      setLoading(false);
    }
  }, [fetchMode, seanceId, showSnackbar]);

  useEffect(() => {
    // Only fetch if a seanceId is provided for 'by_seance' mode, or always for 'all_tasks' mode.
    if (fetchMode === 'all_tasks' || (fetchMode === 'by_seance' && seanceId)) {
        primaryFetchTasks();
    }
  }, [primaryFetchTasks, fetchMode, seanceId]);

  // --- Filtering Logic (Memoized) ---
  const filteredTasks = useMemo(() => {
    let tasksToFilter = allUserTasks;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      tasksToFilter = tasksToFilter.filter(task =>
        task.titre.toLowerCase().includes(lowerCaseSearchTerm) ||
        (task.description && task.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    if (selectedImportance !== '') {
      const importanceValue = parseInt(selectedImportance);
      tasksToFilter = tasksToFilter.filter(task => task.importance === importanceValue);
    }
    if (selectedStatus !== '') {
        tasksToFilter = tasksToFilter.filter(task =>
            String(task.statut).toLowerCase() === selectedStatus.toLowerCase()
        );
    }
    return tasksToFilter;
  }, [allUserTasks, searchTerm, selectedImportance, selectedStatus]);

  // --- Grouped Tasks for Kanban Board ---
  const groupedTasks = useMemo(() => {
    const tasks = filteredTasks;
    return {
      'en attente': tasks.filter(task => String(task.statut).toLowerCase() === 'en attente'),
      'en cours': tasks.filter(task => String(task.statut).toLowerCase() === 'en cours'),
      'terminée': tasks.filter(task =>
        ['terminée', 'complétée', 'complete'].includes(String(task.statut).toLowerCase())
      ),
    };
  }, [filteredTasks]);

  // --- Add Task Logic ---
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTaskData(prev => ({ ...prev, [name]: value }));
  };

  const onToggleAddToActiveSeance = (e) => {
    setAddToActiveSeance(e.target.checked);
  };

  const handleAddTask = async () => {
    if (!newTaskData.titre) {
      showSnackbar("Le titre de la tâche est requis.", 'warning');
      return;
    }
    showSnackbar("Ajout de la tâche...", 'info', true);

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error("Authentification requise pour ajouter une tâche.");
      
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const client_id = decodedPayload.sub;

      const payload = {
        ...newTaskData,
        client_id: client_id,
        date_fin: newTaskData.date_fin ? new Date(newTaskData.date_fin).toISOString() : null,
        priorite: newTaskData.importance === 1 ? 'Urgent' : newTaskData.importance === 2 ? 'Haute' : 'Moyenne',
        est_terminee: newTaskData.statut === 'terminée',
      };

      if (addToActiveSeance && seanceId) {
        payload.seance_etude_id = seanceId;
      }

      await addTaskToBackend(payload);
      showSnackbar('Tâche ajoutée avec succès!', 'success');
      setIsAddTaskDialogOpen(false);
      setNewTaskData({ // Reset form
        titre: '', description: '', importance: 3, statut: 'en attente', date_fin: '',
      });
      setAddToActiveSeance(false);
      
      // Refresh the tasks after a successful addition
      primaryFetchTasks();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error.message);
      showSnackbar(`Erreur lors de l'ajout de la tâche: ${error.message}`, 'error');
    }
  };

  // --- Task Drag-and-Drop / Update Logic ---
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    // Optimistically update the UI first
    setAllUserTasks(prevAllTasks =>
      prevAllTasks.map(task =>
        task.id === taskId ? { ...task, statut: newStatus } : task
      )
    );
    showSnackbar(`Mise à jour du statut...`, 'info', true);
    
    try {
      await updateTaskStatus(taskId, newStatus);
      showSnackbar(`Statut de la tâche mis à jour !`, 'success');
    } catch (error) {
      showSnackbar(`Erreur lors de la mise à jour du statut: ${error.message}`, 'error');
      // If the update fails, revert the state
      primaryFetchTasks();
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await updateTaskBackend(taskId, updatedData);
      showSnackbar("Tâche mise à jour avec succès", "success");
      primaryFetchTasks(); // Refresh tasks after a successful update
    } catch (error) {
      showSnackbar(`Erreur: ${error.message}`, "error");
    }
  };

  const handleViewDetailsClick = (task) => {
    setSelectedTaskDetails(task);
    setIsTaskDetailsDialogOpen(true);
  };

  const handleCloseTaskDetailsDialog = () => {
    setIsTaskDetailsDialogOpen(false);
    setSelectedTaskDetails(null);
  };

  return {
    // Task Data and state
    allTasks: allUserTasks,
    loading,
    groupedTasks, // For Kanban boards
    filteredTasks, // For simple lists
    
    // Fetching and filtering handlers
    primaryFetchTasks,
    searchTerm,
    setSearchTerm,
    selectedImportance,
    setSelectedImportance,
    selectedStatus,
    setSelectedStatus,

    // Add Task Dialog handlers
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    newTaskData,
    handleNewTaskChange,
    handleAddTask,
    addToActiveSeance,
    onToggleAddToActiveSeance,

    // Task details/update handlers
    isTaskDetailsDialogOpen,
    setIsTaskDetailsDialogOpen,
    selectedTaskDetails,
    handleViewDetailsClick,
    handleCloseTaskDetailsDialog,
    handleUpdateTaskStatus,
    handleUpdateTask,
  };
};