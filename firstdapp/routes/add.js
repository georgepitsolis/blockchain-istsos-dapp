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

function upload_files(req, res, next){
    if(req.method == "POST") {

       // create an incoming form object
       var form = new formidable.IncomingForm();
       // specify that we want to allow the user to upload multiple files in a single request
       form.multiples = true;
       // store all uploads in the /uploads directory
       console.log("step 1");
       form.uploadDir = path.basename(path.dirname('./public/uploads/json_files'))
       // every time a file has been uploaded successfully,
       // rename it to it's orignal name
       console.log("step 2");

       form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name), function(err){
                console.log("step 3"); 
                if (err) throw err;
                    console.log('renamed complete: '+file.name);
                    const file_path = './public/uploads/'+file.name;
            });
            console.log(file.name);
       });
       console.log("step 4");

       // log any errors that occur
       form.on('error', function(err) {
           console.log('An error has occured: \n' + err);
       });
       console.log("step 5");

       // once all the files have been uploaded, send a response to the client
       form.on('end', function() {
            //res.end('success');
            res.statusMessage = "Process cashabck initiated";
            res.statusCode = 200;
            res.redirect('/')
            res.end()
       });
       console.log("step 6");

       // parse the incoming request containing the form data
       form.parse(req);
     }
 }

module.exports = router;