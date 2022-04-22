var express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
let doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));

var router = express.Router();

router.get('/', function(req, res) {
    doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));

    const { PythonShell } = require('python-shell');

    let options = {
        mode: 'text',
        pythonPath: 'python3',
        pythonOptions: ['-u'], // get print all_stations in real-time
        scriptPath: '../pythonscripts',
        args: ['stations']
    };

    PythonShell.run('visualizeData.py', options, function(err, all_stations) {
        if (err) console.log(err);
        // if (all_stations[0] != "error") {
            
        // }else {
        //     all_stations.push(false);  
        // }
        // console.log(all_stations);
        res.render('pages/chart', {
            title: 'Visualize data',
            stations: all_stations,
            doc: doc
        });
    });
 
});


router.post('/set/ip', set_data_ip);
router.post('/set/db', set_data_db);

function set_data_ip(req, res, next) {
    doc.istsos.ip = req.body['input-ip'];
    doc.istsos.url = 'http://' + doc.istsos.ip + '/istsos/';
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
module.exports = router;