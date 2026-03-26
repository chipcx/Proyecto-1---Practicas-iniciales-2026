const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');

// Obtener usuario por registro académico
router.get('/by-registro/:registro', authMiddleware, UserController.getUserByRegistro);

// Obtener usuario por ID
router.get('/:id', authMiddleware, UserController.getUserById);

// Actualizar perfil de usuario
router.put('/:id', authMiddleware, UserController.updateUser);

module.exports = router;
