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

exports.get_post = (req, res) => {
    res.render('reportpost', {
        postID: req.params.postid
    });
}

exports.initiate_post = (req, res) => {
    let MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://harmant901:manwar@harman2107project.njxma.mongodb.net/<dbname>?retryWrites=true&w=majority"

    // grab fields

    var reason = req.body.reason;
    var message = req.body.reasondetails;

    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("reportedposts");
        dbo.collection("reportedpost").insertOne({
            postID: req.params.postid,
            reportReason: reason,
            reportMessage: message
        },
        function(err, result) {
            if(err) throw err;
            db.close();
            res.render('reportposted', {
                username: req.cookies.username
            });
        });
    });
    
    }