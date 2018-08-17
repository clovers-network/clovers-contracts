var utils = require('web3-utils')
var Reversi = artifacts.require('./Reversi.sol')
var Clovers = artifacts.require('./Clovers.sol')
var CloversController = artifacts.require('./CloversController.sol')
var ClubTokenController = artifacts.require('./ClubTokenController.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
var CurationMarket = artifacts.require('./CurationMarket.sol')
var ClubToken = artifacts.require('./ClubToken.sol')

const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._

var {
  stakeAmount,
  ethPrice,
  oneGwei,
  gasPrice,
  stakePeriod,
  payMultiplier,
  priceMultiplier,
  basePrice,
  decimals,
  reserveRatio,
  virtualBalance,
  virtualSupply,
  updateClubTokenController
} = require('../helpers/migVals')

module.exports = (deployer, helper, accounts) => {
  deployer.then(async () => {
    try {
      web3.eth.getBalance(accounts[0], (err, res) => {
        console.log(utils.fromWei(res.toString()))
      })
      var totalGas = new web3.BigNumber('0')

      // reversi = await Reversi.deployed()
      clovers = await Clovers.deployed()
      cloversController = await CloversController.deployed()

      clubToken = await ClubToken.deployed()
      clubTokenController = await ClubTokenController.deployed()
      curationMarket = await CurationMarket.deployed()
      // simpleCloversMarket = await SimpleCloversMarket.deployed()

      // Deploy SimpleCloversMarket.sol
      // -w Clovers address
      // -w ClubToken address
      // -w ClubTokenController address
      // -w CloversController address
      console.log(
        clovers.address,
        clubToken.address,
        clubTokenController.address,
        cloversController.address
      )
      await deployer.deploy(
        SimpleCloversMarket,
        clovers.address,
        clubToken.address,
        clubTokenController.address,
        cloversController.address,
        { overwrite: true }
      )
      simpleCloversMarket = await SimpleCloversMarket.deployed()

      console.log('clubTokenController.updateSimpleCloversMarket')
      var tx = await clubTokenController.updateSimpleCloversMarket(
        simpleCloversMarket.address
      )
      console.log('cloversController.updateSimpleCloversMarket')
      var tx = await cloversController.updateSimpleCloversMarket(
        simpleCloversMarket.address
      )
    } catch (error) {
      console.log(error)
    }
  })
}
