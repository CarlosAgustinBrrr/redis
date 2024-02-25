import Persona from '../models/personaModel.js';
import fs from 'fs';

const listarPersonas = async (req, res) => {
  try {
      const personas = await Persona.recuperarTodas(); // Suponiendo que esta operación es asíncrona
      res.render('pages/index.ejs', { personas });
  } catch (error) {
      console.error('Error en la ruta :', error);
      res.status(500).send('Error al recuperar las personas');
  }
};

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

      // Leer el contenido del archivo
      const contenidoArchivo = fs.readFileSync(archivoPath, 'utf8');
      const personas = JSON.parse(contenidoArchivo);

      // Asegúrate de que el archivo JSON contiene un array de personas
      if (Array.isArray(personas)) {
          // Procesa cada persona en el array
          for (const persona of personas) {
              await Persona.guardar(new Persona(persona));
          }
          res.redirect('/');
      } else {
          res.status(400).send("El archivo JSON debe contener un array de personas.");
      }

      // Opcional: eliminar el archivo después de procesarlo
      fs.unlinkSync(archivoPath);
  } catch (error) {
      console.error('Error al cargar el archivo:', error);
      res.status(500).send("Error al procesar el archivo.");
  }
};

const filtrarPersonas = async (req, res) => {
  try {
      // Capturar los parámetros de búsqueda y filtro de req.query
      const { nombre, edadMin, edadMax } = req.query;
      let personasFiltradas = await Persona.recuperarTodas(); // Suponiendo que este método ya existe

      // Filtrar por nombre si se proporciona
      if (nombre) {
          personasFiltradas = personasFiltradas.filter(persona => persona.nombre.toLowerCase().includes(nombre.toLowerCase()));
      }

      // Filtrar por rango de edad si se proporcionan ambos valores
      if (edadMin !== undefined && edadMax !== undefined) {
          personasFiltradas = personasFiltradas.filter(persona => persona.edad >= edadMin && persona.edad <= edadMax);
      }

      // Enviar los resultados filtrados a la vista
      res.render('tuVistaDeListado.ejs', { personas: personasFiltradas });
  } catch (error) {
      console.error('Error al filtrar personas:', error);
      res.status(500).send('Error al recuperar las personas');
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

export { listarPersonas, agregarPersona, actualizarPersona, eliminarPersona, agregarJson, filtrarPersonas, listarOFiltrarPersonas };

