import api from './api';

const AuthService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => localStorage.removeItem('token')
};

export default AuthService;
