var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/chart', {
        title: 'Visualize data',
        station: 'Asigonia'
    });
});

module.exports = router;