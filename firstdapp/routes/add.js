require('dotenv').config();
const express = require('express');
const formidable = require('formidable');
const path = require('path');
const { web3Object } = require('./../utils/web3');
const fs = require('fs');
const { resolve } = require('dns');
var router = express.Router();

var stationInfo = '';
function getStationInfo(){
    return new Promise(cur => {
        web3Object.contracts.meteo.deployed()
            .then(instance => {
                return instance.getStationInfo.call({ from: web3Object.account });
            }).then(info => {
                stationInfo = info;
            });
    }) 
}

router.get('/', function(req, res) {
    getStationInfo();
    let messages = req.flash("messages");
    if (messages.length == 0) messages = [];

    res.render('pages/add', {
        title: 'Add files page',
        station: stationInfo.charAt(0) + stationInfo.slice(1).toLowerCase(),
        messages: messages
    });
});

router.post('/upload/files', upload_files);

function upload_files(req, res, next){
    var form = new formidable.IncomingForm();
    form.multiples = true;

    var uploadFolder = path.join(__dirname, "uploads");
    // console.log("uploadFolder: ", uploadFolder);

    form.uploadDir = uploadFolder;
    // console.log("req.body: ",req.body);

    // Parsing
    form.parse(req, function(err, fields, files) {
        if (err) {
        console.log("Error parsing the files");
        return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
        });
        }
        
        const file = files.myFiles;
        const fileName = file.originalFilename;
        console.log("file name:", fileName);              

        // renames the file in the directory
        fs.rename(file.filepath, path.join(uploadFolder, fileName), function(err) {
            if (err) throw err;
        });          
    });

    const { PythonShell } = require('python-shell');

    let options = {
        mode: 'text',
        pythonPath: 'python3',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: '../pythonscripts',
        args: []
    };

    PythonShell.run('postMain.py', options, function(err, results) {
        if (err) console.log(err);
        // console.log('results: %j', results);
        res.status(200).send({result: results});
    });
};

module.exports = router;