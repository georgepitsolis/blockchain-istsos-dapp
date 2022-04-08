const Meteosc = artifacts.require("./contracts/Meteosc.sol");

module.exports = function(deployer) {
  deployer.deploy(Meteosc);
};
