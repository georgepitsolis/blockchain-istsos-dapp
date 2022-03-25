require('dotenv').config();
const express = require('express');
const chalk = require("chalk");

const PORT = process.env.SERVER_PORT || 3000;
const IP = process.env.SERVER_IP || "127.0.0.1";
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('pages/main');
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.get('*', (req, res) => {
    res.status(404);
    res.send('Oops... this URL does not exist');
});

app.listen(PORT, IP, () => {
    console.log(chalk.green(`🚀 Server running on port ${PORT}!`));
});