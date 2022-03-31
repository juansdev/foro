"use strict"

var moongose = require("mongoose");
var Schema = moongose.Schema;//Permite crear un esquema de Mongoose, para definir las propiedades que tendra el esquema, y que posteriormente podrá ser utilizado para almacenar Documentos siguiendo ese Esquema en las base de dato de Mongoose.

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String
});

UserSchema.methods.toJSON = function(){//Siempre que se intente devolver los datos de este documento en JSON, borrara el Password y devolvera un objeto sin esta.
    const obj = this.toObject();
    delete obj.password;
    return obj;
} 

module.exports = moongose.model("User",UserSchema);//Modelo,Esquema a seguir. (El modelo es el nombre de la collection que se generara en la base de datos, y se guardara con el mismo nombre pero lowercase y con el nombre pluralizado).