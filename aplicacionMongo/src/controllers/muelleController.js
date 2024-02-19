const mongoose = require('mongoose');
const conectarBaseDeDatos = require('../config/database');
conectarBaseDeDatos();

// En este metodo devolveremos todos los muelles de la 
// base de datos.
exports.obtenerMuelles = async (req, res) => {
    try {
        const db = mongoose.connection;
        const embarcaderos = await db.collection('EMBARCADERO').find({}).toArray();
        if (!embarcaderos || embarcaderos.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron muelles.' });
        }
        const muelles = embarcaderos
            .map(embarcadero => embarcadero.muelles).filter(muelles => muelles).flat(); 
        res.json(muelles);
    } catch (error) {
        console.error('Error al obtener los muelles:', error.message);
        res.status(500).json({ mensaje: 'Error del servidor al obtener los muelles.' });
    }
};
