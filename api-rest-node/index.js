"use strict"//Me obligara a seguir las mejores practicas de desarrollo de NodeJS, y me permitira utilizar ciertas mejoras  del lenguaje del JS.

//CONECTAMOS NUESTRO PROYECTO A LA BASE DE DATOS "API_REST_NODE".
var mongoose = require("mongoose");//Carga el moduló "mongoose".
var app = require("./app");
var port = process.env.PORT || 3999;//process.env.PORT: Variable de entorno llamada "PORT" del servidor. Aquí se indicara el puerto de mi API RestFull.

mongoose.set("useFindAndModify",false);//Conveniencia para evitar warnings durante ejecución.
mongoose.Promise = global.Promise;//Me permitira trabajar con Promesas.
mongoose.connect("mongodb://localhost:27017/api_rest_node",{
    useNewUrlParser:true//Estableciendo esto, la conexión se realizara de la mejor manera, otorgando nuevas funcionales del mongoose.
}).then(//Caso conexión exitosa.
    ()=>{
        console.log("La conexión a la base de datos de mongo se ha realizado correctamente.");

        // Crear el servidor web
        app.listen(port,()=>{
            console.log("El servidor http://localhost:"+port+" esta funcionando!!.");
        });
    }
).catch(//Caso conexión fallida
    error => console.log(error)
);//URL del Mongo (localhost:27017/forum) donde localhost:27017 es donde esta alojado el puerto de nuestra BD de mongo, "api_rest_node" es el nombre de la BD a utilizar.