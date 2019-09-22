var utils = require('web3-utils')
var Rev = require('clovers-reversi').default
var {deployAllContracts} = require('../helpers/deployAllContracts')
var {updateAllContracts} = require('../helpers/updateAllContracts')
var networks = require('../networks.json')
const {
  gasToCash,
  getLowestPrice, 
  randomGame,
  _
} = require('../helpers/utils')

var {
  signMessage,
  toEthSignedMessageHash,
  fixSignature,
  getSignFor
} = require('../helpers/sign.js')

const {
  payMultiplier,
  priceMultiplier,
  basePrice
} = require('../helpers/migVals')

contract('CloversController.sol', async function(accounts) {
  let oracle = accounts[8]

  var reversi,
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

      reversi = allContracts.reversi 
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

      await cloversController.updateOracle(oracle)

      // totalGas = totalGas.add(utils.toBN(gasUsed))

      // console.log(_ + totalGas.toString(10) + ' - Total Gas')
      // gasToCash(totalGas)
    } catch (error) {
      console.log('error:', error)
    }
    return 
  })

  const _tokenId = '0x55555aa5569955695569555955555555'
  const _moves = [
    '0xb58b552a986549b132451cbcbd69d106af0e3ae6cead82cc297427c3',
    '0xbb9af45dbeefd78f120678dd7ef4dfe69f3d9bbe7eeddfc7f0000000'
  ]

  describe('Signing Methods', async () => {

    let reversi = new Rev()
    reversi.playGameByteMoves(..._moves)

    const keep = false
    const recepient = accounts[0]
    const tokenId = `0x${reversi.byteBoard}`
    const moves = _moves
    const symmetries = reversi.returnSymmetriesAsBN().toString(10)
    let signature

    const hashedMsg = web3.utils.soliditySha3(
      {type: "uint256", value: tokenId},
      {type:"bytes28[2]", value: moves},
      {type:"uint256", value: symmetries},
      {type:"bool", value: keep},
      {type:"address", value: recepient}
    )

    it('getHash should work', async () => {
      //    function getHash(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, bool keep, address recepient) public pure returns (bytes32) {
      const contractHashedMsg = await cloversController.getHash(
        tokenId,
        moves,
        symmetries,
        keep,
        recepient
      )
      assert(contractHashedMsg === hashedMsg, "Hashed messages didn't match")
    })
    it('recover should work', async () => {
      signature = fixSignature(await web3.eth.sign(hashedMsg, oracle));
      const jsHashWithPrefix = toEthSignedMessageHash(hashedMsg)

      // Recover the signer address from the generated message and signature.
      let result = await cloversController.recover(
        jsHashWithPrefix,
        signature
      )
      assert(result.toLowerCase() === oracle.toLowerCase(), "Signatures don't match")
    })
    it('checkSignature should work', async () => {
      const validClaim = await cloversController.checkSignature(
        tokenId,
        moves,
        symmetries,
        keep,
        recepient,
        signature,
        oracle
      )
      assert(validClaim, "checkSignature() returned false")
    })
    it('claimCloverWithSignature should work', async () => {
      const _oracle = await cloversController.oracle()
      assert(_oracle.toLowerCase() === oracle.toLowerCase(), "oracles don't match")

      var tx = await cloversController.claimCloverWithSignature(
        tokenId,
        moves,
        symmetries,
        keep,
        signature
      )
      assert(tx.receipt.status, "tx.receipt.status wasn't true")
    })
  })

  describe('securely claimCloverWithVerification + keep = false', () => {

    let movesHash, movesHashWithRecepient
    let from = accounts[7]
    let notFrom = accounts[6]
    const {moves, tokenId} = randomGame()

    it('getMovesHash and getMovesHashWithRecepient should be same as js', async () => {
      movesHash = await cloversController.getMovesHash(moves)
      movesHashWithRecepient = await cloversController.getMovesHashWithRecepient(movesHash, from)

      const movesHashFromJS = web3.utils.soliditySha3(
        {type:"bytes28[2]", value: moves}
      )
      assert(movesHash === movesHashFromJS, `movesHashes don't match`)

      const movesHashWithRecepientFromJS = web3.utils.soliditySha3(
        {type:"bytes32", value: movesHash},
        {type:"address", value: from},
      )
      assert(movesHashWithRecepient === movesHashWithRecepientFromJS, `movesHashWithRecepients don't match`)
    })
    it('claimCloverSecurelyPartTwo should fail without partOne', async () => {
      let failed = false
      try {
        await cloversController.claimCloverSecurelyPartTwo(movesHash, {from})
      } catch (_) {
        failed = true
      }
      assert(failed, `claimCloverSecurelyPartTwo did not fail when it should have`)
    })
    it('claimCloverSecurelyPartOne should work', async () => {
      await cloversController.claimCloverSecurelyPartOne(movesHashWithRecepient, {from})
      let movesHashWithRecepientCommit = await cloversController.commits(movesHashWithRecepient)
      assert(parseInt(movesHashWithRecepientCommit) === 1, `movesHashWithRecepientCommit (${parseInt(movesHashWithRecepientCommit)}) does not equal 1`)
    })
    it('claimCloverSecurelyPartTwo should work', async () => {
      await cloversController.claimCloverSecurelyPartTwo(movesHash, {from})
      let movesHashCommit = await cloversController.commits(movesHash)
      assert(movesHashCommit.toLowerCase() === from.toLowerCase(), `movesHashCommit (${movesHashCommit}) does not equal ${from}`)
    })
    it('claimCloverWithVerification should fail with keep = false when not from correct committer', async () => {
      let keep = false
      let failed = false
      try {
        await cloversController.claimCloverWithVerification(moves, keep, {from: notFrom})
      } catch (_) {
        failed = true
      }
      assert(failed, `claimCloverWithVerification did not fail when not from correct committer`)
    })
    it('claimCloverWithVerification should fail with keep = true and not enough CloverCoin', async () => {
      let keep = true
      let failed = false
      try {
        await cloversController.claimCloverWithVerification(moves, keep, {from})
      } catch (error) {
        failed = true
      }
      assert(failed, `claimCloverWithVerification didn't fail when CloverCoin balance was too low`)
    })
    it('claimCloverWithVerification should work with keep = false', async () => {
      let keep = false
      let game = await cloversController.getGame(moves)

      let isValidCloversController = await cloversController.isValid(moves)
      let isValidReversi = await reversi.isValid(moves)
      assert(isValidCloversController && isValidReversi, `game is not valid in cloversController ${isValidCloversController} or reversi ${isValidReversi}`)

      let exists = await clovers.exists(game.board)
      assert(!exists, `board ${game.board} should not exist yet`)

      await cloversController.claimCloverWithVerification(moves, keep, {from})
      ownerOf = await clovers.ownerOf(tokenId)
      assert(ownerOf.toLowerCase() === clovers.address.toLowerCase(), `owner of token (${ownerOf}) is not address 'from' (${clovers.address})`)
    })
  })

  describe('securely claimCloverWithVerification + keep = true',  () => {
   
    const {moves, tokenId, symmetries} = randomGame()

    it('claimCloverWithVerification should work with keep = true', async () => {
      const keep = true
      const from = accounts[7]

      const movesHash = await cloversController.getMovesHash(moves)
      const movesHashWithRecepient = await cloversController.getMovesHashWithRecepient(movesHash, from)
        
      // let reward
      // try {
      //   reward = await cloversController.calculateReward(symmetries.toString(10))
      // } catch (error) {
      //   assert(false, 'calculate reward failed')
      //   return
      // }

      let costInTokens
      try {
        costInTokens = await cloversController.getPrice(symmetries.toString())
      } catch (error) {
        console.log(error)
        assert(false, 'getPrice failed')
        return
      }

      let costOfTokens
      try {
        costOfTokens = await getLowestPrice(clubTokenController, costInTokens)
      } catch (error) {
        console.log(error)
        assert(false, 'get lowest price failed')
        return
      }

      let tryNow
      try {
        tryNow = 'claimCloverSecurelyPartOne'
        await cloversController.claimCloverSecurelyPartOne(movesHashWithRecepient, {from})
        tryNow = 'claimCloverSecurelyPartTwo'
        await cloversController.claimCloverSecurelyPartTwo(movesHash, {from})
        tryNow = 'claimCloverWithVerification'
        await cloversController.claimCloverWithVerification(moves, keep, {from, value: costOfTokens})
      } catch (error) {
        assert(false, `failed on ${tryNow} with ${error}`)
      }
      
      let exists = await clovers.exists(tokenId)
      assert(exists, `token ${tokenId} doesnt exit yet`)
          
      let ownerOf = await clovers.ownerOf(tokenId)
      assert(ownerOf.toLowerCase() === from.toLowerCase(), `owner of token (${ownerOf}) is not address 'from' (${from})`)
    })
  })



  describe('Params and Utils', () => {

    it('should convert correctly', async () => {
      let game = await reversi.getGame(_moves)
      let boardUint = await cloversController.convertBytes16ToUint(game[3])
      assert(
        '0x' + boardUint.toString(16) === _tokenId,
        '_tokenId !== boardUint'
      )
    })

    it('should read parameters that were set', async () => {
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
  })

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
