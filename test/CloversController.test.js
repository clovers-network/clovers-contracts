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

var ethers = require('ethers')
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
var assert = require('assert');
const { web3 } = require("@nomiclabs/buidler")

describe('CloversController.sol', async () => {
  const accounts = await web3.eth.getAccounts();

  let oracle = accounts[8]

  var reversi,
    clovers, 
    cloversMetadata, 
    cloversController, 
    clubTokenController, 
    simpleCloversMarket, 
    clubToken
  before(async () => {
    console.log('before')
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

  const _tokenId2 = '0x55555555596556955695596555555555'
  const _moves2 = [
    '0xb58b561d7532f1e59aef3970a6d1cfb7d55b34a25febe7c53e9bf4e8',
    '0xb1b257cc10f841fb2287b8116b49dd1af768ffbbd7ff3274f0000000'
  ]

  describe('Signing Methods', async () => {

    let reversi = new Rev()
    reversi.playGameByteMoves(..._moves)

    const keep1 = false
    const keep = keep1
    const recepient = accounts[0]
    const symmetricalTokenId1 = `0x${reversi.byteBoard}`
    const symmetricalMoves1 = _moves
    const symmetricalSymmetries1 = reversi.returnSymmetriesAsBN().toString(10)
    let signature1
    const hashedMsg1 = web3.utils.soliditySha3(
      {type: "uint256", value: symmetricalTokenId1},
      {type:"bytes28[2]", value: symmetricalMoves1},
      {type:"uint256", value: symmetricalSymmetries1},
      {type:"bool", value: keep1},
      {type:"address", value: recepient}
    )

    const hashedMsgEthers = ethers.utils.solidityKeccak256([
      'uint256', 'bytes28[2]', 'uint256', 'bool', 'address'
    ], [
      symmetricalTokenId1, symmetricalMoves1, symmetricalSymmetries1, keep1, recepient
    ])

    assert(hashedMsg1 === hashedMsgEthers, `hashes don't match ${hashedMsg1} != ${hashedMsgEthers}`)

    const keep2 = true
    reversi = new Rev()
    reversi.playGameByteMoves(..._moves2)

    const symmetricalTokenId2= `0x${reversi.byteBoard}`
    const symmetricalMoves2= _moves2
    const symmetricalSymmetries2= reversi.returnSymmetriesAsBN().toString(10)
    let signature2

    const hashedMsg2= web3.utils.soliditySha3(
      {type: "uint256", value: symmetricalTokenId2},
      {type:"bytes28[2]", value: symmetricalMoves2},
      {type:"uint256", value: symmetricalSymmetries2},
      {type:"bool", value: keep2},
      {type:"address", value: recepient}
    )

    it('getHash should work', async () => {
      //    function getHash(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, bool keep, address recepient) public pure returns (bytes32) {
      const contractHashedMsg = await cloversController.getHash(
        symmetricalTokenId1,
        symmetricalMoves1,
        symmetricalSymmetries1,
        keep1,
        recepient
      )
      assert(contractHashedMsg === hashedMsg1, "Hashed messages didn't match")
    })
    it('recover should work', async () => {
      const foo = await web3.eth.sign(hashedMsg1, oracle)
      signature1 = fixSignature(foo);
      const jsHashWithPrefix = toEthSignedMessageHash(hashedMsg1)

      const walletProvider = new ethers.Wallet('0xef09de2f5b5125b78652f07c8365b3dabd657611a2818715d73808d0df786f48')
      const ethersSig = await walletProvider.signMessage(ethers.utils.arrayify(hashedMsg1))
      assert(ethersSig === signature1, `signatures don't match ${ethersSig} !== ${signature1}`)

      const ethersjsHashWithPrefix = ethers.utils.hashMessage(ethers.utils.arrayify(hashedMsg1))
      assert(ethersjsHashWithPrefix === jsHashWithPrefix, `hashes don't match ${ethersjsHashWithPrefix} !== ${jsHashWithPrefix}`)

      // Recover the signer address from the generated message and signature.
      let result = await cloversController.recover(
        jsHashWithPrefix,
        signature1
      )
      assert(result.toLowerCase() === oracle.toLowerCase(), "Signatures don't match")
    })
    it('checkSignature should work', async () => {
      const validClaim = await cloversController.checkSignature(
        symmetricalTokenId1,
        symmetricalMoves1,
        symmetricalSymmetries1,
        keep1,
        recepient,
        signature1,
        oracle
      )
      assert(validClaim, "checkSignature() returned false")
    })
    it('oracle addresses should match', async () => {
      const _oracle = await cloversController.oracle()
      assert(_oracle.toLowerCase() === oracle.toLowerCase(), "oracles don't match")
    })
    it('claimCloverWithSignature should work with symmetrical clover & keep = false', async () => {
      var tx = await cloversController.claimCloverWithSignature(
        symmetricalTokenId1,
        symmetricalMoves1,
        symmetricalSymmetries1,
        keep1,
        signature1
      )
      console.log(_ + 'cloversController.claimCloverWithSignature: ' + tx.receipt.cumulativeGasUsed)
      gasToCash(tx.receipt.cumulativeGasUsed)
      assert(tx.receipt.status, "tx.receipt.status wasn't true")
    })

    it('claimCloverWithSignature should work with symmetrical clover, keep = true & buy tokens during', async () => {
      signature2 = fixSignature(await web3.eth.sign(hashedMsg2, oracle));

      let reward
      try {
        reward = await cloversController.calculateReward(symmetricalSymmetries2.toString(10))
      } catch (error) {
        console.log({error})
        assert(false, 'calculate reward failed')
        return
      }

      let costInTokens
      try {
        costInTokens = await cloversController.getPrice(symmetricalSymmetries2.toString())
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

      var tx = await cloversController.claimCloverWithSignature(
        symmetricalTokenId2,
        symmetricalMoves2,
        symmetricalSymmetries2,
        keep2,
        signature2,
        {
          value: costOfTokens
        }
      )
      console.log(_ + 'cloversController.claimCloverWithSignature: ' + tx.receipt.cumulativeGasUsed)
      gasToCash(tx.receipt.cumulativeGasUsed)
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
      var tx = await cloversController.claimCloverSecurelyPartOne(movesHashWithRecepient, {from})
      console.log(_ + 'cloversController.claimCloverSecurelyPartOne: ' + tx.receipt.cumulativeGasUsed)
      gasToCash(tx.receipt.cumulativeGasUsed)
      let movesHashWithRecepientCommit = await cloversController.commits(movesHashWithRecepient)
      assert(parseInt(movesHashWithRecepientCommit) === 1, `movesHashWithRecepientCommit (${parseInt(movesHashWithRecepientCommit)}) does not equal 1`)
    })
    it('claimCloverSecurelyPartTwo should work', async () => {
      var tx = await cloversController.claimCloverSecurelyPartTwo(movesHash, {from})
      console.log(_ + 'cloversController.claimCloverSecurelyPartTwo: ' + tx.receipt.cumulativeGasUsed)
      gasToCash(tx.receipt.cumulativeGasUsed)
      let movesHashCommit = await cloversController.commits(movesHash)
      assert(movesHashCommit.toLowerCase() === from.toLowerCase(), `movesHashCommit (${movesHashCommit}) does not equal ${from}`)
    })
    it('claimCloverWithVerification should fail with keep = false when not from correct committer', async () => {
      let keep = false
      let failed = false
      try {
        var tx = await cloversController.claimCloverWithVerification(moves, keep, {from: notFrom})
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

      var tx = await cloversController.claimCloverWithVerification(moves, keep, {from})
      console.log({tx})
      console.log(_ + 'cloversController.claimCloverWithVerification: ' + tx.receipt.cumulativeGasUsed)
      gasToCash(tx.receipt.cumulativeGasUsed)
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
        var tx = await cloversController.claimCloverSecurelyPartOne(movesHashWithRecepient, {from})
        console.log(_ + 'cloversController.claimCloverSecurelyPartOne: ' + tx.receipt.cumulativeGasUsed)
        gasToCash(tx.receipt.cumulativeGasUsed)

        tryNow = 'claimCloverSecurelyPartTwo'
        tx = await cloversController.claimCloverSecurelyPartTwo(movesHash, {from})
        console.log(_ + 'cloversController.claimCloverSecurelyPartTwo: ' + tx.receipt.cumulativeGasUsed)
        gasToCash(tx.receipt.cumulativeGasUsed)

        tryNow = 'claimCloverWithVerification'
        tx = await cloversController.claimCloverWithVerification(moves, keep, {from, value: costOfTokens})
        console.log(_ + 'cloversController.claimCloverWithVerification: ' + tx.receipt.cumulativeGasUsed)
        gasToCash(tx.receipt.cumulativeGasUsed)
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