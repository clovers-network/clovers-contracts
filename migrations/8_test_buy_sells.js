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
// const Rev = require('clovers-reversi')
module.exports = (deployer, helper, accounts) => {
  deployer.then(async () => {
    try {
      var totalGas = new web3.BigNumber('0')

      reversi = await Reversi.deployed()
      clovers = await Clovers.deployed()
      cloversController = await CloversController.deployed()

      clubToken = await ClubToken.deployed()
      clubTokenController = await ClubTokenController.deployed()
      curationMarket = await CurationMarket.deployed()
      simpleCloversMarket = await SimpleCloversMarket.deployed()

      // let rev = new Rev()
      // rev.mine()
      await clubTokenController.buy(accounts[0], {
        value: oneGwei
      })
      let balance = await clubToken.balanceOf(accounts[0])
      await clubTokenController.sell(balance)
    } catch (error) {
      console.log(error)
    }
  })
}
