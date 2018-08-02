var utils = require("web3-utils");
var Reversi = artifacts.require("./Reversi.sol");
var Clovers = artifacts.require("./Clovers.sol");
var CloversMetadata = artifacts.require("./CloversMetadata.sol");
var CloversController = artifacts.require("./CloversController.sol");
var ClubTokenController = artifacts.require("./ClubTokenController.sol");
var SimpleCloversMarket = artifacts.require("./SimpleCloversMarket.sol");
var CurationMarket = artifacts.require("./CurationMarket.sol");
var ClubToken = artifacts.require("./ClubToken.sol");

const gasToCash = require("../helpers/utils").gasToCash;
const _ = require("../helpers/utils")._;

let stakeAmount = 529271 * 1000000000 * 40; // gasPrice * 1GWEI * 40

let multiplier = 10;

const ethPrice = new web3.BigNumber("440");
const oneGwei = new web3.BigNumber("1000000000"); // 1 GWEI
let gasPrice = oneGwei.toString(10);

let stakePeriod = "6000"; // at 15 sec block times this is ~25 hours

let payMultiplier = "10";
let priceMultiplier = "10";
let basePrice = utils.toWei("0.001");

let decimals = "18";

let reserveRatio = "333333"; // parts per million 500000 / 1000000 = 1/2
let virtualBalance = utils.toWei("3333");
let virtualSupply = utils.toWei("100000");

module.exports = (deployer, helper, accounts) => {
  deployer.then(async () => {
    try {
      var totalGas = new web3.BigNumber("0");

      // Deploy Clovers.sol (NFT)
      await deployer.deploy(Clovers, "Clovers", "CLVR");
      clovers = await Clovers.deployed();
      // var tx = web3.eth.getTransactionReceipt(clovers.transactionHash);
      //
      // console.log(_ + "Deploy clovers - " + tx.gasUsed);
      // gasToCash(tx.gasUsed);
      //
      // totalGas = totalGas.plus(tx.gasUsed);

      // Deploy CloversMetadata.sol
      // -w Clovers address
      await deployer.deploy(CloversMetadata, clovers.address);
      cloversMetadata = await CloversMetadata.deployed();
      // var tx = web3.eth.getTransactionReceipt(cloversMetadata.transactionHash);
      // console.log(_ + "Deploy cloversMetadata - " + tx.gasUsed);
      // gasToCash(tx.gasUsed);
      //
      // totalGas = totalGas.plus(tx.gasUsed);

      // Update Clovers.sol
      // -w CloversMetadata address
      var tx = await clovers.updateCloversMetadataAddress(
        cloversMetadata.address
      );

      // console.log(_ + "Update clovers - " + tx.receipt.gasUsed);
      // gasToCash(tx.receipt.gasUsed);
      //
      // totalGas = totalGas.plus(tx.receipt.gasUsed);

      // Deploy ClubToken.sol (ERC20)

      await deployer.deploy(ClubToken, "ClubToken", "CLB", decimals);
      clubToken = await ClubToken.deployed();
      // var tx = web3.eth.getTransactionReceipt(clubToken.transactionHash);
      //
      // console.log(_ + "Deploy clubToken - " + tx.gasUsed);
      // gasToCash(tx.gasUsed);
      //
      // totalGas = totalGas.plus(tx.gasUsed);

      // Deploy Reversi.sol
      // -link w cloversController

      await deployer.deploy(Reversi);
      reversi = await Reversi.deployed();
      // var tx = web3.eth.getTransactionReceipt(reversi.transactionHash);
      //
      // console.log(_ + "Deploy reversi - " + tx.gasUsed);
      // gasToCash(tx.gasUsed);
      //
      // totalGas = totalGas.plus(tx.gasUsed);

      await CloversController.link("Reversi", reversi.address);

      // Deploy ClubTokenController.sol
      // -w ClubToken address

      await deployer.deploy(ClubTokenController, clubToken.address);
      clubTokenController = await ClubTokenController.deployed();
      // var tx = web3.eth.getTransactionReceipt(
      //   clubTokenController.transactionHash
      // );
      //
      // console.log(_ + "Deploy clubTokenController - " + tx.gasUsed);
      // gasToCash(tx.gasUsed);
      //
      // totalGas = totalGas.plus(tx.gasUsed);

      // Deploy CloversController.sol
      // -w Clovers address
      // -w ClubToken address
      // -w ClubTokenController address

      await deployer.deploy(
        CloversController,
        clovers.address,
        clubToken.address,
        clubTokenController.address
      );
      cloversController = await CloversController.deployed();

      await deployer.deploy(
        SimpleCloversMarket,
        clovers.address,
        clubToken.address,
        clubTokenController.address,
        cloversController.address
      );
      simpleCloversMarket = await SimpleCloversMarket.deployed();

      await deployer.deploy(
        CurationMarket,
        virtualSupply,
        virtualBalance,
        reserveRatio,
        clovers.address,
        cloversController.address,
        clubToken.address,
        clubTokenController.address
      );
      curationMarket = await CurationMarket.deployed();
    } catch (error) {
      console.log(error);
    }
  });
};
