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

exports.post_listing = (req, res) => {
    
    if(!req.file) { res.render('error') }
	
    // connect to database and add
    // grab post title and message
    var postTitle = req.body.title;
    var postMessage = req.body.message;

    console.log('File name: ' + req.file.filename);
    // change filename
    var nfilename = uniqid() + '.png';
   
    fs.rename('public/images/'+req.file.filename, 'public/images/'+nfilename, (err) => {
        if(err) {
            console.log('error renaming');
        } else {
            console.log('renamed')  
        }
        
    });

    // grabbing date information, then piecing together
    var d = new Date(); 
    
    var day, dayOfMonth, month, year;

    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    day = days[d.getDay()];

    dayOfMonth = d.getDate();

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    month = months[d.getMonth()];

    year = d.getFullYear();

    var date = "Posted on " + day + " " + month + " " + dayOfMonth + ", " + year;
    

    // finally, post to database
    
    
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
    
        var dbo = db.db("posts");
    
        dbo.collection("post").insertOne({
            Author: req.cookies.username,
            listingTitle: postTitle,
            postMessage: postMessage,
            fileImageName: nfilename,
            timeOfPost: date

        },
        function(err, result) {
            if(err) throw err;
            
            db.close();
        }
        )
    });
    
   
 res.redirect('/post?=success');

}

exports.delete_listing = (req, res) => {
    var postImageId = req.params.postimageID;

    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
        var dbo = db.db("posts");
        dbo.collection("post").deleteOne({
            fileImageName: postImageId
        },
        function(err, result) {
            if(err) throw err;
            res.render('postdeleted', {
                username: req.cookies.username
            })
            db.close();
        }
        )
     
        });
}