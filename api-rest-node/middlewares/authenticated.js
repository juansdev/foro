"use strict"

const key_secret = require("../services/global").jwt.key;
const jwt = require("jwt-simple");
const moment = require("moment");

exports.authenticated = function (req,res,next){//Un middleware tiene 3 parametros, los tipos req,res y el "next" es el que permite bien sea a la ruta que proteje el middleware o redireccionarlo a otro lugar.
    
    //Comprobar si llega autorización en el Header
    if(!req.headers.authorization){
        return res.status(500).send({
            message:"Petición no valida"
        });
    }
    else{
        //Limpiar el token y quitar comillas
        const token = req.headers.authorization.replace(/['"]+/g,""); 
        try {
            //Decodificar token
            var payload = jwt.decode(token,key_secret);
            
            //Comprobar si el token ha expirado
            if(payload.exp <= moment().unix()){
                return res.status(404).send({
                    message:"El token ha expirado"
                });
            }
        } catch (error) {
            return res.status(404).send({
                message:"El token no es válido"
            });
        }
        //Adjuntar usuario identificado a request
        req.user = payload;

        //Pasar a la ruta protegida
        next();
    }
}