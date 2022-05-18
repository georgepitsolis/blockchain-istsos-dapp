var express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { PythonShell } = require('python-shell');

let doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));

var router = express.Router();

router.get('/', function(req, res) {
    doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));
    var nodeId = doc.current.port;

    let options = {
        mode: 'text',
        pythonPath: 'python3',
        pythonOptions: ['-u'], // get print all_stations in real-time
        scriptPath: '../pythonscripts',
        args: ['stations']
    };

    PythonShell.run('visualizeData.py', options, function(err, all_data) {
        if (err) console.log(err);
        
        res.render('pages/chart', {
            title: 'Visualize data',
            data: all_data,
            doc: doc,
            region: doc['node'][nodeId]
        });
    });
 
});


router.post('/set/ip', set_data_ip);
router.post('/set/db', set_data_db);
router.post('/take/measures', take_measures);

function set_data_ip(req, res, next) {
    doc.istsos.ip = req.body['input-ip'];
    doc.istsos.url = 'https://' + doc.istsos.ip + '/istsos/';
    fs.writeFile(process.env.YAML, yaml.dump(doc), (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/chart');
};

function set_data_db(req, res, next) {
    doc.istsos.db = req.body['input-db'];
    fs.writeFile(process.env.YAML, yaml.dump(doc), (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect('/chart');
};

function take_measures(req, res, next) {

    let options = {
        mode: 'text',
        pythonPath: 'python3',
        pythonOptions: ['-u'], // get print all_stations in real-time
        scriptPath: '../pythonscripts',
        args: ['json', req.body.station, req.body.startDate, req.body.endDate, req.body.sensor]
    };

    PythonShell.run('visualizeData.py', options, function(err, measures) {
        if (err) console.log(err);
        res.status(200).send({result: measures});
    });
    
};

module.exports = router;