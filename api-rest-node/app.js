"use strict"

// Requires
var express = require("express");
var bodyParser = require("body-parser");//Convierte todas las peticiones recibidas del backend en objetos JSON.

// Ejecutar express
const app = express();

// Cargar archivos de rutas
const user_routes = require("./routes/user");
const topic_routes = require("./routes/topic");
const comment_routes = require("./routes/comment");

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS
// Middleware - Configuración cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Reescribir rutas
app.use("/api",user_routes)//Creación de rutas middleware. Todas las rutas definidas, tendrán esta ruta antes.
app.use("/api",topic_routes)//Creación de rutas middleware. Todas las rutas definidas, tendrán esta ruta antes.
app.use("/api",comment_routes)//Creación de rutas middleware. Todas las rutas definidas, tendrán esta ruta antes.

// Exportar módulo
module.exports = app;