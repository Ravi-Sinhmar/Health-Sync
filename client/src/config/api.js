// src/config/api.js
const url =
  import.meta.env.VITE_ENV == "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:5000";
const apiConfig = {
  baseURL: url,
};

export default apiConfig;
