require('dotenv').config();
var express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');

let doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));

var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/login', {
        title: 'Login page'
    });
});

router.post('/select', selectRegion);

function selectRegion(req, res, next) {
    doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));

    doc.current.port = req.body['select-region'];
    doc.current.url = 'http://127.0.0.1:' + req.body['select-region'];

    // var nodeStr = req.body['select-region'];
    // var region = 'PORT_' + nodeStr;
    // var node = parseInt(nodeStr);

    fs.writeFile(process.env.YAML, yaml.dump(doc), (err) => {
        if (err) {
            console.log(err);
        }
    });
    let { web3Object } = require('./../utils/web3');
    res.redirect('/main');
};

module.exports = router;