// src/config/api.js
const apiConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    env: import.meta.env.VITE_ENV || 'development'
  };
  
  export default apiConfig;