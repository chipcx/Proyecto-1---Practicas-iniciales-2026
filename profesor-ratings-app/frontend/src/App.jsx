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
            <div className="nav-links">
              {user ? (
                <>
                  <button onClick={() => window.location.href = '/search'} className="btn" style={{ marginRight: '1rem', padding: '0.4rem 1rem', backgroundColor: '#e2e8f0', color: '#333', fontWeight: 'bold' }}>
                    🔍 Buscar Perfiles
                  </button>
                  <span className="user-info" style={{ marginLeft: '1rem' }}>
                    Bienvenido, {user.nombres}
                  </span>

                  <Link
                    to={`/profile/${user.registro_academico}`}
                    className="btn"
                    style={{
                      marginLeft: '1rem',
                      padding: '0.4rem 1rem',
                      backgroundColor: '#0066cc',
                      color: '#fff',
                      fontWeight: 'bold',
                      textDecoration: 'none'
                    }}
                  >
                    👤 Mi Perfil
                  </Link>

                  <button onClick={handleLogout} className="btn btn-logout">
                    Cerrar Sesión
                  </button>
                </>
              ) : null}
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
