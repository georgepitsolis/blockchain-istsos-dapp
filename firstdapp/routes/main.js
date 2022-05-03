var express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const { web3Object } = require('./../utils/web3');

let doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));

var router = express.Router();

router.get('/', function(req, res) {
    doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));
    var nodeId = doc.current.port;

    res.render('pages/main', {
        title: 'Home page',
        region: doc['node'][nodeId]
    });
});

module.exports = router;