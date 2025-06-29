import config from '../config';

export const fetchStatisticsFromAPI = async () => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
        throw new Error('Token JWT manquant.');
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(`${config.statsMicroserviceBaseUrl}/statistique`, {
        method: 'GET',
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des statistiques.');
    }

    return await response.json();
};
