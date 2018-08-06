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
var { getLowestPrice } = require('../helpers/utils')

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

      // let tokenId = '0xaaaaa55a99669aa6aaaaaaaaaaaaaaaa'

      let tokenId = await clovers.tokenOfOwnerByIndex(accounts[0], '0')
      // console.log('token is ' + tokenId.toString(16))
      if ((await clovers.ownerOf(tokenId)) === accounts[0].toLowerCase()) {
        console.log('is owner')
        await curationMarket.addCloverToMarket(tokenId, '0')
      } else {
        console.log('is not ownder')
      }
      let value = await getLowestPrice(curationMarket, oneGwei, tokenId)
      console.log(
        'must spend ' + value.toString(16) + ' to buy ' + oneGwei.toString(16)
      )
      // function buy(address _to, uint256 _tokenId, uint256 _spendAmount) public payable
      await curationMarket.buy(accounts[0], tokenId, oneGwei, {
        value
      })

      let balanceOf = await curationMarket.balanceOf(tokenId, accounts[0])
      await curationMarket.sell(tokenId, balanceOf)
      // function sell(uint256 _tokenId, uint256 sellAmount) public
    } catch (error) {
      console.log(error)
    }
  })
}
