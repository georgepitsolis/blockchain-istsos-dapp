require('dotenv').config();
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/add', {
        title: 'Add files page'
    });
});

router.post('/upload/data', function(req, res) {
    
})
module.exports = router;