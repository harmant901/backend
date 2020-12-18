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

exports.home_panel = (req, res) => {
    console.log(process.env.API_BASE_URL);
    // grab current date
    var datetime = new Date();
    var upgradeddatetime = datetime.toISOString().slice(0, 10);
   if(req.cookies.username != req.params.username) { res.redirect('https://harman2107project.herokuapp.com/') }
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
          
          
            if(req.cookies) {
                res.render('home', {
                    username: req.params.username,
                    posts: result,
                    user: userdata,
                    date: upgradeddatetime
                });
            db.close();
           } else {
                res.render('error');
            db.close();
           }
        });
        
    });
}

exports.admin_panel = (req, res) => {
    if(!req.cookies.username) { res.redirect('https://harman2107project.herokuapp.com/');  }   
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("reportedposts");

        dbo.collection("reportedpost").find({}).toArray(function(err, result) {
          
            
            if(req.cookies) {
                res.render('reportedposts', {
                    reportedposts: result,
                    username: req.cookies.username
                });
            db.close();
           } else {
                res.render('error');
                db.close();
           }
        });
        
    });
}

exports.user_settings = (req, res) => {
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
    
}

exports.create_listing = (req, res) => {
    res.render('listingcreate', {
        username: req.params.username
    });
}

exports.post_created = (req, res) => {
    res.render('postcreated', {
        username: req.cookies.username
    });
}

exports.users = (req, res) => {
    
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("users");


        
        dbo.collection("user").find({}).toArray(function(err, result) {
          
            res.send(result);
            
        });
        
    });
}