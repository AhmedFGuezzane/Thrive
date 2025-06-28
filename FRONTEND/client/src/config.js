const config = {
  // Use import.meta.env to access environment variables in modern frontend frameworks like Vite.
  authMicroservicePort: import.meta.env.VITE_AUTH__PORT,
  tacheMicroservicePort: import.meta.env.VITE_TACHE__PORT,
  seanceMicroservicePort: import.meta.env.VITE_SEANCE__PORT,
  statsMicroservicePort: import.meta.env.VITE_STATS__PORT,

  // Construct the base URL for the authentication microservice
  authMicroserviceBaseUrl: `http://localhost:${import.meta.env.VITE_AUTH__PORT}`,
  tacheMicroserviceBaseUrl: `http://localhost:${import.meta.env.VITE_TACHE__PORT}`,
  seanceMicroserviceBaseUrl: `http://localhost:${import.meta.env.VITE_SEANCE__PORT}`,
  statsMicroserviceBaseUrl: `http://localhost:${import.meta.env.VITE_STATS__PORT}`
};

export default config;