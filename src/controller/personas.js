import Persona from "../models/personaModel.js";
import { promisify } from 'util';
import { getRedisClient } from './redisClient.js';

export const obtenerPersonasRedis = async (req, res) => {
    try {
        const client = await getRedisClient();
        console.log('Attempting to fetch from Redis');
        const resultado = await client.get('personas');
        console.log('Fetched from Redis:', resultado);
        const personas = JSON.parse(resultado);

        if (res) {
            res.json(personas);
        } else {
            return personas; // In case the function is used outside an Express route context
        }
    } catch (error) {
        console.error('Error in obtenerPersonasRedis:', error);
        if (res) {
            res.status(500).json({ error: 'Error al obtener personas de Redis' });
        } else {
            throw error;
        }
    }
};
// Método con el que obtenemos las personas almacenadas en nuestra base de datos
export const obtenerPersonas = async (req, res) => {
    try {
        // Fetch the data from Redis
        const resultado = await getAsync('personas');

        // Parse the JSON string
        const personas = JSON.parse(resultado);

        // Send the response
        if (res) {
            res.json(personas);
        } else {
            return personas;
        }
    } catch (error) {
        if (res) {
            res.status(500).json({ error: 'Error al obtener personas' });
        } else {
            throw error;
        }
    }
};


//Método con el que introducimos varias personas a nuestra base de datos a través de un archivo .json
export const crearPersonas = async (req, res) => {
    try {
        const archivoJSON = req.file.buffer.toString(); //Extrae el archivo y lo convierte a una cadena de texto
        const personasData = JSON.parse(archivoJSON);
        await Persona.insertMany(personasData);
        return res.redirect('/');
    } catch (error) {
        console.error('Error al importar personas:', error);
        res.status(500).send('Error al importar personas. Comprueba que no hay claves duplicadas o vacias');
    }
};

//Método con el que introducimos una persona a nuestra base de datos a través de un form
export const registrarPersona = async (req, res) => {
    try {
        const { nombre, dni, edad, correo } = req.body;
        const nuevaPersona = new Persona({
            nombre,
            dni,
            edad,
            correo,
        });
        await nuevaPersona.save();
        return res.redirect('/');
    } catch (error) {
        console.error('Error al registrar persona:', error);
        res.status(500).send('Error al registrar persona. Comprueba los datos proporcionados.');
    }
};

//Método con el que eliminamos a una persona de nuestra base de datos
export const eliminarPersona = async (req, res) => {
    try {
        const personaId = req.params.id;
        const result = await Persona.findOneAndDelete({ _id: personaId });
        if (result) {
            return res.redirect('/');
        } else {
            res.status(404).json({ error: 'Persona no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar persona:', error);
        res.status(500).json({ error: 'Error al eliminar persona' });
    }
};