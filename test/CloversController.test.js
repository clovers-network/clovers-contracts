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
// const { web3 } = require("@nomiclabs/buidler")
const { contract } = require("@nomiclabs/buidler")

// const oraclePK = '0xef09de2f5b5125b78652f07c8365b3dabd657611a2818715d73808d0df786f48' // ?
// const oraclePK = '0x0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4' // truffle
const oraclePK = '0xca3e3407cfe2d341c1f5b8255e27887e41ff4b4bc8f51a86836a4494f0ad71ca' // testnet

contract('CloversController.sol', async (accounts) => {
  const defaultAccount = accounts[0]
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
      var allContracts = await deployAllContracts({
        accounts,
        artifacts,
        web3,
        chainId,
        networks,
        deployAll: true
      })

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
          accounts,
          verbose: false
      })

      await cloversController.updateOracle(oracle)

      // await clubTokenController.buy(accounts[3], {from: accounts[3], value: 99e18})
      await clubTokenController.buy(accounts[4], {from: accounts[4], value: 99e18})
      await clubTokenController.buy(accounts[5], {from: accounts[5], value: 99e18})
      await clubTokenController.buy(accounts[6], {from: accounts[6], value: 99e18})
      await clubTokenController.buy(accounts[7], {from: accounts[7], value: 99e18})
      // await clubTokenController.buy(accounts[9], {from: accounts[9], value: 99e18})

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
    const recipient = accounts[0]
    const symmetricalTokenId1 = `0x${reversi.byteBoard}`
    const symmetricalMoves1 = _moves
    const symmetricalSymmetries1 = reversi.returnSymmetriesAsBN().toString(10)
    let signature1
    const hashedMsg1 = web3.utils.soliditySha3(
      {type: "uint256", value: symmetricalTokenId1},
      {type:"bytes28[2]", value: symmetricalMoves1},
      {type:"uint256", value: symmetricalSymmetries1},
      {type:"bool", value: keep1},
      {type:"address", value: recipient}
    )

    const hashedMsgEthers = ethers.utils.solidityKeccak256([
      'uint256', 'bytes28[2]', 'uint256', 'bool', 'address'
    ], [
      symmetricalTokenId1, symmetricalMoves1, symmetricalSymmetries1, keep1, recipient
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
      {type:"address", value: recipient}
    )

    it('getHash should work', async () => {
      //    function getHash(uint256 tokenId, bytes28[2] memory moves, uint256 symmetries, bool keep, address recipient) public pure returns (bytes32) {
      const contractHashedMsg = await cloversController.getHash(
        symmetricalTokenId1,
        symmetricalMoves1,
        symmetricalSymmetries1,
        keep1,
        recipient
      )
      assert(contractHashedMsg === hashedMsg1, "Hashed messages didn't match")
    })
    it('recover should work', async () => {
      const foo = await web3.eth.sign(hashedMsg1, oracle)
      signature1 = fixSignature(foo);
      const jsHashWithPrefix = toEthSignedMessageHash(hashedMsg1)

      const walletProvider = new ethers.Wallet(oraclePK)
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
        recipient,
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
        signature1,
        defaultAccount
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
        defaultAccount,
        {
          value: costOfTokens
        }
      )
      console.log(_ + 'cloversController.claimCloverWithSignature: ' + tx.receipt.cumulativeGasUsed)
      gasToCash(tx.receipt.cumulativeGasUsed)
      assert(tx.receipt.status, "tx.receipt.status wasn't true")
    })
  })

  describe.skip('securely claimCloverWithVerification + keep = false', () => {

    let movesHash, movesHashWithRecipient
    let from = accounts[7]
    let notFrom = accounts[6]
    const {moves, tokenId} = randomGame()

    it('getMovesHash and getMovesHashWithRecipient should be same as js', async () => {
      movesHash = await cloversController.getMovesHash(moves)
      movesHashWithRecipient = await cloversController.getMovesHashWithRecipient(movesHash, from)

      const movesHashFromJS = web3.utils.soliditySha3(
        {type:"bytes28[2]", value: moves}
      )
      assert(movesHash === movesHashFromJS, `movesHashes don't match`)

      const movesHashWithRecipientFromJS = web3.utils.soliditySha3(
        {type:"bytes32", value: movesHash},
        {type:"address", value: from},
      )
      assert(movesHashWithRecipient === movesHashWithRecipientFromJS, `movesHashWithRecipients don't match`)
    })
    it('claimCloverSecurelyPartTwo should fail without partOne', async () => {
      let failed = false
      try {
        await cloversController.claimCloverSecurelyPartTwo(movesHash, from, {from})
      } catch (_) {
        failed = true
      }
      assert(failed, `claimCloverSecurelyPartTwo did not fail when it should have`)
    })
    it('claimCloverSecurelyPartOne should work', async () => {
      var tx = await cloversController.claimCloverSecurelyPartOne(movesHashWithRecipient, from, {from})
      console.log(_ + 'cloversController.claimCloverSecurelyPartOne: ' + tx.receipt.cumulativeGasUsed)
      gasToCash(tx.receipt.cumulativeGasUsed)
      let movesHashWithRecipientCommit = await cloversController.commits(movesHashWithRecipient)
      assert(parseInt(movesHashWithRecipientCommit) === 1, `movesHashWithRecipientCommit (${parseInt(movesHashWithRecipientCommit)}) does not equal 1`)
    })
    it('claimCloverSecurelyPartTwo should work', async () => {
      var tx = await cloversController.claimCloverSecurelyPartTwo(movesHash, from, {from})
      console.log(_ + 'cloversController.claimCloverSecurelyPartTwo: ' + tx.receipt.cumulativeGasUsed)
      gasToCash(tx.receipt.cumulativeGasUsed)
      let movesHashCommit = await cloversController.commits(movesHash)
      assert(movesHashCommit.toLowerCase() === from.toLowerCase(), `movesHashCommit (${movesHashCommit}) does not equal ${from}`)
    })
    it('claimCloverWithVerification should fail with keep = false when not from correct committer', async () => {
      let keep = false
      let failed = false
      try {
        var tx = await cloversController.claimCloverWithVerification(moves, keep, notFrom, {from: notFrom})
      } catch (_) {
        failed = true
      }
      assert(failed, `claimCloverWithVerification did not fail when not from correct committer`)
    })
    it('claimCloverWithVerification should fail with keep = true and not enough CloverCoin', async () => {
      let keep = true
      let failed = false
      try {
        await cloversController.claimCloverWithVerification(moves, keep, from, {from})
      } catch (error) {
        failed = true
      }
      assert(failed, `claimCloverWithVerification didn't fail when CloverCoin balance was too low`)
    })
    it('claimCloverWithVerification should work with keep = false', async () => {
      let keep = false
      let game = await cloversController.getGame(moves)
      assert(game.board === tokenId, `tokenIds don't match ${tokenIdLog} !== ${tokenId}`)

      let isValidCloversController = await cloversController.isValid(moves)
      let isValidReversi = await reversi.isValid(moves)
      assert(isValidCloversController && isValidReversi, `game is not valid in cloversController ${isValidCloversController} or reversi ${isValidReversi}`)

      let exists = await clovers.exists(game.board)
      assert(!exists, `board ${game.board} should not exist yet`)
      var tx = await cloversController.claimCloverWithVerification(moves, keep, from, {from})
      var tokenIdLog = '0x' + tx.logs[0].args.tokenId.toString(16)
      assert(tokenIdLog === tokenId, `tokenIds don't match ${tokenIdLog} !== ${tokenId}`)
      console.log(_ + 'cloversController.claimCloverWithVerification: ' + tx.receipt.cumulativeGasUsed)
      gasToCash(tx.receipt.cumulativeGasUsed)
      ownerOf = await clovers.ownerOf(tokenId)
      assert(ownerOf.toLowerCase() === clovers.address.toLowerCase(), `owner of token (${ownerOf}) is not address 'from' (${clovers.address})`)
    })
  })

  describe.skip('securely claimCloverWithVerification + keep = true',  () => {
   
    const {moves, tokenId, symmetries} = randomGame()

    it('claimCloverWithVerification should work with keep = true', async () => {
      const keep = true
      const from = accounts[7]

      const movesHash = await cloversController.getMovesHash(moves)
      const movesHashWithRecipient = await cloversController.getMovesHashWithRecipient(movesHash, from)
        
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
        var tx = await cloversController.claimCloverSecurelyPartOne(movesHashWithRecipient, from, {from})
        console.log(_ + 'cloversController.claimCloverSecurelyPartOne: ' + tx.receipt.cumulativeGasUsed)
        gasToCash(tx.receipt.cumulativeGasUsed)

        tryNow = 'claimCloverSecurelyPartTwo'
        tx = await cloversController.claimCloverSecurelyPartTwo(movesHash, from, {from})
        console.log(_ + 'cloversController.claimCloverSecurelyPartTwo: ' + tx.receipt.cumulativeGasUsed)
        gasToCash(tx.receipt.cumulativeGasUsed)

        tryNow = 'claimCloverWithVerification'
        tx = await cloversController.claimCloverWithVerification(moves, keep, from, {from, value: costOfTokens})
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



  describe.skip('Params and Utils', () => {

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

  describe('claimAndCashout', () => {
    let allMoves = ([
      'C4C5F6C3B4D3B2B3D2B1B5E6D6F4A3D1C1A1C2A4G3D7E1A5A2G6E3G4A6C6G7A7B6E7H6F1H4C7C8F2F7D8B7H8H7H5G5F3E2G8F8B8G1H3F5H1G2H2A8E8',
      'C4E3F4C3E2F2G2G5C2E1D2B2D3B4E6E7A5C6C5G3A1C1F6A2F3G7B3B5F5G6F1D6A3G1F7A4H3E8H4A6B1H6D7D1B6B7H5G4D8H2H8A7H7C7H1G8C8B8A8F8',
      'C4E3F3G3G2G1F5C6F2B3B4F1B2A4C5E6D7E8C3E7F6E2C7B6H1G7A5H3F7C8B5B7H8A7F4A3A8C2A6B1D2F8D6H6H7C1A2D8B8G6G5H5G8G4E1D1D3H2A1H4',
      'C4E3F2C5F4E2B6G3G4G1F5A7C3D6B5H4B7D3H3C7F1G5G2C2F3B2E7B3B8C6B4E1F6A6A1A2C1H2H1D7D1B1C8A4D2E6H6E8D8G7F7G8A8G6H8H7H5F8A5A3',
      'C4C5E6E3C6F4G4B6B5D6D7B4B3G3A5E7F8B2D3C3A6C8B1A2H2F7F2A1F6C7A3G6B7G1E2H4H5D2G7D8F1A8H3C1E1E8A7H7G8H8F3F5H1C2G5H6D1A4B8G2',
      'C4C5F6E3C6F4C3E6F7B4D3C7F3F2G4D6B8H5A5B3B7D7E2G3B2A8C2G6H2A4A7F5G7C8H6B1E1G2H1H7A3A6B6G8E8E7G5B5C1G1F1D1D2A2H3H4H8D8F8A1',
      'C4E3F6C5C6B6F4C3A6G7B4A3D2E2F5C1F2F3G2E6F7G4H4G5H5A7D1F1G1H2C2C7B1D3B5G6H8A4E1B3H3B2A1A2G3A5H7H6A8D7C8B7B8E7D6E8H1G8D8F8',
      'C4E3F4G3E6C5H2E7C6B3F2B7F6G6C7B5A4D3A8F5F3F1G2H3G4H1F7H4D2A5A2G7B6D7G1E1G8E8C8A7E2B4H5D1H8G5C1A3A6H7D6C2B8B1F8H6D8C3B2A1',
      'C4E3F4G5F2B4F3E2D3G4E1C3F5C5B6G3H4H2C6G1F6H6H5D6F1B7B3A7H3G2A5A2C7C2A8B5B1D1C1C8H1A6D2B2A1E6E7A4A3G6D8D7F7E8H7G7H8G8F8B8',
      'C4C3C2B4B3B2E6F4E3D2A4F6A2E7C1A5B1C5G4G5E2F2C6A1A6D1G6F3D6D7E1F1F8H6B5F5C8B6G7H3A7B7F7H8G1C7G8H5G2H2G3A3D8E8B8H1H7A8H4D3',
      'C4C3D3E3E2C5B3D2C2A2D6C7F5E6B6D1D8A7B2B1A3B8A5E1F7G6G5B4G7H5E7E8F8H7F3G2C1A1G8A4G4B5F4D7G3B7H1G1H2A6C8H3F1H8H4F6H6C6F2A8',
      'C4C3D3C5B5F3F4B3B4A3C2E3A4B1F5C6B2E6G3H3D7E7A2C7F6G4E2E1C8G5H5D6G2H4E8B8G7F8F1D8C1A5B6G6A1A7H2H6F7D2H7G8A6G1H8D1H1F2A8B7',
      'C4C5C6B5E6E3C3D3E2C7B7A7B6F4A5C2G5B4C1D6A4F1C8B3A6F7F3G4E7B1G7B8D8D2D7G6A2B2H4D1F6H6A1G3H3E8G8G2A3H7F5H5A8H2F8H8F2E1G1H1',
      'C4C3F5B4B2E6C5B3A4G5H5D3D2B5A3E3F7C2F2F3F4G3B1F1F6C6G4F8A6A5E7E2C7A2B6H4G2D6D1A7G6H3H1D8H2G1C8H7E8B8E1G8A1H6C1D7G7A8B7H8',
      'C4C5D6C3B5C7C2E3F3A5C6G3E2B4G4G5H3C1B3E1F4A4A2A3B8C8F2A1D1G1D2G2D8F6A6E6F1A7H4B6B1H2H1H5G6H6H7D3F7G8B7D7E8A8E7F5B2F8G7H8',
      'C4E3F6E6F5C5C3B3F2G6B6B2C2B4E7C1A1D7D6F7A2F4G7A4D8A7F3F1H7F8G4H3G3D3D2B1G1H5G2G8C7B8H8C8H4E8H2E1H6E2A3C6D1G5A5H1B5A6B7A8',
      'C4C5D6E7F5E3D7C7B8E6F3G4E2E1G5B7F4B3B5C6D2F2G2H5F6G3H3C3A8B6D8H4C2H1A2F7F8A4H6B2D3B4A5A7G8G6C8G7C1D1F1H2E8H7A6A1B1A3G1H8',
      'C4E3F2C3C2B2A2G1F5C1D3C5B4G5C6B5A6D2E1A4G6B3G4A3E2C7B7F3D7E8A5D1F1H5H1D6D8A8G3F4B1B8E7C8F6H3B6F7G7E6G8F8A7G2H2H6H4H8H7A1',
      'C4C5D6E3F4F5C6B5A4B3E6C7F6D3B8G5A2A6D2F7H6G3B6H5G6C1B4B7A7C8D1H7H4E2H2E7C2C3E1A8B2B1D8H3H8F8G8E8A5G7D7F1A1F3G1A3G4F2G2H1',
      'C4E3F4C5C6B6F5B4D3E6D6G5B5C2G3F3B7A7B3A4H5H2E7A5A2F6D7C8G6F8E8F7D8C7A8A6A3B2F2H7E2H4C1H6D2G2H1B1B8D1H3G4F1G1G8E1H8C3A1G7',
      'C4E3F6B4B3C6A4A2C3F5C2C1F2A5B5D3B2F7D7A1D2A6B1B7G7A3D1F3G5F1D6E6E7E1G1E8C8H5G4H8H7H1B6G8F4D8F8B8A8G3C7H6E2G6G2A7H3C5H4H2',
      'C4C5E6F5D6E7E8D3B5B4B3A6A5C6A7A2G5H5E2F6C7A3A4B6H4C8G6D2B7A8C3F1D7B8C2D8E3D1E1H3B1G7G1F3C1F8G8H7G4H8F7F4H6G3G2F2B2A1H2H1',
      'C4C5D6C7D7C3E6F5B8F7G6F3D3G4E8F4B4D2D1B5G3C6A6A4H4H2C2H3E7B7F6D8A5A3C8A8A2G8A7B6G7B3E3F8G5B2B1H8F2E1H7C1F1A1H5H6E2G1G2H1',
      'C4C5B6D3C2B5D6C3E6F6C6B4A4B2G6F4F5D2G3A5A3H7C1E7H6C7A6B1F3A2F8E3F2G2F7H5H2H3D8B8A1G7D1G1H4E8G8D7B7F1H8C8B3A7A8E2H1G5E1G4',
      'C4C5F6B3B5F4D3C2A2B4E3B6G5F3A3H6G3E6F2E7D2B2C6H2B1D1E8C7H4G2C1F5G6C3E1H7D6H5G4A5E2A1A7F7D7D8G1H1C8A6F8H3A4G7B7F1G8A8B8H8'
    ]).map(moves => {
      let reversi = new Rev()
      reversi.playGameMovesString(moves)
      // reversi.playGameByteMoves(...moves)
      reversi.thisMovesToByteMoves()
      const byteMoves = reversi.returnByteMoves().map(b => '0x' + b)
      const tokenId = `0x${reversi.byteBoard}`
      const symmetries = reversi.returnSymmetriesAsBN().toString(10)
      return {
        moves,
        byteMoves,
        tokenId,
        symmetries
      }
    })
    it ('should estimate how much eth earned', async () => {

      const recipient = accounts[9]

      const balanceBefore = await web3.eth.getBalance(recipient)
      console.log('balanceBefore', web3.utils.fromWei(balanceBefore.toString(10)))

      console.log({recipient})

      // current Eth payout = 0.000263
      console.log({currentEthPayout: '0.000263'})

      let ethReturnOne = await cloversController.estimateCashOut(allMoves.slice(0, 1).map(c => c.symmetries))
      console.log('ethReturnOne', web3.utils.fromWei(ethReturnOne.toString(10)))

      let ethReturnAll = await cloversController.estimateCashOut(allMoves.map(c => c.symmetries))
      console.log('ethReturnAll', web3.utils.fromWei(ethReturnAll.toString(10)))

      let tx
      try {
        // gasCost = await cloversController.claimAndCashOut.estimateGas(
        //   allMoves.map(c => c.tokenId),
        //   allMoves.map(c => c.byteMoves),
        //   allMoves.map(c => c.symmetries),
        //   recipient,
        //   {
        //     from: oracle
        //   }
        // )
        tx = await cloversController.claimAndCashOut(
          allMoves.map(c => c.tokenId),
          allMoves.map(c => c.byteMoves),
          allMoves.map(c => c.symmetries),
          recipient,
          {
            from: oracle
          }
        )
      } catch (error) {
        console.log({error})
      }
      // console.log({tx})
      tx = await web3.eth.getTransaction(tx.tx)
      // console.log({tx})

      const gasSpent = web3.utils.fromWei((tx.gas * tx.gasPrice).toString())
      console.log({gasSpent})

      const balanceAfter = await web3.eth.getBalance(recipient)
      console.log('balanceAfter', web3.utils.fromWei(balanceAfter.toString(10)))
      console.log('difference', web3.utils.fromWei((balanceAfter - balanceBefore).toString()))

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