import React, { useState } from 'react';
import PublicationService from '../services/publicationService';
import './CreatePublication.css';

const CreatePublication = ({ onPublicationCreated }) => {
  const [formData, setFormData] = useState({
    tipo: 'catedratico',
    referencia_id: '',
    contenido: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await PublicationService.createPublication({
        tipo: formData.tipo,
        referencia_id: parseInt(formData.referencia_id),
        contenido: formData.contenido
      });

      setSuccess('Publicación creada exitosamente');
      setFormData({
        tipo: 'catedratico',
        referencia_id: '',
        contenido: ''
      });

      if (onPublicationCreated) {
        onPublicationCreated();
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear publicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-publication">
      <h2>Crear Publicación</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="catedratico">Catedrático</option>
            <option value="curso">Curso</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="referencia_id">ID de {formData.tipo === 'catedratico' ? 'Catedrático' : 'Curso'}:</label>
          <input
            id="referencia_id"
            type="number"
            name="referencia_id"
            value={formData.referencia_id}
            onChange={handleChange}
            required
            placeholder="Ej: 1, 2, 3..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="contenido">Tu Opinión:</label>
          <textarea
            id="contenido"
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            required
            placeholder="Comparte tu experiencia..."
            rows="6"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};

export default CreatePublication;
