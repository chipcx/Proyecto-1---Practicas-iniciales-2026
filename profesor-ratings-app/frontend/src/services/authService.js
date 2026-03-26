import api from './api';

const AuthService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => localStorage.removeItem('token'),

  // Nuevos métodos para recuperación de contraseña
  forgotPassword: (registro_academico, email) =>
    api.post('/auth/forgot-password', { registro_academico, email }),

  resetPassword: (token, nuevaContraseña) =>
    api.post('/auth/reset-password', { token, nuevaContraseña })
};

export default AuthService;
