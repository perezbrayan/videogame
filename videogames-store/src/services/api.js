import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const gameService = {
  getAllGames: async () => {
    const response = await axios.get(`${API_URL}/games`);
    return response.data;
  },

  getGame: async (id) => {
    const response = await axios.get(`${API_URL}/games/${id}`);
    return response.data;
  },

  createGame: async (gameData) => {
    const formData = new FormData();
    Object.keys(gameData).forEach(key => {
      if (key === 'image') {
        if (gameData[key]) {
          formData.append('image', gameData[key]);
        }
      } else if (Array.isArray(gameData[key])) {
        formData.append(key, JSON.stringify(gameData[key]));
      } else {
        formData.append(key, gameData[key]);
      }
    });

    const response = await axios.post(`${API_URL}/games`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateGame: async (id, gameData) => {
    const formData = new FormData();
    Object.keys(gameData).forEach(key => {
      if (key === 'image') {
        if (gameData[key]) {
          formData.append('image', gameData[key]);
        }
      } else if (Array.isArray(gameData[key])) {
        formData.append(key, JSON.stringify(gameData[key]));
      } else {
        formData.append(key, gameData[key]);
      }
    });

    const response = await axios.put(`${API_URL}/games/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteGame: async (id) => {
    const response = await axios.delete(`${API_URL}/games/${id}`);
    return response.data;
  }
};

export const platformService = {
  getAllPlatforms: async () => {
    const response = await axios.get(`${API_URL}/platforms`);
    return response.data;
  }
};

export const categoryService = {
  getAllCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  }
};

export const developerService = {
  getAllDevelopers: async () => {
    const response = await axios.get(`${API_URL}/developers`);
    return response.data;
  }
};
