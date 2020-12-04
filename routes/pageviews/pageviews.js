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

// default

router.get('/', (req, res) => {
    res.send('Tester'); 
});

// home panel

router.get('/user/panel/:username', (req, res) => {
   // check if user actually logged in correctly.
  
    // query the database, then send the data into the render
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("posts");

        dbo.collection("post").find({}).toArray(function(err, result) {
          
            console.log(result);
            if(req.cookies) {
                res.render('home', {
                    username: req.params.username,
                    posts: result
                });
           } else {
                res.render('error');
           }
        });
        
    });

   
});

// user settings page

router.get('/user/panel/:username/profile/settings', (req, res) => {
    res.render('usersettings', {
        username: req.cookies.username
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




 
module.exports = router;