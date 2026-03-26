import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PublicationList from './components/PublicationList';
import CreatePublication from './components/CreatePublication';
import PublicationDetail from './components/PublicationDetail';
import UserProfile from './components/UserProfile';
import SearchProfile from './components/SearchProfile';
import { Link } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario logueado
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
    // Redirigir a login
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

            <h1 className="navbar-brand">⭐ Rating de Catedráticos</h1>

            {user && (
              <div className="nav-actions">

                <Link to="/search" className="nav-btn secondary">
                  🔍 Buscar
                </Link>

                <Link to={`/profile/${user.registro_academico}`} className="nav-btn primary">
                  👤 Mi Perfil
                </Link>

                <span className="user-info">
                  {user.nombres}
                </span>

                <button onClick={handleLogout} className="nav-btn logout">
                  Cerrar sesión
                </button>

              </div>
            )}

          </div>
        </nav>

        {/* Contenido Principal */}
        <main className="main-content">
          <Routes>
            {!user ? (
              <>
                <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/register" element={<RegisterForm onRegisterSuccess={handleRegisterSuccess} />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<PublicationList />} />
                <Route path="/create" element={<CreatePublication onPublicationCreated={() => window.location.href = '/'} />} />
                <Route path="/publication/:id" element={<PublicationDetail />} />
                <Route path="/profile/:registro" element={<UserProfile />} />
                <Route path="/search" element={<SearchProfile />} />
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
