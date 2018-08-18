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

module.exports = (deployer, network, accounts) => {
  if (network === 'test') return

  deployer.then(async () => {
    return
    try {
      var totalGas = new web3.BigNumber('0')

      // reversi = await Reversi.deployed()
      clovers = await Clovers.deployed()
      cloversController = await CloversController.deployed()

      clubToken = await ClubToken.deployed()
      clubTokenController = await ClubTokenController.deployed()
      // curationMarket = await CurationMarket.deployed()
      simpleCloversMarket = await SimpleCloversMarket.deployed()

      // Deploy CurationMarket.sol
      // -w virtualSupply
      // -w virtualBalance
      // -w reserveRatio
      // -w Clovers address
      // -w CloversController address
      // -w ClubToken address
      // -w ClubTokenController address
      await deployer.deploy(
        CurationMarket,
        virtualSupply,
        virtualBalance,
        reserveRatio,
        clovers.address,
        cloversController.address,
        clubToken.address,
        clubTokenController.address,
        { overwrite: true }
      )
      curationMarket = await CurationMarket.deployed()

      console.log('clubTokenController.updateCurationMarket')
      var tx = await clubTokenController.updateCurationMarket(
        curationMarket.address
      )
      console.log('cloversController.updateCurationMarket')
      var tx = await cloversController.updateCurationMarket(
        curationMarket.address
      )
    } catch (error) {
      console.log(error)
    }
  })
}
