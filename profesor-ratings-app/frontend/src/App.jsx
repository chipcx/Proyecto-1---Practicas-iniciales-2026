import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PublicationList from './components/PublicationList';
import CreatePublication from './components/CreatePublication';
import PublicationDetail from './components/PublicationDetail';
import ForgotPassword from './components/ForgotPassword';
import SearchProfile from './components/SearchProfile';
import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleRegisterSuccess = () => {
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-container">

            {/* Logo / Nombre */}
            <h1
              className="navbar-brand"
              style={{ cursor: 'pointer' }}
              onClick={() => window.location.href = '/'}
            >
              Rating de Catedráticos
            </h1>

            {/* Acciones */}
            <div className="nav-links">
              {user && (
                <>
                  {/* Botón buscar */}
                  <button
                    onClick={() => window.location.href = '/search'}
                    className="btn btn-secondary"
                  >
                    Buscar
                  </button>

                  {/* Botón perfil */}
                  <button
                    onClick={() => window.location.href = `/profile/${user.registro_academico}`}
                    className="btn btn-primary"
                  >
                    Mi Perfil
                  </button>

                  {/* Nombre usuario */}
                  <span className="user-info">
                    {user.nombres}
                  </span>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="btn btn-logout"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Contenido Principal */}
        <main className="main-content">
          <Routes>
            {!user ? (
              <>
                <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/register" element={<RegisterForm onRegisterSuccess={handleRegisterSuccess} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<PublicationList />} />
                <Route path="/create" element={<CreatePublication onPublicationCreated={() => window.location.href = '/'} />} />
                <Route path="/publication/:id" element={<PublicationDetail />} />
                <Route path="/search" element={<SearchProfile />} />
                <Route path="/profile/:registro" element={<UserProfile />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2026 Aplicación de Rating de Catedráticos - USAC</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
