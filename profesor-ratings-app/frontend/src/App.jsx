import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PublicationList from './components/PublicationList';
import CreatePublication from './components/CreatePublication';
import PublicationDetail from './components/PublicationDetail';
import ForgotPassword from './components/ForgotPassword';
import SearchProfile from './components/SearchProfile';
import UserProfile from './components/UserProfile';

/* ---- Navbar (needs useNavigate, so it must be inside Router) ---- */
function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1
          className="navbar-brand"
          onClick={() => navigate('/')}
        >
          Rating de Catedráticos
        </h1>

        <div className="nav-links">
          <button onClick={() => navigate('/create')} className="btn btn-secondary">
            ✏️ Publicar
          </button>
          <button onClick={() => navigate('/search')} className="btn btn-secondary">
            🔍 Buscar
          </button>
          <button onClick={() => navigate(`/profile/${user.registro_academico}`)} className="btn btn-primary">
            👤 Mi Perfil
          </button>
          <span className="user-info">{user.nombres}</span>
          <button onClick={onLogout} className="btn btn-logout">
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ---- App ---- */
function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />

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
              <Route path="/create" element={<CreatePublication onPublicationCreated={() => navigate('/')} />} />
              <Route path="/publication/:id" element={<PublicationDetail />} />
              <Route path="/search" element={<SearchProfile />} />
              <Route path="/profile/:registro" element={<UserProfile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Rating de Catedráticos — USAC — Práctica Inicial</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
