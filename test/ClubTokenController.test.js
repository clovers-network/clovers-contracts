var utils = require('web3-utils')
var {deployAllContracts} = require('../helpers/deployAllContracts')
var {updateAllContracts} = require('../helpers/updateAllContracts')
var networks =require('../networks.json')
const {
    oneGwei,
    gasToCash,
    globalGasPrice,
    _
} = require('../helpers/utils')
const {
  reserveRatio,
  virtualBalance,
  virtualSupply,
  payMultiplier,
  priceMultiplier,
  basePrice
} = require('../helpers/migVals')
var assert = require('assert');

describe('ClubTokenController.sol', async function() {
  const accounts = await web3.eth.getAccounts();

  var
    clovers, 
    cloversMetadata, 
    cloversController, 
    clubTokenController, 
    simpleCloversMarket, 
    clubToken
  before(async () => {
      try {
        var totalGas = utils.toBN('0')
        const chainId = await web3.eth.net.getId()
        var allContracts = await deployAllContracts({accounts, artifacts, web3, chainId, networks})
        
        clovers = allContracts.clovers 
        cloversMetadata = allContracts.cloversMetadata 
        cloversController = allContracts.cloversController 
        clubTokenController = allContracts.clubTokenController 
        simpleCloversMarket = allContracts.simpleCloversMarket 
        clubToken = allContracts.clubToken
        gasUsed = allContracts.gasUsed       

        totalGas = totalGas.add(utils.toBN(gasUsed))

        var {gasUsed} = await updateAllContracts({
            clovers, 
            cloversMetadata, 
            cloversController, 
            clubTokenController, 
            simpleCloversMarket, 
            clubToken,
            accounts
        })
        // totalGas = totalGas.add(utils.toBN(gasUsed))

        // console.log(_ + totalGas.toString(10) + ' - Total Gas')
        // gasToCash(totalGas)

      } catch (error) {
        console.log('error:', error)
      }
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

      let difference = utils.toBN(_depositAmount).sub(expectedReturn)
      assert(
        difference.lte(utils.toBN(2)),
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
          gasPrice: globalGasPrice
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
      let gasCost = gasSpent * parseInt(globalGasPrice)

      let balanceAfter = await web3.eth.getBalance(buyer)
      assert(
        utils.toBN(balanceBefore)
          .sub(utils.toBN(gasCost.toString()))
          .add(utils.toBN(expectedReturn.toString()))
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

})