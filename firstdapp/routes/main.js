var express = require('express');
const { web3Object } = require('./../utils/web3');
var router = express.Router();

router.get('/', function(req, res) {

    res.render('pages/main', {
        title: 'Home page',
        station: "Hello"
    });
});

module.exports = router;