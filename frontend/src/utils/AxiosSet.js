// src/utils/axiosSetup.js
import axios from 'axios';
import { refreshTokenRoute } from './APIRoutes';

const api = axios.create({
  baseURL: 'http://localhost:7800',
  withCredentials: true,            
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refreshToken') &&
      !originalRequest.url?.includes('/login') &&
      !originalRequest.url?.includes('/signup')
    ) {
      originalRequest._retry = true;
      try {
        await api.get(refreshTokenRoute);
        return api(originalRequest); // retry
      } catch (err) {
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
