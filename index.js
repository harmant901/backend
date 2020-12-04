const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'pug');



const port = process.env.PORT || 8080;

// access our external routes


app.use('/', require('./routes/loginregister/loginregister'));
app.use('/', require('./routes/pageviews/pageviews'));
app.use('/logout', require('./routes/logout/logout'));
app.use('/user', require('./routes/postdelete/postdelete'));

app.use(express.static(path.join(__dirname, 'public')));


//allow access to images
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});