import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicationService from '../services/publicationService';
import './PublicationList.css';

const PublicationList = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Filter state
  const [filterType, setFilterType] = useState('');
  const [cursoNombre, setCursoNombre] = useState('');
  const [catedraticoNombre, setCatedraticoNombre] = useState('');

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const filters = {};
      if (filterType) filters.tipo = filterType;
      if (cursoNombre.trim()) filters.curso_nombre = cursoNombre.trim();
      if (catedraticoNombre.trim()) filters.catedratico_nombre = catedraticoNombre.trim();

      const response = await PublicationService.getAllPublications(page, 20, filters);
      setPublications(response.data.publications || []);
    } catch (err) {
      setError('Error al cargar publicaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filterType, cursoNombre, catedraticoNombre]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleClear = () => {
    setFilterType('');
    setCursoNombre('');
    setCatedraticoNombre('');
    setPage(1);
  };

  return (
    <div className="publication-list">
      <div className="actions-bar">
        <h2>📋 Publicaciones</h2>
        <button onClick={() => navigate('/create')} className="btn btn-primary">
          ✏️ Nueva Publicación
        </button>
      </div>

      <div className="filter-section">
        <form onSubmit={handleFilter}>
          <div className="filter-group">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="curso">📚 Cursos</option>
              <option value="catedratico">👨‍🏫 Catedráticos</option>
            </select>

            <input
              type="text"
              placeholder="Buscar por nombre de curso..."
              value={cursoNombre}
              onChange={(e) => setCursoNombre(e.target.value)}
            />

            <input
              type="text"
              placeholder="Buscar por nombre de catedrático..."
              value={catedraticoNombre}
              onChange={(e) => setCatedraticoNombre(e.target.value)}
            />

            <button type="submit" className="btn btn-primary">Buscar</button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Cargando publicaciones...</div>}

      <div className="publications">
        {!loading && publications.length > 0 ? (
          publications.map(pub => (
            <div key={pub.id} className="publication-card">
              <div className="publication-header">
                <h4>{pub.nombres} {pub.apellidos}</h4>
                <span className="date">
                  {new Date(pub.fecha_creacion).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </span>
              </div>
              <div className="publication-meta">
                <span className="type">
                  {pub.tipo === 'curso' ? '📚' : '👨‍🏫'}{' '}
                  {pub.nombre_referencia || pub.tipo}
                </span>
              </div>
              <p className="content">{pub.contenido}</p>
              <Link to={`/publication/${pub.id}`} className="btn btn-link">
                💬 Ver comentarios →
              </Link>
            </div>
          ))
        ) : (
          !loading && <p className="empty-state">No hay publicaciones que coincidan con tu búsqueda</p>
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
