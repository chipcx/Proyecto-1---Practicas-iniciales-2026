const pool = require('./database');

const migrate = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT PRIMARY KEY AUTO_INCREMENT,
      registro_academico VARCHAR(10) UNIQUE NOT NULL,
      nombres VARCHAR(100) NOT NULL,
      apellidos VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      reset_token VARCHAR(255) DEFAULT NULL,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS catedraticos (
      id INT PRIMARY KEY AUTO_INCREMENT,
      nombre VARCHAR(150) NOT NULL,
      apellido VARCHAR(150) NOT NULL,
      email VARCHAR(100),
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS cursos (
      id INT PRIMARY KEY AUTO_INCREMENT,
      codigo VARCHAR(20) UNIQUE NOT NULL,
      nombre VARCHAR(150) NOT NULL,
      descripcion TEXT,
      creditos INT,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS curso_catedratico (
      id INT PRIMARY KEY AUTO_INCREMENT,
      curso_id INT NOT NULL,
      catedratico_id INT NOT NULL,
      semestre VARCHAR(20),
      anno INT,
      FOREIGN KEY (curso_id) REFERENCES cursos(id),
      FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id)
    )`,
    `CREATE TABLE IF NOT EXISTS publicaciones (
      id INT PRIMARY KEY AUTO_INCREMENT,
      usuario_id INT NOT NULL,
      tipo ENUM('catedratico', 'curso') NOT NULL,
      referencia_id INT NOT NULL,
      contenido TEXT NOT NULL,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      INDEX idx_tipo_referencia (tipo, referencia_id),
      INDEX idx_fecha (fecha_creacion)
    )`,
    `CREATE TABLE IF NOT EXISTS comentarios (
      id INT PRIMARY KEY AUTO_INCREMENT,
      publicacion_id INT NOT NULL,
      usuario_id INT NOT NULL,
      contenido TEXT NOT NULL,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      INDEX idx_publicacion (publicacion_id)
    )`,
    `CREATE TABLE IF NOT EXISTS cursos_aprobados (
      id INT PRIMARY KEY AUTO_INCREMENT,
      usuario_id INT NOT NULL,
      curso_id INT NOT NULL,
      calificacion DECIMAL(5,2),
      fecha_aprobacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (curso_id) REFERENCES cursos(id),
      UNIQUE KEY unique_usuario_curso (usuario_id, curso_id)
    )`,
    `INSERT IGNORE INTO catedraticos (nombre, apellido, email) VALUES
      ('Herman', 'Véliz', 'hvl@usac.edu.gt'),
      ('Juan', 'Pérez', 'jperez@usac.edu.gt'),
      ('María', 'García', 'mgarcia@usac.edu.gt'),
      ('Carlos', 'López', 'clopez@usac.edu.gt')`,
    `INSERT IGNORE INTO cursos (codigo, nombre, descripcion, creditos) VALUES
      ('IPC2', 'Introducción a la Programación en C', 'Curso introductorio de programación', 4),
      ('SO1', 'Sistemas Operativos 1', 'Conceptos básicos de sistemas operativos', 4),
      ('ED1', 'Estructuras de Datos 1', 'Estructuras de datos fundamentales', 4),
      ('BD1', 'Bases de Datos 1', 'Introducción a bases de datos relacionales', 4),
      ('LFP', 'Lenguajes Formales y Programación', 'Teoría de compiladores', 4)`,
    `INSERT INTO usuarios (registro_academico, nombres, apellidos, email, password_hash)
      SELECT '202100001', 'Ana', 'Lopez', 'ana.sis@usac.edu.gt', '$2a$10$zenLQnuvtxu4rsDcYFjN8ugqd61N.ibyvJXUE.eb9iOEOtr5KNHdO'
      WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'ana.sis@usac.edu.gt')`,
    `INSERT INTO usuarios (registro_academico, nombres, apellidos, email, password_hash)
      SELECT '202100002', 'Luis', 'Perez', 'luis.dev@usac.edu.gt', '$2a$10$zenLQnuvtxu4rsDcYFjN8ugqd61N.ibyvJXUE.eb9iOEOtr5KNHdO'
      WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'luis.dev@usac.edu.gt')`,
    `INSERT INTO usuarios (registro_academico, nombres, apellidos, email, password_hash)
      SELECT '202100003', 'Maria', 'Garcia', 'maria.code@usac.edu.gt', '$2a$10$zenLQnuvtxu4rsDcYFjN8ugqd61N.ibyvJXUE.eb9iOEOtr5KNHdO'
      WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'maria.code@usac.edu.gt')`,
    `INSERT INTO publicaciones (usuario_id, tipo, referencia_id, contenido)
      SELECT u.id, 'curso', 1, 'IPC2 me parecio muy util para reforzar logica. El catedratico explica claro y deja tareas semanales.'
      FROM usuarios u WHERE u.email = 'ana.sis@usac.edu.gt'
      AND NOT EXISTS (SELECT 1 FROM publicaciones p WHERE p.usuario_id = u.id AND p.tipo = 'curso' AND p.referencia_id = 1)`,
    `INSERT INTO publicaciones (usuario_id, tipo, referencia_id, contenido)
      SELECT u.id, 'catedratico', 2, 'El catedratico es exigente pero justo. Recomiendo llevar el curso con buen tiempo para practicar.'
      FROM usuarios u WHERE u.email = 'luis.dev@usac.edu.gt'
      AND NOT EXISTS (SELECT 1 FROM publicaciones p WHERE p.usuario_id = u.id AND p.tipo = 'catedratico' AND p.referencia_id = 2)`,
    `INSERT INTO publicaciones (usuario_id, tipo, referencia_id, contenido)
      SELECT u.id, 'curso', 4, 'BD1 tiene bastante laboratorio. Si ya manejas SQL basico, se siente mas llevadero.'
      FROM usuarios u WHERE u.email = 'maria.code@usac.edu.gt'
      AND NOT EXISTS (SELECT 1 FROM publicaciones p WHERE p.usuario_id = u.id AND p.tipo = 'curso' AND p.referencia_id = 4)`
  ];

  // Idempotent ALTER TABLE: add reset_token column if missing
  try {
    await pool.execute(`ALTER TABLE usuarios ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL`);
  } catch (e) {
    // ER_DUP_FIELDNAME (1060) means column already exists — safe to ignore
    if (e.errno !== 1060) throw e;
  }

  for (const query of queries) {
    await pool.execute(query);
  }
  console.log('✅ Migración completada — tablas listas');
};

module.exports = migrate;