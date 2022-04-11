var express = require('express');
const { web3Object } = require('./../utils/web3');
var router = express.Router();

router.get('/', function(req, res) {

    web3Object.contracts.meteo.deployed()
        .then(instance => {
            return instance.getAllFiles.call({ from: web3Object.account });
        })
        .then(stationMesures => {
            var allData = [];
            for (let st of stationMesures) {
                allData.push(st);
            }
            res.render('pages/timeline', {
                title: "Blockchain history",
                station: 'Asigonia',
                data: allData
            });
        });

});

module.exports = router;