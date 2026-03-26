const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const UserModel = require('../models/User');

class AuthController {
  static async register(req, res) {
    try {
      const { registro_academico, nombres, apellidos, email, password } = req.body;

      if (!registro_academico || !nombres || !apellidos || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        registro_academico,
        nombres,
        apellidos,
        email,
        password_hash: hashedPassword
      });

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          nombres: user.nombres
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'Email o contraseña incorrectos' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ error: 'Email o contraseña incorrectos' });
      }

      const token = generateToken(user.id);

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          email: user.email,
          nombres: user.nombres,
          apellidos: user.apellidos,
          registro_academico: user.registro_academico
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en el login' });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuario actual' });
    }
  }

  // Flujo simplificado: verificar identidad con registro + email
  static async forgotPassword(req, res) {
    try {
      const { registro_academico, email } = req.body;

      if (!registro_academico || !email) {
        return res.status(400).json({ error: 'Registro académico y email requeridos' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user || user.registro_academico !== registro_academico) {
        return res.status(400).json({ error: 'Datos incorrectos. Verifique su registro académico y email.' });
      }

      // Identidad verificada — el frontend mostrará el formulario de nueva contraseña
      res.json({ message: 'Usuario verificado. Puede establecer su nueva contraseña.' });
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      res.status(500).json({ error: 'Error al procesar solicitud' });
    }
  }

  // Restablecer contraseña directamente con verificación de identidad
  static async resetPassword(req, res) {
    try {
      const { registro_academico, email, newPassword } = req.body;

      if (!registro_academico || !email || !newPassword) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user || user.registro_academico !== registro_academico) {
        return res.status(400).json({ error: 'Datos incorrectos' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(user.id, hashedPassword);

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error en resetPassword:', error);
      res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
  }
}

module.exports = AuthController;
