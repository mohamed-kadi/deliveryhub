import axios from 'axios';
import { getAccessToken, getRefreshToken, refreshAccessToken, clearTokens } from './authService';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - automatically add access token to all requests
apiClient.interceptors.request.use(
  (config) => {
        const newToken = getAccessToken(); // check new location first
        const oldToken = localStorage.getItem("token"); // fallback to old location

        const token = newToken || oldToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh automatically
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('🔄 Response interceptor caught error:', error.response?.status);  // delete after debuggin
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Attempting token refresh...'); // delete after debuggin
      if (isRefreshing) {
        console.log('🔄 Already refreshing - queuing request'); // delete after debugging
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        
        // Process queued requests
        processQueue(null, newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError); // delete after debugging
        // Refresh failed - user needs to login again
        processQueue(refreshError, null);
        clearTokens();
        
        // Redirect to login page
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
export default apiClient;