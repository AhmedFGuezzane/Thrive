import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  addTaskToBackend,
  fetchTasksBySeanceId,
  fetchAllTasksForUser,
  updateTaskStatus,
  updateTask as updateTaskBackend,
  deleteTask as deleteTaskBackend
} from '../utils/taskService';

const PREFETCH_KEY = "prefetchedTasks";
const PREFETCH_TIME_KEY = "lastTaskPrefetch";
const COOLDOWN_MS = 30000;

export const useTaskManagement = (seanceId, showSnackbar, fetchMode = 'all_tasks') => {
  const [allUserTasks, setAllUserTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImportance, setSelectedImportance] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    titre: '',
    description: '',
    importance: 3,
    statut: 'en attente',
    date_fin: '',
  });
  const [addToActiveSeance, setAddToActiveSeance] = useState(false);

  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);

  const primaryFetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      let fetchedTasks;
      if (fetchMode === 'by_seance' && seanceId) {
        fetchedTasks = await fetchTasksBySeanceId(seanceId);
      } else {
        fetchedTasks = await fetchAllTasksForUser();
      }
      setAllUserTasks(fetchedTasks ?? []);
      sessionStorage.setItem(PREFETCH_KEY, JSON.stringify(fetchedTasks));
      sessionStorage.setItem(PREFETCH_TIME_KEY, Date.now().toString());
    } catch (error) {
      showSnackbar(`Erreur lors de la récupération des tâches: ${error.message}`, 'error');
      setAllUserTasks([]);
    } finally {
      setLoading(false);
    }
  }, [fetchMode, seanceId, showSnackbar]);

  const prefetchTasksIfAllowed = useCallback(async () => {
    const lastPrefetch = parseInt(sessionStorage.getItem(PREFETCH_TIME_KEY), 10) || 0;
    const now = Date.now();

    if (now - lastPrefetch > COOLDOWN_MS) {
      try {
        const fetched = await fetchAllTasksForUser();
        sessionStorage.setItem(PREFETCH_KEY, JSON.stringify(fetched));
        sessionStorage.setItem(PREFETCH_TIME_KEY, now.toString());
      } catch (err) {
        console.warn("Prefetch failed:", err.message);
      }
    }
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem(PREFETCH_KEY);
    if (cached) {
      try {
        setAllUserTasks(JSON.parse(cached));
      } catch {
        sessionStorage.removeItem(PREFETCH_KEY);
      }
    }

    if (fetchMode === 'all_tasks' || (fetchMode === 'by_seance' && seanceId)) {
      primaryFetchTasks();
    }
  }, [primaryFetchTasks, fetchMode, seanceId]);

  const filteredTasks = useMemo(() => {
    let tasksToFilter = allUserTasks;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      tasksToFilter = tasksToFilter.filter(task =>
        task.titre.toLowerCase().includes(lower) ||
        (task.description && task.description.toLowerCase().includes(lower))
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

    setIsAddTaskDialogOpen(false);
    showSnackbar("Ajout de la tâche...", 'info', true);

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error("Authentification requise pour ajouter une tâche.");

      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const client_id = decodedPayload.sub;

      const payload = {
        ...newTaskData,
        client_id,
        date_fin: newTaskData.date_fin ? new Date(newTaskData.date_fin).toISOString() : null,
        priorite: newTaskData.importance === 1 ? 'Urgent' : newTaskData.importance === 2 ? 'Haute' : 'Moyenne',
        est_terminee: newTaskData.statut === 'terminée',
      };

      if (addToActiveSeance && seanceId) {
        payload.seance_etude_id = seanceId;
      }

      await addTaskToBackend(payload);

      showSnackbar('Tâche ajoutée avec succès!', 'success');
      setNewTaskData({ titre: '', description: '', importance: 3, statut: 'en attente', date_fin: '' });
      setAddToActiveSeance(false);
      primaryFetchTasks();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error.message);
      showSnackbar(`Erreur lors de l'ajout de la tâche: ${error.message}`, 'error');
      setIsAddTaskDialogOpen(true);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    setAllUserTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, statut: newStatus } : task))
    );
    showSnackbar(`Mise à jour du statut...`, 'info', true);
    try {
      await updateTaskStatus(taskId, newStatus);
      showSnackbar(`Statut de la tâche mis à jour !`, 'success');
    } catch (error) {
      showSnackbar(`Erreur lors de la mise à jour du statut: ${error.message}`, 'error');
      primaryFetchTasks();
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await updateTaskBackend(taskId, updatedData);
      showSnackbar("Tâche mise à jour avec succès", "success");
      primaryFetchTasks();
    } catch (error) {
      showSnackbar(`Erreur: ${error.message}`, "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    showSnackbar("Suppression de la tâche...", "info", true);
    try {
      await deleteTaskBackend(taskId);
      showSnackbar("Tâche supprimée avec succès !", "success");
      primaryFetchTasks();
    } catch (error) {
      showSnackbar(`Erreur lors de la suppression: ${error.message}`, "error");
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
    allTasks: allUserTasks,
    loading,
    groupedTasks,
    filteredTasks,
    primaryFetchTasks,
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
    isTaskDetailsDialogOpen,
    setIsTaskDetailsDialogOpen,
    selectedTaskDetails,
    handleViewDetailsClick,
    handleCloseTaskDetailsDialog,
    handleUpdateTaskStatus,
    handleUpdateTask,
    handleDeleteTask,
    prefetchTasksIfAllowed, // added
  };
};
