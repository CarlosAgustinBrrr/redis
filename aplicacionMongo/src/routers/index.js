import express from "express";
import { listarPersonas, agregarPersona } from "../controller/personas.js";
import multer from 'multer';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        //const personas = await obtenerPersonas();
        const personas = await listarPersonas();
        res.render('pages/index', { personas });

    } catch (error) {
        console.error('Error en la ruta :', error);
        res.redirect('/error');
    }
});

router.get('/listaPerros', listarPersonas)
router.post('/agregar', agregarPersona);

export default router;