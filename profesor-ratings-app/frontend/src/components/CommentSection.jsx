import React, { useEffect, useState } from 'react';
import CommentService from '../services/commentService';
import './CommentSection.css';

const CommentSection = ({ publicationId, comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await CommentService.createComment({
        publicacion_id: publicationId,
        contenido: newComment
      });

      setComments([...comments, response.data.comment]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agregar comentario');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('¿Eliminar este comentario?')) return;

    try {
      await CommentService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      setError('Error al eliminar comentario');
    }
  };

  return (
    <div className="comment-section">
      <h3>Comentarios ({comments.length})</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Agrega tu comentario..."
          rows="3"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !newComment.trim()}
          className="btn btn-primary"
        >
          {loading ? 'Enviando...' : 'Comentar'}
        </button>
      </form>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.nombres} {comment.apellidos}</strong>
                <span className="date">
                  {new Date(comment.fecha_creacion).toLocaleDateString('es-ES')}
                </span>
              </div>
              <p className="comment-content">{comment.contenido}</p>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="btn btn-link btn-sm"
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p className="empty-state">Aún no hay comentarios</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
