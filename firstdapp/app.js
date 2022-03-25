const Web3 = require('web3');
const TruffleContract = require('truffle-contract');
const request = require('request');

App = {
    /**  essential definitions **/
    web3Provider: null,
    contracts: {},
    currentAccount:{},
 
    // Integrates web3 with our web app
    initWeb3 : async function (){
        if (process.env.MODE == 'development' || typeof window.web3 === 'undefined'){
            App.web3Provider = new Web3.providers.HttpProvider(process.env.LOCAL_NODE);
        }
        else {
            App.web3Provider = web3.currentProvider;
        }
        web3 = new Web3(App.web3Provider);
        return await App.initContract(); 
    },
 
    // Initialises a variable with IDManagement contract JSON
    initContract : async function () {
        await $.getJSON('HelloWorld.json', function(data){
            let hwArtifact = data;
            App.contracts.helloworld = TruffleContract(hwArtifact);
            App.contracts.helloworld.setProvider(App.web3Provider);     
        })
        return App.bindEvents();
    },
 
    // Binds button clicks to the repective functions
    bindEvents: function() { 
        $('#setName').click(App.InputString);
        $('#getName').click(App.RetrieveString);
        $('#getAll').click(App.RetrieveAllStrings);
    },

    // Defines functionality for OUTPUT label
    showMessage: function (msg){
        document.getElementById("output").value = msg.toString();
        document.getElementById("errorHolder").value = "";
    },
 
    // Defines functionality for ERROR label
    showError: function(err) {
        document.getElementById("errorHolder").value = err.toString();
        document.getElementById("output").value = "";
    },

    /** string submission **/
    InputString: function (){
        let string = document.getElementById("stringLiteral").value;

        document.getElementById("stringLiteral").value = "";
        console.log("In app.js InputString", string);
  
        if(string) {
            // Retrieves user account to perform operations
            web3.eth.getAccounts((error,accounts) => {
                if (error) {
                    console.log("[ERROR]: fn -> InputString (getAccounts)");
                    App.showError(error);
                }
                App.currentAccount = accounts[0];
    
                // Submits string to the blockchain network
                App.contracts.helloworld.deployed()
                .then(obj => {
                    console.log(obj);
                    return obj.add.sendTransaction(string, { from : App.currentAccount });
                })
                .then(result => {
                console.log(result);
                App.showMessage("String submitted as a transaction");
                })
                .catch(error => {
                    console.log("[ERROR]: fn -> InputString");
                    App.showError(error);
                });
            })
        }
        else {
            App.showError("Valid string is required!")
        }
    },

    /** string retrieval **/
    RetrieveString : function (){
        console.log("In app.js RetrieveString");
        web3.eth.getAccounts((error,accounts) => {
            if (error){
                console.log("[ERROR]: fn -> RetrieveString (getAccounts)");
                App.showError(error);
            }
            App.currentAccount = accounts[0];
            
            App.contracts.helloworld.deployed()
            .then(instance => {
                console.log("instance ", instance)
                return instance.get.call({ from : App.currentAccount });
            })
            .then(result => {
                console.log("RetrieveString returns : ", result);
                App.showMessage(result);
            })
            .catch(error => {
                console.log("[ERROR]: fn -> CallRegStatus");
                App.showError(error);
            })
        })
    },

    /** string retrieval **/
    RetrieveAllStrings : function (){
        console.log("In app.js RetrieveAllStrings");
        web3.eth.getAccounts((error,accounts) => {
            if (error){
                console.log("[ERROR]: fn -> RetrieveAllStrings (getAccounts)");
                App.showError(error);
            }
            App.currentAccount = accounts[0];
            
            App.contracts.helloworld.deployed()
            .then(instance => {
                console.log("instance ", instance)
                return instance.getAll.call({ from : App.currentAccount });
            })
            .then(result => {
                console.log("RetrieveAllStrings returns : ", result);
                App.showMessage(result);
            })
            .catch(error => {
                console.log("[ERROR]: fn -> CallRegStatus");
                App.showError(error);
            })
        })
    },

    /** initialize web3 when webpage is loaded **/
    init : async function (){
        await App.initWeb3();
        console.log("In app.js init, initiated App");
    }
}
 
$(function() {
    $(window).load(function() {         
        App.init();
    });
});