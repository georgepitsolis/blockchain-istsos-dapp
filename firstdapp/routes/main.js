var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/main', {
        title: 'Home page',
        station: 'Asigonia'
    });
});

module.exports = router;