import express from "express";
import { listarPersonas, agregarPersona, eliminarPersona, actualizarPersona, agregarJson, filtrarPersonas, listarOFiltrarPersonas } from "../controller/personas.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

// router.get('/', async (req, res) => {
//     try {
//         //const personas = await obtenerPersonas();
//         const personas = await listarPersonas();
//         res.render('pages/index', { personas });

//     } catch (error) {
//         console.error('Error en la ruta :', error);
//         res.redirect('/error');
//     }
// });

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
router.get('/personas/filtrar', filtrarPersonas);

export default router;