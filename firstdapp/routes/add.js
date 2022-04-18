require('dotenv').config();
const express = require('express');
const formidable = require('formidable');
const path = require('path');
const { web3Object } = require('./../utils/web3');
const fs = require('fs');
const yaml = require('js-yaml');
let doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));

var router = express.Router();

router.get('/', function(req, res) {
    let messages = req.flash("messages");
    if (messages.length == 0) messages = [];

    res.render('pages/add', {
        title: 'Add files page',
        station: "Hello",
        messages: messages,
        doc: doc
    });
});

router.post('/upload/files', upload_files);
router.post('/set/ip', set_data_ip);
router.post('/set/db', set_data_db);

function upload_files(req, res, next){
    var form = new formidable.IncomingForm();
    form.multiples = true;

    var uploadFolder = path.join(__dirname, "uploads");
    form.uploadDir = uploadFolder;

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
        // console.log("file name:", fileName);              

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
        console.log('results: %j', results);
        if(results && results[0] != 'error') {
            newF = results[2].split('@').slice(1);
            upload_to_blockchain(res, results, newF[0], newF[1] ,newF[2], newF[3], newF[4]);
        }else {
            res.status(200).send({result: results});
        }
    });
};

function set_data_ip(req, res, next) {
    doc.istsos.ip = req.body['input-ip'];
    doc.istsos.url = 'http://' + doc.istsos.ip + '/istsos/';
    fs.writeFile(process.env.YAML, yaml.dump(doc), (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/add');
};

function set_data_db(req, res, next) {
    doc.istsos.db = req.body['input-db'];
    fs.writeFile(process.env.YAML, yaml.dump(doc), (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/add');
};

function upload_to_blockchain(res, results, fullName, name, data, firstM, lastM) {
    web3Object.contracts.meteo.deployed()
    .then(instance => {
        console.log(name, fullName, data);
        return instance.verifyData.call(name, fullName, data, { from: web3Object.account });
    })
    .then(existfile => {
        if (!existfile) {
            web3Object.contracts.meteo.deployed()
            .then(instance2 => {
                console.log(fullName);
                return instance2.addFile.sendTransaction(fullName, name, data, firstM, lastM, { from: web3Object.account });
            });
        }else {
            results.unshift('already');
        }
        // console.log(results);
        res.status(200).send({result: results});
    }); 
};

module.exports = router;