"use strict"

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

//Modelo de COMMENT
const CommentSchema = Schema({
    content:String,
    date:{ type:Date, default:Date.now },
    user:{ type: Schema.ObjectId, ref: "User" }
});

const Comment = mongoose.model("Comment", CommentSchema);//Creo una colección con el nombre "comments" que tendra el Schema "CommentSchema".

//Modelo de TOPIC
const TopicSchema = Schema({
    "title":String,
    "content":String,
    "code":String,
    "lang":String,
    "date":{ type:Date, default: Date.now },//Si no hay dato insertado, por defecto guardara la fecha actual.
    "user":{ type: Schema.ObjectId, ref: "User" }, //Vincula toda la informacion de la colección "User", en este Dato Documento. 
    "comments":[CommentSchema]//Este dato de documento, se guardara siguiendo el Schema de "CommentSchema".
});

//Cargar paginación
TopicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Topic",TopicSchema);