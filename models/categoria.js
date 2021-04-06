


const {Schema, model, SchemaTypes } = require('mongoose');

const categoriaSchema = Schema({

    nombre: {
        type:String,
        required:[true, 'El nombre es obligatorio'],
        unique:true
    },
    estado: {
        type:Boolean,
        default:true,
        required:true
    },
    usuario: {
        type:SchemaTypes.ObjectId,
        ref:'Usuario',
        required: true
    }

});

module.exports = model('Categoria', categoriaSchema);