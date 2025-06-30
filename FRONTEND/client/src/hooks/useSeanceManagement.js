import { useState, useCallback } from "react";
import {
  createSeance,
  endSeance,
  updateMinuterie,
  updateStatut,
  getUserSeances,
} from "../utils/seanceService";
import { useTranslation } from 'react-i18next';

export const useSeanceManagement = () => {
  const { t } = useTranslation();

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
      setError(err.message || t('seance.fetch_error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  /* ADD SEANCE - D.O. */ 
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  const addSeance = async (formData) => {
    try {
      const newSeance = await createSeance(formData);
      setSeances((prev) => [...prev, newSeance]);
      return newSeance;
    } catch (err) {
      throw err;
    }
  };
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/

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
