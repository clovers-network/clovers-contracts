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
      var totalGas = new web3.BigNumber('0')

      // reversi = await Reversi.deployed()
      clovers = await Clovers.deployed()
      cloversController = await CloversController.deployed()
      clubToken = await ClubToken.deployed()
      // clubTokenController = await ClubTokenController.deployed()
      curationMarket = await CurationMarket.deployed()
      simpleCloversMarket = await SimpleCloversMarket.deployed()

      await deployer.deploy(ClubTokenController, clubToken.address, {
        overwrite: true
      })
      clubTokenController = await ClubTokenController.deployed()

      await cloversController.updateClubTokenController(
        clubTokenController.address
      )
      await simpleCloversMarket.updateClubTokenController(
        clubTokenController.address
      )
      await curationMarket.updateClubTokenController(
        clubTokenController.address
      )
      await clovers.updateClubTokenController(clubTokenController.address)
      await clubToken.updateClubTokenControllerAddress(
        clubTokenController.address
      )

      await updateClubTokenController({
        clubTokenController,
        curationMarket,
        simpleCloversMarket
      })
    } catch (error) {
      console.log(error)
    }
  })
}
