const pool = require('../config/database');

class UserModel {
  static async create(userData) {
    const { registro_academico, nombres, apellidos, email, password_hash } = userData;
    
    const query = `
      INSERT INTO usuarios (registro_academico, nombres, apellidos, email, password_hash, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    try {
      const [result] = await pool.execute(query, [
        registro_academico,
        nombres,
        apellidos,
        email,
        password_hash
      ]);
      return { id: result.insertId, ...userData };
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  }

  static async findByRegistroAcademico(registro_academico) {
    const query = 'SELECT * FROM usuarios WHERE registro_academico = ?';
    const [rows] = await pool.execute(query, [registro_academico]);
    return rows[0] || null;
  }

  static async update(id, userData) {
    const updates = Object.keys(userData)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.values(userData);
    
    const query = `UPDATE usuarios SET ${updates} WHERE id = ?`;
    
    await pool.execute(query, [...values, id]);
    return this.findById(id);
  }

  // 🔹 Nuevo: guardar token de recuperación
  static async updateResetToken(id, token) {
    const query = 'UPDATE usuarios SET reset_token = ? WHERE id = ?';
    await pool.execute(query, [token, id]);
  }

  // 🔹 Nuevo: actualizar contraseña
  static async updatePassword(id, newHash) {
    const query = 'UPDATE usuarios SET password_hash = ? WHERE id = ?';
    await pool.execute(query, [newHash, id]);
  }
}

module.exports = UserModel;
