var Clovers = artifacts.require('./Clovers.sol')
// var CloversController = artifacts.require('./CloversController.sol')
// var ethers = require('ethers')
var start = 0
// var Reversi = require('../app/src/assets/reversi.js')
// var Reversi = require('clovers-reversi').default
// var Web3 = require('web3')
var fs = require('fs');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const badAccounts = ['0x5899c1651653E1e4A110Cd45C7f4E9F576dE0670', '0x35b701E4550f0FCC45d854040562e35A4600e4Ee', '0x284bAAE3a186f6272309f7cc955AA76f21cF5375', ]
const goodOwner = '0x45e25795A72881a4D80C59B5c60120655215a053' // clovers "goodPlayer" account
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

    //   var cloversController = await CloversController.deployed()
      // var web3Provider = ZeroClientProvider({
      //   getAccounts: function(){},
      //   rpcUrl: 'https://rinkeby.infura.io/Q5I7AA6unRLULsLTYd6d',
      // })
      // var _web3 = new Web3(web3Provider)

      var getCloversCount = await clovers.totalSupply()
      console.log(getCloversCount.toString())
      await doFors(getCloversCount.toNumber(), start, i => {
        console.log(i + '/' + getCloversCount.toNumber())
        return new Promise(async (resolve, reject) => {
          try {
            var tokenId = await clovers.tokenByIndex(i)

            let owner = await clovers.ownerOf(tokenId)
            if (badAccounts.map( a => a.replace("0x", "").toLowerCase()).includes(owner.toLowerCase().replace("0x", ""))) {
              owner = goodOwner
            }

            let keep = await clovers.getKeep( tokenId)
            let blockMinted = await clovers.getBlockMinted(tokenId)
            let cloverMoves = await clovers.getCloverMoves(tokenId)
            let reward = await clovers.getReward(tokenId)
            let symmetries = await clovers.getSymmetries(tokenId)

            let hash = await clovers.getHash(cloverMoves)

            if (owner === ZERO_ADDRESS) resolve()

            let clover = {
                tokenId, owner, keep, blockMinted, cloverMoves, reward, symmetries, hash
            }
            const cloverPath = __dirname + '/../clovers/raw.json'
            var allCloversString = fs.readFileSync(cloverPath).toString()
            var allCloversJSON
            try {
                allCloversJSON = JSON.parse(allCloversString)
            } catch(_) {
                allCloversJSON = []
            }
            allCloversJSON.push(clover)

            allCloversString = JSON.stringify(allCloversJSON)
            fs.writeFileSync(cloverPath, allCloversString)
            resolve() 

            /*
            var reversi = new Reversi()
            reversi.byteBoardPopulateBoard(tokenId.toString(16))
            reversi.isSymmetrical()

            var first32Moves = cloverMoves[0]
            var lastMoves = cloverMoves[1]

            reversi.playGameByteMoves(first32Moves, lastMoves)
            let stringMoves = reversi.movesString

            // setCommit
            var tx = await cloversController._setCommit(hash, owner)
            console.log('setCommit')
            // console.log(tx.receipt.status)
            // setBlockMinted
            tx = await clovers.setBlockMinted(tokenId, blockMinted)
            console.log('setBlockMinted')
            // console.log(tx.receipt.status)
            // setCloverMoves
            tx = await clovers.setCloverMoves(tokenId, cloverMoves)
            console.log('setCloverMoves')
            // console.log(tx.receipt.status)

            if (reversi.symmetrical) {
              console.log('is symmetrical')
              // console.log(reversi)

              var symmetries = new web3.BigNumber(0)

              symmetries = symmetries.add(reversi.RotSym ? '0b10000' : 0)
              symmetries = symmetries.add(reversi.Y0Sym ? '0b01000' : 0)
              symmetries = symmetries.add(reversi.X0Sym ? '0b00100' : 0)
              symmetries = symmetries.add(reversi.XYSym ? '0b00010' : 0)
              symmetries = symmetries.add(reversi.XnYSym ? '0b00001' : 0)
              // setSymmetries
              tx = await clovers.setSymmetries(tokenId, symmetries)
              console.log('setSymmetries')

              // setAllSymmetries
              var allSymmetries = await clovers.getAllSymmetries()
              allSymmetries[0] = allSymmetries[0].add(1)
              allSymmetries[1] = allSymmetries[1].add(reversi.Y0Sym ? 1 : 0)
              allSymmetries[2] = allSymmetries[2].add(reversi.X0Sym ? 1 : 0)
              allSymmetries[3] = allSymmetries[3].add(reversi.XYSym ? 1 : 0)
              allSymmetries[4] = allSymmetries[4].add(reversi.XnYSym ? 1 : 0)
              tx = await clovers.setAllSymmetries(...allSymmetries)
              console.log('setAllSymmetries')
            }
            if (!(await clovers.exists(tokenId))) {
              tx = await clovers.mint(owner, tokenId)
              console.log('minted')
              console.log(tx.logs)
            }
            resolve()
            */
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
