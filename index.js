const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.set('view engine', 'pug');

//Allow all the things
const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET, POST, DELETE, PUT"
}
// use cors

app.use(cors(corsOptions));


const port = 8000;


// access our external routes


app.use('/', require('./routes/loginregister/loginregister'));
app.use('/', require('./routes/pageviews/pageviews'));
app.use('/logout', require('./routes/logout/logout'));
app.use('/user', require('./routes/postdelete/postdelete'));
app.use('/user/avatar', require('./routes/avatarupload/avatarupload'));

app.use(express.static(path.join(__dirname, 'public')));


//allow access to images
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});