import { useState, useEffect, useCallback } from 'react';
import config from '../config'; // <-- IMPORT YOUR CONFIG FILE
import { useSnackbar } from './useSnackbar';

// Assuming you have a utility to decode the JWT token to get the user ID
const getClientIdFromToken = () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return decodedPayload.sub; // Assuming 'sub' holds the client ID
    } catch (error) {
        console.error("Failed to decode JWT token:", error);
        return null;
    }
};

export const useStatisticsManagement = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- CORRECTED: Use the base URL from the config file ---
    const STATS_API_URL = `${config.statsMicroserviceBaseUrl}/statistique`;
    // ---------------------------------------------------------
    
    // You can use useSnackbar here, but it's not strictly necessary for this simple fetch.
    // const { showSnackbar } = useSnackbar();

    const fetchStatistics = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        const clientId = getClientIdFromToken();
        if (!clientId) {
            setError("User not authenticated.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('jwt_token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            
            const response = await fetch(STATS_API_URL, { headers });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch statistics.');
            }
            
            const data = await response.json();
            setStats(data);
            
        } catch (err) {
            console.error("Error fetching statistics:", err);
            setError(err.message || 'An unexpected error occurred.');
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, [STATS_API_URL]); // STATS_API_URL is a stable dependency

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    return { stats, loading, error, fetchStatistics };
};