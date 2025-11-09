// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api-rest-bicentenario-gcex.onrender.com/api/dashboard",
  headers: {
    "Content-Type": "application/json",
  },
});

// Puedes interceptar peticiones/respuestas si lo necesitas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la API:", error);
    return Promise.reject(error);
  }
);

export default api;
