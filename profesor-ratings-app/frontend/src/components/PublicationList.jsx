import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicationService from '../services/publicationService';
import './PublicationList.css';

const PublicationList = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filtered, setFiltered] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterId, setFilterId] = useState('');

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      if (filtered && (filterType || filterId)) {
        response = await PublicationService.filterPublications(filterType, filterId);
      } else {
        response = await PublicationService.getAllPublications(page);
      }
      setPublications(response.data.publications || response.data);
    } catch (err) {
      setError('Error al cargar publicaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filtered, filterType, filterId]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const handleFilter = (e) => {
    e.preventDefault();
    setFiltered(true);
    setPage(1);
  };

  return (
    <div className="publication-list">
      <h2>Publicaciones</h2>

      <div className="filter-section">
        <form onSubmit={handleFilter}>
          <div className="filter-group">
            <input
              type="text"
              placeholder="Filtrar por tipo (catedratico/curso)"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            />
            <input
              type="number"
              placeholder="ID de referencia"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">Filtrar</button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setFiltered(false);
                setFilterType('');
                setFilterId('');
                setPage(1);
              }}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Cargando...</div>}

      <div className="publications">
        {publications.length > 0 ? (
          publications.map(pub => (
            <div key={pub.id} className="publication-card">
              <div className="publication-header">
                <h4>{pub.nombres} {pub.apellidos}</h4>
                <span className="date">
                  {new Date(pub.fecha_creacion).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="publication-meta">
                <span className="type">Tipo: {pub.tipo}</span>
                <span className="ref">ID: {pub.referencia_id}</span>
              </div>
              <p className="content">{pub.contenido}</p>
              <Link to={`/publication/${pub.id}`} className="btn btn-link">
                Ver comentarios →
              </Link>
            </div>
          ))
        ) : (
          <p className="empty-state">No hay publicaciones disponibles</p>
        )}
      </div>

      {!loading && publications.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1}
            className="btn btn-secondary"
          >
            ← Anterior
          </button>
          <span>Página {page}</span>
          <button 
            onClick={() => setPage(page + 1)}
            className="btn btn-secondary"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicationList;
