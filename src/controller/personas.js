import Persona from '../models/personaModel.js';
import fs from 'fs';

// Nuevo controlador para añadir una persona
const agregarPersona = async (req, res) => {
  try {
    const { nombre, dni, edad, correo, altura, peso } = req.body;

    let personasFiltradas = await Persona.recuperarTodas(); 

    if (dni || correo) {
      personasFiltradas = personasFiltradas.filter(persona => persona.dni.toLowerCase().includes(dni.toLowerCase()));
      personasFiltradas = personasFiltradas.filter(persona => persona.correo.toLowerCase().includes(correo.toLowerCase()));
    }

    if(personasFiltradas.length > 0){
      return res.status(400).send('Ya existe una persona con el mismo DNI o correo.');
    }else{
      const nuevaPersona = new Persona({ nombre, dni, edad, correo, altura, peso });
      await Persona.guardar(nuevaPersona);
    }
    console.log('Persona agregada:', nuevaPersona);
    res.redirect('/'); // Redirecciona a la lista de personas, ajusta según tu ruta de listado
  } catch (error) {
    console.error('Error al agregar persona:', error);
    res.status(500).send('Error al agregar la persona');
  }
};

// Controlador para actualizar una persona
const actualizarPersona = async (req, res) => {
  try {
    const { dni } = req.params;
    const datosActualizados = req.body;
    const personaActualizada = await Persona.actualizar(dni, datosActualizados);

    if (personaActualizada) {
      console.log('Persona actualizada:', personaActualizada);
      res.redirect('/');
    } else {
      console.log('Persona no encontrada');
      res.status(404).send('Persona no encontrada');
    }
  } catch (error) {
    console.error('Error al actualizar persona:', error);
    res.status(500).send('Error al actualizar la persona');
  }
};

// Controlador para eliminar una persona
const eliminarPersona = async (req, res) => {
  try {
    const { dni } = req.params;
    await Persona.eliminar(dni);
    console.log('Persona eliminada:', dni);
    res.redirect('/');
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    res.status(500).send('Error al eliminar la persona');
  }
};

const agregarJson = async (req, res) => {
  try {
    const archivoPath = req.file.path;
    const contenidoArchivo = fs.readFileSync(archivoPath, 'utf8');
    const personas = JSON.parse(contenidoArchivo);
    if (Array.isArray(personas)) {
      for (const persona of personas) {
        if (
          !persona.nombre || persona.nombre.trim() === '' || persona.nombre.length > 75 ||
          !persona.dni || persona.dni.trim() === '' || persona.dni.length > 75 ||
          !persona.edad || typeof persona.edad !== 'number' || persona.edad < 0 || persona.edad > 1000 ||
          !persona.correo || persona.correo.trim() === '' || persona.correo.length > 100 ||
          !persona.altura || typeof persona.altura !== 'number' || persona.altura < 0 || persona.altura > 1000 ||
          !persona.peso || typeof persona.peso !== 'number' || persona.peso < 0 || persona.peso > 1000
      ) { 
          res.status(400).send("Los campos 'nombre', 'dni', 'edad', 'correo', 'altura' y 'peso' son obligatorios. " +
          "Compruebe que los datos estan en el fomato correcto ni que los numeros sean negativos");
          return;
        }
        let personasFiltradas = await Persona.recuperarTodas(); 
        let dniNuevo = persona.dni;
        let correoNuevo = persona.correo;
        if (dniNuevo || correoNuevo) {
          personasFiltradas = personasFiltradas.filter(p => p.dni.toLowerCase() === dniNuevo.toLowerCase() || p.correo.toLowerCase() === correoNuevo.toLowerCase());
        }
        if(personasFiltradas.length > 0){
          return res.status(400).send('Ya existe una persona con el mismo DNI o correo.');
        }else{
          const nuevaPersona = new Persona({
            nombre: persona.nombre,
            dni: persona.dni,
            edad: persona.edad,
            correo: persona.correo,
            altura: persona.altura,
            peso: persona.peso
        });
          console.log(nuevaPersona)
          await Persona.guardar(nuevaPersona);
        }
      }
      res.redirect('/');
    } else {
      res.status(400).send("El archivo JSON debe contener un array de personas.");
    }
    fs.unlinkSync(archivoPath);
  } catch (error) {
    console.error('Error al cargar el archivo:', error);
    res.status(500).send("Error al procesar el archivo.");
  }
};

const listarOFiltrarPersonas = async (req, res) => {
  try {
      let personas = await Persona.recuperarTodas(); // Asumiendo que este método devuelve todas las personas
      const { nombre, edadMin, edadMax } = req.query;

      // Si se proporciona un nombre, filtra por ese nombre
      if (nombre) {
          personas = personas.filter(persona => persona.nombre.toLowerCase().includes(nombre.toLowerCase()));
      }

      // Si se proporcionan edadMin y edadMax, filtra por ese rango de edad
      if (edadMin && edadMax) {
          personas = personas.filter(persona => persona.edad >= edadMin && persona.edad <= edadMax);
      }

      // Renderizar la vista con las personas filtradas (o todas si no hay criterios de filtrado)
      res.render('pages/index.ejs', { personas });
  } catch (error) {
      console.error('Error al listar o filtrar personas:', error);
      res.status(500).send('Error al procesar la solicitud');
  }
};

export { agregarPersona, actualizarPersona, eliminarPersona, agregarJson, listarOFiltrarPersonas };

