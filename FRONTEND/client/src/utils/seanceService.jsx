// src/utils/seanceService.jsx
import config from '../config';

const SEANCE_BASE_URL = config.seanceMicroserviceBaseUrl;

const getToken = () => {
  const token = localStorage.getItem('jwt_token');
  if (!token) throw new Error("Authentication required");
  return token;
};

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erreur de communication avec le service séance');
  }

  return res.json();
};

//CREATE SEANCE - D.O.
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */

export const createSeance = async (formData) => {

  // RECUPERER LE CLIENT_ID QUI SE TROUVE DANS LE TOKEN DANS LE LOCALSTORAGE (DECODER LE TOKEN ET RECUPERER ID )
  const token = getToken();
  const payloadBase64 = token.split('.')[1];
  const decodedPayload = JSON.parse(atob(payloadBase64));
  const client_id = decodedPayload.sub;

  // CALCUL DE LA DATE DE DEBUT ET DATE DE FIN (DATE DEBUT = TODAY, DATE DE FIN CEST TODAY + DUREE SEANCE)
  const date_debut = new Date();
  const date_fin = new Date(date_debut.getTime() + Number(formData.pomodoro.duree_seance_totale) * 1000);

  // CONSTRUIT UN PAYLOAD AVEC LES INFORMATIONS DU FORMULAIRE QUI A ETE ENVOYER
  const payload = {
    client_id,
    type_seance: formData.type_seance,
    nom: formData.nom,
    date_debut: date_debut.toISOString(),
    date_fin: date_fin.toISOString(),
    statut: "en_cours",
    est_complete: false,
    interruptions: 0,
    nbre_pomodoro_effectues: 0,
    pomodoro: {
      ...formData.pomodoro,
      duree_seance: Number(formData.pomodoro.duree_seance),
      duree_pause_courte: Number(formData.pomodoro.duree_pause_courte),
      duree_pause_longue: Number(formData.pomodoro.duree_pause_longue),
      nbre_pomodoro_avant_pause_longue: Number(formData.pomodoro.nbre_pomodoro_avant_pause_longue),
      duree_seance_totale: Number(formData.pomodoro.duree_seance_totale)
    }
  };

  // ON VA APPELER LE BACKEND SEANCE_SERVICE, ENVOYER LE PAYLOAD ET STOCKER REPONSE DANS CONST RESULT
  const result = await fetchWithAuth(`${SEANCE_BASE_URL}/seances`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // SI RESULTAT REVIENT POSITIF, ON STOCK LE RESULTAT DANS CONST SEANCE
  const seance = result?.seance || result;

  // SI CONST SEANCE.ID NEST PAS VIDE, ON STOCK LA SEANCE DANS LE LOCALSTORAGE
  if (seance?.id) {
    localStorage.setItem("active_seance_id", seance.id);
  }

  return seance;
};

/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */



export const endSeance = async (seanceId, seanceData) => {
  return await fetchWithAuth(`${SEANCE_BASE_URL}/seances/${seanceId}/terminer`, {
    method: 'PATCH',
    body: JSON.stringify(seanceData),
  });
};

export const updateMinuterie = async (seanceId, data) => {
  return await fetchWithAuth(`${SEANCE_BASE_URL}/seances/${seanceId}/minuterie`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const updateStatut = async (seanceId, statut) => {
  return await fetchWithAuth(`${SEANCE_BASE_URL}/seances/${seanceId}/statut`, {
    method: 'PATCH',
    body: JSON.stringify({ statut }),
  });
};

export const getUserSeances = async () => {
  return await fetchWithAuth(`${SEANCE_BASE_URL}/seances`, {
    method: 'GET',
  });
};
