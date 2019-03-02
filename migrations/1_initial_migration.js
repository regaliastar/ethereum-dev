var Migrations = artifacts.require("./Migrations.sol");
var First = artifacts.require("./First.sol");
var Conference = artifacts.require("./Conference");
var Algorithm = artifacts.require("./Algorithm");
var Main = artifacts.require("./Main");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(First);
  deployer.deploy(Conference);
  deployer.deploy(Algorithm);
  deployer.deploy(Main);

};
