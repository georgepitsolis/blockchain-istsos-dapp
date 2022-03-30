var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/timeline', {title: 'Bockchain history'});
});

module.exports = router;