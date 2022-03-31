"use strict"

const Topic = require("../models/topic");
const validator = require("validator");

const controller = {
    add: function(req,res){

        //Recoger el ID del topic de la URL
        const topicId = req.params.topicId;

        //Find por ID del topic
        Topic.findById(topicId).exec((err,topic)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Error en la petición"
            });
            else if(!topic) return res.status(404).send({
                status:"error",
                message:"No existe el tema"
            });
            else{
                //Comprobar objeto usuario y validar datos
                if(req.body.content){
                    //Validar datos
                    try {
                        var validate_content = !validator.isEmpty(req.body.content);
                    } catch (error) {
                        return res.status(404).send({
                            status:"error",
                            message:"No has comentado nada!"
                        });
                    }
                    if(validate_content){
                        const comment = {
                            content: req.body.content,
                            user: req.user.sub
                        };
                        //En la propiedad "comments" del objeto resultante, hacer un PUSH.
                        topic.comments.push(comment);

                        //Guardar el topic completo
                        topic.save((err)=>{
                            if(err) return res.status(500).send({
                                status:"error",
                                message:"Error al guardar el comentario"
                            });
                            //Devolver respuesta
                            else Topic.findById(topic._id)
                                .populate("user")
                                .populate("comments.user")
                                .exec((err,topic)=>{
                                    if(err) return res.status(500).send({
                                        status:"error",
                                        message:"Error en la petición"
                                    });
                                    else if(!topic) return res.status(404).send({
                                        status:"error",
                                        message:"No existe el topic"
                                    });
                                    else return res.status(200).send({
                                        status:"success",
                                        topic
                                    });
                                });
                        });
                    }
                }
                else res.status(404).send({
                    status:"error",
                    message:"No has realizado ningún comentario!"
                });
            }
        });
    },
    update: function(req,res){
        //Conseguir ID de comentario que llega por URL
        const commentId = req.params.commentId;

        //Recoger datos y validar
        const params = req.body;
        //Validar datos
        try {
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(404).send({
                status:"error",
                message:"No has comentado nada!"
            });
        }
        if(validate_content){
            //Find and update de subdocumento
            Topic.findOneAndUpdate(
                {"comments._id":commentId},
                {"$set":{//$set: Permitira actualizar datos del subdocumento "comments" del documento Topic.
                    "comments.$.content":params.content//comments.$.content: Donde el "$" significa el valor de la "_id" encontrada tras cumplir la condicion realizada anteriormente.
                }},{new:true},(error,topicUpdate)=>{
                    if(error) res.status(500).send({
                        status:"error",
                        message:"Error en la petición"
                    });
                    else if(!topicUpdate) res.status(404).send({
                        status:"error",
                        message:"El comentario no existe"
                    });
                    else return res.status(200).send({
                        status:"success",
                        topic:topicUpdate
                    });
                }
            );
        }
    },
    delete: function(req,res){
        //Sacar el ID del topic y del comentario a borrar
        const topicId = req.params.topicId;
        const commentId = req.params.commentId;

        //Buscar el topic
        Topic.findById(topicId,(error,topic)=>{
            if(error) res.status(500).send({
                status:"error",
                message:"Error en encontrar el Topic"
            });
            else if(!topic) res.status(404).send({
                status:"error",
                message:"El comentario no existe"
            });
            else{
                //Seleccionar el subdocumento (comentario)
                const comment = topic.comments.id(commentId);//Retorna el Objeto documento del comment con dicha ID.

                if(comment){
                    //Borrar el comentario
                    comment.remove();
        
                    //Guardar el topic
                    topic.save((err)=>{
                        if(err) res.status(500).send({
                            status:"error",
                            message:"Error en la eliminación del comentario"
                        });
                        //Devolver un resultado
                        else Topic.findById(topic._id)
                        .populate("user")
                        .populate("comments.user")
                        .exec((err,topic)=>{
                            if(err) return res.status(500).send({
                                status:"error",
                                message:"Error en la petición"
                            });
                            else if(!topic) return res.status(404).send({
                                status:"error",
                                message:"No existe el topic"
                            });
                            else return res.status(200).send({
                                status:"success",
                                topic
                            });
                        });
                    });
                }
                else return res.status(404).send({
                    status:"error",
                    message:"El comentario no existe"
                });
            }
        });
    }
};

module.exports = controller;