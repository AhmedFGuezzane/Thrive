// src/hooks/useSeanceManagement.js
import { useState, useCallback } from "react";
import {
  createSeance,
  endSeance,
  updateMinuterie,
  updateStatut,
  getUserSeances,
} from "../utils/seanceService";

export const useSeanceManagement = () => {
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSeances = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserSeances();
      setSeances(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des séances.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ADD SEANCE HOOK - D.O.
  const addSeance = async (formData) => {
    try {

      // APPELER METHODE CREATESEANCE DE SEANCESERVIE DANS (src/utils/seanceService), ENVOYER LES DONNEE DU FORMULAIRE ET STOCKER REPONSE DANS CONST NEWSEANCE
      const newSeance = await createSeance(formData);
      setSeances((prev) => [...prev, newSeance]); // STOCKER LES INFORMATIONS DE LA SEANCE (TIMER, ETC) DANS LE LOCALSTORAGE
      return newSeance; // RETOURNER LA SEANCE
    } catch (err) {
      throw err;
    }
  };

  const updateSeanceMinuterie = async (seanceId, data) => {
    try {
      return await updateMinuterie(seanceId, data);
    } catch (err) {
      throw err;
    }
  };

  const changeSeanceStatut = async (seanceId, statut) => {
    try {
      return await updateStatut(seanceId, statut);
    } catch (err) {
      throw err;
    }
  };

  const terminateSeance = async (seanceId, data) => {
    try {
      return await endSeance(seanceId, data);
    } catch (err) {
      throw err;
    }
  };

  
  return {
    seances,
    loading,
    error,
    fetchSeances,
    addSeance,
    updateSeanceMinuterie,
    changeSeanceStatut,
    terminateSeance,
  };
};
