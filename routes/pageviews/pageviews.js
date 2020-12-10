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


// home panel

router.get('/user/panel/:username', (req, res) => {
   
   var userdata;
    
    // query the database, then send the data into the render

    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("users");


        
        dbo.collection("user").find({}).toArray(function(err, result) {
          
            userdata = result;
            
        });
        
    });



    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("posts");

        dbo.collection("post").find({}).toArray(function(err, result) {
          
            console.log(result);
            if(req.cookies) {
                res.render('home', {
                    username: req.params.username,
                    posts: result,
                    user: userdata
                });
           } else {
                res.render('error');
           }
        });
        
    });

   
});

// user settings page

router.get('/user/panel/:username/profile/settings', (req, res) => {
    // query the database, then send the data into the render
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("users");

        dbo.collection("user").find({}).toArray(function(err, result) {
          
            
            if(req.cookies) {
                res.render('usersettings', {
                    username: req.params.username,
                    user: result
                });
           } else {
                res.render('error');
           }
        });
        
    });
    
});

// listing page & create listing page

router.get('/user/panel/:username/createlisting', (req, res) => {
    res.render('listingcreate', {
        username: req.params.username
    });
});

// post created page

router.get('/post', (req, res) => {
    res.render('postcreated', {
        username: req.cookies.username
    });
});


// get user route
router.get('/users', (req, res) => {
    
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("users");


        
        dbo.collection("user").find({}).toArray(function(err, result) {
          
            res.send(result);
            
        });
        
    });
});





 
module.exports = router;