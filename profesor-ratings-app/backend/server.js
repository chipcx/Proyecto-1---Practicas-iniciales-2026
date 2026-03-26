const app = require('./src/app');
const migrate = require('./src/config/migrate');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error en migración:', err);
    process.exit(1);
  });