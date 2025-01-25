import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getGames = async () => {
  try {
    const response = await axios.get(`${API_URL}/games`);
    return response.data.games;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener los juegos' };
  }
};

export const getGame = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/games/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al obtener el juego' };
  }
};

export const createGame = async (gameData) => {
  try {
    const response = await axios.post(`${API_URL}/games`, gameData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al crear el juego' };
  }
};

export const updateGame = async (id, gameData) => {
  try {
    const response = await axios.put(`${API_URL}/games/${id}`, gameData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al actualizar el juego' };
  }
};

export const deleteGame = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/games/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al eliminar el juego' };
  }
};
