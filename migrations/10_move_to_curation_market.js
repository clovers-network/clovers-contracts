var utils = require('web3-utils')
// var Reversi = artifacts.require('./Reversi.sol')
var Clovers = artifacts.require('./Clovers.sol')
var CloversController = artifacts.require('./CloversController.sol')
var ClubTokenController = artifacts.require('./ClubTokenController.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
// var CurationMarket = artifacts.require('./CurationMarket.sol')
var ClubToken = artifacts.require('./ClubToken.sol')
const Reversi = require('clovers-reversi').default

const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._
var { getLowestPrice } = require('../helpers/utils')

var {
  oracle,
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

      let user = accounts[6]
      let tokenId // = '0xaaaaa55a99669aa6aaaaaaaaaaaaaaaa'
      try {
        tokenId = await clovers.tokenOfOwnerByIndex(user, '0')
        console.log('token is ' + tokenId.toString(16))
      } catch (error) {
        console.log('no token under that id')

        rev.mine()
        rev.thisMovesToByteMoves()
        let moves = [rev.byteFirst32Moves, rev.byteLastMoves]
        tokenId = '0x' + rev.byteBoard
        let symmetries = rev.returnSymmetriesAsBN()
        console.log('symmetries', symmetries.toString(10))

        let stakeAmount = await cloversController.stakeAmount()
        console.log('stakeAmount', stakeAmount.toString(10))

        let reward = await cloversController.calculateReward(
          symmetries.toString(10)
        )
        console.log('reward', reward.toString(10))

        let costInTokens = await cloversController.getPrice(
          symmetries.toString()
        )
        console.log('costInTokens', costInTokens.toString())

        let costOfTokens = await getLowestPrice(
          clubTokenController,
          costInTokens
        )
        console.log('costOfTokens in Eth (wei)', costOfTokens.toString())

        let value = costOfTokens.add(stakeAmount)
        console.log('value', value.toString())
        let keep = true
        try {
          await cloversController.claimClover(
            moves,
            tokenId,
            symmetries.toString(),
            keep,
            {
              value: value.toString(),
              from: user
            }
          )
        } catch (error) {
          console.log('uhoh')
          console.log(error)
          return
        }

        try {
          await cloversController.retrieveStake(tokenId, { from: oracle })
        } catch (errror) {
          console.log('uhoh2')
          console.log(error)
        }
      }
      // if ((await clovers.ownerOf(tokenId)) === accounts[0].toLowerCase()) {
      //   console.log('is owner')
      //   await curationMarket.addCloverToMarket(tokenId, '0')
      // } else {
      //   console.log('is not ownder')
      // }
      // let value = await getLowestPrice(curationMarket, oneGwei, tokenId)
      // console.log(
      //   'must spend ' + value.toString(16) + ' to buy ' + oneGwei.toString(16)
      // )
      // // function buy(address _to, uint256 _tokenId, uint256 _spendAmount) public payable
      // await curationMarket.buy(accounts[0], tokenId, oneGwei, {
      //   value
      // })

      // let balanceOf = await curationMarket.balanceOf(tokenId, accounts[0])
      // await curationMarket.sell(tokenId, balanceOf)
      // // function sell(uint256 _tokenId, uint256 sellAmount) public
    } catch (error) {
      console.log(error)
    }
  })
}
