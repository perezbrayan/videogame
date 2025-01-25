import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user } = response.data;
    
    if (!token) {
      throw new Error('No se recibió el token de autenticación');
    }
    
    // Guardar el token en localStorage y configurar axios
    setAuthToken(token);
    
    // También guardar la información del usuario
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error.response?.data || { message: 'Error al iniciar sesión' };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al registrar usuario' };
  }
};

export const logout = () => {
  setAuthToken(null);
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Inicializar token desde localStorage
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}
