const express = require('express');

// essentials

// AuthController.js
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config');
var User = require('../../model/User');

const router = express.Router();
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');

// unique user id
const { v4: uuidv4 } = require('uuid');


// for file uploads
var multer = require('multer');
var uploadDestination = multer({dest: 'public/images'});
var uniqid = require('uniqid');
var fs = require('fs');

//mongodb database

var pug = require('pug');

// session variables

var session_username;

// controller

const LoginRegisterController = require('../../controllers/loginregister/loginregister');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));   


router.use(cookieParser());

// mongodb credentials

let MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://harmant901:manwar@harman2107project.njxma.mongodb.net/<dbname>?retryWrites=true&w=majority"

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://harmant901:manwar@harman2107project.njxma.mongodb.net/<dbname>?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true } );

// register route

router.post('/user/register', LoginRegisterController.register );   

// login route


router.post('/user/login', LoginRegisterController.login);

//set cookies then send to home panel
router.get('/setcookies', LoginRegisterController.setcookies);


module.exports = router;
