const express = require('express');

// essentials

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



router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));   


router.use(cookieParser());

// mongodb credentials

let MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://harmantiwana:manwar123@cluster0.nmhm9.mongodb.net/<dbname>?retryWrites=true&w=majority"


router.post('/', (req, res) => {
    //clear cookies and redirect
    res.clearCookie('username');
    session_username = "";
    res.redirect('/');
    // testing
});

 
module.exports = router;