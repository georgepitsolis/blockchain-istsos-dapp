require('dotenv').config();
 
const Web3 = require('web3');
const TruffleContract = require('truffle-contract');
const fs = require('fs');
const yaml = require('js-yaml');
 
class w3 {
 
    constructor() {
        this.web3 = null;
        this.web3Provider = null;
        this.contracts = {};
        this.account = null;
    }
 
    async initWeb3() {
        let doc = yaml.load(fs.readFileSync(process.env.YAML, 'utf8'));
        if (process.env.MODE == 'development' || typeof web3 === 'undefined'){
            this.web3Provider = new Web3.providers.HttpProvider(doc.current.url);
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
 
    async initContractMeteo() {
        const meteoArtifact = fs.readFileSync(__dirname + '/../build/contracts/Meteosc.json', { encoding: "utf-8" });
        this.contracts.meteo = TruffleContract(JSON.parse(meteoArtifact));
 
        this.contracts.meteo.setProvider(this.web3Provider);
    }
}
 
let web3Object;
 
async function start() {
    if (web3Object == null) {
        web3Object = new w3();
        await web3Object.initWeb3();
        await web3Object.initAccount();
        await web3Object.initContractMeteo();
    }
}
 
start();
 
module.exports = { web3Object };