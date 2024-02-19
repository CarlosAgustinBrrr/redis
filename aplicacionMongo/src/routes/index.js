const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');
const upload = multer({ dest: 'uploads/' });
const muelleController = require('../controllers/muelleController');
const barcoController = require('../controllers/barcoController');
const eventoController = require('../controllers/eventoController');
const conectarBaseDeDatos = require('../config/database');
const mongoose = require('mongoose');
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('pages/index');
});
router.get('/barcos', (req, res) => {
    res.render('pages/barcos');
});
router.get('/eventos', (req, res) => {
    res.render('pages/eventos');
});
router.get('/anadirColeccionJSON', (req, res) => {
    res.render('pages/anadirColeccionJSON');
});
router.get('/anadirColeccionFORM', (req, res) => {
    res.render('pages/anadirColeccionFORM');
});
router.get('/muelles', muelleController.obtenerMuelles);
router.get('/obtenerBarcos', barcoController.obtenerBarcos);
router.get('/obtenerEventos', eventoController.obtenerEventos);
router.get('/obtenerBarcosEspecificos/:nombreMuelle', barcoController.obtenerBarcosEspecificos);
router.post('/eliminarBarco', bodyParser.json(), barcoController.eliminarBarco);
router.post('/agregarBarco', bodyParser.urlencoded({ extended: true }), barcoController.agregarBarco);










router.post('/anadirJSON', upload.single('fileInput'), async (req, res) => {
    try {
        conectarBaseDeDatos();
        const db = mongoose.connection;
        const jsonFile = req.file;
        if (!jsonFile) {
            return res.status(400).json({ mensaje: 'Archivo JSON no encontrado' });
        }
        const jsonData = fs.readFileSync(jsonFile.path, 'utf-8');
        const resultado = await db.collection('EMBARCADERO').insertOne(JSON.parse(jsonData));

        res.status(201).json({ mensaje: 'Colección añadida con éxito', resultado, jsonData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al añadir la colección', error });
    }
});
module.exports = router;
