const app = require('./src/app');
const migrate = require('./src/config/migrate'); // ← LÍNEA NUEVA
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Primero crea las tablas, luego inicia el servidor
migrate()                                           // ← LÍNEA NUEVA
  .then(() => {                                       // ← LÍNEA NUEVA
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })                                                  // ← LÍNEA NUEVA
  .catch((err) => {                                   // ← LÍNEA NUEVA
    console.error('Error en migración:', err);       // ← LÍNEA NUEVA
    process.exit(1);                                 // ← LÍNEA NUEVA
  });                                                 // ← LÍNEA NUEVA