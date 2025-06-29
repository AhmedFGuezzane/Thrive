import { useState, useEffect, useCallback } from 'react';
import { fetchStatisticsFromAPI } from '../utils/statisticsService';
import { useSnackbar } from './useSnackbar';

// Utility to decode client ID from JWT
const getClientIdFromToken = () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return decodedPayload.sub; // Assuming 'sub' contains client ID
    } catch (error) {
        console.error("Failed to decode JWT token:", error);
        return null;
    }
};

export const useStatisticsManagement = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { showSnackbar } = useSnackbar(); // Optional: show feedback


    // FETCH STATS - A.G.
    const fetchStatistics = useCallback(async () => {
        setLoading(true);
        setError(null);

        const clientId = getClientIdFromToken();
        if (!clientId) {
            setError("Utilisateur non authentifié.");
            setLoading(false);
            return;
        }

        try {
            const data = await fetchStatisticsFromAPI();
            setStats(data);
        } catch (err) {
            console.error("Error fetching statistics:", err);
            const errorMsg = err.message || 'Erreur inattendue';
            setError(errorMsg);
            setStats(null);
            showSnackbar?.(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    return { stats, loading, error, fetchStatistics };
};
