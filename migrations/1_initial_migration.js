var Migrations = artifacts.require("./Migrations.sol");
var First = artifacts.require("./First.sol");
var Conference = artifacts.require("./Conference");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(First);
  deployer.deploy(Conference);
};
