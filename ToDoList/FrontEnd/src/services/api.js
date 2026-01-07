import axios from 'axios';

// استخدام proxy في التطوير، أو URL مباشر في الإنتاج
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // في التطوير يستخدم proxy
  : 'http://localhost:7043/api';  // في الإنتاج يستخدم URL مباشر

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // استخدام نفس API_BASE_URL (proxy في التطوير)
          const refreshUrl = import.meta.env.DEV 
            ? '/api/Users/refresh-token'
            : `${API_BASE_URL}/Users/refresh-token`;
          const response = await axios.post(refreshUrl, {
            refreshToken: refreshToken,
          });

          if (response.data.success && response.data.data) {
            const token = response.data.data.token;
            if (token) {
              const accessToken = token.accessToken || token.AccessToken;
              const refreshTokenValue = token.refreshToken || token.RefreshToken;
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', refreshTokenValue);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return api(originalRequest);
            }
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
