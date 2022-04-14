var express = require('express');
const { web3Object } = require('web3');

const stationInfo = '';

async function getStationInfo(){
    let promise = new Promise(cur => {
        web3Object.contracts.meteo.deployed()
            .then(instance => {
                return instance.getStationInfo.call({ from: web3Object.account });
            }).then(info => {
                stationInfo = info;
            });
    });
    return await promise; 
}

getStationInfo();

module.exports = { stationInfo };