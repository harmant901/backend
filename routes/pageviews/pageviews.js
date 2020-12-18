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

// import controller

const PageViewsController = require('../../controllers/pageviews/pageviews');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));   


router.use(cookieParser());

// mongodb credentials

let MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://harmant901:manwar@harman2107project.njxma.mongodb.net/<dbname>?retryWrites=true&w=majority"


// home panel

router.get('/user/panel/:username', PageViewsController.home_panel);

// reported posts (for admins) page

router.get('/user/panel/:username/profile/reportedposts', PageViewsController.admin_panel);

// user settings page

router.get('/user/panel/:username/profile/settings', PageViewsController.user_settings);

// listing page & create listing page

router.get('/user/panel/:username/createlisting', PageViewsController.create_listing);

// post created page

router.get('/post', PageViewsController.post_created);


// get user route
router.get('/users', PageViewsController.users);





 
module.exports = router;
