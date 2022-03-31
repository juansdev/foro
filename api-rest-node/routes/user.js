"use strict"

var express = require("express");
var UserController = require("../controllers/user");//Importo el controlador User.

var router = express.Router();
var md_auth = require("../middlewares/authenticated"); 

const multipart = require("connect-multiparty");
const md_upload = multipart({uploadDir:"./uploads/users"});//Configuramos el multipart, definiendo la ruta donde se guardaran los archivos subidos por el usuario en: "upload/user".

//Rutas de usuarios
router.post("/register",UserController.save);
router.post("/login",UserController.login);
router.put("/user/update", md_auth.authenticated, UserController.update);
router.post("/upload-avatar", [md_auth.authenticated,md_upload], UserController.uploadAvatar);
router.get("/avatar/:fileName",UserController.avatar);
router.get("/users",UserController.getUsers);
router.get("/user/:userId",UserController.getUser);

module.exports = router; 