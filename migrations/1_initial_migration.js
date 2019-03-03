var Migrations = artifacts.require("./Migrations.sol");
var Algorithm = artifacts.require("./Algorithm");
var Main = artifacts.require("./Main");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Algorithm);
  deployer.deploy(Main);
};
