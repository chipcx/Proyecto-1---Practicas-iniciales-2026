const pool = require('../config/database');

class PublicationModel {
  static async create(data) {
    const { usuario_id, tipo, referencia_id, contenido } = data;
    
    const query = `
      INSERT INTO publicaciones (usuario_id, tipo, referencia_id, contenido, fecha_creacion)
      VALUES (?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute(query, [
      usuario_id,
      tipo, // 'catedratico' o 'curso'
      referencia_id,
      contenido
    ]);

    return { id: result.insertId, ...data };
  }

  static async findAll(limit = 20, offset = 0) {
    const safeLimit = Number(limit);
    const safeOffset = Number(offset);

    if (!Number.isInteger(safeLimit) || !Number.isInteger(safeOffset) || safeLimit < 1 || safeOffset < 0) {
      throw new Error('Parámetros de paginación inválidos');
    }

    const query = `
      SELECT p.*, u.nombres, u.apellidos, u.registro_academico
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha_creacion DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `;

    const [rows] = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, u.nombres, u.apellidos
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
    `;

    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findByFilter(tipo, referencia_id) {
    let query = `
      SELECT p.*, u.nombres, u.apellidos, u.registro_academico
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    if (referencia_id) {
      query += ' AND referencia_id = ?';
      params.push(referencia_id);
    }

    query += ' ORDER BY fecha_creacion DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }
}

module.exports = PublicationModel;
