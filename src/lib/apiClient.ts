import axios from 'axios';

// Base URL for API requests. It will hit the Express backend.
// On the frontend, /api routes to the backend via Next.js or directly depending on setup.
// Assuming Next.js is running and handles /api via rewrites or same-domain Express.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies when cross-domain
});

// Request interceptor to attach tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // If you are using local storage for tokens:
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (like 401)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login or refresh token)
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
