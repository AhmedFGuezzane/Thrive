const config = {
  // Use import.meta.env to access environment variables in modern frontend frameworks like Vite.
  authMicroservicePort: import.meta.env.VITE_AUTH__PORT,

  // Construct the base URL for the authentication microservice
  authMicroserviceBaseUrl: `http://localhost:${import.meta.env.VITE_AUTH__PORT}`
};

export default config;