"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
const key_secret = require("../services/global").jwt.key;

exports.createToken = function(user){//Usuario a cifrar en JWT.
    var payload = {//Aqui estaria todos los datos del usuario que queremos cifrar en JWT.
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payload,key_secret);//Genera el JWT utilizando la clave secreta, apartir de los datos del "payload".
};