const SimpleStorageContract = artifacts.require("SimpleStorage");
const FundraiserFactoryContract = artifacts.require("FundraiserFactory");

/**
 * マイグレーションファイル
 * 
 * デプロイコード
 */
module.exports = function(deployer) {
  deployer.deploy(SimpleStorageContract);
  deployer.deploy(FundraiserFactoryContract);
}