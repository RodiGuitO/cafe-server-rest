const mongoose = require('mongoose');

// validar registro unico en BD
var uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} - no es un rol valido'
};

// defino esquema
const schema = mongoose.Schema;

let usuarioSchema = new schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true, // unique validator mongoose
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

// para no regresar el passsword
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

// aplicamos plugin validacion + error: {PATH} es la propiedad(unique) dupicada
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema); //Usuario mayuscula