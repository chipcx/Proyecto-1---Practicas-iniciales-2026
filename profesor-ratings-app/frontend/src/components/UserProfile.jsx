import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/userService';
import './UserProfile.css';

const UserProfile = () => {
  const { registro } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nombres: '',
    apellidos: '',
    email: ''
  });

  const loggedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProfile();
  }, [registro]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setIsEditing(false);
      const data = await userService.getUserByRegistro(registro);
      setProfileData(data);
      setEditForm({
        nombres: data.nombres,
        apellidos: data.apellidos,
        email: data.email
      });
    } catch (err) {
      setError(err.message || 'Error al obtener el perfil de usuario');
    } finally {
      setLoading(false);
    }
  };

  const isOwnProfile = profileData && loggedUser && profileData.id === loggedUser.id;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.nombres.trim() || !editForm.apellidos.trim() || !editForm.email.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const updatedUser = await userService.updateUser(profileData.id, editForm);
      setProfileData(updatedUser);
      setSuccess('Perfil actualizado exitosamente');
      setIsEditing(false);
      
      // Update local storage user if it's the own profile
      if (isOwnProfile) {
        localStorage.setItem('user', JSON.stringify({
          ...loggedUser,
          nombres: updatedUser.nombres,
          apellidos: updatedUser.apellidos,
          email: updatedUser.email
        }));
        // Optional: Dispatch event to notify layout (App.jsx) if it relies on localStorage 'user'
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return <div className="loading-message">Cargando perfil...</div>;
  }

  if (error && !profileData) {
    return <div className="error-message">{error}</div>;
  }

  if (!profileData) {
    return <div className="error-message">Usuario no encontrado</div>;
  }

  return (
    <div className="user-profile-container">
      <h2>Perfil de Usuario</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="profile-info">
        <div className="info-group">
          <label>Registro Académico</label>
          <p>{profileData.registro_academico}</p>
        </div>

        <div className="info-group">
          <label>Nombres</label>
          {isEditing ? (
            <input 
              type="text" 
              name="nombres" 
              value={editForm.nombres} 
              onChange={handleInputChange} 
              required 
            />
          ) : (
            <p>{profileData.nombres}</p>
          )}
        </div>

        <div className="info-group">
          <label>Apellidos</label>
          {isEditing ? (
            <input 
              type="text" 
              name="apellidos" 
              value={editForm.apellidos} 
              onChange={handleInputChange} 
              required 
            />
          ) : (
            <p>{profileData.apellidos}</p>
          )}
        </div>

        <div className="info-group">
          <label>Correo Electrónico</label>
          {isEditing ? (
            <input 
              type="email" 
              name="email" 
              value={editForm.email} 
              onChange={handleInputChange} 
              required 
            />
          ) : (
             <p>{profileData.email}</p>
          )}
        </div>

        {isOwnProfile && (
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button type="button" className="btn-cancel" onClick={() => {
                  setIsEditing(false);
                  setError('');
                }}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </>
            ) : (
              <button type="button" className="btn-edit" onClick={() => {
                setIsEditing(true);
                setSuccess('');
                setError('');
              }}>Editar Perfil</button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
