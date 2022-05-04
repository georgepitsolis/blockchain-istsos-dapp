require('dotenv').config();
var express = require('express');
var chalk = require('chalk');
var path = require('path');
const flash = require('connect-flash');
const session = require('express-session');

// Set all routes
var main = require('./routes/main');
var login = require('./routes/login');
var add = require('./routes/add');
var chart = require('./routes/chart');
var timeline = require('./routes/timeline');
// End of setting routes

var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(flash());
app.use(session({
    secret: "ThisShouldBeSecret",
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.SERVER_PORT || 3000;
const IP = process.env.SERVER_IP || '127.0.0.1';

// set the view engine to ejs
// app.use(express.static(path.join(__dirname, 'views/css')));

// app.use(express.static('app.js'));
// app.use(express.static('build/contracts'));
// use res.render to load up an ejs view file

// Use pages
app.use('/', login);             // Login page
app.use('/main', main);       // Main page
app.use('/add', add);           // Add to istSOS
app.use('/chart', chart);       // Visualize data
app.use('/timeline', timeline); // BLockchain history
// End of pages

app.get('*', (req, res) => {
    res.status(404);
    res.send('Oops... this URL does not exist');
});

app.listen(PORT, IP, () => {
    console.log(chalk.green(`🚀 Server running on port ${PORT}!`));
});