import axios from 'axios';

const TOKEN_KEY = 'parihaaram_jwt_token';
const USER_KEY = 'parihaaram_user_data';

// Create Centralized Axios Client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Error Normalization & Session Expiry
apiClient.interceptors.response.use(
  (response) => {
    // Return inner data payload if standardized ApiResponse
    return response.data;
  },
  (error) => {
    const originalRequest = error.config;

    // Handle Network / Backend Offline Error
    if (!error.response) {
      console.warn('⚠️ PARIHAARAM Backend is unreachable. Check if Spring Boot server is running.');
      const offlineError = {
        success: false,
        isOffline: true,
        code: 'NETWORK_ERROR',
        message: 'Backend server is offline or unreachable. Please verify connection.'
      };
      return Promise.reject(offlineError);
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized / Token Expired
    if (status === 401 && !originalRequest._retry) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        window.dispatchEvent(new CustomEvent('parihaaram:unauthorized'));
      }
    }

    // Standardized Normalized Error
    const formattedError = {
      success: false,
      status: status,
      code: data?.code || (status === 403 ? 'FORBIDDEN' : status === 401 ? 'UNAUTHORIZED' : 'API_ERROR'),
      message: data?.message || error.message || 'An error occurred while communicating with the server.',
      data: data?.data || null
    };

    return Promise.reject(formattedError);
  }
);

export { apiClient, TOKEN_KEY, USER_KEY };
export default apiClient;
