// src/utils/taskService.jsx
import config from '../config';

const BASE_URL = config.tacheMicroserviceBaseUrl;

// Get token from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("jwt_token"); // fixed here
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

// ✅ Create new task
export async function addTaskToBackend(taskData) {
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

// ✅ Update full task (PUT)
export async function updateTask(tacheId, updatedData) {
  const response = await fetch(`${BASE_URL}/tache/${tacheId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la mise à jour de la tâche.");
  }

  return await response.json();
}

// ✅ Update only task status (PATCH-like, via PUT)
export async function updateTaskStatus(tacheId, newStatus) {
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

// ✅ Delete a task
export async function deleteTask(tacheId) {
  const response = await fetch(`${BASE_URL}/tache/${tacheId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la suppression de la tâche.");
  }

  return await response.json();
}
