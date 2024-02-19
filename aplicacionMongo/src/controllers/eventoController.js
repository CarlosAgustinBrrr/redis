const mongoose = require('mongoose');
const conectarBaseDeDatos = require('../config/database');

// En este metodo devolveremos todos los eventos de la base
// de datos.
exports.obtenerEventos = async (req, res) => {
    conectarBaseDeDatos();
    try {
        const db = mongoose.connection;
        const embarcaderos = await db.collection('EMBARCADERO').find({}).toArray();
        
        // Si no se encontraron embarcaderos
        if (!embarcaderos || embarcaderos.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron eventos.' });
        }
        
        // Buscar eventos dentro de cada embarcadero y filtrar los null
        const eventos = embarcaderos
            .map(embarcadero => embarcadero.eventos).filter(eventos => eventos).flat(); 
        res.json(eventos);
    } catch (error) {
        console.error('Error al obtener los eventos:', error.message);
        res.status(500).json({ mensaje: 'Error del servidor al obtener los eventos.' });
    }
};
