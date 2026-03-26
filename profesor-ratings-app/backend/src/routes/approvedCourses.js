const express = require('express');
const router = express.Router();
const ApprovedCoursesModel = require('../models/ApprovedCoursesModel');
const authMiddleware = require('../middlewares/auth');

// Obtener cursos de un usuario
router.get('/:userId', async (req, res) => {
  try {
    const cursos = await ApprovedCoursesModel.getByUser(req.params.userId);
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:userId', authMiddleware, async (req, res) => {
  try {

    // Solo el usuario dueño de los cursos puede agregar
    if (req.userId != req.params.userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { curso_id, calificacion } = req.body;

    await ApprovedCoursesModel.addCourse(
      req.params.userId,
      curso_id,
      calificacion
    );

    res.json({ message: 'Curso agregado' });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El curso ya está agregado' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Eliminar curso aprobado de un usuario
router.delete('/:userId/:cursoId', authMiddleware, async (req, res) => {
  try {

    if (req.userId != req.params.userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await ApprovedCoursesModel.deleteCourse(
      req.params.userId,
      req.params.cursoId
    );

    res.json({ message: 'Curso eliminado' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;