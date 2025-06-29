// src/utils/taskService.jsx
import config from '../config';

const BASE_URL = config.tacheMicroserviceBaseUrl;

// Get token from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ✅ Fetch all tasks for the authenticated user
export async function fetchAllTasksForUser() {
  const response = await fetch(`${BASE_URL}/taches`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors du chargement des tâches.");
  }

  return await response.json();
}

// ✅ Fetch tasks by seance ID
export async function fetchTasksBySeanceId(seanceId) {
  const response = await fetch(`${BASE_URL}/taches/seance/${seanceId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors du chargement des tâches.");
  }

  return await response.json();
}

// ✅ Fetch single task by ID
export async function fetchTaskById(tacheId) {
  const response = await fetch(`${BASE_URL}/tache/${tacheId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors du chargement de la tâche.");
  }

  return await response.json();
}

//CREATE TASK - S.L.
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */
export async function addTaskToBackend(taskData) {

  // WE SEND A POST REQUEST WITH THE TASKDATA AS BODY, THE TOKEN AS HEADER -- WE STORE THE RESPONSE IN CONST RESPONSE 
  const response = await fetch(`${BASE_URL}/tache`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la création de la tâche.");
  }

  return await response.json();
}

// UPDATE TASK - I.R.
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */

export async function updateTask(tacheId, updatedData) {
  // ON ENVOI UNE REQUETE (PUT) A TACHE_SERVICE ET ON STOCK LA REPONSE DANS CONST RESPONSE
  const response = await fetch(`${BASE_URL}/tache/${tacheId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la mise à jour de la tâche.");
  }

  return await response.json(); // RENVOI A USETASKMANAGEMENT
}
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */


export async function updateTaskStatus(tacheId, newStatus) {

  // ENVOYER REQUETE PUT A TACHE_SERVICE AVEC LE TACHE ID, TOKEN ET BODY
  const response = await fetch(`${BASE_URL}/tache/${tacheId}`, { 
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ statut: newStatus }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la mise à jour du statut.");
  }

  return await response.json();
}




// DELETE TASK - I.R.
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */

export async function deleteTask(tacheId) {
  // ON ENVOI UNE REQUETE (DELETE) A TACHE_SERVICE ET ON STOCK LA REPONSE DANS CONST RESPONSE
  const response = await fetch(`${BASE_URL}/tache/${tacheId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la suppression de la tâche.");
  }

  return await response.json(); // RENVOI A USETASKMANAGEMENT
}


/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */