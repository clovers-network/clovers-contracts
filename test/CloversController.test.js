var utils = require('web3-utils')
var Rev = require('clovers-reversi').default
var {deployAllContracts} = require('../helpers/deployAllContracts')
var {updateAllContracts} = require('../helpers/updateAllContracts')
var networks =require('../networks.json')
const {
  gasToCash,
  getLowestPrice, 
  _
} = require('../helpers/utils')

const ethPrice = utils.toBN('440')
const oneGwei = utils.toBN('1000000000') // 1 GWEI
let globalGasPrice = oneGwei.toString(10)

contract('Clovers', async function(accounts) {
  let oracle = accounts[8]

  let clovers, 
    cloversMetadata, 
    cloversController, 
    clubTokenController, 
    simpleCloversMarket, 
    clubToken
  before(done => {
    ;(async () => {
      try {
        var totalGas = utils.toBN('0')
        const chainId = await web3.eth.net.getId()
        var {
            clovers, 
            cloversMetadata, 
            cloversController, 
            clubTokenController, 
            simpleCloversMarket, 
            clubToken,
            gasUsed
        } = await deployAllContracts({accounts, artifacts, web3, chainId, networks})

        gasToCash(gasUsed)
        totalGas = totalGas.add(utils.toBN(gasUsed))

        var {
          gasUsed
        } = await updateAllContracts({
            clovers, 
            cloversMetadata, 
            cloversController, 
            clubTokenController, 
            simpleCloversMarket, 
            clubToken,
            accounts
        })

        gasToCash(gasUsed)
        totalGas = totalGas.add(utils.toBN(gasUsed))

        console.log(_ + totalGas.toString(10) + ' - Total Gas')
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

  // describe('SimpleCloversMarket.sol', function() {
  //   let _tokenId = '0x666'
  //   let _seller = accounts[9]
  //   let _buyer = accounts[8]
  //   let _price = utils.toBN(utils.toWei('0.5'))
  //   it('should have correct contract addresses', async function() {
  //     let _clovers = await simpleCloversMarket.clovers()
  //     assert(
  //       _clovers === clovers.address,
  //       'clovers contract address is incorrect ' +
  //         _clovers +
  //         '!=' +
  //         clovers.address
  //     )

  //     let _clubToken = await simpleCloversMarket.clubToken()
  //     assert(
  //       _clubToken === clubToken.address,
  //       'clubToken contract address is incorrect ' +
  //         _clubToken +
  //         '!=' +
  //         clubToken.address
  //     )

  //     let _clubTokenController = await simpleCloversMarket.clubTokenController()
  //     assert(
  //       _clubTokenController === clubTokenController.address,
  //       'clubTokenController contract address is incorrect ' +
  //         _clubTokenController +
  //         '!=' +
  //         clubTokenController.address
  //     )
  //   })

  //   it('should list a clover for sale', async function() {
  //     try {
  //       tx = await clovers.mint(_seller, _tokenId)
  //       console.log(_ + 'clovers.mint - ' + tx.receipt.cumulativeGasUsed)
  //       gasToCash(tx.receipt.cumulativeGasUsed)
  //       let owner = await clovers.ownerOf(_tokenId)
  //       assert(
  //         owner.toString() === _seller.toString(),
  //         'owner is not seller ' + owner.toString() + '!=' + _seller.toString()
  //       )
  //     } catch (error) {
  //       assert(false, error.message)
  //     }
  //     try {
  //       tx = await simpleCloversMarket.sell(_tokenId, _price, {
  //         from: _seller
  //       })
  //       console.log(
  //         _ + 'simpleCloversMarket.sell - ' + tx.receipt.cumulativeGasUsed
  //       )
  //       gasToCash(tx.receipt.cumulativeGasUsed)

  //       let _price_ = await simpleCloversMarket.sellPrice(_tokenId)
  //       assert(
  //         _price_.toString() === _price.toString(),
  //         'prices do not match ' +
  //           _price_.toString() +
  //           '!==' +
  //           _price.toString()
  //       )
  //     } catch (error) {
  //       assert(false, error.message)
  //     }
  //   })

  //   it('should buy the clover by minting ClubToken before', async () => {
  //     let buyerBalance = await clubToken.balanceOf(_buyer)
  //     let amountToSpend, tx
  //     try {
  //       if (buyerBalance.lt(_price)) {
  //         amountToSpend = await getLowestPrice(clubTokenController, _price)
  //         // tx = await clubTokenController.buy(_buyer, {
  //         //   value: amountToSpend
  //         // });
  //         // console.log(
  //         //   _ + "clubTokenController.buy - " + tx.receipt.cumulativeGasUsed
  //         // );
  //         // gasToCash(tx.receipt.cumulativeGasUsed);
  //         // buyerBalance = await clubToken.balanceOf(_buyer);
  //         // assert(
  //         //   buyerBalance.gte(_price),
  //         //   "buyer balance still isn't enough (" +
  //         //     buyerBalance.toString() +
  //         //     "<" +
  //         //     _price.toString()
  //         // );
  //       } else {
  //         amountToSpend = '0'
  //       }
  //     } catch (error) {
  //       assert(false, error.message)
  //     }
  //     try {
  //       let from = await simpleCloversMarket.sellFrom(_tokenId)
  //       let owner = await clovers.ownerOf(_tokenId)
  //       assert(
  //         from.toString() === owner.toString(),
  //         'for sale from wrong person'
  //       )


  //       tx = await simpleCloversMarket.buy(_tokenId, {
  //         from: _buyer,
  //         value: amountToSpend
  //       })
  //       console.log(
  //         _ + 'simpleCloversMarket.buy - ' + tx.receipt.cumulativeGasUsed
  //       )
  //       gasToCash(tx.receipt.cumulativeGasUsed)
  //       let newOwner = await clovers.ownerOf(_tokenId)
  //       assert(
  //         newOwner.toString() === _buyer.toString(),
  //         'buyer was unable to buy'
  //       )
  //     } catch (error) {
  //       console.log({tx})
  //       assert(false, error.message)
  //     }
  //   })
  // })

  // describe('ClubTokenController.sol', function() {
  //   it('should read parameters that were set', async function() {
  //     let _reserveRatio = await clubTokenController.reserveRatio()
  //     assert(
  //       _reserveRatio.toString(10) === reserveRatio,
  //       'reserveRatio ' +
  //         _reserveRatio.toString(10) +
  //         ' not equal to ' +
  //         reserveRatio
  //     )

  //     let _virtualSupply = await clubTokenController.virtualSupply()
  //     assert(
  //       _virtualSupply.toString(10) === virtualSupply,
  //       'virtualSupply ' +
  //         _virtualSupply.toString(10) +
  //         ' not equal to ' +
  //         virtualSupply
  //     )

  //     let _virtualBalance = await clubTokenController.virtualBalance()
  //     assert(
  //       _virtualBalance.toString(10) === virtualBalance,
  //       'virtualBalance ' +
  //         _virtualBalance.toString(10) +
  //         ' not equal to ' +
  //         virtualBalance
  //     )
  //   })

  //   it('should mint new tokens', async function() {
  //     let _depositAmount = utils.toWei('1')
  //     let buyer = accounts[5]

  //     let _virtualSupply = await clubTokenController.virtualSupply()
  //     let _totalSupply = await clubToken.totalSupply()
  //     let _supply = _virtualSupply.add(_totalSupply)

  //     let _virtualBalance = await clubTokenController.virtualBalance()
  //     let _poolBalance = await clubTokenController.poolBalance()
  //     let _connectorBalance = _virtualBalance.add(_poolBalance)

  //     let _connectorWeight = await clubTokenController.reserveRatio()

  //     let expectedReturn = await clubTokenController.calculatePurchaseReturn(
  //       _supply,
  //       _connectorBalance,
  //       _connectorWeight,
  //       _depositAmount
  //     )

  //     let balanceBefore = await clubToken.balanceOf(buyer)
  //     try {
  //       tx = await clubTokenController.buy(buyer, {
  //         from: buyer,
  //         value: _depositAmount
  //       })
  //       console.log(
  //         _ + 'clubTokenController.buy - ' + tx.receipt.cumulativeGasUsed
  //       )
  //       gasToCash(tx.receipt.cumulativeGasUsed)
  //     } catch (error) {
  //       console.log('error:', error)

  //       assert(false, 'buy tx receipt should not have thrown an error')
  //     }

  //     let balanceAfter = await clubToken.balanceOf(buyer)
  //     assert(
  //       balanceBefore.add(expectedReturn).toString(10) ===
  //         balanceAfter.toString(10),
  //       'balanceBefore plus expectedReturn (' +
  //         balanceBefore.add(expectedReturn).toString(10) +
  //         ') did not equal balanceAfter (' +
  //         balanceAfter.toString(10) +
  //         ')'
  //     )
  //   })
  //   it('should sell the new tokens', async function() {
  //     let buyer = accounts[5]
  //     let _depositAmount = utils.toWei('1')

  //     let _virtualSupply = await clubTokenController.virtualSupply()
  //     let _totalSupply = await clubToken.totalSupply()
  //     let _supply = _virtualSupply.add(_totalSupply)

  //     let _virtualBalance = await clubTokenController.virtualBalance()
  //     let _poolBalance = await clubTokenController.poolBalance()
  //     let _connectorBalance = _virtualBalance.add(_poolBalance)

  //     let _connectorWeight = await clubTokenController.reserveRatio()

  //     let _sellAmount = await clubToken.balanceOf(buyer)

  //     let expectedReturn = await clubTokenController.calculateSaleReturn(
  //       _supply,
  //       _connectorBalance,
  //       _connectorWeight,
  //       _sellAmount
  //     )

  //     let difference = utils.toBN(_depositAmount).sub(expectedReturn)
  //     assert(
  //       difference.lte(utils.toBN(2)),
  //       'difference of expectedReturn (' +
  //         expectedReturn.toString(10) +
  //         ') and _depositAmount (' +
  //         _depositAmount.toString(10) +
  //         ') by a margin of more than 1 WEI (' +
  //         difference.toString(10) +
  //         ')'
  //     )

  //     let balanceBefore = await web3.eth.getBalance(buyer)
  //     try {
  //       var tx = await clubTokenController.sell(_sellAmount, {
  //         from: buyer,
  //         gasPrice: globalGasPrice
  //       })
  //       console.log(
  //         _ + 'clubTokenController.sell - ' + tx.receipt.cumulativeGasUsed
  //       )
  //       gasToCash(tx.receipt.cumulativeGasUsed)
  //     } catch (error) {
  //       console.log('error:', error)

  //       assert(false, 'sell tx receipt should not have thrown an error')
  //     }
  //     gasSpent = tx.receipt.cumulativeGasUsed
  //     let gasCost = gasSpent * parseInt(globalGasPrice)

  //     let balanceAfter = await web3.eth.getBalance(buyer)
  //     assert(
  //       utils.toBN(balanceBefore)
  //         .sub(utils.toBN(gasCost.toString()))
  //         .add(utils.toBN(expectedReturn.toString()))
  //         .toString() === balanceAfter.toString(),
  //       'balanceBefore (' +
  //         utils.fromWei(balanceBefore.toString()) +
  //         ') minus gasCosts (' +
  //         gasCost.toString() +
  //         ') plus expectedReturn (' +
  //         utils.fromWei(expectedReturn.toString()) +
  //         ') did not equal balanceAfter (' +
  //         utils.fromWei(balanceAfter.toString()) +
  //         ')'
  //     )
  //   })
  // })

  // describe('CloversController.sol', function() {
  //   let balance,
  //     _balance,
  //     tx,
  //     clubBalance,
  //     gasEstimate,
  //     newStakeAmount,
  //     gasSpent

  //   let _invalidTokenId = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
  //   let _invalidMoves = [
  //     utils.toBN(
  //       '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
  //       16
  //     ),
  //     utils.toBN(
  //       '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
  //       16
  //     )
  //   ]

  //   let _tokenId = '0x55555aa5569955695569555955555555'

  //   let _moves = [
  //       '0xb58b552a986549b132451cbcbd69d106af0e3ae6cead82cc297427c3',
  //       '0xbb9af45dbeefd78f120678dd7ef4dfe69f3d9bbe7eeddfc7f0000000'
  //   ]

  //   it('should convert correctly', async function() {

  //     let game = await reversi.getGame(_moves)
  //     let boardUint = await cloversController.convertBytes16ToUint(game[3])
  //     assert(
  //       '0x' + boardUint.toString(16) === _tokenId,
  //       '_tokenId !== boardUint'
  //     )
  //   })

  //   it('should read parameters that were set', async function() {


  //     let _payMultiplier = await cloversController.payMultiplier()
  //     assert(
  //       _payMultiplier.toString() === payMultiplier,
  //       'payMultiplier not equal'
  //     )

  //     let _priceMultiplier = await cloversController.priceMultiplier()
  //     assert(
  //       _priceMultiplier.toString() === priceMultiplier,
  //       'priceMultiplier not equal'
  //     )

  //     let _basePrice = await cloversController.basePrice()
  //     assert(_basePrice.toString() === basePrice, 'basePrice not equal')

  //     let _fastGasPrice = await cloversController.fastGasPrice()
  //     assert(_fastGasPrice.toString() === fastGasPrice.toString(10), 'fastGasPrice not equal')

  //     let _averageGasPrice = await cloversController.averageGasPrice()
  //     assert(_averageGasPrice.toString() === averageGasPrice.toString(10), 'averageGasPrice not equal')

  //     let _safeLowGasPrice = await cloversController.safeLowGasPrice()
  //     assert(_safeLowGasPrice.toString(10) === safeLowGasPrice.toString(10), 'safeLowGasPrice not equal')

  //   })

  //   it("should make sure token doesn't exist", async function() {
  //     balance = utils.toBN(await web3.eth.getBalance(accounts[0]))
  //     try {
  //       await clovers.ownerOf(_tokenId)
  //     } catch (error) {
  //       assert(true, 'ownerOf should have failed while no one owns it')
  //     }
  //   })

  //   it('should make sure can claimClover (keep = true) w valid game, owning no clubToken and approve from oracle', async function() {
  //     var currentPaused = await clubTokenController.paused()
  //     // await clubTokenController.updatePaused(false)
  //     await makeFullClaim({ user: accounts[6], buyClubToken: false })
  //     // await clubTokenController.updatePaused(true)
  //   })

  //   it('should make sure claimClover (_keep = false) is successful using valid game w/ invalid symmetries', async function() {
  //     var gasPrice = utils.toBN(await cloversController.getGasPriceForApp())
  //     try {
  //       let options = [
  //         _moves,
  //         utils.toBN(_tokenId, 16),
  //         utils.toBN('0x1F', 16), // invalid symmetries
  //         false,
  //         {
  //           value: gasPrice.toString(10),
  //           gasPrice: globalGasPrice
  //         }
  //       ]

  //       tx = await cloversController.claimClover(...options)
  //       console.log(
  //         _ + 'cloversController.claimClover - ' + tx.receipt.cumulativeGasUsed
  //       )
  //       gasToCash(tx.receipt.cumulativeGasUsed)

  //       gasSpent = tx.receipt.cumulativeGasUsed
  //       assert(
  //         tx.receipt.status,
  //         'claimClover tx receipt should have been 0x01 (successful) but was instead ' +
  //           tx.receipt.status
  //       )
  //     } catch (error) {
  //       console.log('error:', error)
  //       assert(false, 'claimClover tx receipt should not have thrown an error')
  //     }
  //   })

  //   it('should check the cost of challenging this clover w invalid symmetries', async function() {
  //     try {
  //       gasEstimate = await cloversController.challengeCloverWithGas.estimateGas(
  //         _tokenId,
  //         fastGasPrice,
  //         averageGasPrice,
  //         safeLowGasPrice,
  //         {
  //           from: oracle
  //         }
  //       )
  //       console.log(_ + 'challengeClover gasEstimate', gasEstimate.toString())
  //       gasToCash(gasEstimate.toString())
  //     } catch (error) {
  //       console.log('error:', error)

  //       assert(false, 'cloversController.challengeClover ' + error.message)
  //     }
  //   })




  //   it('should make sure token exists & is owned by this clovers contract', async function() {
  //     try {
  //       let owner = await clovers.ownerOf(_tokenId)
  //       assert(
  //         clovers.address === owner,
  //         'owner of token should have been clovers.address (' +
  //           accounts[0] +
  //           ') but was ' +
  //           owner
  //       )
  //     } catch (error) {
  //       console.log('error:', error)

  //       assert(false, 'ownerOf should have succeeded')
  //     }
  //   })

  //   it('should make sure reward was received', async function() {
  //     let _clubBalance = await clubToken.balanceOf(accounts[0])
  //     assert(
  //       _clubBalance.gt(clubBalance),
  //       'new balance of ' +
  //         _clubBalance.toString() +
  //         ' is not more than previous Balance of ' +
  //         clubBalance.toString()
  //     )
  //   })


  //   it('should make sure can claimClover (keep = true) w valid game, while owning enough clubToken and approve from oracle', async function() {
  //     await makeFullClaim({ user: accounts[4], buyClubToken: true })
  //   })
  // })

  // async function makeFullClaim({ user, buyClubToken }) {
  //   let rev = new Rev()

  //   rev.mine()
  //   rev.thisMovesToByteMoves()

  //   let moves = [
  //     '0x' + rev.byteFirst32Moves.padStart(56, '0'),
  //     '0x' + rev.byteLastMoves.padStart(56, '0')
  //   ]
  //   tokenId = utils.toBN(rev.byteBoard, 16)

  //   let symmetries = rev.returnSymmetriesAsBN()
  //   let gasPrice = await cloversController.getGasPriceForApp()
  //   let reward
  //   try {
  //     reward = await cloversController.calculateReward(symmetries.toString(10))
  //   } catch (error) {
  //     assert(false, 'calculate reward failed')
  //     return
  //   }

  //   let costInTokens
  //   try {
  //     costInTokens = await cloversController.getPrice(symmetries.toString())
  //   } catch (error) {
  //     console.log(error)
  //     assert(false, 'costInTokens2 reward failed')
  //     return
  //   }

  //   let costOfTokens
  //   try {
  //     costOfTokens = await getLowestPrice(clubTokenController, costInTokens)
  //   } catch (error) {
  //     assert(false, 'get lowest price failed')
  //     console.log(error)
  //     return
  //   }

  //   if (buyClubToken) {
  //     await clubTokenController.buy(user, { value: costOfTokens.div(2) })
  //     costOfTokens = costOfTokens.div(2)
  //   }
  //   let value = costOfTokens

  //   let keep = true
  //   try {
  //     var tx = await cloversController.claimClover(
  //       moves,
  //       tokenId.toString(10),
  //       '0x' + symmetries.toString(16),
  //       keep,
  //       {
  //         value: value,
  //         from: user
  //       }
  //     )
  //     console.log(
  //       _ + 'cloversController.claimClover - ' + tx.receipt.cumulativeGasUsed
  //     )
  //     gasToCash(tx.receipt.cumulativeGasUsed)
  //   } catch (error) {
  //     assert(false, 'claimClover failed ' + error.message)
  //     return
  //   }

  //   try {
  //     let exists = await clovers.exists(tokenId)
  //     assert(
  //       exists,
  //       'clover ' +
  //         tokenId.toString(16) +
  //         (exists ? ' does ' : ' does not ') +
  //         ' exist'
  //     )
  //     let newOwner = await clovers.ownerOf(tokenId)
  //     assert(
  //       newOwner.toLowerCase() === clovers.address.toLowerCase(),
  //       'clover ' +
  //         tokenId.toString(16) +
  //         ' should be owned by ' +
  //         clovers.address +
  //         ' but is owned by ' +
  //         newOwner
  //     )
  //   } catch (error) {
  //     console.log(error)
  //     assert(false, 'check owner failed ' + error.message)
  //     return
  //   }
  //   // retrieveStake
  // }
})

// function gasToCash(totalGas) {
//   BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: 4 });
//
//   if (typeof totalGas !== "object") totalGas = utils.toBN(totalGas);
//   let lowGwei = oneGwei.mul(new utils.BN("8"));
//   let highGwei = oneGwei.mul(new utils.BN("20"));
//   let ethPrice = utils.toBN("450");
//
//   console.log(
//     _ +
//       _ +
//       "$" +
//       utils.toBN(utils.fromWei(totalGas.mul(lowGwei).toString()))
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
//       utils.toBN(utils.fromWei(totalGas.mul(highGwei).toString()))
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
    web3.currentProvider.send(
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
