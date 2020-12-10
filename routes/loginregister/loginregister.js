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


// register route

router.post('/user/register', (req,res) => {
    // validate
    var iusername = req.body.username;
    var ipassword = req.body.password;

    if(iusername != "" || ipassword != "") {

        MongoClient.connect(url, function(err, db) {
            if(err) throw err;
        
            var dbo = db.db("users");
        
            dbo.collection("user").insertOne({
                ID: uuidv4(),
                accounttype: 'Standard',
                avatar: "",
                username: iusername,
                password: ipassword
            },
            function(err, result) {
                if(err) throw err;
                console.log(result);
                db.close();
            }
            )
        });
    
        res.send('Register Recieved!, you may now go back to the panel to login.');
    } else {
        res.send('Please enter valid fields.');
    }

   

});   

// login route


router.post('/user/login', (req, res) => {
    // check if user and password is correct
    var iusername = req.body.username;
    var ipassword = req.body.password;
   
    // set our global session variable
    session_username = iusername;
    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
    
        var dbo = db.db("users");
    
        dbo.collection("user").findOne({
           username: iusername,
           password: ipassword
        },
        function(err, result) {
            if(result) {
                res.redirect('http://' + req.headers.host + "/setcookies");
            } else {
                res.send('Invalid login credentials. Please go back and try again!');
            }
           
        
            db.close();
        }
        )
    });

});

//set cookies then send to home panel
router.get('/setcookies', (req,res) => {
    res.cookie('username', session_username, {httpOnly: false});
    res.render('enablecookies', {
        username: session_username
    })
});


module.exports = router;