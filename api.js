// In your axios setup file
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log('Axios Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('Axios Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Axios Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default api;