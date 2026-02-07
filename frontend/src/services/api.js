import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Adjust if backend runs on a different port
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., logging out on 401)
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
