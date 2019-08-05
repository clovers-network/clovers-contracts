var utils = require('web3-utils')
var Reversi = artifacts.require('./Reversi.sol')
var Clovers = artifacts.require('./Clovers.sol')
var CloversController = artifacts.require('./CloversController.sol')
var ClubTokenController = artifacts.require('./ClubTokenController.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
// var CurationMarket = artifacts.require('./CurationMarket.sol')
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
module.exports = (deployer, network, accounts) => {
  if (network === 'test') return
  deployer.then(async () => {
    try {
      var totalGas = new web3.BigNumber('0')

      reversi = await Reversi.deployed()
      clovers = await Clovers.deployed()
      cloversController = await CloversController.deployed()

      clubToken = await ClubToken.deployed()
      clubTokenController = await ClubTokenController.deployed()
      // curationMarket = await CurationMarket.deployed()
      simpleCloversMarket = await SimpleCloversMarket.deployed()

      // let rev = new Rev()
      // rev.mine()
      let poolBalance = await clubTokenController.poolBalance()
      console.log('poolBalance is ' + poolBalance.toString(10) + ' ETH')

      console.log(accounts[0] + ' to spend ' + oneGwei.toString(10) + ' ETH')
      let shouldBuy = await clubTokenController.getBuy(oneGwei)
      console.log('should buy ' + shouldBuy.toString(10) + ' Tokens')
      await clubTokenController.buy(accounts[0], {
        value: oneGwei
      })
      let balance = await clubToken.balanceOf(accounts[0])
      console.log('balance is ' + balance.toString(10) + ' Tokens')
      let shouldSell = await clubTokenController.getSell(balance)
      console.log(
        'should receive from sale: ' + shouldSell.toString(10) + ' ETH'
      )
      poolBalance = await clubTokenController.poolBalance()
      console.log('poolBalance is ' + poolBalance.toString(10) + ' ETH')
      await clubTokenController.sell(balance)
    } catch (error) {
      console.log(error)
    }
  })
}
