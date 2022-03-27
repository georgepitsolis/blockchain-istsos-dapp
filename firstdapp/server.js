require('dotenv').config();
const express = require('express');
const chalk = require("chalk");
const path = require('path');

const PORT = process.env.SERVER_PORT || 3000;
const IP = process.env.SERVER_IP || "127.0.0.1";
const app = express();

// set the view engine to ejs
// app.use(express.static(path.join(__dirname, 'views/css')));
app.set('view engine', 'ejs');
// app.set('views', 'views')
// app.use(express.static('app.js'));
// app.use(express.static('build/contracts'));
// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('pages/main');
});

// add page
app.get('/add', function(req, res) {
    res.render('pages/add');
});

// about page
app.get('/chart', function(req, res) {
    res.render('pages/chart');
});

// about page
app.get('/timeline', function(req, res) {
    res.render('pages/timeline');
});

app.get('*', (req, res) => {
    res.status(404);
    res.send('Oops... this URL does not exist');
});

app.listen(PORT, IP, () => {
    console.log(chalk.green(`🚀 Server running on port ${PORT}!`));
});