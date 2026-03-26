const express = require('express');
const CommentController = require('../controllers/CommentController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Crear comentario (requiere autenticación)
router.post('/', authMiddleware, CommentController.createComment);

// Eliminar comentario (requiere autenticación)
router.delete('/:id', authMiddleware, CommentController.deleteComment);

module.exports = router;
