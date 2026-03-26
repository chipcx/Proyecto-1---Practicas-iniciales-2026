-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registro_academico VARCHAR(50) NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  reset_token VARCHAR(255) DEFAULT NULL
);

-- Tabla de cursos
CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  creditos INT NOT NULL
);

-- Datos iniciales de cursos
INSERT INTO cursos (codigo, nombre, descripcion, creditos) VALUES
('IPC2', 'Introducción a la Programación en C', 'Curso introductorio de programación', 4),
('SO1', 'Sistemas Operativos 1', 'Conceptos básicos de sistemas operativos', 4),
('ED1', 'Estructuras de Datos 1', 'Estructuras de datos fundamentales', 4),
('BD1', 'Bases de Datos 1', 'Introducción a bases de datos relacionales', 4),
('LFP', 'Lenguajes Formales y Programación', 'Teoría de compiladores', 4);
