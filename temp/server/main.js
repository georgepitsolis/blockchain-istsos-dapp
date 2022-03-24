require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '127.0.0.1';

// Enter the path of YOUR project directory
// const proj_dir = `/home/amey/Projects/medium-tutorial`;

app.use(express.static('client'));
app.use(express.static('build/contracts'));

// Serves the home page of the project
app.get('/index', (req, res) => {
    res.sendFile(`/client/index.html`, {root: '.'});
});

app.get('*', (req, res) => {
    res.status(404);
    res.send('Oops... this URL does not exist');
});

app.listen(PORT, IP, () => {
    console.log(`HelloWorld Dapp running on port ${PORT}...`);
});