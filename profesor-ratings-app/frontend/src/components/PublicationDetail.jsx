import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PublicationService from '../services/publicationService';
import CommentSection from './CommentSection';

const PublicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [publication, setPublication] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublication = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await PublicationService.getPublicationById(id);
        setPublication(response.data.publication);
        setComments(response.data.comments || []);
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la publicacion');
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  if (loading) {
    return <div className="alert alert-info">Cargando publicacion...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-danger">{error}</div>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          Volver
        </button>
      </div>
    );
  }

  if (!publication) {
    return (
      <div>
        <div className="alert alert-warning">Publicacion no encontrada</div>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <section>
      <div className="publication-card" style={{ marginBottom: '1rem' }}>
        <div className="publication-header">
          <h4>{publication.nombres} {publication.apellidos}</h4>
          <span className="date">{new Date(publication.fecha_creacion).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="publication-meta">
          <span className="type">Tipo: {publication.tipo}</span>
          <span className="ref">ID: {publication.referencia_id}</span>
        </div>
        <p className="content">{publication.contenido}</p>
      </div>

      <CommentSection publicationId={publication.id} comments={comments} />

      <div style={{ marginTop: '1rem' }}>
        <Link to="/" className="btn btn-secondary">Volver al listado</Link>
      </div>
    </section>
  );
};

export default PublicationDetail;
