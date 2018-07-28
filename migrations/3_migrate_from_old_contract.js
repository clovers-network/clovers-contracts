
var Clovers = artifacts.require("./Clovers.sol");
var ClubToken = artifacts.require("./ClubToken.sol");
var OldToken = artifacts.require('../contracts/OldToken.sol');
var ethers = require('ethers');

// var Reversi = require('../app/src/assets/reversi.js')
var Reversi = require('clovers-reversi')
var Web3 = require('web3')
module.exports = async function(deployer, helper, accounts)  {

  var doFors = (n, i = 0, func) => {
    // console.log(n, i, func)
    return new Promise((resolve, reject) => {
      try {
        if (i === n) {
          resolve()
        } else {
          func(i).then(() => {
            doFors(n, i + 1, func).then(() => {
              resolve()
            }).catch((error) => {
              console.log(error)
            })
          }).catch((error) => {
            console.log(error)
          })
        }
      } catch(error) {
        reject(error)
      }
    })
  }

  deployer.then(async () => {
    try {
      var providers = require('ethers').providers;
      var network = providers.networks.rinkeby;
      var infuraProvider = new providers.InfuraProvider(network);
      var etherscanProvider = new providers.EtherscanProvider(network);
      var fallbackProvider = new providers.FallbackProvider([
          infuraProvider,
          etherscanProvider
      ]);
      var provider = providers.getDefaultProvider(network)

      var clovers = await Clovers.deployed()
      // var web3Provider = ZeroClientProvider({
      //   getAccounts: function(){},
      //   rpcUrl: 'https://rinkeby.infura.io/Q5I7AA6unRLULsLTYd6d',
      // })
      // var _web3 = new Web3(web3Provider)
      var address = '0xcc0604514f71b8d39e13315d59f4115702b42646';
      var oldToken = new ethers.Contract(address, OldToken.abi, provider);

      var getCloversCount = await oldToken.getCloversCount()
      // console.log(getCloversCount)
      // await doFors(getCloversCount.toNumber(), 0, (i) => {
      //   console.log(i + '/' + getCloversCount.toNumber())
      //   return new Promise(async (resolve, reject) => {
      //     try{
      //       var clover = await oldToken.getCloverByKey(i)
      //       var _tokenId = clover[0]
      //       var reversi = new Reversi()
      //       reversi.byteBoardPopulateBoard(_tokenId.toString(16))
      //       reversi.isSymmetrical()

      //       var _to = clover[3]
      //       var first32Moves = clover[4]
      //       var lastMoves = clover[5]
      //       var moves = [first32Moves, lastMoves]
      //       var movesHash = await clovers.getHash(moves)
      //       var blockNumber = await getBlockNumber()

      //       // setCommit
      //       var tx = await clovers.setCommit(movesHash, _to)
      //       // console.log(tx.receipt.status)
      //       // setBlockMinted
      //       tx = await clovers.setBlockMinted(_tokenId, blockNumber)
      //       // console.log(tx.receipt.status)
      //       // setCloverMoves
      //       tx = await clovers.setCloverMoves(_tokenId, moves)
      //       // console.log(tx.receipt.status)

      //       if (reversi.symmetrical) {
      //         console.log('is symmetrical')
      //         // console.log(reversi)

      //         var symmetries = new web3.BigNumber(0)

      //         symmetries = symmetries.add(reversi.RotSym ? '0b10000' : 0)
      //         symmetries = symmetries.add(reversi.Y0Sym  ? '0b01000' : 0)
      //         symmetries = symmetries.add(reversi.X0Sym  ? '0b00100' : 0)
      //         symmetries = symmetries.add(reversi.XYSym  ? '0b00010' : 0)
      //         symmetries = symmetries.add(reversi.XnYSym ? '0b00001' : 0)
      //         // setSymmetries
      //         tx = await clovers.setSymmetries(_tokenId, symmetries)
      //         // setAllSymmetries
      //         var allSymmetries = await clovers.getAllSymmetries()
      //         allSymmetries[0] = allSymmetries[0].add(1)
      //         allSymmetries[1] = allSymmetries[1].add(reversi.Y0Sym  ? 1 : 0)
      //         allSymmetries[2] = allSymmetries[2].add(reversi.X0Sym  ? 1 : 0)
      //         allSymmetries[3] = allSymmetries[3].add(reversi.XYSym  ? 1 : 0)
      //         allSymmetries[4] = allSymmetries[4].add(reversi.XnYSym ? 1 : 0)
      //         tx = await clovers.setAllSymmetries(...allSymmetries)
      //         // console.log(tx.receipt.status)
      //       }
      //       tx = await clovers.mint(_to, _tokenId)
      //       console.log(tx.logs)
      //       resolve()
      //     } catch(error) {
      //       reject(error)
      //     }
      //   })
      // })
    } catch (error) {
      console.log(error)
    }
  })

}

function getBlockNumber () {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, result) => {
      if (error) reject(error)
      resolve(result)
    })
  })
}
function deploy(deployer, params) {
  return new Promise((resolve, reject) => {
    deployer.deploy(...params, (error) => {
      if (error) {
        reject()
      } else {
        resolve()
      }
    })
  })
}