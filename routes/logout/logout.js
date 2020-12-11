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
var url = "mongodb+srv://harmant901:manwar@harman2107project.njxma.mongodb.net/<dbname>?retryWrites=true&w=majority"


router.post('/', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("users");

        var query = {username: req.cookies.username};
        var newval = {$set: {username: req.cookies.username, online: false}};

        dbo.collection("user").updateOne(query, newval, function(err, res) {
            if(err) {
                throw err;
            }

            console.log('Record avatar updated.');
            db.close();
        });
        
    });
    //clear cookies and redirect
    res.clearCookie('username');
    session_username = "";
    res.redirect('/');
    // testing
});

 
module.exports = router;