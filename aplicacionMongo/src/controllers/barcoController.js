const fetch = require('node-fetch');
const mongoose = require('mongoose');
const conectarBaseDeDatos = require('../config/database');
const { format } = require('date-fns');

// En esta peticion obtendremos todos los barcos que se encuentran en la base de 
// datos y los devolveremos en formato JSON.
exports.obtenerBarcos = async (req, res) => {
    conectarBaseDeDatos();
    try {
        const db = mongoose.connection;
        const embarcaderos = await db.collection('EMBARCADERO').find({}).toArray();
        if (!embarcaderos || embarcaderos.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron barcos.' });
        }
        const barcos = embarcaderos
            .map(embarcadero => embarcadero.barcos).filter(barcos => barcos).flat(); 
        res.json(barcos);
    } catch (error) {
        console.error('Error al obtener los barcos:', error.message);
        res.status(500).json({ mensaje: 'Error del servidor al obtener los barcos.' });
    }
};

// En esta peticion obtendremos los barcos que se encuentran en el muelle
// desde el cual se manda la peticion, para ello recibimos en los params
// el nombre de el muelle y se hace una busqueda de todos aquellos barcos
// que se encuentran en el muelle y no tienen un evento de salida mas reciente.
exports.obtenerBarcosEspecificos = async (req, res) => {
    conectarBaseDeDatos();
    const nombreMuelle = req.params.nombreMuelle;
    try {
        const eventosResponse = await fetch('http://localhost:3000/obtenerEventos');
        const eventos = await eventosResponse.json();
        const barcosAtracados = [];
        eventos.forEach(evento => {
            if (evento.muelle === nombreMuelle) {
                if (evento.evento === "Llegada") {
                    const eventosSalida = eventos.filter(e => e.barco === evento.barco && e.muelle === evento.muelle && e.timestamp > evento.timestamp && e.evento === "Salida");
                    if (eventosSalida.length === 0) {
                        barcosAtracados.push(evento.barco);
                    }
                } else if (evento.evento === "Salida") {
                    const index = barcosAtracados.indexOf(evento.barco);
                    if (index !== -1) {
                        barcosAtracados.splice(index, 1);
                    }
                }
            }
        });
        const barcosResponse = await fetch('http://localhost:3000/obtenerBarcos');
        const barcosCompleta = await barcosResponse.json();
        const barcosFiltrados = barcosCompleta.filter(barco => barcosAtracados.includes(barco.nombre));
        res.json(barcosFiltrados);
    } catch (error) {
        console.error('Error al obtener los barcos específicos:', error.message);
        res.status(500).json({ mensaje: 'Error del servidor al obtener los barcos específicos.' });
    }
};

// En este metodo eliminaremos el barco con el nombre que coincida 
// con el nombre que se pasa en el body, ademas añadiremos a la base
// de datos un evento de salida de ese puerto y de ese barco.
exports.eliminarBarco = async (req, res) => {
    conectarBaseDeDatos();
    const nombreBarco = req.body.nombre;
    try {
        const db = mongoose.connection;
        const embarcaderos = await db.collection('EMBARCADERO').find({}).toArray();
        let barcoEncontrado = null;
        let embarcaderoEncontrado = null; 
        let muelle = null;
        for (const embarcadero of embarcaderos) {
            if (embarcadero.barcos && Array.isArray(embarcadero.barcos)) {
                const barcoIndex = embarcadero.barcos.findIndex(b => b.nombre === nombreBarco);
                if (barcoIndex !== -1) {
                    barcoEncontrado = embarcadero.barcos[barcoIndex];
                    muelle = embarcadero.barcos[barcoIndex].atracado;
                    embarcaderoEncontrado = embarcadero;
                    embarcadero.barcos.splice(barcoIndex, 1);
                    break;
                }
            }
        }
        if (!barcoEncontrado) {
            return res.status(404).json({ mensaje: 'El barco no se encontró en la base de datos.' });
        }
        await db.collection('EMBARCADERO').updateOne(
            { _id: embarcaderoEncontrado._id },
            { $set: { barcos: embarcaderoEncontrado.barcos } }
        );
        const today = new Date();
        const formattedDate = format(today, 'yyyy-MM-dd');
        const eventoSalida = {
            barco: nombreBarco,
            muelle: muelle,
            evento: 'Salida',
            timestamp: formattedDate
        };
        await db.collection('EMBARCADERO').updateOne(
            { _id: embarcaderoEncontrado._id },
            { $push: { eventos: eventoSalida } }
        );
        res.json({ mensaje: 'Barco eliminado con éxito y evento de salida insertado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el barco:', error.message);
        res.status(500).json({ mensaje: 'Error del servidor al eliminar el barco.' });
    }
};

// En este metodo agregaremos un barco, desde el formulario pasaremos por el 
// body todos los atributos necesarios previamente controlados en el form, y
// a la vez añadiremos un evento de llegada al embarcadero correspondiente.
exports.agregarBarco = async (req, res) => {
    conectarBaseDeDatos();
    const { nombre, tipo, capacidad, tripulacion, imagen, equipamiento, atracado } = req.body;
    try {
        const db = mongoose.connection;
        const barcoExistente = await db.collection('EMBARCADERO').findOne({ 'barcos.nombre': nombre });
        if (barcoExistente) {
            return res.send(`
                <script>
                    alert("Ya existe un barco con el mismo nombre.");
                    window.location.href = "/anadirColeccionFORM"; // Redirigir a la misma página de añadir barco
                </script>
            `);
        }
        const nuevoBarco = {
            nombre: nombre,
            tipo: tipo,
            capacidad_pasajeros: capacidad,
            tripulacion: tripulacion,
            imagen: imagen,
            equipamiento: equipamiento,
            atracado: atracado
        };
        await db.collection('EMBARCADERO').updateOne(
            {},
            { $push: { barcos: nuevoBarco } }
        );
        const today = new Date();
        const formattedDate = format(today, 'yyyy-MM-dd');
        const eventoLlegada = {
            barco: nombre,
            muelle: atracado,
            evento: 'Llegada',
            timestamp: formattedDate
        };
        await db.collection('EMBARCADERO').updateOne(
            {},
            { $push: { eventos: eventoLlegada } }
        );
        res.send(`
            <script>
                alert("Barco agregado con éxito y evento de llegada insertado correctamente.");
                window.location.href = "/anadirColeccionFORM"; // Redirigir a la misma página de añadir barco
            </script>
        `);
    } catch (error) {
        console.error('Error al agregar el barco:', error.message);
        res.status(500).json({ mensaje: 'Error del servidor al agregar el barco.' });
    }
};

