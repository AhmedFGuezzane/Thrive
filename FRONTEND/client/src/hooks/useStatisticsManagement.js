import { useState, useEffect, useCallback } from 'react';
import { fetchStatisticsFromAPI } from '../utils/statisticsService';
import { useSnackbar } from './useSnackbar';
import { useTranslation } from 'react-i18next';

const getClientIdFromToken = () => {
  const token = localStorage.getItem('jwt_token');
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.sub;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
};

export const useStatisticsManagement = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showSnackbar } = useSnackbar();

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    const clientId = getClientIdFromToken();
    if (!clientId) {
      const authError = t('statistics.not_authenticated');
      setError(authError);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchStatisticsFromAPI();
      setStats(data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      const errorMsg = t('statistics.fetch_error', { error: err.message || '...' });
      setError(errorMsg);
      setStats(null);
      showSnackbar?.(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [t, showSnackbar]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { stats, loading, error, fetchStatistics };
};
