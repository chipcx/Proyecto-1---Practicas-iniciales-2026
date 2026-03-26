import React, { useState, useEffect } from 'react';
import PublicationService from '../services/publicationService';
import api from '../services/api';
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

  // Data for dropdowns
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cursosRes, catedraticosRes] = await Promise.all([
          api.get('/courses'),
          api.get('/catedraticos')
        ]);
        setCursos(cursosRes.data);
        setCatedraticos(catedraticosRes.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTipoChange = (e) => {
    setFormData({
      ...formData,
      tipo: e.target.value,
      referencia_id: '' // reset selection when changing type
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

  const options = formData.tipo === 'curso' ? cursos : catedraticos;

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
            onChange={handleTipoChange}
            required
          >
            <option value="catedratico">Catedrático</option>
            <option value="curso">Curso</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="referencia_id">
            {formData.tipo === 'catedratico' ? 'Catedrático' : 'Curso'}:
          </label>
          <select
            id="referencia_id"
            name="referencia_id"
            value={formData.referencia_id}
            onChange={handleChange}
            required
          >
            <option value="">
              Selecciona un {formData.tipo === 'catedratico' ? 'catedrático' : 'curso'}
            </option>
            {options.map(item => (
              <option key={item.id} value={item.id}>
                {formData.tipo === 'curso'
                  ? `${item.codigo} - ${item.nombre}`
                  : `${item.nombre} ${item.apellido}`}
              </option>
            ))}
          </select>
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
