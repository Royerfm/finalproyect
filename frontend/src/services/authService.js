// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8081/auth';

// Función para iniciar sesión
export const login = (email, password) => {
  // Envía un objeto JSON { email, password }
  return axios.post(`${API_URL}/login`, { email, password });
};

// Función para validar el token
export const validateToken = (token) => {
  return axios.post(
    `${API_URL}/validate-token`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
