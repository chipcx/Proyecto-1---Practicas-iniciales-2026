# Guía Rápida de Inicio - Profesor Ratings App

## Inicio rápido (5 minutos)

### 1. Requisitos instalados
- [ ] Node.js 14+
- [ ] MySQL 8.0+
- [ ] Git

### 2. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd profesor-ratings-app
```

### 3. Configurar la Base de Datos

**Opción A: Línea de comandos**
```bash
mysql -u root -p < backend/database/schema.sql
```

**Opción B: GUI (MySQL Workbench)**
- Abre el archivo `backend/database/schema.sql`
- Ejecuta el script

### 4. Configurar Backend

```bash
cd backend
npm install
cp .env.example .env

# Editar .env con tus credenciales:
# DB_PASSWORD=tu_contraseña_mysql
```

**Iniciar Backend:**
```bash
npm start
# Debería mostrar: "Servidor corriendo en puerto 5000"
```

### 5. Configurar Frontend

```bash
cd ../frontend
npm install
npm start
# Se abrirá automáticamente en http://localhost:3000
```

---

## URLs Importantes
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## Pruebas Iniciales

### 1. Probar que el servidor funciona
```bash
curl http://localhost:5000/api/health
```

### 2. Crear un usuario (desde Frontend)
- Ir a http://localhost:3000
- Haz clic en "Regístrate aquí"
- Completa los campos
- Haz clic en "Registrarse"

### 3. Iniciar sesión
- Ingresa tu email y contraseña
- Deberías ver la página principal

### 4. Crear una publicación
- Haz clic en "Crear Publicación"
- Selecciona "Catedrático"
- Ingresa "1" como ID
- Escribe una opinión
- Haz clic en "Publicar"

---

## Comandos Útiles

### Backend
```bash
# Desarrollo con recarga automática
npm run dev

# Iniciar en producción
npm start

# Verificar que todo está bien
curl http://localhost:5000/api/health
```

### Frontend
```bash
# Desarrollo
npm start

# Build para producción
npm run build

# Test
npm test
```

### Base de Datos
```bash
# Conectar a MySQL
mysql -u root -p

# Ver bases de datos
SHOW DATABASES;

# Usar la BD
USE profesor_ratings;

# Ver tablas
SHOW TABLES;

# Ver usuarios
SELECT * FROM usuarios;
```

---

## Estructura de Carpetas (Resumen)

```
profesor-ratings-app/
├── frontend/               # React App
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # API calls
│   │   ├── styles/        # CSS global
│   │   ├── App.jsx
│   │   └── index.js
│   └── public/            # HTML estático
│
├── backend/                # Express API
│   ├── src/
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── models/        # Queries a BD
│   │   ├── routes/        # Definición de rutas
│   │   ├── middlewares/   # Middleware (auth, etc)
│   │   ├── config/        # Configuración
│   │   └── app.js
│   ├── database/          # Scripts SQL
│   └── server.js          # Punto de entrada
│
├── docs/                   # Documentación
│   ├── manual-usuario.md
│   └── manual-tecnico.md
│
└── README.md              # Este archivo
```

---

## Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| `Cannot find module 'express'` | Ejecuta `npm install` en backend |
| `ECONNREFUSED` en BD | Verifica que MySQL esté corriendo |
| `CORS error` | Verifica que backend esté en puerto 5000 |
| `Cannot find database` | Ejecuta `backend/database/schema.sql` |
| Puerto 3000 en uso | Usa `npm start -- --port 3001` |
| Puerto 5000 en uso | Cambia PORT en `.env` |

---

## Siguientes Pasos

1. Verificar que todo funciona
2. Crear un repositorio Git
3. Agregar integrantes del grupo
4. Hacer cambios según los requisitos
5. Documentar los cambios
6. Preparar para entrega

---

## Links Útiles

- **Documentación React**: https://react.dev/
- **Documentación Express**: https://expressjs.com/
- **Documentación MySQL**: https://dev.mysql.com/doc/
- **Tutorial Video**: [enlace YouTube del curso]

---

## Notas Importantes

- **NO subas** archivos `.env` a Git
- **Haz commits frecuentes** con mensajes descriptivos
- **Probá localmente** antes de hacer push
- **Crea ramas** para nuevas features
- **Usa nombres claros** en commits: "feat: agregar filtro", "fix: bug en login"

---

*Actualizado: Marzo 2026*
