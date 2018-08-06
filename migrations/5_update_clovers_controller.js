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
  updateCloversController,
  deployCloversController
} = require('../helpers/migVals')

module.exports = (deployer, helper, accounts) => {
  deployer.then(async () => {
    return
    try {
      var totalGas = new web3.BigNumber('0')

      reversi = await Reversi.deployed()
      clovers = await Clovers.deployed()
      clubToken = await ClubToken.deployed()
      curationMarket = await CurationMarket.deployed()
      simpleCloversMarket = await SimpleCloversMarket.deployed()
      clubTokenController = await ClubTokenController.deployed()

      await deployCloversController({
        deployer,
        CloversController,
        reversi,
        clovers,
        clubToken,
        clubTokenController,
        overwrite: true
      })
      cloversController = await CloversController.deployed()

      await simpleCloversMarket.updateCloversController(
        cloversController.address
      )
      await curationMarket.updateCloversController(cloversController.address)
      await clovers.updateCloversControllerAddress(cloversController.address)
      await clubToken.updateCloversControllerAddress(cloversController.address)

      await updateCloversController({
        cloversController,
        curationMarket,
        simpleCloversMarket
      })
    } catch (error) {
      console.log(error)
    }
  })
}
