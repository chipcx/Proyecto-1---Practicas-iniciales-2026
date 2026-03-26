import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/authService';
import './LoginForm.css';
import './RegisterForm.css';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    registro_academico: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      await AuthService.register({
        registro_academico: formData.registro_academico,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password
      });
      
      setFormData({
        registro_academico: '',
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      onRegisterSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="login-form register-form">
        <h2>Crear Cuenta</h2>
        <p className="subtitle">Regístrate para comenzar</p>

        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="registro">Registro Académico</label>
            <input
              id="registro"
              type="text"
              name="registro_academico"
              value={formData.registro_academico}
              onChange={handleChange}
              required
              placeholder="202101234"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombres">Nombres</label>
            <input
              id="nombres"
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              placeholder="Juan"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              id="apellidos"
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              placeholder="Pérez García"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Contraseña</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="form-divider">o</div>

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
