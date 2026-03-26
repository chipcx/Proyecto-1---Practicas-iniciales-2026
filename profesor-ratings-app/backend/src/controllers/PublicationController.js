const PublicationModel = require('../models/Publication');
const CommentModel = require('../models/Comment');

class PublicationController {
  static async createPublication(req, res) {
    try {
      const { tipo, referencia_id, contenido } = req.body;

      if (!tipo || !referencia_id || !contenido) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      if (!['catedratico', 'curso'].includes(tipo)) {
        return res.status(400).json({ error: 'Tipo inválido' });
      }

      const publication = await PublicationModel.create({
        usuario_id: req.userId,
        tipo,
        referencia_id,
        contenido
      });

      res.status(201).json({
        message: 'Publicación creada exitosamente',
        publication
      });
    } catch (error) {
      console.error('Error al crear publicación:', error);
      res.status(500).json({ error: 'Error al crear publicación' });
    }
  }

  static async getPublications(req, res) {
    try {
      const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const offset = (page - 1) * limit;

      // Support advanced filters on the main endpoint too
      const filters = {};
      if (req.query.tipo) filters.tipo = req.query.tipo;
      if (req.query.referencia_id) filters.referencia_id = req.query.referencia_id;
      if (req.query.curso_nombre) filters.curso_nombre = req.query.curso_nombre;
      if (req.query.catedratico_nombre) filters.catedratico_nombre = req.query.catedratico_nombre;

      const publications = await PublicationModel.findAll(limit, offset, filters);

      res.json({
        publications,
        pagination: { page, limit }
      });
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      res.status(500).json({ error: 'Error al obtener publicaciones' });
    }
  }

  static async getPublicationById(req, res) {
    try {
      const { id } = req.params;
      const publication = await PublicationModel.findById(id);

      if (!publication) {
        return res.status(404).json({ error: 'Publicación no encontrada' });
      }

      // Obtener comentarios
      const comments = await CommentModel.findByPublicationId(id);

      res.json({
        publication,
        comments
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener publicación' });
    }
  }

  static async filterPublications(req, res) {
    try {
      const filters = {};
      if (req.query.tipo) filters.tipo = req.query.tipo;
      if (req.query.referencia_id) filters.referencia_id = req.query.referencia_id;
      if (req.query.curso_nombre) filters.curso_nombre = req.query.curso_nombre;
      if (req.query.catedratico_nombre) filters.catedratico_nombre = req.query.catedratico_nombre;

      const publications = await PublicationModel.findByFilter(filters);

      res.json({
        publications,
        filters
      });
    } catch (error) {
      console.error('Error al filtrar publicaciones:', error);
      res.status(500).json({ error: 'Error al filtrar publicaciones' });
    }
  }
}

module.exports = PublicationController;
