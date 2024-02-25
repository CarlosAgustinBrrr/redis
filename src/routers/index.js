import express from "express";
import { agregarPersona, eliminarPersona, actualizarPersona, agregarJson, listarOFiltrarPersonas } from "../controller/personas.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

router.get('/', listarOFiltrarPersonas);
router.get('/add', (req, res) => {
    res.render('pages/anadir')
});
router.get('/addJson', (req, res) => {
    res.render('pages/anadirJson')
});
router.post('/agregar', agregarPersona);
router.post('/personas/eliminar/:dni', eliminarPersona);
router.post('/personas/actualizar/:dni', actualizarPersona);
router.post('/personas/cargar', upload.single('archivoPersonas'), agregarJson);

export default router;