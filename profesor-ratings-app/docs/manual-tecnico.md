# Manual Técnico - Aplicación de Rating de Catedráticos

## Índice
1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Backend](#estructura-del-backend)
4. [Endpoints de la API](#endpoints-de-la-api)
5. [Base de Datos](#base-de-datos)
6. [Instalación para Desarrolladores](#instalación-para-desarrolladores)
7. [Guía de Desarrollo](#guía-de-desarrollo)
8. [Deployment](#deployment)

---

## Arquitectura del Sistema

```
┌─────────────────┐
│   Frontend      │  React.js (SPA)
│  (Puerto 3000)  │
└────────┬────────┘
         │ HTTP/AJAX
         │
┌────────▼────────────────────┐
│   Backend REST API          │
│   Express.js (Puerto 5000)  │
└────────┬────────────────────┘
         │ SQL
         │
┌────────▼────────────────────┐
│   MySQL Database            │
│   (Puerto 3306)             │
└─────────────────────────────┘
```

**Patrón**: Cliente-Servidor (MVC)
**Comunicación**: RESTful API con JSON
**Autenticación**: JWT (JSON Web Tokens)

---

## Stack Tecnológico

### Frontend
- **React.js 18.2**: Librería para UI
- **React Router 6**: Enrutamiento SPA
- **Axios**: Cliente HTTP
- **CSS3**: Estilos
- **Bootstrap 5**: Framework CSS (opcional)

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web minimalista
- **MySQL2**: Driver para MySQL
- **bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Generación y validación de JWT
- **express-validator**: Validación de datos
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Gestión de variables de entorno

### Base de Datos
- **MySQL 8.0+**: SGBD relacional
- **Charset UTF-8**: Soporte de caracteres especiales

---

## Estructura del Backend

```
backend/
├── src/
│   ├── app.js                    # Configuración de Express
│   ├── config/
│   │   └── database.js           # Conexión a MySQL
│   ├── controllers/
│   │   ├── AuthController.js     # Lógica de autenticación
│   │   ├── PublicationController.js
│   │   └── CommentController.js
│   ├── routes/
│   │   ├── auth.js              # Rutas de auth
│   │   ├── publications.js      # Rutas de publicaciones
│   │   └── comments.js          # Rutas de comentarios
│   ├── models/
│   │   ├── User.js              # Modelo de usuarios
│   │   ├── Publication.js       # Modelo de publicaciones
│   │   └── Comment.js           # Modelo de comentarios
│   ├── middlewares/
│   │   └── auth.js              # Middleware de autenticación
│   └── utils/
│       └── jwt.js               # Funciones JWT
├── database/
│   └── schema.sql               # Script de creación de BD
├── server.js                    # Punto de entrada
├── package.json
├── .env.example
└── .gitignore
```

---

## Endpoints de la API

### Base URL
```
http://localhost:5000/api
```

### 1. Autenticación

#### Registro
```
POST /auth/register
Content-Type: application/json

{
  "registro_academico": "202101234",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "email": "juan@example.com",
  "password": "contraseña123"
}

Response (201):
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "nombres": "Juan"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "contraseña123"
}

Response (200):
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "nombres": "Juan",
    "apellidos": "Pérez"
  }
}
```

#### Obtener Usuario Actual
```
GET /auth/me
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "registro_academico": "202101234",
  "nombres": "Juan",
  "apellidos": "Pérez",
  "email": "juan@example.com",
  "fecha_creacion": "2026-03-15T10:30:00Z"
}
```

### 2. Publicaciones

#### Obtener todas las publicaciones
```
GET /publications?page=1&limit=20

Response (200):
{
  "publications": [
    {
      "id": 1,
      "usuario_id": 1,
      "tipo": "catedratico",
      "referencia_id": 1,
      "contenido": "Excelente profesor...",
      "fecha_creacion": "2026-03-15T10:30:00Z",
      "nombres": "Juan",
      "apellidos": "Pérez"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

#### Crear publicación
```
POST /publications
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo": "catedratico",
  "referencia_id": 1,
  "contenido": "Opinión detallada..."
}

Response (201):
{
  "message": "Publicación creada exitosamente",
  "publication": {
    "id": 5,
    "usuario_id": 1,
    "tipo": "catedratico",
    "referencia_id": 1,
    "contenido": "..."
  }
}
```

#### Obtener publicación con comentarios
```
GET /publications/{id}

Response (200):
{
  "publication": {
    "id": 1,
    "tipo": "catedratico",
    "referencia_id": 1,
    "contenido": "...",
    "nombres": "Juan",
    "apellidos": "Pérez"
  },
  "comments": [
    {
      "id": 1,
      "publicacion_id": 1,
      "usuario_id": 2,
      "contenido": "Estoy de acuerdo...",
      "fecha_creacion": "2026-03-15T11:00:00Z",
      "nombres": "María",
      "apellidos": "García"
    }
  ]
}
```

#### Filtrar publicaciones
```
GET /publications/filter?tipo=catedratico&referencia_id=1

Response (200):
{
  "publications": [...],
  "filters": {
    "tipo": "catedratico",
    "referencia_id": "1"
  }
}
```

### 3. Comentarios

#### Crear comentario
```
POST /comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "publicacion_id": 1,
  "contenido": "Comentario detallado..."
}

Response (201):
{
  "message": "Comentario creado exitosamente",
  "comment": {
    "id": 2,
    "publicacion_id": 1,
    "usuario_id": 2,
    "contenido": "..."
  }
}
```

#### Eliminar comentario
```
DELETE /comments/{id}
Authorization: Bearer {token}

Response (200):
{
  "message": "Comentario eliminado exitosamente"
}
```

---

## Base de Datos

### Tablas principales

#### usuarios
```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  registro_academico VARCHAR(10) UNIQUE NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### catedraticos
```sql
CREATE TABLE catedraticos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  apellido VARCHAR(150) NOT NULL,
  email VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### cursos
```sql
CREATE TABLE cursos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  creditos INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### publicaciones
```sql
CREATE TABLE publicaciones (
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
);
```

#### comentarios
```sql
CREATE TABLE comentarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  publicacion_id INT NOT NULL,
  usuario_id INT NOT NULL,
  contenido TEXT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX idx_publicacion (publicacion_id)
);
```

---

## Instalación para Desarrolladores

### Requisitos previos
- Node.js 14+
- MySQL 8.0+
- npm o yarn
- Git

### Pasos

1. **Clonar repositorio**
```bash
git clone https://github.com/tu-usuario/profesor-ratings-app.git
cd profesor-ratings-app
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con credenciales de BD
```

3. **Crear Base de Datos**
```bash
mysql -u root -p < database/schema.sql
```

4. **Iniciar Backend**
```bash
npm start
# O en modo desarrollo con nodemon
npm run dev
```

5. **Configurar Frontend**
```bash
cd ../frontend
npm install
```

6. **Iniciar Frontend**
```bash
npm start
# Se abrirá en http://localhost:3000
```

---

## Guía de Desarrollo

### Variables de Entorno (.env)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=profesor_ratings
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_muy_larga
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Estructura de Respuestas API

**Éxito (2xx)**
```json
{
  "message": "Descripción de éxito",
  "data": {...}
}
```

**Error (4xx/5xx)**
```json
{
  "error": "Descripción del error"
}
```

### Rutas protegidas

Para acceder a rutas protegidas, incluye el header:
```
Authorization: Bearer {jwt_token}
```

El middleware `authMiddleware` valida el token y agrega `req.userId`.

### Agregar nueva funcionalidad

1. **Crear modelo** en `src/models/`
2. **Crear controlador** en `src/controllers/`
3. **Crear rutas** en `src/routes/`
4. **Registrar rutas** en `src/app.js`
5. **Actualizar frontend** según sea necesario

---

## Deployment

### En producción

1. **Cambiar NODE_ENV** a "production"
2. **Usar variables de entorno seguros** en el servidor
3. **Configurar CORS** solo para dominio permitido
4. **Usar HTTPS** obligatoriamente
5. **Implement rate limiting** en endpoints
6. **Usar conexión pooling** en BD
7. **Realizar backups** regularmente

### Opciones de hosting
- **Backend**: Heroku, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages
- **BD**: AWS RDS, Google Cloud SQL, DigitalOcean

---

## Troubleshooting

### Error: "ECONNREFUSED" (BD)
- Verifica que MySQL esté corriendo
- Confirma las credenciales en .env

### Error: CORS
- Verifica CORS_ORIGIN en .env
- Asegúrate que el frontend usa la URL correcta

### Error: "Invalid token"
- Verifica JWT_SECRET
- El token puede haber expirado

---

## Contribuciones

Para contribuir al proyecto:
1. Crea una rama con tu feature
2. Haz commits descriptivos
3. Envía un pull request

---

*Documentación técnica v1.0 - Marzo 2026*
