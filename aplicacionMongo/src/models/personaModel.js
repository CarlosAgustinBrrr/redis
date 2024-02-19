import { createClient } from 'redis';

// Conexión a Redis. Asegúrate de configurar tu conexión de manera segura y reutilizable.
const client = createClient({
  url: 'redis://default:sfsoVvdeRpJjCL1czso4pC4inIvgyBxi@redis-12705.c274.us-east-1-3.ec2.cloud.redislabs.com:12705'
});
client.connect();

class Persona {
  constructor({ nombre, dni, edad, correo, altura, peso }) {
    this.nombre = nombre;
    this.dni = dni;
    this.edad = edad;
    this.correo = correo;
    this.altura = altura;
    this.peso = peso;
  }

  // Guarda la persona en Redis
  static async guardar(persona) {
    await client.set(persona.dni, JSON.stringify(persona));
  }

  // Recupera una persona por su DNI
  static async recuperar(dni) {
    const personaStr = await client.get(dni);
    if (!personaStr) return null;
    return new Persona(JSON.parse(personaStr));
  }

  // Recupera todas las personas (esto es ineficiente para grandes volúmenes de datos, se muestra solo con fines educativos)
  static async recuperarTodas() {
    const keys = await client.keys('*');
    const personas = [];
    for (const key of keys) {
      const tipo = await client.type(key);
      if (tipo === 'string') { // Verifica que el tipo de dato sea un string
        const personaStr = await client.get(key);
        personas.push(new Persona(JSON.parse(personaStr)));
      }
    }
    return personas;
  }

}

export default Persona;
