# Configuración de Git y GitHub para el Proyecto

## Paso 1: Inicializar repositorio local

```bash
cd profesor-ratings-app

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: estructura inicial del proyecto"
```

## Paso 2: Crear repositorio en GitHub

1. Accede a https://github.com/new
2. Nombre del repo: `profesor-ratings-app`
3. Descripción: "Aplicación web para rating de catedráticos - USAC"
4. **NO** inicialices con README (ya lo tenemos)
5. Haz clic en "Create repository"

## Paso 3: Conectar repositorio local con GitHub

```bash
# Agregar remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/profesor-ratings-app.git

# Cambiar rama a main
git branch -M main

# Hacer push
git push -u origin main
```

## Paso 4: Agregar colaboradores

1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings"
3. En el menú lateral, selecciona "Collaborators"
4. Haz clic en "Add people"
5. Ingresa el usuario de GitHub de cada integrante

## Workflow Git para el equipo

### Crear rama para nueva feature
```bash
# Actualizar main
git pull origin main

# Crear rama (uso: feature/nombre-descriptivo)
git checkout -b feature/agregar-perfil-usuario

# Hacer cambios y commits
git add .
git commit -m "feat: agregar página de perfil de usuario"
git commit -m "style: mejorar estilos del perfil"

# Subir rama
git push origin feature/agregar-perfil-usuario
```

### Crear Pull Request en GitHub
1. Ve a tu repositorio
2. Haz clic en "Pull requests"
3. Haz clic en "New pull request"
4. Selecciona tu rama en "compare"
5. Agrega descripción de los cambios
6. Haz clic en "Create pull request"

### Después del merge
```bash
# Volver a main
git checkout main

# Actualizar
git pull origin main

# Eliminar rama local
git branch -d feature/agregar-perfil-usuario

# Eliminar rama remota
git push origin --delete feature/agregar-perfil-usuario
```

## Commits Recomendados

Usa estos prefijos para mejor organización:

- **feat**: Nueva funcionalidad
- **fix**: Corrección de bug
- **style**: Cambios de estilos
- **refactor**: Refactorización de código
- **docs**: Cambios en documentación
- **test**: Agregar o actualizar tests
- **chore**: Cambios en configuración

### Ejemplos
```bash
git commit -m "feat: agregar sistema de filtrado por profesor"
git commit -m "fix: corregir bug en validación de email"
git commit -m "docs: actualizar manual técnico"
```

## Proteger la rama main

Para evitar errores, protege main en GitHub:

1. Settings → Branches
2. Agregar regla de protección para main
3. Requiere pull request review
4. Requiere tests pasen antes de merge

---

*Adaptado para el equipo de desarrollo*
