var express = require('express');
const { web3Object } = require('./../utils/web3');
var router = express.Router();

router.get('/', function(req, res) {

    web3Object.contracts.meteo.deployed()
        .then(instance => {
            return instance.getFileHistory.call("ASI", { from: web3Object.account });
        })
        .then(stationMesures => {
            var allData = [];
            for (let el of stationMesures) {
                allData.push(el.period);
            }
            res.render('pages/timeline', {
                title: "Blockchain history",
                data: allData
            });
        });

});

module.exports = router;