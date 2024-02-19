import mongoose from 'mongoose';

const personaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        unique: true,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    correo: {
        type: String,
        unique: true,
        required: true
    }
});

const Persona = mongoose.model('coleccionpersonas', personaSchema);

export default Persona;
