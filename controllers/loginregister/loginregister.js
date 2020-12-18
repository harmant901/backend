const express = require('express');

// essentials

// AuthController.js
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config');
var User = require('../../model/User');

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

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://harmant901:manwar@harman2107project.njxma.mongodb.net/<dbname>?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true } );


exports.register = (req,res) => {
    // validate
    var iusername = req.body.username;
    var ipassword = req.body.password;

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
	username: req.body.username,
	password: hashedPassword
    },
    function(err, user) {
	if (err) res.status(500).send('error');

	var token = jwt.sign({ id: user.username }, config.secret, {
     		 expiresIn: 86400 // expires in 24 hours
   	 });

   	if(iusername != "" || ipassword != "") {
        
        MongoClient.connect(url, function(err, db) {
            if(err) throw err;
        
            var dbo = db.db("users");
        
            dbo.collection("user").insertOne({
                ID: uuidv4(),
                accounttype: 'Standard',
                avatar: "",
                username: iusername,
                password: ipassword,
                online: false
            },
            function(err, result) {
                if(err) throw err;
                console.log(result);
                db.close();
            }
            )
        });
    	console.log({auth: true, token: token});
        res.status(200).redirect('https://harman2107project.herokuapp.com/');
    } else {
        res.send('Please enter valid fields.');
    }
});
}

exports.login = (req, res) => {
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
           
        
        
        }
        )

        // set status

        var query = {username: iusername};
        var newval = {$set: {username: iusername, online: true}};

        dbo.collection("user").updateOne(query, newval, function(err, res) {
            if(err) {
            throw err;
        }

    
        db.close();
    });
    });

}

exports.setcookies = (req,res) => {
    res.cookie('username', session_username, {httpOnly: false});
    res.render('enablecookies', {
        username: session_username
    })
}