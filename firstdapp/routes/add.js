var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/add', {
        title: 'Add files page',
        selected_files: [
            {
            station_name:'ASIGONIA',
            file_name:'ASIGONIA_20220328193.txt' 
            }, {
            station_name:'ASIGONIA',
            file_name:'ASIGONIA_20220328193.txt' 
            }            
        ]        
    });
});

module.exports = router;