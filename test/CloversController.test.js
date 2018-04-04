var utils = require('web3-utils')
var Reversi = artifacts.require("./Reversi.sol")
var Clovers = artifacts.require("./Clovers.sol")
var CloversMetadata = artifacts.require("./CloversMetadata.sol")
var CloversController = artifacts.require("./CloversController.sol")
var ClubToken = artifacts.require("./ClubToken.sol")


let gasPrice = 1000000000 // 1GWEI

let stakeAmount = 100
let stakePeriod = 100
let multiplier = 10
let _ = '        '

contract('Clovers', async function(accounts)  {
  let clovers, cloversMetadata, clubToken, reversi, cloversController
  before((done) => {
    (async () => {
      try {
        var totalGas = new web3.BigNumber(0)

        // Deploy Clovers.sol (NFT)
        clovers = await Clovers.new()
        var tx = web3.eth.getTransactionReceipt(clovers.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_+tx.gasUsed+' - Deploy clovers')
        clovers = await Clovers.deployed()
        // console.log('clovers', clovers.address)

        // Deploy CloversMetadata.sol
        // -w Clovers address
        cloversMetadata = await CloversMetadata.new(clovers.address)
        var tx = web3.eth.getTransactionReceipt(cloversMetadata.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_+tx.gasUsed+' - Deploy cloversMetadata')
        cloversMetadata = await CloversMetadata.deployed()
        // console.log('cloversMetadata', cloversMetadata.address)

        // Update Clovers.sol 
        // -w CloversMetadata address
        var tx = await clovers.updateCloversMetadataAddress(cloversMetadata.address)
        totalGas = totalGas.plus(tx.receipt.gasUsed)
        console.log(_+tx.receipt.gasUsed+' - Update clovers')

        // Deploy ClubToken.sol (ERC20)
        clubToken = await ClubToken.new()
        var tx = web3.eth.getTransactionReceipt(clubToken.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_+tx.gasUsed+' - Deploy clubToken')
        clubToken = await ClubToken.deployed()
        // console.log('clubToken', clubToken.address)

        // Deploy Reversi.sol
        // -link w cloversController
        reversi = await Reversi.new()
        var tx = web3.eth.getTransactionReceipt(reversi.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_+tx.gasUsed+' - Deploy reversi')
        reversi = await Reversi.deployed()
        await CloversController.link('Reversi', reversi.address)
        // await deployer.link(Reversi, CloversController);
        // await deployer.link(Reversi);
        // await CloversController.link(reversi);

        // Deploy CloversController.sol
        // -w Clovers address
        // -w ClubToken address
        cloversController = await CloversController.new(clovers.address, reversi.address)
        var tx = web3.eth.getTransactionReceipt(cloversController.transactionHash)
        totalGas = totalGas.plus(tx.gasUsed)
        console.log(_+tx.gasUsed+' - Deploy cloversController')
        cloversController = await CloversController.deployed()

        // Update Clovers.sol
        // -w CloversController address
        var tx = await clovers.updateCloversControllerAddress(cloversController.address)
        totalGas = totalGas.plus(tx.receipt.gasUsed)
        console.log(_+tx.receipt.gasUsed+' - Update clovers')
        // Update ClubToken.sol
        // -w CloversController address
        var tx = await clubToken.updateCloversControllerAddress(cloversController.address)
        totalGas = totalGas.plus(tx.receipt.gasUsed)
        console.log(_+tx.receipt.gasUsed+' - Update clubToken')
        // Update CloversController.sol
        // -w stakeAmount
        // -w stakePeriod
        // -w payMultiplier
        var tx = await cloversController.updateStakeAmount(stakeAmount)
        totalGas = totalGas.plus(tx.receipt.gasUsed)
        console.log(_+tx.receipt.gasUsed+' - Update cloversController')
        var tx = await cloversController.updateStakePeriod(stakePeriod)
        totalGas = totalGas.plus(tx.receipt.gasUsed)
        console.log(_+tx.receipt.gasUsed+' - Update cloversController')
        var tx = await cloversController.updatePayMultipier(multiplier)
        totalGas = totalGas.plus(tx.receipt.gasUsed)
        console.log(_+tx.receipt.gasUsed+' - Update cloversController')

        console.log(_+totalGas.toFormat(0) + ' - Total Gas')
        done()
      } catch (error) {
        console.error(error)
        done()
      }
    })();
  })

  describe('Clovers.sol', function () {
    it('should be able to read metadata', async function () {
      let metadata = await clovers.tokenMetadata(666)
      let _metadata = await cloversMetadata.tokenMetadata(666)
      assert(_metadata === metadata, '_metadata != metadata')
    })
  })

  describe('CloversController.sol', function() {
    let balance, _balance, tx, clubBalance, gasEstimate, newStakeAmount, gasSpent

    let _invalidTokenId = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    let _invalidMoves = [
      new web3.BigNumber('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16),
      new web3.BigNumber('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)
    ]


    let _tokenId = '0x5555555565556955695566955aa55555'
    let _moves = [
      new web3.BigNumber('0xcb76aedd77baf6cfcfbeeb5362d6affb54f9d53971d37f37de9bf87c', 16),
      new web3.BigNumber('0xc5670faa513068f1effd8f32a14ba11b64ca7461c193223c', 16)
    ]

    it('should read parameters that were set', async function () {
      let _stakeAmount = await cloversController.currentStakeAmount()

      assert(_stakeAmount.toNumber() === stakeAmount, 'stake amount not equal');

      let _stakePeriod = await cloversController.currentStakePeriod()
      assert(_stakePeriod.toNumber() === stakePeriod, 'stake period not equal');
      
      let _multiplier = await cloversController.getMultiplier()
      assert(_multiplier.toNumber() === multiplier, 'multiplier not equal');
    })

    it('should make sure token doesn\'t exist', async function () {
      balance = web3.eth.getBalance(accounts[0])
      try {
        await clovers.ownerOf(_tokenId)
      } catch (error) {
        assert(true, 'ownerOf should have failed while no one owns it');
      }
    })

    it('should make sure claimClover is successful', async function () {
      try {
        let options = [
          _moves,
          new web3.BigNumber(_tokenId, 16), 
          new web3.BigNumber('0x1F', 16), // invalid symmetries
          accounts[0], 
          {
            value: new web3.BigNumber(stakeAmount),
            gasPrice
          }
        ]
        tx = await cloversController.claimClover(...options)
        console.log(_+'claimClover gasCost ' + tx.receipt.cumulativeGasUsed)
        gasSpent = tx.receipt.cumulativeGasUsed
        assert(new web3.BigNumber(tx.receipt.status).eq(1), 'claimClover tx receipt should have been 0x01 (successful) but was instead ' + tx.receipt.status);
      } catch (error) {
        console.log(error)
        assert(false, 'claimClover tx receipt should not have thrown an error')
      }
    })

    it('should make sure token exists & is owned by this account', async function () {
      try {
        let owner = await clovers.ownerOf(_tokenId)
        assert(accounts[0] === owner, 'owner of token should have been accounts[0] (' + accounts[0] + ') but was ' + owner)
      } catch (error) {
        console.log(error)
        assert(false, 'ownerOf should have succeeded')
      }
    })

    it('should make sure stake amount was removed from your account', async function () {
      let gasCost = gasSpent * gasPrice
      _balance = web3.eth.getBalance(accounts[0])
      assert(balance.sub(_balance).sub(gasCost).eq(stakeAmount), 'original balance ' + web3.fromWei(balance).toString() + ' minus new balance ' + web3.fromWei(_balance).toString() + ' minus gas ' + web3.fromWei(gasCost).toString() + ' did not equal stakeAmount ' + web3.fromWei(stakeAmount).toString())
    })

    it('should make sure it\'s not verified yet', async function () {
      let isVerified = await cloversController.isVerified(_tokenId)      
      assert(!isVerified, 'clover is already verified somehow')
    })

    it('should check the cost of challenging this fake clover', async function () {
      try{
        gasEstimate = await cloversController.challengeClover.estimateGas(_tokenId, accounts[0])
        console.log(_+'challengeClover gasEstimate', gasEstimate.toString())
      } catch (error) {
        console.error(error)
      }
    })

    it('should update the stake amount with the gas Estimate from challengeClover', async function () {
       try {
        newStakeAmount = new web3.BigNumber(gasEstimate).mul(gasPrice).mul(40)
        tx = await cloversController.updateStakeAmount(newStakeAmount, {gasPrice})
        console.log(_+'updateStakeAmount gasCost ' + tx.receipt.cumulativeGasUsed)
        gasSpent += tx.receipt.cumulativeGasUsed

        assert(new web3.BigNumber(tx.receipt.status).eq(1), 'updateStakeAmount tx receipt should have been 0x01 (successful) but was instead ' + tx.receipt.status);
      } catch (error) {
        console.log(error)
        assert(false, 'updateStakeAmount tx should not have thrown an error')
      }
    })

    it('should check the stake amount for the token in question', async function () {
      let _movesHashSol = await cloversController.getMovesHash(_tokenId)
      let currentStake = await clovers.getStake(_movesHashSol)
      assert(currentStake.toNumber() === stakeAmount, 'currentStake ' + currentStake.toString() + ' doest not equal stakeAmount ' + stakeAmount)
    })

    it('should make sure it is verified after blocks increase', async function () {
      await increaseBlocks(stakePeriod)
      isVerified = await cloversController.isVerified(_tokenId)
      assert(isVerified, 'clover wasn\'t verified when it should have been already')
      clubBalance = await clubToken.balanceOf(accounts[0])
    })

    it('should make sure retrieveStake tx was successful', async function () {
      try {
        tx = await cloversController.retrieveStake(_tokenId, {gasPrice})
        console.log(_+'retrieveStake gasCost ' + tx.receipt.cumulativeGasUsed)
        gasSpent += tx.receipt.cumulativeGasUsed
        assert(new web3.BigNumber(tx.receipt.status).eq(1), 'retrieveStake tx receipt should have been 0x01 (successful) but was instead ' + tx.receipt.status);
      } catch (error) {
        console.log(error)
        assert(false, 'retrieveStake tx should not have thrown an error')
      }
    })

    it('should make sure reward was received', async function () {
      let _clubBalance = await clubToken.balanceOf(accounts[0])
      console.log(_+'reward was ' + _clubBalance.toString())
      assert(_clubBalance.gt(clubBalance), 'new balance of ' + _clubBalance.toString() + ' is not more than previous Balance of ' + clubBalance.toString())
    })

    it('should make sure stake amount was retured to your account', async function () {
      gasCost = gasSpent * gasPrice
      _balance = web3.eth.getBalance(accounts[0])
      let result = balance.minus(gasCost)
      assert(result.eq(_balance), 'original balance ' + web3.fromWei(balance).toString() + ' minus all gas costs ' + web3.fromWei(gasCost).toString() + ' did not equal new balance ' + web3.fromWei(_balance).toString() + ' but rather ' + result.toString())
    })
  })
})

function getBlockNumber () {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, result) => {
      if (error) reject(error)
      resolve(result)
    })
  })
}

function increaseBlocks (blocks) {
  return new Promise((resolve, reject) => {
    increaseBlock().then(() => {
      blocks -= 1;
      if (blocks == 0){
        resolve()
      } else {
        increaseBlocks(blocks).then(resolve)
      }
    })
  })
}

function increaseBlock() {
  return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "evm_mine",
        id: 12345
      }, (err, result) => {
        if (err) reject(err)
        resolve(result)
      });
  })
}

function decodeEventString(hexVal) {
  return hexVal.match(/.{1,2}/g).map((a) => a.toLowerCase().split('').reduce( (result, ch) =>
        result * 16 + '0123456789abcdefgh'.indexOf(ch), 0)).map((a) => String.fromCharCode(a)).join('')

}