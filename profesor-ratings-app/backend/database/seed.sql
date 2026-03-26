USE profesor_ratings;

-- Usuarios de prueba (password para todos: 123456)
INSERT INTO usuarios (registro_academico, nombres, apellidos, email, password_hash)
SELECT '202100001', 'Ana', 'Lopez', 'ana.sis@usac.edu.gt', '$2a$10$zenLQnuvtxu4rsDcYFjN8ugqd61N.ibyvJXUE.eb9iOEOtr5KNHdO'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'ana.sis@usac.edu.gt');

INSERT INTO usuarios (registro_academico, nombres, apellidos, email, password_hash)
SELECT '202100002', 'Luis', 'Perez', 'luis.dev@usac.edu.gt', '$2a$10$zenLQnuvtxu4rsDcYFjN8ugqd61N.ibyvJXUE.eb9iOEOtr5KNHdO'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'luis.dev@usac.edu.gt');

INSERT INTO usuarios (registro_academico, nombres, apellidos, email, password_hash)
SELECT '202100003', 'Maria', 'Garcia', 'maria.code@usac.edu.gt', '$2a$10$zenLQnuvtxu4rsDcYFjN8ugqd61N.ibyvJXUE.eb9iOEOtr5KNHdO'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'maria.code@usac.edu.gt');

-- Publicaciones de prueba
INSERT INTO publicaciones (usuario_id, tipo, referencia_id, contenido, fecha_creacion)
SELECT u.id, 'curso', 1, 'IPC2 me parecio muy util para reforzar logica. El catedratico explica claro y deja tareas semanales.', NOW() - INTERVAL 5 DAY
FROM usuarios u
WHERE u.email = 'ana.sis@usac.edu.gt'
AND NOT EXISTS (
  SELECT 1 FROM publicaciones p
  WHERE p.usuario_id = u.id AND p.tipo = 'curso' AND p.referencia_id = 1
);

INSERT INTO publicaciones (usuario_id, tipo, referencia_id, contenido, fecha_creacion)
SELECT u.id, 'catedratico', 2, 'El catedratico es exigente pero justo. Recomiendo llevar el curso con buen tiempo para practicar.', NOW() - INTERVAL 3 DAY
FROM usuarios u
WHERE u.email = 'luis.dev@usac.edu.gt'
AND NOT EXISTS (
  SELECT 1 FROM publicaciones p
  WHERE p.usuario_id = u.id AND p.tipo = 'catedratico' AND p.referencia_id = 2
);

INSERT INTO publicaciones (usuario_id, tipo, referencia_id, contenido, fecha_creacion)
SELECT u.id, 'curso', 4, 'BD1 tiene bastante laboratorio. Si ya manejas SQL basico, se siente mas llevadero.', NOW() - INTERVAL 1 DAY
FROM usuarios u
WHERE u.email = 'maria.code@usac.edu.gt'
AND NOT EXISTS (
  SELECT 1 FROM publicaciones p
  WHERE p.usuario_id = u.id AND p.tipo = 'curso' AND p.referencia_id = 4
);

-- Comentarios de prueba
INSERT INTO comentarios (publicacion_id, usuario_id, contenido, fecha_creacion)
SELECT p.id, u.id, 'Totalmente de acuerdo, ese curso ayuda bastante para siguientes areas.', NOW() - INTERVAL 2 DAY
FROM publicaciones p
JOIN usuarios u ON u.email = 'luis.dev@usac.edu.gt'
WHERE p.tipo = 'curso' AND p.referencia_id = 1
AND NOT EXISTS (
  SELECT 1 FROM comentarios c
  WHERE c.publicacion_id = p.id AND c.usuario_id = u.id
);

INSERT INTO comentarios (publicacion_id, usuario_id, contenido, fecha_creacion)
SELECT p.id, u.id, 'Yo lo lleve el semestre pasado y la evaluacion fue bastante practica.', NOW() - INTERVAL 1 DAY
FROM publicaciones p
JOIN usuarios u ON u.email = 'ana.sis@usac.edu.gt'
WHERE p.tipo = 'catedratico' AND p.referencia_id = 2
AND NOT EXISTS (
  SELECT 1 FROM comentarios c
  WHERE c.publicacion_id = p.id AND c.usuario_id = u.id
);

-- Cursos aprobados de prueba
INSERT INTO cursos_aprobados (usuario_id, curso_id, calificacion)
SELECT u.id, 1, 85.00
FROM usuarios u
WHERE u.email = 'ana.sis@usac.edu.gt'
AND NOT EXISTS (
  SELECT 1 FROM cursos_aprobados ca WHERE ca.usuario_id = u.id AND ca.curso_id = 1
);

INSERT INTO cursos_aprobados (usuario_id, curso_id, calificacion)
SELECT u.id, 3, 79.00
FROM usuarios u
WHERE u.email = 'ana.sis@usac.edu.gt'
AND NOT EXISTS (
  SELECT 1 FROM cursos_aprobados ca WHERE ca.usuario_id = u.id AND ca.curso_id = 3
);

INSERT INTO cursos_aprobados (usuario_id, curso_id, calificacion)
SELECT u.id, 2, 90.00
FROM usuarios u
WHERE u.email = 'luis.dev@usac.edu.gt'
AND NOT EXISTS (
  SELECT 1 FROM cursos_aprobados ca WHERE ca.usuario_id = u.id AND ca.curso_id = 2
);
