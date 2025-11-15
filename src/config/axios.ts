import axios from 'axios';
import { APP_ROUTES } from '@/constants/app-routes';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PROVIDER,
  timeout: 10000,
});

// Request interceptor: always attach tokens
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const access_token = localStorage.getItem('access-token');
      const refresh_token = localStorage.getItem('refresh-token');
      const language = localStorage.getItem('language') || 'en';

      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      if (refresh_token) {
        config.headers['refresh-token'] = refresh_token;
      }
      config.headers['Accept-Language'] = language;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: update tokens if backend sends new ones
axiosInstance.interceptors.response.use(
  (response) => {
    const headers = response.headers;

    if (headers['authorization']) {
      const authHeader = headers['authorization'];
      if (authHeader.startsWith('Bearer ')) {
        const newAccessToken = authHeader.substring(7);
        localStorage.setItem('access-token', newAccessToken);
      }
    }
    if (headers['refresh-token']) {
      localStorage.setItem('refresh-token', headers['refresh-token']);
    }
    return response;
  },
  (error) => {
    // If unauthorized, just redirect
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        if (!window.location.href.includes(APP_ROUTES.signIn)) {
          window.location.href = APP_ROUTES.signIn;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;