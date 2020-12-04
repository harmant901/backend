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


// upload avatar

router.post('/upload', uploadDestination.single('avatar'), (req, res) => {
    if(!req.file.filename) {
        res.render('error');
    } else {
        var nfilename = req.cookies.username + "-" + uniqid() + '.png';

    fs.rename('public/images/'+req.file.filename, 'public/images/'+nfilename, (err) => {
        if(err) {
            console.log('error renaming');
        } else {
            console.log('renamed')  
        }
        
    });

    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
    
        var dbo = db.db("users");
    
        var query = {username: req.cookies.username};
        var newval = {$set: {username: req.cookies.username, avatar: nfilename}};

        dbo.collection("user").updateOne(query, newval, function(err, res) {
            if(err) {
                throw err;
            }

            console.log('Record avatar updated.');
            db.close();
        });
       
    });
    
    res.redirect('/user/panel/' + req.cookies.username + '/profile/settings');
    }
    
});


// delete avatar

router.post('/delete', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
    
        var dbo = db.db("users");
    
        dbo.collection("user").find({}).toArray(function(err, result) {
          
            // result[0].avatar
            var fileToRemove = result[0].avatar;
            var path = 'public/images/' + fileToRemove;
            // remove file
            
            fs.unlink(path, (err) => {
                if(err) {
                    console.log('unable to delete file');
                } else {
                    console.log('Avatar file successfully removed');
                }
            }); 
             
        });
       
    });

    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
    
        var dbo = db.db("users");
    
        var query = {username: req.cookies.username};
        var newval = {$set: {username: req.cookies.username, avatar: ""}};

        dbo.collection("user").updateOne(query, newval, function(err, res) {
            if(err) {
                throw err;
            }

            console.log('Record avatar updated.');
            db.close();
        });
       
    });
    
    res.redirect('/user/panel/' + req.cookies.username + '/profile/settings');
});
 
module.exports = router;