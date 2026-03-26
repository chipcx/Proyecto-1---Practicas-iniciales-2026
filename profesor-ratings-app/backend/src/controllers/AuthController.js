const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const UserModel = require('../models/User');

class AuthController {
  static async register(req, res) {
    try {
      const { registro_academico, nombres, apellidos, email, password } = req.body;

      // Validaciones básicas
      if (!registro_academico || !nombres || !apellidos || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      // Verificar si el usuario ya existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
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

      // Verificar contraseña
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({ error: 'Email o contraseña incorrectos' });
      }

      // Generar token
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
}

module.exports = AuthController;
