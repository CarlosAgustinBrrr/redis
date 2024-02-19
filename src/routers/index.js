import express from "express";
import { obtenerPersonas, crearPersonas, eliminarPersona, registrarPersona, obtenerPersonasRedis } from "../controller/personas.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); //Subir un archivo JSON


router.get('/', async (req, res) => {
    try {
        //const personas = await obtenerPersonas();
        const personas = await obtenerPersonasRedis();
        res.render('pages/index', { personas });

    } catch (error) {
        console.error('Error en la ruta :', error);
        res.redirect('/error');
    }
});

router.get('/listaPersonas', obtenerPersonas);
router.post('/crearPersonas', upload.single('archivoJSON'), crearPersonas);
router.post('/eliminarPersona/:id', eliminarPersona)
router.post('/registrarPersonas', registrarPersona)
router.get('/listaPerros', obtenerPersonasRedis)

export default router;