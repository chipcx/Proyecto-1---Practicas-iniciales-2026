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
      tipo,
      referencia_id,
      contenido
    ]);

    return { id: result.insertId, ...data };
  }

  static async findAll(limit = 20, offset = 0, filters = {}) {
    const safeLimit = Number(limit);
    const safeOffset = Number(offset);

    if (!Number.isInteger(safeLimit) || !Number.isInteger(safeOffset) || safeLimit < 1 || safeOffset < 0) {
      throw new Error('Parámetros de paginación inválidos');
    }

    let query = `
      SELECT p.*, u.nombres, u.apellidos, u.registro_academico
    `;
    const params = [];
    let joins = 'JOIN usuarios u ON p.usuario_id = u.id';
    let where = ' WHERE 1=1';

    // Add course/professor name to results based on tipo
    if (filters.curso_nombre) {
      joins += ' LEFT JOIN cursos c ON p.referencia_id = c.id AND p.tipo = \'curso\'';
      where += ' AND p.tipo = \'curso\' AND c.nombre LIKE ?';
      params.push(`%${filters.curso_nombre}%`);
      query += ', c.nombre AS nombre_referencia';
    } else if (filters.catedratico_nombre) {
      joins += ' LEFT JOIN catedraticos cat ON p.referencia_id = cat.id AND p.tipo = \'catedratico\'';
      where += ' AND p.tipo = \'catedratico\' AND CONCAT(cat.nombre, \' \', cat.apellido) LIKE ?';
      params.push(`%${filters.catedratico_nombre}%`);
      query += ', CONCAT(cat.nombre, \' \', cat.apellido) AS nombre_referencia';
    } else {
      // Always try to resolve the reference name
      joins += ` LEFT JOIN cursos c ON p.referencia_id = c.id AND p.tipo = 'curso'
                 LEFT JOIN catedraticos cat ON p.referencia_id = cat.id AND p.tipo = 'catedratico'`;
      query += ', CASE WHEN p.tipo = \'curso\' THEN c.nombre ELSE CONCAT(cat.nombre, \' \', cat.apellido) END AS nombre_referencia';
    }

    if (filters.tipo) {
      where += ' AND p.tipo = ?';
      params.push(filters.tipo);
    }

    if (filters.referencia_id) {
      where += ' AND p.referencia_id = ?';
      params.push(filters.referencia_id);
    }

    query += ` FROM publicaciones p ${joins} ${where} ORDER BY p.fecha_creacion DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, u.nombres, u.apellidos,
        CASE WHEN p.tipo = 'curso' THEN c.nombre
             ELSE CONCAT(cat.nombre, ' ', cat.apellido) END AS nombre_referencia
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN cursos c ON p.referencia_id = c.id AND p.tipo = 'curso'
      LEFT JOIN catedraticos cat ON p.referencia_id = cat.id AND p.tipo = 'catedratico'
      WHERE p.id = ?
    `;

    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findByFilter(filters = {}) {
    let query = `
      SELECT p.*, u.nombres, u.apellidos, u.registro_academico
    `;
    const params = [];
    let joins = 'JOIN usuarios u ON p.usuario_id = u.id';
    let where = ' WHERE 1=1';

    if (filters.curso_nombre) {
      joins += ' LEFT JOIN cursos c ON p.referencia_id = c.id AND p.tipo = \'curso\'';
      where += ' AND p.tipo = \'curso\' AND c.nombre LIKE ?';
      params.push(`%${filters.curso_nombre}%`);
      query += ', c.nombre AS nombre_referencia';
    } else if (filters.catedratico_nombre) {
      joins += ' LEFT JOIN catedraticos cat ON p.referencia_id = cat.id AND p.tipo = \'catedratico\'';
      where += ' AND p.tipo = \'catedratico\' AND CONCAT(cat.nombre, \' \', cat.apellido) LIKE ?';
      params.push(`%${filters.catedratico_nombre}%`);
      query += ', CONCAT(cat.nombre, \' \', cat.apellido) AS nombre_referencia';
    } else {
      joins += ` LEFT JOIN cursos c ON p.referencia_id = c.id AND p.tipo = 'curso'
                 LEFT JOIN catedraticos cat ON p.referencia_id = cat.id AND p.tipo = 'catedratico'`;
      query += ', CASE WHEN p.tipo = \'curso\' THEN c.nombre ELSE CONCAT(cat.nombre, \' \', cat.apellido) END AS nombre_referencia';
    }

    if (filters.tipo) {
      where += ' AND p.tipo = ?';
      params.push(filters.tipo);
    }

    if (filters.referencia_id) {
      where += ' AND p.referencia_id = ?';
      params.push(filters.referencia_id);
    }

    query += ` FROM publicaciones p ${joins} ${where} ORDER BY p.fecha_creacion DESC`;

    const [rows] = await pool.execute(query, params);
    return rows;
  }
}

module.exports = PublicationModel;
