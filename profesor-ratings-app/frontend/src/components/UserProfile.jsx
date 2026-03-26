import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/userService';
import './UserProfile.css';
import courseService from '../services/courseService';

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
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [calificacion, setCalificacion] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProfile();
  }, [registro]);

  useEffect(() => {
    if (profileData) {
      fetchCourses();
      fetchAllCourses();
    }
  }, [profileData]);

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

  // Permite manejar los cambios en los campos del formulario de edición del perfil
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //Permite obtener la lista de cursos aprobados del usuario para mostrarlos en su perfil
  const fetchCourses = async () => {
    try {
      const data = await courseService.getApprovedCourses(profileData.id);
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Permite obtener la lista de todos los cursos disponibles para mostrarlos en el formulario de agregar curso aprobado
  const fetchAllCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setAllCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Agregar curso aprobado
  const handleAddCourse = async () => {
    if (!selectedCourse) return;

    if(calificacion){
      const nota = parseInt(calificacion,10);
    
    if(nota <61){
      setError('la nota deber se 61 para considerar el cuerso como aprobado');
      return;
    }
  }
  
     
    try {
      await courseService.addApprovedCourse(profileData.id, {
        curso_id: selectedCourse,
        calificacion: calificacion || null
      });

      setSelectedCourse('');
      setCalificacion('');
      setShowAdd(false);
      fetchCourses();

    } catch (err) {
      setError(err.error || 'Error al agregar curso');
    }
  };

  // Eliminar curso aprobado
  const handleDeleteCourse = async (courseId) => {
    try {
      await courseService.deleteApprovedCourse(profileData.id, courseId);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  

  // Permite manejar la actualización del perfil del usuario, validando que los campos no estén vacíos y actualizando la información tanto en el estado local como en el almacenamiento local si es el propio perfil
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

  const totalCreditos = courses.reduce((acc, c) => acc + (c.creditos || 0), 0);

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

      {/* 🎓 CURSOS APROBADOS */}
      <div className="courses-section">
        <h3>📚 Cursos Aprobados</h3>

        <div className="credits-box">
          Total de créditos: <strong>{totalCreditos}</strong>
        </div>

        {courses.length === 0 ? (
          <p className="no-courses">No hay cursos registrados.</p>
        ) : (
          <div className="course-list">
            {courses.map(course => (
              <div key={course.id} className="course-card">
                <div>
                  <strong>{course.nombre}</strong>
                  <p>{course.creditos} créditos</p>
                  {course.calificacion && <span>Nota: {course.calificacion}</span>}
                </div>

                {isOwnProfile && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {isOwnProfile && (
          <div className="add-course">
            {!showAdd ? (
              <button className="btn-add" onClick={() => setShowAdd(true)}>
                ➕ Agregar curso
              </button>
            ) : (
              <div className="add-form">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">Selecciona un curso</option>
                  {allCourses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Nota (opcional)"
                  value={calificacion}
                  onChange={(e) => setCalificacion(e.target.value)}
                />

                <div className="actions">
                  <button className="btn-save" onClick={handleAddCourse}>
                    Guardar
                  </button>
                  <button className="btn-cancel" onClick={() => setShowAdd(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;