var utils = require('web3-utils')
var Rev = require('clovers-reversi').default
var {deployAllContracts} = require('../helpers/deployAllContracts')
var {updateAllContracts} = require('../helpers/updateAllContracts')
var networks = require('../networks.json')
const {
  gasToCash,
  getLowestPrice, 
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

    it('cloversController.getHash should work', async () => {
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
    it('cloversController.recover should work', async () => {
      signature = fixSignature(await web3.eth.sign(hashedMsg, oracle));
      const jsHashWithPrefix = toEthSignedMessageHash(hashedMsg)

      // Recover the signer address from the generated message and signature.
      let result = await cloversController.recover(
        jsHashWithPrefix,
        signature
      )
      assert(result.toLowerCase() === oracle.toLowerCase(), "Signatures don't match")
    })
    it('cloversController.checkSignature should work', async () => {
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
    it('cloversController.claimCloverWithSignature should work', async () => {
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

  describe('Full on-chain verification with commit-reveal', () => {

    let movesHash, movesHashWithRecepient
    let from = accounts[0]
    let keep = false
    const moves = _moves

    it('should make a commit', async () => {

      let isValid = await reversi.isValid(moves)
      console.log({isValid})

      isValid = await cloversController.isValid(moves)
      console.log({isValid})

      let getGame = await reversi.getGame(moves)
      console.log({getGame})

      getGame = await cloversController.getGame(moves)
      console.log({getGame})

      // console.log(cloversController.constructor.links)
      // console.log(reversi.address)


      movesHash = await cloversController.getMovesHash(moves)
      movesHashWithRecepient = await cloversController.getMovesHashWithRecepient(movesHash, from)
      // function claimCloverWithVerificationCommit(bytes32 movesHash, bytes32 movesHashWithRecepient) public {
      await cloversController.claimCloverSecurelyPartOne(movesHashWithRecepient, {from})
      await cloversController.claimCloverSecurelyPartTwo(movesHash, from, {from})
      await cloversController.claimCloverWithVerification(moves, keep)
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
