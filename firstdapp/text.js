require('dotenv').config();
 
const Web3 = require('web3');
const TruffleContract = require('truffle-contract');
const fs = require('fs');
 
class w3 {
 
    constructor() {
        this.web3 = null;
        this.web3Provider = null;
        this.contracts = {};
        this.account = null;
    }
 
    async initWeb3() {
        if (process.env.MODE == 'development' || typeof web3 === 'undefined'){
            this.web3Provider = new Web3.providers.HttpProvider(process.env.LOCAL_NODE);
        }
        else {
            this.web3Provider = web3.currentProvider;
        }
        this.web3 = new Web3(this.web3Provider);
    }
 
    async initAccount() {
        this.web3.eth.getAccounts((err, accounts) => {
            if (err) console.log(err);
 
            if (accounts == null) console.log("Blockchain not running");
            else this.account = accounts[0];
        })
    }
 
    async initContractGrades() {
        const meteoArtifact = fs.readFileSync(__dirname + '/../bnet/build/contracts/Meteosc.json', { encoding: "utf-8" });
        this.contracts.meteo = TruffleContract(JSON.parse(meteoArtifact));
 
        this.contracts.meteo.setProvider(this.web3Provider);
    }

    // //
    async run() {
        web3Object.contracts.meteo.deployed()
        .then(instance => {
            return instance.getFileHistory.call("ASI", { from: web3Object.account });
        })
        .then(stationMesures => {
            for (let el of stationMesures) {
                console.log(el.period)
            }
        });

    }
    // //
}
 
let web3Object;
 
async function start() {
    if (web3Object == null) {
        web3Object = new w3();
        await web3Object.initWeb3();
        await web3Object.initAccount();
        await web3Object.initContractGrades();
        // //
        await web3Object.run();
        // //
    }
}
 
start();
 

