var express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { web3Object } = require('./../utils/web3');
const yaml = require('js-yaml');

let doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));

var router = express.Router();

router.get('/',async function(req, res) {
    doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));
    var nodeId = doc.current.port;

    let instance = await web3Object.contracts.meteo.deployed();
    let stationMesures = await instance.getAllFiles.call({ from: web3Object.account });
    var allData = [];
    for (let st of stationMesures) {
        allData.push(st);
    }
    res.render('pages/timeline', {
        title: 'Blockchain history',
        data: allData,
        region: doc['node'][nodeId]
    });

});

router.post('/verify', verify_file);

function verify_file(req, res, next){
    var form = new formidable.IncomingForm();
    form.multiples = false;

    var verifyFolder = path.join(__dirname, "verify");
    form.uploadDir = verifyFolder;

    form.parse(req, function(err, fields, files) {
        if (err) {
        console.log("Error parsing the files");
        return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
        });
        }
        
        const file = files.myFile;
        const fileName = file.originalFilename;
        // console.log("file name:", fileName);              

        // renames the file in the directory
        fs.rename(file.filepath, path.join(verifyFolder, fileName), function(err) {
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

    PythonShell.run('verifyData.py', options, function(err, results) {
        if (err) console.log(err);
        if (results[0] != "error") {
            web3Object.contracts.meteo.deployed()
            .then(instance => {
                return instance.verifyHash.call(results[0], results[1], results[2], { from: web3Object.account });
            })
            .then(existData => {
                let anw = false;
                if (existData) {
                    anw = true;
                }
                results.push(anw);
                res.status(200).send({result: results});
            });
        }else {
            results.push(false);
            res.status(200).send({result: results});
        }
        console.log(results);
        
    });
}

module.exports = router;