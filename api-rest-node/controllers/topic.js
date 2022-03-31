"use strict"

const validator = require("validator");
const Topic = require("../models/topic");

const controller = {
    save: function(req,res){
        //Recoger parametros por POST
        const params = req.body;

        //Validar datos
        try {
        var validate_title = !validator.isEmpty(params.title);
        var validate_content = !validator.isEmpty(params.content);
        var validate_lang = !validator.isEmpty(params.lang);
        } catch (error) {
            return res.status(200).send({
                status:"error",
                message:"Faltan datos por envíar"
            });
        }
        if(validate_title && validate_content && validate_lang){
            //Crear objeto a guardar
            let topic = new Topic();

            //Asignar valores
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;
            
            //Guardar el topic
            topic.save((err,topicStored)=>{
                if(err||!topicStored) res.status(404).send({
                    status:"error",
                    message:"El tema no se ha guardado"
                });
                //Devolver una respuesta
                return res.status(200).send({
                    status:"success",
                    topic: topicStored
                });
            });
        }
        else{
            return res.status(200).send({
                status:"error",
                message:"Los datos no son válidos"
            });
        }
    },
    getTopics: function(req,res){
        //Cargar la librería de paginación en la clase. HECHO en el modelo Topic.

        //Recoger la página actual
        const page = !req.params.page ? 1 : parseInt(req.params.page) ? parseInt(req.params.page) : 1;

        //Indicar las opciones de paginación
        const options = {
            sort: { date: -1 },//Ordenado de más nuevo a más viejo
            populate: "user",//Agarra la ID del req.body.user, y carga el objeto documento completo del Usuario con esa ID.
            limit: 5,//Habra 5 topics por página
            page: page
        };

        //Find paginado
        Topic.paginate({},options,(err, topics)=>{
            if(err)return res.status(500).send({
                status:"error",
                message:"Error al realizar la consulta"
            });
            else if(!topics) return res.status(404).send({
                status:"notfound",
                message:"No hay topics"
            });
            //Devolver resultado (topics, total de topics, total de paginas)
            else return res.status(200).send({
                status:"success",
                topics:topics.docs,
                totalDocs: topics.totalDocs,
                totalPage: topics.totalPages
            });
        });
    },
    getTopicsByUser: function(req,res){
        //Conseguir el ID del usuario
        const userId = req.params.user;

        if (userId){
            //Find con la condición del usuario
            Topic.find({user:userId})
            .sort([["date","descending"]])
            .exec((err,topics)=>{
                if(err) return res.status(500).send({
                    status:"error",
                    message:"Error en la petición"
                });
                else if (!topics) return res.status(404).send({
                    status:"error",
                    message:"No hay temas para mostrar"
                });
                //Devolver un resultado
                else return res.status(200).send({
                    status:"success",
                    topics
                });
            });
        }
    },
    getTopic: function(req,res){
        //Sacar el ID del topic de la URL
        var topicId = req.params.id;
        //Find por ID del topic
        Topic.findById(topicId)
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
    },
    update: function(req,res){
        //Recoger el ID del topic de la url
        const topicId = req.params.id;

        //Recoger los datos del req
        const params = req.body;

        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
            } catch (error) {
            return res.status(200).send({
                status:"error",
                message:"Faltan datos por envíar"
            });
        }
        if(validate_title && validate_content && validate_lang){
            //Montar un JSON con los datos a modificar en la bd
            const update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            };

            //Find and update del topic por ID del params debe ser igual al del ID del usuario
            Topic.findOneAndUpdate({_id:topicId, user:req.user.sub},update,{new:true},(err,topicUpdated)=>{
                if(err) return res.status(500).send({
                    status:"error",
                    message:"Error en la petición"
                });
                else if(!topicUpdated) return res.status(404).send({
                    status:"error",
                    message:"No se ha actualizado el Topic"
                });
                else return res.status(200).send({
                    status:"success",
                    topic: topicUpdated
                });
            });
        }
        else{
            return res.status(200).send({
                status:"error",
                message:"Los datos no son válidos"
            });
        }
    },
    delete: function(req,res){
        //Sacar el ID del topic de la URL
        const topicId = req.params.id;
        //Find and delete por TopicID y por userID
        Topic.findOneAndDelete({_id:topicId,user:req.user.sub},(err,topicRemoved)=>{
            if(err) return res.status(500).send({
                status:"error",
                message:"Error en la petición"
            });
            else if(!topicRemoved) return res.status(404).send({
                status:"error",
                message:"No se ha borrado el tema"
            });
            else return res.status(200).send({
                status:"success",
                topic:topicRemoved
            });
        });
    },
    search: function(req,res){
        //Sacar String a buscar de la URL
        const searchString = req.params.search;

        //Find or
        Topic.find({
            "$or":[//Es una condicional OR, que buscara las coincidencias listadas a continuación y si algo coincide, retorna el dato. 
                {"title":{"$regex":searchString,"$options":"i"}},//$regex->Si coincide con la siguiente cadena condicional regular, $options->"i" es para que coincida sin importar si es mayús o minusculas.
                {"content":{"$regex":searchString,"$options":"i"}},
                {"code":{"$regex":searchString,"$options":"i"}},
                {"lang":{"$regex":searchString,"$options":"i"}}
            ]
        })
        .populate("user")
        .sort([["date","descending"]])
        .exec((err,topics)=>{
            if(err)return res.status(500).send({
                status: "error",
                message:"Error en la petición"
            });
            else if(!topics) return res.status(404).send({
                status:"error",
                message:"No hay temas disponibles"
            });
            else return res.status(200).send({
                status:"success",
                topics
            })
        });
    }
}

module.exports = controller;