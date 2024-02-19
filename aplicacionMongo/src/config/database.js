const mongoose = require('mongoose');

let db;

// funcion para conectar a la base de datos.
function conectarBaseDeDatos() {
  const MONGODB_URI = 'mongodb://127.0.0.1:27017/EMBARCADERO';
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
  db.once('open', () => {
    console.log('Conexión exitosa a la base de datos');
  });
  return db;
}

module.exports = conectarBaseDeDatos;
