require('dotenv').config();
var express = require('express');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
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
        res.end();
        
    });

 }

module.exports = router;