# Aplicación de Rating de Catedráticos y Cursos

Aplicación web para que estudiantes de la Facultad de Ingeniería de USAC puedan calificar y comentar sobre catedráticos y cursos.

## Descripción

Esta aplicación permite a los estudiantes:
- Registrarse e iniciar sesión en la plataforma
- Ver publicaciones sobre catedráticos y cursos
- Crear publicaciones y comentarios
- Filtrar por curso o catedrático
- Ver perfiles de otros usuarios
- Administrar cursos aprobados

## Arquitectura

### Frontend
- **Framework**: React.js
- **Styling**: CSS3 / Bootstrap
- **State Management**: Context API / Redux
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Express Validator

### Base de Datos
- **SGBD**: MySQL 8.0+
- **ORM**: Sequelize o conexión directa

## Estructura del Proyecto

```
profesor-ratings-app/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas principales
│   │   ├── services/           # Servicios API
│   │   ├── styles/             # Estilos globales
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .gitignore
│
├── backend/                     # Servidor Express
│   ├── src/
│   │   ├── config/             # Configuración (BD, JWT)
│   │   ├── controllers/        # Lógica de negocio
│   │   ├── routes/             # Definición de rutas
│   │   ├── models/             # Modelos de datos
│   │   ├── middlewares/        # Middlewares (auth, validación)
│   │   ├── utils/              # Funciones auxiliares
│   │   └── app.js              # Configuración Express
│   ├── database/               # Scripts SQL
│   ├── package.json
│   ├── .env.example
│   └── server.js
│
├── docs/                        # Documentación
│   ├── manual-usuario.md
│   └── manual-tecnico.md
│
├── .gitignore
├── README.md
└── Estructura completada ✓
```

## Primeros Pasos

### Requisitos
- Node.js 14+
- MySQL 8.0+
- npm o yarn

### Instalación del Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de BD
npm start
```

### Instalación del Frontend

```bash
cd frontend
npm install
npm start
```

## Variables de Entorno (Backend)

Ver archivo `.env.example`

## Documentación

- [Manual de Usuario](docs/manual-usuario.md)
- [Manual Técnico](docs/manual-tecnico.md)

## Autor(es)

Nombres de los integrantes del grupo

## Fecha de Entrega

26 de Marzo de 2026

---

**Nota**: Este es un proyecto de ejemplo desarrollado para fines educativos.
