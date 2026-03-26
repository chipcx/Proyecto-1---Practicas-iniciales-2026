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
    <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Buscador de Perfiles</h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Ingresa el registro académico del usuario que deseas encontrar para ver su información pública.
      </p>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Ej: 202100001" 
          value={registro}
          onChange={(e) => setRegistro(e.target.value)}
          style={{ 
            padding: '1rem', 
            fontSize: '1.1rem', 
            borderRadius: '6px', 
            border: '2px solid #e2e8f0',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          autoFocus
        />
        <button 
          type="submit" 
          style={{ 
            padding: '1rem', 
            fontSize: '1.1rem', 
            backgroundColor: '#0066cc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0052a3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#0066cc'}
        >
          🔍 Buscar Perfil
        </button>
      </form>
    </div>
  );
};

export default SearchProfile;
