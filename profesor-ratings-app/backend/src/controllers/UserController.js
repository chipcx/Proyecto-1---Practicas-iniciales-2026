const User = require('../models/User');

const UserController = {
  // GET /api/users/by-registro/:registro
  async getUserByRegistro(req, res) {
    try {
      const { registro } = req.params;
      const user = await User.findByRegistroAcademico(registro);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error al obtener usuario por registro:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  },

  // GET /api/users/:id
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  },

  // PUT /api/users/:id
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { nombres, apellidos, email } = req.body;

      // Validar que el token pertenezca al usuario que se intenta actualizar
      if (req.userId !== parseInt(id, 10)) {
        return res.status(403).json({ message: 'No tienes permisos para editar este perfil' });
      }

      // Validar campos obligatorios
      if (!nombres || !apellidos || !email) {
        return res.status(400).json({ message: 'Nombres, apellidos y email son obligatorios' });
      }

      // Verificar si el email ya existe y pertenece a otro usuario
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== parseInt(id, 10)) {
        return res.status(409).json({ message: 'El correo electrónico ya está en uso por otro usuario' });
      }

      // Actualizar usuario
      const updatedUser = await User.update(id, { nombres, apellidos, email });

      res.json(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
};

module.exports = UserController;
