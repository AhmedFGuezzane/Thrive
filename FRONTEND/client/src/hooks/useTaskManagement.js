import { useState } from 'react';
import { addTaskToBackend } from '../utils/taskService'

/**
 * Custom hook for managing task addition logic and state.
 * @param {string} currentActiveSeanceId The ID of the current active study session, or null if none.
 * @param {function} onTaskAdded Callback function to be called after a task is successfully added (e.g., to refresh the task list).
 * @param {function} showSnackbar A function to display snackbar alerts (message, severity, loading?: boolean). // Corrected JSDoc
 * @returns {object} An object containing states and handlers for adding a task.
 */
export const useTaskManagement = (currentActiveSeanceId, onTaskAdded, showSnackbar) => {
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    titre: '',
    description: '',
    importance: 3, // Default to Medium importance
    statut: 'en attente', // Default to 'en attente'
    date_fin: '',
  });
  const [addToActiveSeance, setAddToActiveSeance] = useState(false);

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

    // 1. Show "Adding Task..." progress message
    showSnackbar("Ajout de la tâche...", 'info', true); // 'info' severity, and 'true' for loading

    try {
      // Decode JWT to get client_id
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        throw new Error("Authentification requise pour ajouter une tâche.");
      }
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const client_id = decodedPayload.sub; // Assuming 'sub' contains the client ID

      const payload = {
        ...newTaskData,
        client_id: client_id, // Always include client_id
        date_fin: newTaskData.date_fin ? new Date(newTaskData.date_fin).toISOString() : null,
        priorite: newTaskData.importance === 1 ? 'Urgent' : newTaskData.importance === 2 ? 'Haute' : 'Moyenne',
        est_terminee: newTaskData.statut === 'terminée',
      };

      if (addToActiveSeance && currentActiveSeanceId) {
        payload.seance_etude_id = currentActiveSeanceId;
      }

      const addedTask = await addTaskToBackend(payload);
      console.log('Task added successfully:', addedTask);

      // 2. On success, show "Task added successfully!" message
      showSnackbar('Tâche ajoutée avec succès!', 'success');

      setIsAddTaskDialogOpen(false);
      setNewTaskData({ // Reset form
        titre: '',
        description: '',
        importance: 3,
        statut: 'en attente',
        date_fin: '',
      });
      setAddToActiveSeance(false); // Reset switch state after adding task

      if (onTaskAdded) {
        onTaskAdded(); // Trigger refresh of the task list in parent component
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error.message);
      // 3. On error, show "Failed to add task" message
      showSnackbar(`Erreur lors de l'ajout de la tâche: ${error.message}`, 'error');
    }
  };

  return {
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    newTaskData,
    handleNewTaskChange,
    handleAddTask,
    addToActiveSeance,
    onToggleAddToActiveSeance,
  };
};