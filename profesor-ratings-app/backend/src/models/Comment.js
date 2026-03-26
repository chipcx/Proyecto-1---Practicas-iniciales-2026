const pool = require('../config/database');

class CommentModel {
  static async create(data) {
    const { publicacion_id, usuario_id, contenido } = data;
    
    const query = `
      INSERT INTO comentarios (publicacion_id, usuario_id, contenido, fecha_creacion)
      VALUES (?, ?, ?, NOW())
    `;

    const [result] = await pool.execute(query, [
      publicacion_id,
      usuario_id,
      contenido
    ]);

    return { id: result.insertId, ...data };
  }

  static async findByPublicationId(publicacionId) {
    const query = `
      SELECT c.*, u.nombres, u.apellidos
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.publicacion_id = ?
      ORDER BY c.fecha_creacion ASC
    `;

    const [rows] = await pool.execute(query, [publicacionId]);
    return rows;
  }

  static async delete(id) {
    const query = 'DELETE FROM comentarios WHERE id = ?';
    await pool.execute(query, [id]);
  }
}

module.exports = CommentModel;
