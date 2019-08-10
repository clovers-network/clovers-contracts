var Clovers = artifacts.require('./Clovers.sol')
var CloversController = artifacts.require('./CloversController.sol')
// var ethers = require('ethers')
var start = 0
// var Reversi = require('../app/src/assets/reversi.js')
var Reversi = require('clovers-reversi').default
// var Web3 = require('web3')
var fs = require('fs');
const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
module.exports = async function(deployer, network, accounts) {
  if (network === 'test') return
  var doFors = (n, i = 0, func) => {
    // console.log(n, i, func)
    return new Promise((resolve, reject) => {
      try {
        if (i === n) {
          resolve()
        } else {
          func(i)
          .then(() => {
            doFors(n, i + 1, func)
            .then(() => {
              resolve()
            })
            .catch(error => {
              console.log(error)
            })
          })
          .catch(error => {
            console.log(error)
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  
  deployer.then(async () => {
    try {
      
      //   var providers = require('ethers').providers
      //   var network = providers.networks.rinkeby
      //   var infuraProvider = new providers.InfuraProvider(network)
      //   var etherscanProvider = new providers.EtherscanProvider(network)
      //   var fallbackProvider = new providers.FallbackProvider([
      //     infuraProvider,
      //     etherscanProvider
      //   ])
      //   var provider = providers.getDefaultProvider(network)
      
      var clovers = await Clovers.deployed()
      var cloversController = await CloversController.deployed()
      
      var totalGas = new web3.BigNumber('0')
      
      // var web3Provider = ZeroClientProvider({
      //   getAccounts: function(){},
      //   rpcUrl: 'https://rinkeby.infura.io/Q5I7AA6unRLULsLTYd6d',
      // })
      // var _web3 = new Web3(web3Provider)
      
      const cloverPath = __dirname + '/../clovers/raw.json'
      var allCloversString = fs.readFileSync(cloverPath).toString()
      var allCloversJSON = JSON.parse(allCloversString)
      var getCloversCount = allCloversJSON.length
      console.log(getCloversCount.toString())
      await doFors(getCloversCount, start, i => {
        console.log(i + '/' + getCloversCount)
        return new Promise(async (resolve, reject) => {
          resolve()
          return
          try {
            
            var clover = allCloversJSON[i]
            var {owner, keep, blockMinted, cloverMoves, reward, symmetries, hash} = clover
            
            var reversi = new Reversi()
            
            
            // reversi.byteBoardPopulateBoard(tokenId.toString(16))
            
            var first32Moves = cloverMoves[0]
            var lastMoves = cloverMoves[1]
            
            reversi.playGameByteMoves(first32Moves, lastMoves)
            reversi.isSymmetrical()
            let tokenId = '0x' + reversi.byteBoard

            if (!(await clovers.exists(tokenId))) {

              // let stringMoves = reversi.movesString
              
              // setCommit
              // var {receipt} = await cloversController._setCommit(hash, owner)
              // console.log(_ + 'setCommit - ' + receipt.gasUsed)
              // gasToCash(receipt.gasUsed)
              // totalGas = totalGas.plus(receipt.gasUsed)
              
              // setBlockMinted
              // var {receipt} = await clovers.setBlockMinted(tokenId, "1")
              // console.log(_ + 'setBlockMinted - ' + receipt.gasUsed)
              // gasToCash(receipt.gasUsed)
              // totalGas = totalGas.plus(receipt.gasUsed)
              // console.log(receipt.receipt.status)
              // setCloverMoves
              var {receipt} = await clovers.setCloverMoves(tokenId, cloverMoves)
              console.log(_ + 'setCloverMoves - ' + receipt.gasUsed)
              gasToCash(receipt.gasUsed)
              totalGas = totalGas.plus(receipt.gasUsed)
              // console.log(receipt.receipt.status)
              
              if (reversi.symmetrical) {
                // console.log(reversi)
                
                var symmetries = new web3.BigNumber(0)
                
                symmetries = symmetries.add(reversi.RotSym ? '0b10000' : 0)
                symmetries = symmetries.add(reversi.Y0Sym ? '0b01000' : 0)
                symmetries = symmetries.add(reversi.X0Sym ? '0b00100' : 0)
                symmetries = symmetries.add(reversi.XYSym ? '0b00010' : 0)
                symmetries = symmetries.add(reversi.XnYSym ? '0b00001' : 0)
                // setSymmetries
                var {receipt} = await clovers.setSymmetries(tokenId, symmetries)
                console.log(_ + 'setSymmetries - ' + receipt.gasUsed)
                gasToCash(receipt.gasUsed)
                totalGas = totalGas.plus(receipt.gasUsed)
              }

              var {receipt} = await clovers.mint(owner, tokenId)
              console.log(_ + 'minted - ' + receipt.gasUsed)
              gasToCash(receipt.gasUsed)
              totalGas = totalGas.plus(receipt.gasUsed)
            }
            resolve()
          } catch (error) {
            if (error.message.indexOf('impossibru!!!') !== -1) {
              console.log('found a bad game!!!!')
              console.log(reversi)
              resolve()
            } else {
              reject(error)
            }
          }
        })
      })

      // setAllSymmetries
      var allSymmetries = await clovers.getAllSymmetries()

      if (
        allSymmetries[0].eq(0) &&
        allSymmetries[1].eq(0) &&
        allSymmetries[2].eq(0) &&
        allSymmetries[3].eq(0) &&
        allSymmetries[4].eq(0)
      ) {
        allCloversJSON.forEach(clover => {
          var {cloverMoves} = clover
            
          var first32Moves = cloverMoves[0]
          var lastMoves = cloverMoves[1]

          var reversi = new Reversi()
          reversi.playGameByteMoves(first32Moves, lastMoves)
          reversi.isSymmetrical()

          allSymmetries[0] = allSymmetries[0].add(reversi.RoSym ? 1 : 0)
          allSymmetries[1] = allSymmetries[1].add(reversi.Y0Sym ? 1 : 0)
          allSymmetries[2] = allSymmetries[2].add(reversi.X0Sym ? 1 : 0)
          allSymmetries[3] = allSymmetries[3].add(reversi.XYSym ? 1 : 0)
          allSymmetries[4] = allSymmetries[4].add(reversi.XnYSym ? 1 : 0)
        });
      
        var {receipt} = await clovers.setAllSymmetries(...allSymmetries)
        console.log(_ + 'setAllSymmetries - ' + receipt.gasUsed)
        gasToCash(receipt.gasUsed)
        totalGas = totalGas.plus(receipt.gasUsed)
      }
      

      
      console.log(_ + totalGas.toFormat(0) + ' - Total Gas')
      gasToCash(totalGas)
    } catch (error) {
      console.log(error)
    }
  })
}

function getBlockNumber() {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, result) => {
      if (error) reject(error)
      resolve(result)
    })
  })
}
function deploy(deployer, params) {
  return new Promise((resolve, reject) => {
    deployer.deploy(...params, error => {
      if (error) {
        reject()
      } else {
        resolve()
      }
    })
  })
}
