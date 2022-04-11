var express = require('express');
const { web3Object } = require('./../utils/web3');
var router = express.Router();

var stationInfo = '';
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
    console.log();
    res.render('pages/main', {
        title: 'Home page',
        station: stationInfo.charAt(0) + stationInfo.slice(1).toLowerCase()
    });
});

module.exports = router;