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




exports.approve = (req, res) => {
    var mongo = require('mongodb');
    var oid = mongo.ObjectID(req.params.reportedpostid);
    // delete post
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
    
        var dbo = db.db("posts");
        
        
        dbo.collection("post").deleteOne({_id: oid}, function(err, result) {
            if(err) throw err;
            console.log(result);
            console.log('Post deleted');
        });
        
        
    });

    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
    
        var dbo = db.db("reportedposts");
        
        dbo.collection("reportedpost").deleteOne({postID: req.params.reportedpostid}, function(err, result) {
            if(err) throw err;
            
        });
        
        db.close();
    });

    res.redirect('/user/panel/'+req.cookies.username+'/profile/reportedposts')
    
}

exports.deny =  (req, res) => {
    // delete report record

    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
    
        var dbo = db.db("reportedposts");
        
        dbo.collection("reportedpost").deleteOne({postID: req.params.reportedpostid}, function(err, result) {
            if(err) throw err;
            
        });
        
        db.close();
    });

    res.redirect('/user/panel/'+req.cookies.username+'/profile/reportedposts')
}