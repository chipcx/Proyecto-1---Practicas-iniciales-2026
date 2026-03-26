import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchProfile = () => {
  const [registro, setRegistro] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (registro.trim()) {
      navigate(`/profile/${registro.trim()}`);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <div className="login-form" style={{ animation: 'fadeInUp 0.4s ease' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.3rem', fontSize: '1.5rem', fontWeight: '700' }}>
          🔍 Buscar Perfil
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Ingresa el registro académico del usuario que deseas encontrar.
        </p>
        
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="search-registro">Registro Académico</label>
            <input
              id="search-registro"
              type="text" 
              placeholder="Ej: 202100001" 
              value={registro}
              onChange={(e) => setRegistro(e.target.value)}
              autoFocus
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Buscar Perfil
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchProfile;
