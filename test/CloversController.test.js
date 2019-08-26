var utils = require('web3-utils')
var Reversi = artifacts.require('./Reversi.sol')
var Support = artifacts.require('./Support.sol')
var Clovers = artifacts.require('./Clovers.sol')
var CloversMetadata = artifacts.require('./CloversMetadata.sol')
var CloversController = artifacts.require('./CloversController.sol')
var ClubTokenController = artifacts.require('./ClubTokenController.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
var ClubToken = artifacts.require('./ClubToken.sol')
// var CurationMarket = artifacts.require('./CurationMarket.sol')

var Rev = require('clovers-reversi').default
const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._

var { getLowestPrice } = require('../helpers/utils')
const ethPrice = new web3.BigNumber('440')
const oneGwei = new web3.BigNumber('1000000000') // 1 GWEI
let gasPrice = oneGwei.toString(10)

let stakeAmount = utils.toWei('0.1')
// let stakePeriod = "6000"; // at 15 sec block times this is ~25 hours
let stakePeriod = '10' // make 10 for speed of tests
let payMultiplier = utils.toWei('.327')
let priceMultiplier = '10'
let basePrice = utils.toWei('0.001')

let decimals = '18'

let reserveRatio = '750000' // parts per million 500000 / 1000000 = 1/2
let virtualBalance = utils.toWei('10')
let virtualSupply = utils.toWei('10000')
let limit = utils.toWei('5')


contract('Clovers', async function(accounts) {
  let oracle = accounts[8]

  let clovers,
    support,
    cloversMetadata,
    clubToken,
    reversi,
    cloversController,
    clubTokenController,
    // curationMarket,
    simpleCloversMarket
  before(done => {
    ;(async () => {
      try {
        var totalGas = new web3.BigNumber('0')

        // Deploy Clovers.sol (NFT)
        clovers = await Clovers.new('Clovers', 'CLVR')
        var tx = web3.eth.getTransactionReceipt(clovers.transactionHash)

        console.log(_ + 'Deploy clovers - ' + tx.gasUsed)
        gasToCash(tx.gasUsed)
        totalGas = totalGas.plus(tx.gasUsed)

        // Deploy CloversMetadata.sol
        // -w Clovers address
        cloversMetadata = await CloversMetadata.new(clovers.address)
        var tx = web3.eth.getTransactionReceipt(cloversMetadata.transactionHash)
        console.log(_ + 'Deploy cloversMetadata - ' + tx.gasUsed)
        gasToCash(tx.gasUsed)

        totalGas = totalGas.plus(tx.gasUsed)

        // Update Clovers.sol
        // -w CloversMetadata address
        var tx = await clovers.updateCloversMetadataAddress(
          cloversMetadata.address
        )

        console.log(_ + 'Update clovers - ' + tx.receipt.gasUsed)
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        // Deploy ClubToken.sol (ERC20)
        clubToken = await ClubToken.new('ClubToken', 'CLB', decimals)
        var tx = web3.eth.getTransactionReceipt(clubToken.transactionHash)

        console.log(_ + 'Deploy clubToken - ' + tx.gasUsed)
        gasToCash(tx.gasUsed)

        totalGas = totalGas.plus(tx.gasUsed)

        // Deploy Reversi.sol
        // -link w cloversController
        reversi = await Reversi.new()
        var tx = web3.eth.getTransactionReceipt(reversi.transactionHash)

        console.log(_ + 'Deploy reversi - ' + tx.gasUsed)
        gasToCash(tx.gasUsed)

        totalGas = totalGas.plus(tx.gasUsed)

        await CloversController.link('Reversi', reversi.address)

        // Deploy ClubTokenController.sol
        // -w ClubToken address
        clubTokenController = await ClubTokenController.new(clubToken.address)
        var tx = web3.eth.getTransactionReceipt(
          clubTokenController.transactionHash
        )

        console.log(_ + 'Deploy clubTokenController - ' + tx.gasUsed)
        gasToCash(tx.gasUsed)

        totalGas = totalGas.plus(tx.gasUsed)

        // Deploy CloversController.sol
        // -w Clovers address
        // -w ClubToken address
        // -w ClubTokenController address
        cloversController = await CloversController.new(
          clovers.address,
          clubToken.address,
          clubTokenController.address
        )
        var tx = web3.eth.getTransactionReceipt(
          cloversController.transactionHash
        )

        console.log(_ + 'Deploy cloversController - ' + tx.gasUsed)
        gasToCash(tx.gasUsed)

        await cloversController.updatePaused(false)

        totalGas = totalGas.plus(tx.gasUsed)

        // Deploy SimpleCloversMarket.sol
        // -w Clovers address
        // -w ClubToken address
        // -w ClubTokenController address
        simpleCloversMarket = await SimpleCloversMarket.new(
          clovers.address,
          clubToken.address,
          clubTokenController.address,
          cloversController.address
        )
        var tx = web3.eth.getTransactionReceipt(
          simpleCloversMarket.transactionHash
        )

        console.log(_ + 'Deploy simpleCloversMarket - ' + tx.gasUsed)
        gasToCash(tx.gasUsed)

        totalGas = totalGas.plus(tx.gasUsed)

        // Deploy Support.sol
        // -w limit
        // -w ClubTokenController address

        support = await Support.new(
          limit,
          clubTokenController.address
        )
        var tx = web3.eth.getTransactionReceipt(
          support.transactionHash
        )

        console.log(_ + 'Deploy support - ' + tx.gasUsed)
        gasToCash(tx.gasUsed)

        totalGas = totalGas.plus(tx.gasUsed)

        // Deploy CurationMarket.sol
        // -w virtualSupply
        // -w virtualBalance
        // -w reserveRatio
        // -w Clovers address
        // -w CloversController address
        // -w ClubToken address
        // -w ClubTokenController address
        // curationMarket = await CurationMarket.new(
        //   virtualSupply,
        //   virtualBalance,
        //   reserveRatio,
        //   clovers.address,
        //   cloversController.address,
        //   clubToken.address,
        //   clubTokenController.address
        // )
        // var tx = web3.eth.getTransactionReceipt(
        //   curationMarket.transactionHash
        // )
        // console.log(_ + 'Deploy curationMarket - ' + tx.gasUsed)
        // gasToCash(tx.gasUsed)

        // totalGas = totalGas.plus(tx.gasUsed)

        // Update Clovers.sol
        // -w ClubTokenController address
        var tx = await clovers.updateClubTokenController(
          clubTokenController.address
        )

        console.log(
          _ + 'clovers.updateClubTokenController - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        // Update Clovers.sol
        // -w CloversController address
        var tx = await clovers.updateCloversControllerAddress(
          cloversController.address
        )

        console.log(
          _ + 'clovers.updateCloversControllerAddress - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        // Update ClubToken.sol
        // -w CloversController address
        var tx = await clubToken.updateCloversControllerAddress(
          cloversController.address
        )
        console.log(
          _ + 'clubToken.updateCloversControllerAddress - ' + tx.receipt.gasUsed
        )

        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        // Update ClubToken.sol
        // -w ClubTokenController address
        var tx = await clubToken.updateClubTokenControllerAddress(
          clubTokenController.address
        )

        console.log(
          _ +
            'clubToken.updateClubTokenControllerAddress - ' +
            tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        // Update CloversController.sol
        // -w oracle
        // -w curationMarket
        // -w simpleCloversMarket
        // -w stakeAmount
        // -w stakePeriod
        // -w payMultiplier
        var tx = await cloversController.updateOracle(oracle)
        console.log(
          _ + 'cloversController.updateOracle - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        // var tx = await cloversController.updateCurationMarket(
        //   curationMarket.address
        // )
        // console.log(
        //   _ + 'cloversController.updateCurationMarket - ' + tx.receipt.gasUsed
        // )
        // gasToCash(tx.receipt.gasUsed)

        // totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await cloversController.updateSimpleCloversMarket(
          simpleCloversMarket.address
        )
        console.log(
          _ +
            'cloversController.updateSimpleCloversMarket - ' +
            tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await cloversController.updateStakeAmount(stakeAmount)
        console.log(
          _ + 'cloversController.updateStakeAmount - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await cloversController.updateStakePeriod(stakePeriod)
        console.log(
          _ + 'cloversController.updateStakePeriod - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await cloversController.updatePayMultipier(payMultiplier)
        console.log(
          _ + 'cloversController.updatePayMultipier - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await cloversController.updatePriceMultipier(priceMultiplier)
        console.log(
          _ + 'cloversController.updatePriceMultipier - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await cloversController.updateBasePrice(basePrice)
        console.log(
          _ + 'cloversController.updateBasePrice - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)
        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var fastGasPrice =  new BigNumber(10).mul(oneGwei)
        var averageGasPrice =  new BigNumber(5).mul(oneGwei)
        var safeLowGasPrice = new BigNumber(1).mul(oneGwei)
        var tx = await cloversController.updateGasPrices(fastGasPrice, averageGasPrice, safeLowGasPrice)
        console.log(
          _ + 'cloversController.updateBasePrice - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)


        totalGas = totalGas.plus(tx.receipt.gasUsed)

        // Update ClubTokenController.sol
        // -w curationMarket
        // -w simpleCloversMarket
        // -w reserveRatio
        // -w virtualSupply
        // -w virtualBalance
        var tx = await clubTokenController.updateSimpleCloversMarket(
          simpleCloversMarket.address
        )
        console.log(
          _ +
            'clubTokenController.updateSimpleCloversMarket - ' +
            tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await clubTokenController.updateSupport(
          support.address
        )
        console.log(
          _ + 'clubTokenController.updateSupport - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)


        // var tx = await clubTokenController.updateCurationMarket(
        //   curationMarket.address
        // )
        // console.log(
        //   _ + 'clubTokenController.updateCurationMarket - ' + tx.receipt.gasUsed
        // )
        // gasToCash(tx.receipt.gasUsed)

        // totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await clubTokenController.updateReserveRatio(reserveRatio)
        console.log(
          _ + 'clubTokenController.updateReserveRatio - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await clubTokenController.updateVirtualSupply(virtualSupply)
        console.log(
          _ + 'clubTokenController.updateVirtualSupply - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await clubTokenController.updateVirtualBalance(virtualBalance)
        console.log(
          _ + 'clubTokenController.updateVirtualBalance - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        var tx = await clubTokenController.updatePaused(false)
        console.log(
          _ + 'clubTokenController.updatePaused - ' + tx.receipt.gasUsed
        )
        gasToCash(tx.receipt.gasUsed)

        totalGas = totalGas.plus(tx.receipt.gasUsed)

        console.log(_ + totalGas.toFormat(0) + ' - Total Gas')
        gasToCash(totalGas)
        done()
      } catch (error) {
        console.log('error:', error)

        done(false)
      }
    })()
  })

  describe('Clovers.sol', function() {
    it('should be able to read metadata', async function() {
      let metadata = await clovers.tokenURI(666)
      let _metadata = await cloversMetadata.tokenURI(666)
      assert(_metadata === metadata, '_metadata != metadata')
    })
  })

  // describe('CurationMarket.sol', function() {
  //   let _curator = accounts[4]
  //   let _curatorTokenId = '420'
  //   it('should be able to read metadata', async () => {
  //     let _clovers = await curationMarket.clovers()
  //     assert(
  //       _clovers.toString() === clovers.address.toString(),
  //       '_clovers != clovers'
  //     )
  //     let _clubToken = await curationMarket.clubToken()
  //     assert(
  //       _clubToken.toString() === clubToken.address.toString(),
  //       '_clubToken != clubToken'
  //     )
  //     let _cloversController = await curationMarket.cloversController()
  //     assert(
  //       _cloversController.toString() === cloversController.address.toString(),
  //       '_cloversController != cloversController'
  //     )
  //     let _clubTokenController = await curationMarket.clubTokenController()
  //     assert(
  //       _clubTokenController.toString() ===
  //         clubTokenController.address.toString(),
  //       '_clubTokenController != clubTokenController'
  //     )
  //   })

  //   it('should get a clover and start a market', async () => {
  //     let _spendAmount = utils.toWei('1')

  //     try {
  //       tx = await clovers.mint(_curator, _curatorTokenId)
  //       console.log(_ + 'clovers.mint - ' + tx.receipt.cumulativeGasUsed)
  //       gasToCash(tx.receipt.cumulativeGasUsed)
  //       let owner = await clovers.ownerOf(_curatorTokenId)
  //       assert(
  //         owner.toString() === _curator.toString(),
  //         'owner is not curator ' +
  //           owner.toString() +
  //           '!=' +
  //           _curator.toString()
  //       )
  //     } catch (error) {
  //       assert(false, error.message)
  //     }

  //     try {
  //       let amountToSpend = await getLowestPrice(
  //         clubTokenController,
  //         _spendAmount
  //       )
  //       console.log(
  //         _ + 'amount to spend is ' + utils.fromWei(amountToSpend.toString())
  //       )
  //       console.l
  //       tx = await curationMarket.addCloverToMarket(
  //         _curatorTokenId,
  //         _spendAmount,
  //         {
  //           from: _curator,
  //           value: amountToSpend
  //         }
  //       )
  //       console.log(
  //         _ +
  //           'curationMarket.addCloverToMarket - ' +
  //           tx.receipt.cumulativeGasUsed
  //       )
  //       gasToCash(tx.receipt.cumulativeGasUsed)

  //       // let balance = await curationMarket.balanceOf(_curatorTokenId, _curator);
  //       // assert(balance.gt(0), "doesn't own any shares");
  //     } catch (error) {
  //       assert(false, error.message)
  //       assert(false, error.stack)
  //     }
  //   })
  // })

  describe('SimpleCloversMarket.sol', function() {
    let _tokenId = '666'
    let _seller = accounts[9]
    let _buyer = accounts[8]
    let _price = new web3.BigNumber(utils.toWei('0.5'))
    it('should have correct contract addresses', async function() {
      let _clovers = await simpleCloversMarket.clovers()
      assert(
        _clovers === clovers.address,
        'clovers contract address is incorrect ' +
          _clovers +
          '!=' +
          clovers.address
      )

      let _clubToken = await simpleCloversMarket.clubToken()
      assert(
        _clubToken === clubToken.address,
        'clubToken contract address is incorrect ' +
          _clubToken +
          '!=' +
          clubToken.address
      )

      let _clubTokenController = await simpleCloversMarket.clubTokenController()
      assert(
        _clubTokenController === clubTokenController.address,
        'clubTokenController contract address is incorrect ' +
          _clubTokenController +
          '!=' +
          clubTokenController.address
      )
    })

    it('should list a clover for sale', async function() {
      try {
        tx = await clovers.mint(_seller, _tokenId)
        console.log(_ + 'clovers.mint - ' + tx.receipt.cumulativeGasUsed)
        gasToCash(tx.receipt.cumulativeGasUsed)
        let owner = await clovers.ownerOf(_tokenId)
        assert(
          owner.toString() === _seller.toString(),
          'owner is not seller ' + owner.toString() + '!=' + _seller.toString()
        )
      } catch (error) {
        assert(false, error.message)
      }
      try {
        tx = await simpleCloversMarket.sell(_tokenId, _price, {
          from: _seller
        })
        console.log(
          _ + 'simpleCloversMarket.sell - ' + tx.receipt.cumulativeGasUsed
        )
        gasToCash(tx.receipt.cumulativeGasUsed)

        let _price_ = await simpleCloversMarket.sellPrice(_tokenId)
        assert(
          _price_.toString() === _price.toString(),
          'prices do not match ' +
            _price_.toString() +
            '!==' +
            _price.toString()
        )
      } catch (error) {
        assert(false, error.message)
      }
    })

    it('should buy the clover by minting ClubToken before', async () => {
      let buyerBalance = await clubToken.balanceOf(_buyer)
      let amountToSpend, tx
      try {
        if (buyerBalance.lt(_price)) {
          amountToSpend = await getLowestPrice(clubTokenController, _price)
          // tx = await clubTokenController.buy(_buyer, {
          //   value: amountToSpend
          // });
          // console.log(
          //   _ + "clubTokenController.buy - " + tx.receipt.cumulativeGasUsed
          // );
          // gasToCash(tx.receipt.cumulativeGasUsed);
          // buyerBalance = await clubToken.balanceOf(_buyer);
          // assert(
          //   buyerBalance.gte(_price),
          //   "buyer balance still isn't enough (" +
          //     buyerBalance.toString() +
          //     "<" +
          //     _price.toString()
          // );
        } else {
          amountToSpend = '0'
        }
      } catch (error) {
        assert(false, error.message)
      }
      try {
        let from = await simpleCloversMarket.sellFrom(_tokenId)
        let owner = await clovers.ownerOf(_tokenId)
        assert(
          from.toString() === owner.toString(),
          'for sale from wrong person'
        )


        tx = await simpleCloversMarket.buy(_tokenId, {
          from: _buyer,
          value: amountToSpend
        })
        console.log(
          _ + 'simpleCloversMarket.buy - ' + tx.receipt.cumulativeGasUsed
        )
        gasToCash(tx.receipt.cumulativeGasUsed)
        let newOwner = await clovers.ownerOf(_tokenId)
        assert(
          newOwner.toString() === _buyer.toString(),
          'buyer was unable to buy'
        )
      } catch (error) {
        console.log({tx})
        assert(false, error.message)
      }
    })
  })

  describe('ClubTokenController.sol', function() {
    it('should read parameters that were set', async function() {
      let _reserveRatio = await clubTokenController.reserveRatio()
      assert(
        _reserveRatio.toString(10) === reserveRatio,
        'reserveRatio ' +
          _reserveRatio.toString(10) +
          ' not equal to ' +
          reserveRatio
      )

      let _virtualSupply = await clubTokenController.virtualSupply()
      assert(
        _virtualSupply.toString(10) === virtualSupply,
        'virtualSupply ' +
          _virtualSupply.toString(10) +
          ' not equal to ' +
          virtualSupply
      )

      let _virtualBalance = await clubTokenController.virtualBalance()
      assert(
        _virtualBalance.toString(10) === virtualBalance,
        'virtualBalance ' +
          _virtualBalance.toString(10) +
          ' not equal to ' +
          virtualBalance
      )
    })

    it('should mint new tokens', async function() {
      let _depositAmount = utils.toWei('1')
      let buyer = accounts[5]

      let _virtualSupply = await clubTokenController.virtualSupply()
      let _totalSupply = await clubToken.totalSupply()
      let _supply = _virtualSupply.add(_totalSupply)

      let _virtualBalance = await clubTokenController.virtualBalance()
      let _poolBalance = await clubTokenController.poolBalance()
      let _connectorBalance = _virtualBalance.add(_poolBalance)

      let _connectorWeight = await clubTokenController.reserveRatio()

      let expectedReturn = await clubTokenController.calculatePurchaseReturn(
        _supply,
        _connectorBalance,
        _connectorWeight,
        _depositAmount
      )

      let balanceBefore = await clubToken.balanceOf(buyer)
      try {
        tx = await clubTokenController.buy(buyer, {
          from: buyer,
          value: _depositAmount
        })
        console.log(
          _ + 'clubTokenController.buy - ' + tx.receipt.cumulativeGasUsed
        )
        gasToCash(tx.receipt.cumulativeGasUsed)
      } catch (error) {
        console.log('error:', error)

        assert(false, 'buy tx receipt should not have thrown an error')
      }

      let balanceAfter = await clubToken.balanceOf(buyer)
      assert(
        balanceBefore.add(expectedReturn).toString(10) ===
          balanceAfter.toString(10),
        'balanceBefore plus expectedReturn (' +
          balanceBefore.add(expectedReturn).toString(10) +
          ') did not equal balanceAfter (' +
          balanceAfter.toString(10) +
          ')'
      )
    })
    it('should sell the new tokens', async function() {
      let buyer = accounts[5]
      let _depositAmount = utils.toWei('1')

      let _virtualSupply = await clubTokenController.virtualSupply()
      let _totalSupply = await clubToken.totalSupply()
      let _supply = _virtualSupply.add(_totalSupply)

      let _virtualBalance = await clubTokenController.virtualBalance()
      let _poolBalance = await clubTokenController.poolBalance()
      let _connectorBalance = _virtualBalance.add(_poolBalance)

      let _connectorWeight = await clubTokenController.reserveRatio()

      let _sellAmount = await clubToken.balanceOf(buyer)

      let expectedReturn = await clubTokenController.calculateSaleReturn(
        _supply,
        _connectorBalance,
        _connectorWeight,
        _sellAmount
      )

      let difference = new web3.BigNumber(_depositAmount).sub(expectedReturn)
      assert(
        difference.lte(2),
        'difference of expectedReturn (' +
          expectedReturn.toString(10) +
          ') and _depositAmount (' +
          _depositAmount.toString(10) +
          ') by a margin of more than 1 WEI (' +
          difference.toString(10) +
          ')'
      )

      let balanceBefore = await web3.eth.getBalance(buyer)

      try {
        var tx = await clubTokenController.sell(_sellAmount, {
          from: buyer,
          gasPrice
        })
        console.log(
          _ + 'clubTokenController.sell - ' + tx.receipt.cumulativeGasUsed
        )
        gasToCash(tx.receipt.cumulativeGasUsed)
      } catch (error) {
        console.log('error:', error)

        assert(false, 'sell tx receipt should not have thrown an error')
      }
      gasSpent = tx.receipt.cumulativeGasUsed
      let gasCost = gasSpent * parseInt(gasPrice)

      let balanceAfter = await web3.eth.getBalance(buyer)

      assert(
        balanceBefore
          .sub(gasCost.toString())
          .add(expectedReturn.toString())
          .toString() === balanceAfter.toString(),
        'balanceBefore (' +
          utils.fromWei(balanceBefore.toString()) +
          ') minus gasCosts (' +
          gasCost.toString() +
          ') plus expectedReturn (' +
          utils.fromWei(expectedReturn.toString()) +
          ') did not equal balanceAfter (' +
          utils.fromWei(balanceAfter.toString()) +
          ')'
      )
    })
  })

  describe('Support.sol', function() {
    it('should set pause to true', async function() {
      await clubTokenController.updatePaused(true)
      let paused = await clubTokenController.paused()
      assert(paused, 'paused isnt true')
    })
    it('should still be paused', async function() {
      let paused = await clubTokenController.paused()
      assert(paused, 'paused isnt true')
    })

    it ('should allow owner to add user to whitelist', async function() {
      await support.addToWhitelist(accounts[2], {from: accounts[0]})
      let whitelisted = await support.onWhitelist(accounts[2])
      assert(whitelisted, "Supposed to be on whitelist")
    })

    it('should fail whitelisted user if not active', async function () {
      try {
        await  support.support({value: limit.toString(10), from: accounts[2]})
        console.log("ACTUALLY AN ERROR HERE - 1")
        assert(false, "should fail")
      } catch (error) {
        assert(true, "should fail")
      }
      })

    it('should allow whitelisted user to donate limit', async function () {
      await support.setActive(true)
      await support.support({value: limit.toString(10), from: accounts[2]})

      let currentContribution = await support.currentContribution(accounts[2])
      assert(currentContribution.eq(limit), "Contributions dont match")
    })

    it('should fail when whitelist tries to add more than limit', async function () {
      try {
        await support.support({value: limit, from: accounts[1]})
        console.log("ACTUALLY AN ERROR HERE - 2")
        assert(false, 'shouldnt pass')
      } catch(error) {
        assert(true, 'should fail')
      }
    })

    it ('should allow second contributor via contract and direct send', async function () {
      await support.addToWhitelist(accounts[1])
      await support.support({value: utils.toWei('1'), from: accounts[1]})
      await support.sendTransaction({from: accounts[1], gas: 34000, value: utils.toWei('1')})

      let currentContribution = await support.currentContribution(accounts[1])
      assert(currentContribution.eq(utils.toWei("2")), "Contributions dont match: " + currentContribution.toString(10))
    })

    it("should be able to make buy and withdraw after active = false", async function () {

      var originalCurveBalance = await web3.eth.getBalance(clubToken.address)


      await support.setActive(false)
      await support.makeBuy()
      let tokens = await clubToken.balanceOf(support.address)


      let totalContributions = await support.totalContributions()
      assert(totalContributions.eq((new web3.BigNumber(limit)).plus(utils.toWei("2"))), "totalContribution doenst match sum of contributions: " + totalContributions.toString(10))

      let totalTokens = await support.totalTokens()
      assert(totalTokens.eq(tokens), "tokens should be same: " + totalTokens.toString(10))

      await support.withdraw({from: accounts[2]})
      let supporterTokens = await clubToken.balanceOf(accounts[2])
      assert(supporterTokens.sub(totalTokens.mul("5").div("7")).abs().lt("1"), `tokens (${totalTokens.mul("5").div("7").toString(10)}) did not equal supporter tokens ${supporterTokens.toString(10)}`)

      await support.withdraw({from: accounts[1]})
      supporterTokens = await clubToken.balanceOf(accounts[1])
      assert(supporterTokens.sub(totalTokens.mul("2").div("7")).abs().lt("1"), "tokens did not equal supporter tokens")

      try {
        await support.withdraw({from: accounts[3]})
        console.log("ACTUALLY AN ERROR HERE - 3")
        assert(false, "shouldnt be here")
      } catch (error) {
        assert(true, "should fail")
      }


      try {
        await support.support({from: accounts[2]})
        assert(false, "ACTUALLY AN ERROR HERE - 4")
      } catch (error) {
        assert(true, "should fail")
      }

      contractBalance = await web3.eth.getBalance(support.address)
      assert(contractBalance.eq(0), "contract balance didnt equal 0" + contractBalance.toString(10))

      curveBalance = await web3.eth.getBalance(clubToken.address)
      assert(curveBalance.sub(originalCurveBalance).eq(utils.toWei("7")), `clubToken has wrong balance of ${curveBalance.toString(10)} when it should have ${utils.toWei("7")}`)
     
      // dont forget to unpause the clubTokenController
      await clubTokenController.updatePaused(false)

    })
  })

  describe('CloversController.sol', function() {
    let balance,
      _balance,
      tx,
      clubBalance,
      gasEstimate,
      newStakeAmount,
      gasSpent

    let _invalidTokenId = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    let _invalidMoves = [
      new web3.BigNumber(
        '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
        16
      ),
      new web3.BigNumber(
        '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
        16
      )
    ]

    let _tokenId = '0x55555aa5569955695569555955555555'

    let _moves = [
      new web3.BigNumber(
        '0xb58b552a986549b132451cbcbd69d106af0e3ae6cead82cc297427c3',
        16
      ),
      new web3.BigNumber(
        '0xbb9af45dbeefd78f120678dd7ef4dfe69f3d9bbe7eeddfc7f0000000',
        16
      )
    ]

    it('should convert correctly', async function() {
      let game = await reversi.getGame(_moves)
      let boardUint = await cloversController.convertBytes16ToUint(game[3])
      assert(
        '0x' + boardUint.toString(16) === _tokenId,
        '_tokenId !== boardUint'
      )
    })

    it('should read parameters that were set', async function() {
      let _stakeAmount = await cloversController.stakeAmount()

      assert(_stakeAmount.toString() === stakeAmount, 'stake amount not equal')

      let _stakePeriod = await cloversController.stakePeriod()
      assert(_stakePeriod.toString() === stakePeriod, 'stake period not equal')

      let _payMultiplier = await cloversController.payMultiplier()
      assert(
        _payMultiplier.toString() === payMultiplier,
        'payMultiplier not equal'
      )

      let _priceMultiplier = await cloversController.priceMultiplier()
      assert(
        _priceMultiplier.toString() === priceMultiplier,
        'priceMultiplier not equal'
      )

      let _basePrice = await cloversController.basePrice()
      assert(_basePrice.toString() === basePrice, 'basePrice not equal')
    })

    it("should make sure token doesn't exist", async function() {
      balance = web3.eth.getBalance(accounts[0])
      try {
        await clovers.ownerOf(_tokenId)
      } catch (error) {
        assert(true, 'ownerOf should have failed while no one owns it')
      }
    })

    it('should make sure can claimClover (keep = true) w valid game, owning no clubToken and approve from oracle', async function() {
      var currentPaused = await clubTokenController.paused()
      // await clubTokenController.updatePaused(false)
      await makeFullClaim({ user: accounts[6], buyClubToken: false })
      // await clubTokenController.updatePaused(true)
    })

    it('should make sure claimClover (_keep = false) is successful using valid game w/ invalid symmetries', async function() {
      var gasPrice = await cloversController.fastGasPrice()
      var stakeWithGas = gasPrice.mul(stakeAmount) 
      try {
        let options = [
          _moves,
          new web3.BigNumber(_tokenId, 16),
          new web3.BigNumber('0x1F', 16), // invalid symmetries
          false,
          {
            value: stakeWithGas.toString(10),
            gasPrice
          }
        ]

        tx = await cloversController.claimClover(...options)
        console.log(
          _ + 'cloversController.claimClover - ' + tx.receipt.cumulativeGasUsed
        )
        gasToCash(tx.receipt.cumulativeGasUsed)

        gasSpent = tx.receipt.cumulativeGasUsed
        assert(
          new web3.BigNumber(tx.receipt.status).eq(1),
          'claimClover tx receipt should have been 0x01 (successful) but was instead ' +
            tx.receipt.status
        )
      } catch (error) {
        console.log('error:', error)
        assert(false, 'claimClover tx receipt should not have thrown an error')
      }
    })

    it('should make sure stake amount was removed from your account', async function() {
      let gasCost = gasSpent * parseInt(gasPrice)
      _balance = web3.eth.getBalance(accounts[0])
      var gasPrice = await cloversController.fastGasPrice()
      var stakeWithGas = gasPrice.mul(stakeAmount)
      assert(
        balance
          .sub(_balance)
          .sub(gasCost)
          .eq(stakeWithGas),
        'original balance ' +
          web3.fromWei(balance).toString() +
          ' minus new balance ' +
          web3.fromWei(_balance).toString() +
          ' minus gas ' +
          web3.fromWei(gasCost).toString() +
          ' did not equal stakeWithGas ' +
          web3.fromWei(stakeWithGas).toString()
      )
    })

    it("should make sure it's not verified yet", async function() {
      let isVerified = await cloversController.isVerified(_tokenId, {
        from: accounts[1]
      })
      assert(!isVerified, 'clover is already verified somehow')
    })

    it('should check the cost of challenging this clover w invalid symmetries', async function() {
      try {
        gasEstimate = await cloversController.challengeClover.estimateGas(
          _tokenId,
          {
            from: oracle
          }
        )
        console.log(_ + 'challengeClover gasEstimate', gasEstimate.toString())
        gasToCash(gasEstimate.toString())
      } catch (error) {
        console.log('error:', error)

        assert(false, 'cloversController.challengeClover ' + error.message)
      }
    })

    it('should update the stake amount with the gas Estimate from challengeClover', async function() {
      try {
        newStakeAmount = new web3.BigNumber(gasEstimate).mul(gasPrice).mul(40)
        tx = await cloversController.updateStakeAmount(newStakeAmount, {
          gasPrice
        })

        console.log(
          _ +
            'cloversController.updateStakeAmount - ' +
            tx.receipt.cumulativeGasUsed
        )
        gasToCash(tx.receipt.cumulativeGasUsed)

        gasSpent += tx.receipt.cumulativeGasUsed
        assert(
          new web3.BigNumber(tx.receipt.status).eq(1),
          'updateStakeAmount tx receipt should have been 0x01 (successful) but was instead ' +
            tx.receipt.status
        )
      } catch (error) {
        console.log('error:', error)

        assert(false, 'updateStakeAmount tx should not have thrown an error')
      }
    })

    it('should check the stake amount for the token in question', async function() {
      let _movesHashSol = await cloversController.getMovesHash(_tokenId)
      let currentStake = await cloversController.getStake(_movesHashSol)
      assert(
        currentStake.toString() === stakeAmount,
        'currentStake ' +
          currentStake.toString() +
          ' doest not equal stakeAmount ' +
          stakeAmount
      )
    })

    it('should make sure it is verified after blocks increase', async function() {
      await increaseBlocks(stakePeriod)
      isVerified = await cloversController.isVerified(_tokenId, {
        from: accounts[1]
      })
      assert(
        isVerified,
        "clover wasn't verified when it should have been already"
      )
      clubBalance = await clubToken.balanceOf(accounts[0])
    })

    it('should make sure retrieveStake tx was successful', async function() {
      try {
        tx = await cloversController.retrieveStake(_tokenId, { gasPrice })

        console.log(
          _ +
            'cloversController.retrieveStake - ' +
            tx.receipt.cumulativeGasUsed
        )
        gasToCash(tx.receipt.cumulativeGasUsed)

        gasSpent += tx.receipt.cumulativeGasUsed
        assert(
          new web3.BigNumber(tx.receipt.status).eq(1),
          'retrieveStake tx receipt should have been 0x01 (successful) but was instead ' +
            tx.receipt.status
        )
      } catch (error) {
        console.log('error:', error)

        assert(false, 'retrieveStake tx should not have thrown an error')
      }
    })

    it('should make sure token exists & is owned by this clovers contract', async function() {
      try {
        let owner = await clovers.ownerOf(_tokenId)
        assert(
          clovers.address === owner,
          'owner of token should have been clovers.address (' +
            accounts[0] +
            ') but was ' +
            owner
        )
      } catch (error) {
        console.log('error:', error)

        assert(false, 'ownerOf should have succeeded')
      }
    })

    it('should make sure reward was received', async function() {
      let _clubBalance = await clubToken.balanceOf(accounts[0])
      assert(
        _clubBalance.gt(clubBalance),
        'new balance of ' +
          _clubBalance.toString() +
          ' is not more than previous Balance of ' +
          clubBalance.toString()
      )
    })

    it('should make sure stake amount was retured to your account', async function() {
      gasCost = gasSpent * gasPrice
      _balance = web3.eth.getBalance(accounts[0])
      let result = balance.minus(gasCost)
      assert(
        result.eq(_balance),
        'original balance ' +
          web3.fromWei(balance).toString() +
          ' minus all gas costs ' +
          web3.fromWei(gasCost).toString() +
          ' did not equal new balance ' +
          web3.fromWei(_balance).toString() +
          ' but rather ' +
          result.toString()
      )
    })

    it('should make sure can claimClover (keep = true) w valid game, while owning enough clubToken and approve from oracle', async function() {
      await makeFullClaim({ user: accounts[4], buyClubToken: true })
    })
  })

  async function makeFullClaim({ user, buyClubToken }) {
    let rev = new Rev()

    rev.mine()
    rev.thisMovesToByteMoves()

    let moves = [
      '0x' + rev.byteFirst32Moves.padStart(56, '0'),
      '0x' + rev.byteLastMoves.padStart(56, '0')
    ]
    tokenId = new web3.BigNumber(rev.byteBoard, 16)

    let symmetries = rev.returnSymmetriesAsBN()
    let stakeAmount = await cloversController.stakeAmount()
    let gasPrice = await cloversController.fastGasPrice()
    let stakeWithGas = gasPrice.mul(stakeAmount)
    let reward
    try {
      reward = await cloversController.calculateReward(symmetries.toString(10))
    } catch (error) {
      assert(false, 'calculate reward failed')
      return
    }

    let costInTokens
    try {
      costInTokens = await cloversController.getPrice(symmetries.toString())
    } catch (error) {
      console.log(error)
      assert(false, 'costInTokens2 reward failed')
      return
    }

    let costOfTokens
    try {
      costOfTokens = await getLowestPrice(clubTokenController, costInTokens)
    } catch (error) {
      assert(false, 'get lowest price failed')
      console.log(error)
      return
    }

    if (buyClubToken) {
      await clubTokenController.buy(user, { value: costOfTokens.div(2) })
      costOfTokens = costOfTokens.div(2)
    }
    let value = costOfTokens.add(stakeWithGas)

    let keep = true
    try {
      if (tokenId.constructor.isBN) {
        tokenId = web3.toBigNumber('0x' + tokenId.toString(16))
      }
      var tx = await cloversController.claimClover(
        moves,
        tokenId.toString(10),
        '0x' + symmetries.toString(16),
        keep,
        {
          value: value,
          from: user
        }
      )
      console.log(
        _ + 'cloversController.claimClover - ' + tx.receipt.cumulativeGasUsed
      )
      gasToCash(tx.receipt.cumulativeGasUsed)
    } catch (error) {
      assert(false, 'claimClover failed ' + error.message)
      return
    }

    try {
      let exists = await clovers.exists(tokenId)
      assert(
        exists,
        'clover ' +
          tokenId.toString(16) +
          (exists ? ' does ' : ' does not ') +
          ' exist'
      )
      let newOwner = await clovers.ownerOf(tokenId)
      assert(
        newOwner.toLowerCase() === clovers.address,
        'clover ' +
          tokenId +
          ' should be owned by ' +
          clovers.address +
          ' but is owned by ' +
          newOwner
      )
    } catch (error) {
      console.log(error)
      assert(false, 'check owner failed ' + error.message)
      return
    }

    try {
      await cloversController.retrieveStake(tokenId, { from: oracle })
    } catch (error) {
      assert(false, 'retrieveStake failed ' + error.message)
      assert(false, error.message)
      console.log(error)
    }
  }
})

// function gasToCash(totalGas) {
//   BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: 4 });
//
//   if (typeof totalGas !== "object") totalGas = new web3.BigNumber(totalGas);
//   let lowGwei = oneGwei.mul(new web3.BigNumber("8"));
//   let highGwei = oneGwei.mul(new web3.BigNumber("20"));
//   let ethPrice = new web3.BigNumber("450");
//
//   console.log(
//     _ +
//       _ +
//       "$" +
//       new web3.BigNumber(utils.fromWei(totalGas.mul(lowGwei).toString()))
//         .mul(ethPrice)
//         .toFixed(2) +
//       " @ 8 GWE & " +
//       ethPrice +
//       "/USD"
//   );
//   console.log(
//     _ +
//       _ +
//       "$" +
//       new web3.BigNumber(utils.fromWei(totalGas.mul(highGwei).toString()))
//         .mul(ethPrice)
//         .toFixed(2) +
//       " @ 20 GWE & " +
//       ethPrice +
//       "/USD"
//   );
// }

function getBlockNumber() {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, result) => {
      if (error) reject(error)
      resolve(result)
    })
  })
}

async function increaseTime(amount) {
  let currentBlock = await new Promise(resolve =>
    web3.eth.getBlockNumber((err, result) => resolve(result))
  )
  let getBlock = await web3.eth.getBlock(currentBlock)
  // console.log("timestamp", getBlock.timestamp);
  await web3.currentProvider.send({
    jsonrpc: '2.0',
    method: 'evm_increaseTime',
    params: [amount],
    id: 0
  })
  await increaseBlock()
  currentBlock = await new Promise(resolve =>
    web3.eth.getBlockNumber((err, result) => resolve(result))
  )
  getBlock = await web3.eth.getBlock(currentBlock)
  // console.log("timestamp", getBlock.timestamp);
}

function increaseBlocks(blocks) {
  return new Promise((resolve, reject) => {
    increaseBlock().then(() => {
      blocks -= 1
      if (blocks == 0) {
        resolve()
      } else {
        increaseBlocks(blocks).then(resolve)
      }
    })
  })
}

function increaseBlock() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: 12345
      },
      (err, result) => {
        if (err) reject(err)
        resolve(result)
      }
    )
  })
}

function decodeEventString(hexVal) {
  return hexVal
    .match(/.{1,2}/g)
    .map(a =>
      a
        .toLowerCase()
        .split('')
        .reduce(
          (result, ch) => result * 16 + '0123456789abcdefgh'.indexOf(ch),
          0
        )
    )
    .map(a => String.fromCharCode(a))
    .join('')
}
