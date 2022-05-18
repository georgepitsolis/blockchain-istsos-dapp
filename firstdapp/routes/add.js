require('dotenv').config();
const express = require('express');
const formidable = require('formidable');
const Web3 = require('web3');
const path = require('path');
let { web3Object } = require('./../utils/web3');
const fs = require('fs');
const yaml = require('js-yaml');

let doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));

var router = express.Router();

router.get('/', function(req, res) {
    doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));
    var nodeId = doc.current.port;
    
    res.render('pages/add', {
        title: 'Add files page',
        doc: doc,
        region: doc['node'][nodeId]
    });
});

router.post('/upload/files', upload_files);
router.post('/set/ip', set_data_ip);
router.post('/set/db', set_data_db);


function upload_files(req, res, next){
    var form = new formidable.IncomingForm();
    form.multiples = true;

    var uploadFolder = path.join(__dirname, "uploads/");
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
        fs.renameSync(file.filepath, path.join(uploadFolder, fileName));

        fs.readdirSync(uploadFolder).forEach(file => {
            console.log(file);
            check_region(res, path.join(uploadFolder, fileName), uploadFolder);

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
        
        if (results != null) {
            var check = results.find(x => x == 'error');
            if(results && check == null) {
                newF = results[2].split('@').slice(1);
                upload_to_blockchain(res, results, newF[0], newF[1] ,newF[2], newF[3], newF[4]);
            }else {
                res.status(200).send({result: results});
            }
        }else {
            res.status(200).send({result: results});
        }
        
    });
};

function set_data_ip(req, res, next) {
    doc.istsos.ip = req.body['input-ip'];
    doc.istsos.url = 'https://' + doc.istsos.ip + '/istsos/';
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


async function check_region(res, stationPath, stationRoad) {
    console.log("stationPath: ", stationPath);
    var stationName = stationPath.split('/').pop().split("_")[0].toUpperCase();
    console.log("stationName: ", stationName);

    await web3Object.initWeb3();
    await web3Object.initAccount();
    await web3Object.initContractMeteo();
    let instance2 = await web3Object.contracts.meteo.deployed();
    let verified = await instance2.verifyRegion.call(stationName, { from: web3Object.account });
    
    // var outputEr = [];
    console.log(stationName, "verified: ", verified);
    if (!verified) {
        fs.renameSync(stationPath, path.join(stationRoad, 'error!' + stationName + '.txt'));
    }
}

async function upload_to_blockchain(res, results, fullName, name, hash, firstM, lastM) {
    await web3Object.initWeb3();
    await web3Object.initAccount();
    await web3Object.initContractMeteo();
    // console.log(web3Object.web3Provider);
    let instance = await web3Object.contracts.meteo.deployed();
    let existFile = await instance.verifyHash.call(name, fullName, hash, { from: web3Object.account });
    
    console.log("Exitstfile:", existFile);
    if (!existFile) 
        await instance.addFile.sendTransaction(fullName, name, hash, firstM, lastM, { from: web3Object.account });
    else 
        results.unshift('already');
    return res.status(200).send({result: results});

};

module.exports = router;