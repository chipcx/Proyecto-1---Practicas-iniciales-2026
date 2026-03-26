const express = require('express');
const PublicationController = require('../controllers/PublicationController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Obtener todas las publicaciones
router.get('/', PublicationController.getPublications);

// Filtrar publicaciones
router.get('/filter', PublicationController.filterPublications);

// Crear publicación (requiere autenticación)
router.post('/', authMiddleware, PublicationController.createPublication);

// Obtener publicación por ID con sus comentarios
router.get('/:id', PublicationController.getPublicationById);

module.exports = router;
