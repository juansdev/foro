"use strict"

const { default: validator } = require("validator");
const User = require("../models/user");
const bcrypt = require("bcrypt-node");
const jwt = require("../services/jwt");
const fs = require("fs");//Librería de NodeJS que gestiona los ficheros del proyecto.
const path = require("path");//Utilizado en sistema de ficheros

var controller = {
    save: function(req,res){//Se crea metodos de controladores, de esta manera, este controlador tiene el nombre "probando", cuya funcion es definido a continuación.
        // Recoger los parametros de la petición
        const params = req.body;
        
        try {
            // Validar los datos
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = validator.isEmail(params.email) && !validator.isEmpty(params.surname);
            var validate_password = !validator.isEmpty(params.password);    
        } catch (error) {
            return res.status(500).send(
                {
                    status:"error",
                    message:"Faltan datos por enviar"
                }
            )
        };

        if(validate_name && validate_surname && validate_email && validate_password){
            // Crear el objeto de usuario
            var user = new User();
            
            // Asignar valores al usuario
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.password = params.password;
            user.image = null;
            user.role = "ROLE_USER";

            // Comprobar si el usuario existe
            User.findOne({email: user.email}, (err, issetUser)=>{
                //Si se produce un error...
                if(err || issetUser) return res.status(500).send({
                    status:"error",
                    message: "Error al comprobar la duplicidad del usuario."
                });
                //Si el usuario no existe...
                else if(!issetUser){
                    //Cifrar la contraseña
                    bcrypt.hash(params.password, null, null, (err,hash)=>{
                        user.password = hash;
                        //Guardar usuario
                        user.save((err, userStored)=>{
                            if(err) return res.status(500).send({
                                status:"error",
                                message: "Error al guardar el usuario."
                            });
                            if(!userStored) return res.status(500).send({
                                status:"error",
                                message: "Error el usuario no ha guardado."
                            });
                            else return res.status(200).send({
                                    status:"success",
                                    user: userStored
                                })
                        });// close save
                    });// close bcrypt
                }
                //Si el usuario existe...
                else return res.status(500).send({
                    status:"error",
                    message: "El usuario ya existe."
                });
            });
        }
        else{
            return res.status(400).send({
                status:"error",
                message: "Los datos del usuario que intentas registrar no son validos."
            })
        }
    },
    login:function(req,res){
        //Recoger los parametros de la petición
        const params = req.body;
        //Validar los datos
        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);   
        } catch (error) {
            return res.status(500).send(
                {
                    status:"error",
                    message:"Faltan datos por enviar"
                }
            )
        }

        if(validate_email && validate_password){
            //Buscar usuarios que coincidan con el email
            User.findOne({email: params.email.toLowerCase()}, (err,user) => {
                if(err) return res.status(500).send({
                    status:"error",
                    message:"Error de autentificación"
                });
                else if(!user) return res.status(404).send({
                    status:"error",
                    message:"El usuario no existe"
                });
                else{
                    //Si lo encuentra.

                    //Comprobar la contraseña (Coincidencia de email y password / bcrypt)
                    bcrypt.compare(params.password,user.password,(err, check)=>{
                    //Si es correcto...
                    if(check){
                        //Generar JWT y devolverlo
                        if(params.gettoken){
                            //Devolver los datos
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            //Limpiar el objeto (Quitar password, y demás datos sencibles antes de devolverlo al frontend)
                            user.password = undefined;

                            //Devolver los datos
                            return res.status(200).send({
                                status:"success",
                                user
                            });
                        }
                    }
                    else return res.status(404).send({
                            status:"error",
                            message:"Las credenciales no son correctas"
                        });
                        
                    });

                    
                }
            });
        }
        else return res.status(200).send({
            status:"error",
            message:"Datos incorrectos"
        });
    },
    update: function(req,res){
        //Recoger datos del usuario
        const params = req.body;

        //Validar los datos
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        } catch (error) {
            return res.status(500).send(
                {
                    status:"error",
                    message:"Faltan datos por enviar"
                }
            )
        }

        if(validate_name && validate_surname && validate_email){
            //Eliminar propiedades innecesarias
            delete params.password;
            
            const userId = req.user.sub;

            //Comprobar si el email es unico
            if(req.user.email!=params.email){//Si el correo autenticado es diferente al correo para modificar, entrar...
                //Buscar usuarios que coincidan con el email
                User.findOne({email: params.email.toLowerCase()}, (err,user) => {
                    if(err) return res.status(500).send({
                        status:"error",
                        message:"Error de modificación"
                    });
                    else if(user) return res.status(200).send({
                        status:"error",
                        message:"El email no puede ser modificado"
                    });
                    else{
                        //Buscar y actualizar documento
                        User.findOneAndUpdate({_id:userId},params,{new:true},(err,userUpdated)=>{
                            if(err)return res.status(500).send({
                                status:"error",
                                message:"Error al actualizar usuario"
                            });
                            else if(!userUpdated)return res.status(200).send({
                                status:"error",
                                message:"No se ha actualizado el usuario"
                            });
                            else{
                                //Devolver respuesta
                                return res.status(200).send({
                                    status:"success",
                                    user: userUpdated
                                });
                            };
                        });//Condicion, datos a actualizar, opciones, callback;//new:true-> Devolvera los datos nuevos actualizados.
                    }
                });
            }
            else{
                //Buscar y actualizar documento
                User.findOneAndUpdate({_id:userId},params,{new:true},(err,userUpdated)=>{
                    if(err)return res.status(500).send({
                        status:"error",
                        message:"Error al actualizar usuario"
                    });
                    else if(!userUpdated)return res.status(200).send({
                        status:"error",
                        message:"No se ha actualizado el usuario"
                    });
                    else{
                        //Devolver respuesta
                        return res.status(200).send({
                            status:"success",
                            user: userUpdated
                        });
                    };
                });//Condicion, datos a actualizar, opciones, callback;//new:true-> Devolvera los datos nuevos actualizados.
            }
        }
        else return res.status(200).send({
            status:"error",
            message:"Datos incorrectos"
        });
    },
    uploadAvatar: function(req,res){
        //Configurar el modúlo multiparty (md). HECHO en routes/user.js

        //Recoger el fichero de la petición
        var file_name = "Avatar no subido";
        if(!Object.keys(req.files).length){
            return res.status(404).send({
                status:"error",
                message:file_name
            });
        }
        else{
            //Conseguir el nombre y la extensión del archivo subido
            const file_path = req.files.file0.path;
            const file_split = file_path.split("\\");

            //Nombre del archivo
            const file_name = file_split[2];

            //Extensión del archivo
            const ext_split = file_name.split("\.");
            const file_ext = ext_split[1];

            //Comprobar extensión (Solo imagenes), si no es valida, borrar fichero subido
            if(file_ext!=='png' && file_ext!=='jpg' && file_ext!=='jpeg' && file_ext!=='gif'){
                fs.unlink(file_path,(err)=>{
                    if(err)return res.status(200).send({
                        status:"error",
                        message:"Fallo la eliminación del archivo con extensión errónea."
                    });
                    else return res.status(200).send({
                        status:"error",
                        message:"La extensión del archivo no es valido."
                    });
                })
            }
            else{
                //Sacar el ID del usuario identificado
                const userId = req.user.sub;

                //Buscar y actualizar documento bd.
                User.findOneAndUpdate({_id:userId},{image: file_name},{new:true},(err,userUpdated)=>{
                    if(err || !userUpdated) return res.status(500).send({
                        status:"error",
                        message:"Usuario no encontrado"
                    });
                    //Devolver respuesta
                    else return res.status(200).send({
                        status:"success",
                        user:userUpdated
                    });
                });
            }
        }
    },
    avatar: function(req,res){
        const fileName = req.params.fileName;
        const pathFile = "./uploads/users/"+fileName;
        fs.exists(pathFile, (exists)=>{
            if(exists)return res.sendFile(path.resolve(pathFile));
            else return res.status(404).send({
                status:"error",
                message:"La imagen no existe"
            });
        });
    },
    getUsers: function(req,res){
        User.find().exec((err,users)=>{
            if(err||!users) return res.status(404).send({
                status:"error",
                message:"No hay usuarios que mostrar"
            });
            else return res.status(200).send({
                status:"success",
                users
            });
        });
    },
    getUser: function(req,res){
        const userId = req.params.userId;
        User.findById(userId).exec((err,user)=>{
            if(err||!user) return res.status(404).send({
                status:"error",
                message:"No existe el usuario"
            });
            else return res.status(200).send({
                status:"success",
                user
            });
        });
    }
};

module.exports = controller;