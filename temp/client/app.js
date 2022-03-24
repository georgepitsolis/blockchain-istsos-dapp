const Web3 = require('web3');
const TruffleContract = require('truffle-contract');
const request = require('request');

App = {
/*==================================================================
    DEFINE ESSENTIALS
==================================================================*/
    web3Provider: null,
    contracts: {},
    currentAccount:{},
 
    // Integrates web3 with our web app
    initWeb3 : async function (){
        if (process.env.MODE == 'development' || typeof window.web3 === 'undefined'){
            App.web3Provider = new Web3.providers.HttpProvider(process.env.LOCAL_NODE);
        }
        else{
            App.web3Provider = web3.currentProvider;
        }
        web3 = new Web3(App.web3Provider);
        return await App.initContract(); 
    },
 
    // Initialises a variable with IDManagement contract JSON
    initContract : async function (){
        await $.getJSON('HelloWorld.json', function(data){
            var hwArtifact = data;
            App.contracts.helloworld = TruffleContract(hwArtifact);
            App.contracts.helloworld.setProvider(App.web3Provider);     
        })
        return App.bindEvents();
    },
 
    // Binds button clicks to the repective functions
    bindEvents: function() { 
        $('#setName').click(App.ExeInputUser);
        $('#getName').click(App.CallDispUser);
    },

    // Defines functionality for OUTPUT label
    showMessage: function (msg){
        $('#output').html(msg.toString());
        $('#output').show();
        $('#errorHolder').hide();
    },
 
    // Defines functionality for ERROR label
    showError: function(err){
        $('#errorHolder').html(err.toString());
        $('#errorHolder').show();
        $('#output').hide();
    },

/*==================================================================
    USERNAME SUBMISSION
==================================================================*/

    ExeInputUser: function (){
        var NAME = $('#username').val();
        console.log("In app.js ExeInputUser", NAME);

        if(NAME) {
            // Retrieves user account to perform operations
            web3.eth.getAccounts(function (error,accounts){
                if (error){
                    console.log("ERROR getAccounts ExeInputUser");
                    App.showError(error);
                }
                App.currentAccount = accounts[0];

                // Submits name to the blockchain network
                App.contracts.helloworld.deployed().then(function(obj){
                    return obj.inputUser.sendTransaction(NAME, {from:App.currentAccount});
                }).then(function(result){
                    console.log(result);
                    App.showMessage("Name submitted as a txn");
                }).catch(function (error){
                    console.log("ERROR ExeInputUser");
                    App.showError(error);
                });
            });
        }
        else {
            App.showError("Valid name is required !");
        }
    },

/*==================================================================
 USERNAME RETRIEVAL
==================================================================*/

    CallDispUser : function (){
        var NAME = $('#username').val();
        if(NAME) {
            console.log("In app.js CallDispUser");
            web3.eth.getAccounts(function (error,accounts){
                if (error){
                    console.log("ERROR getAccounts CallDispUser");
                    App.showError(error);
                }
                App.currentAccount = accounts[0];

                App.contracts.helloworld.deployed().then(function(instance){
                    return instance.dispUser.call({from:App.currentAccount});
                }).then(function(result) {
                    console.log("CallDispUser returns : ", result);
                    App.showMessage(result);
                }).catch(function (error){
                    console.log("ERROR CallRegStatus");
                    App.showError(error);
                })
            })
        }
        else {
            App.showError("No output as no name is entered");
        }
    },

/*==================================================================
 INITIALISATION : Intialises web3 when webpage is loaded onto browser
==================================================================*/

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