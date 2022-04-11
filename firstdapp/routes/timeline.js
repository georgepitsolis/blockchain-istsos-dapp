var express = require('express');
const { web3Object } = require('./../utils/web3');
var router = express.Router();

var stationInfo;
function getStationInfo(){
    return new Promise(cur => {
        web3Object.contracts.meteo.deployed()
            .then(instance => {
                return instance.getStationInfo.call({ from: web3Object.account });
            }).then(info => {
                stationInfo = info;
            });
    }) 
}

router.get('/', function(req, res) {
    getStationInfo();
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
                station: stationInfo.charAt(0) + stationInfo.slice(1).toLowerCase(),
                data: allData
            });
        });

});

module.exports = router;