import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/mongodbproyecto';

// Configuramos la conexion a la base de datos
const conectarDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conexión exitosa a MongoDB');
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        process.exit(1);
    }
};

export default conectarDB;