require('dotenv').config();
const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/add', {
        title: 'Add files page'
    });
});

router.post('/upload/files', upload_files);

async function upload_files(req, res, next){
    var form = new formidable.IncomingForm();
    form.multiples = true;

    var uploadFolder = path.join(__dirname, "uploads");
    // console.log("uploadFolder: ", uploadFolder);

    form.uploadDir = uploadFolder;
    // console.log("req.body: ",req.body);

    // Parsing
    form.parse(req, async function(err, fields, files) {
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
        
        res.statusMessage = "Process cashabck initiated";
        res.statusCode = 200;
        res.redirect('/');
        res.end();
        
    });
};

router.post('/run/python', run_python_scripts);

async function run_python_scripts(req, res, next) {
    const { PythonShell } = require('python-shell');

    let options = {
        mode: 'text',
        pythonPath: 'python3',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: '../pythonscripts',
        args: []
    };

    PythonShell.run('postMain.py', options, async function(err, results) {
        if (err) console.log(err);
        // results is an array consisting of messages collected during execution

        outputconsole.Value = results;
        console.log('results: %j', results);

        
    });

    res.statusMessage = "Process cashabck initiated";
    res.statusCode = 200;
    res.redirect('/');
    res.end();

};


module.exports = router;