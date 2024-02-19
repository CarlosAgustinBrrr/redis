import Persona from '../models/personaModel.js';

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
    const nuevaPersona = new Persona({ nombre, dni, edad, correo, altura, peso });
    
    await Persona.guardar(nuevaPersona);
    res.redirect('/listaPerros'); // Redirecciona a la lista de personas, ajusta según tu ruta de listado
  } catch (error) {
    console.error('Error al agregar persona:', error);
    res.status(500).send('Error al agregar la persona');
  }
};

export { listarPersonas, agregarPersona };

