var express = require('express');
const { web3Object } = require('./../utils/web3');
var router = express.Router();

var stationInfo = '';
// function getStationInfo(){
//     return new Promise(cur => {
//         web3Object.contracts.meteo.deployed()
//             .then(instance => {
//                 return instance.getStationInfo.call({ from: web3Object.account });
//             }).then(info => {
//                 stationInfo = info;
//             });
//     }) 
// }

router.get('/', function(req, res) {
    res.render('pages/login', {
        title: 'Login page',
        station: stationInfo
    });
});

router.get('/login', function(req, res) {
    getStationInfo();
    res.redirect('/main');
});

module.exports = router;