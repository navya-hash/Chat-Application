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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.get(refreshTokenRoute);
        return api(originalRequest); // retry
      } catch (err) {
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
//  Only if your backend returns a `401` (usually when an **access token expired**)
    return Promise.reject(error);
  }
);

export default api;
