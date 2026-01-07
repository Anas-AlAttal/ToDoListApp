import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/Users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/Users/login', credentials);
    if (response.data.success && response.data.data) {
      const token = response.data.data.token;
      if (token) {
        localStorage.setItem('accessToken', token.accessToken || token.AccessToken);
        localStorage.setItem('refreshToken', token.refreshToken || token.RefreshToken);
      }
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/Users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/Users/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};
