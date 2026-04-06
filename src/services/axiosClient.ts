import axios from 'axios';

const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL}/api`;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Attach token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors and auto unwrap data
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Auto logout on 401
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('token');
        // Optional: Redirect to login page if needed
        // window.location.href = '/login'; 
      }
      return Promise.reject(error.response.data || error.response);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
