const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

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
          apellidos: user.apellidos
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

  //  Nuevo: flujo de recuperación de contraseña
  static async forgotPassword(req, res) {
    try {
      const { registro_academico, email } = req.body;

      if (!registro_academico || !email) {
        return res.status(400).json({ error: 'Registro académico y email requeridos' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user || user.registro_academico !== registro_academico) {
        return res.status(400).json({ error: 'Datos incorrectos' });
      }

      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      await UserModel.updateResetToken(user.id, resetToken);

      // Aquí normalmente enviarías un correo con el link
      res.json({ message: 'Se envió un enlace de recuperación al correo registrado' });
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      res.status(500).json({ error: 'Error al procesar solicitud' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, nuevaContraseña } = req.body;
      if (!token || !nuevaContraseña) {
        return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.id);

      if (!user || user.reset_token !== token) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }

      const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
      await UserModel.updatePassword(user.id, hashedPassword);
      await UserModel.updateResetToken(user.id, null);

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error en resetPassword:', error);
      res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
  }
}

module.exports = AuthController;
