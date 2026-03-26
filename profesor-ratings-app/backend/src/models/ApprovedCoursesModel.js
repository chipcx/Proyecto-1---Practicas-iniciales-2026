const pool = require('../config/database');

class ApprovedCoursesModel {

  static async getByUser(userId) {
    const query = `
      SELECT c.id, c.codigo, c.nombre, c.creditos, ca.calificacion
      FROM cursos_aprobados ca
      JOIN cursos c ON ca.curso_id = c.id
      WHERE ca.usuario_id = ?
    `;

    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  static async addCourse(userId, cursoId, calificacion) {
    const query = `
      INSERT INTO cursos_aprobados (usuario_id, curso_id, calificacion)
      VALUES (?, ?, ?)
    `;

    await pool.execute(query, [userId, cursoId, calificacion]);
    return { message: 'Curso agregado correctamente' };
  }

  static async deleteCourse(userId, cursoId) {
    const query = `
      DELETE FROM cursos_aprobados
      WHERE usuario_id = ? AND curso_id = ?
    `;

    await pool.execute(query, [userId, cursoId]);
    return { message: 'Curso eliminado' };
  }
}

module.exports = ApprovedCoursesModel;