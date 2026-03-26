const CommentModel = require('../models/Comment');

class CommentController {
  static async createComment(req, res) {
    try {
      const { publicacion_id, contenido } = req.body;

      if (!publicacion_id || !contenido) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      const comment = await CommentModel.create({
        publicacion_id,
        usuario_id: req.userId,
        contenido
      });

      res.status(201).json({
        message: 'Comentario creado exitosamente',
        comment
      });
    } catch (error) {
      console.error('Error al crear comentario:', error);
      res.status(500).json({ error: 'Error al crear comentario' });
    }
  }

  static async deleteComment(req, res) {
    try {
      const { id } = req.params;

      await CommentModel.delete(id);

      res.json({ message: 'Comentario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar comentario' });
    }
  }
}

module.exports = CommentController;
