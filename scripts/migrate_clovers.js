var Clovers = artifacts.require('./Clovers.sol')
// var CloversController = artifacts.require('./CloversController.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
// var ethers = require('ethers')
var increments = [0, 750, 1500, 2250, 3000, false]
var start = increments[4]
var getCloversCount = increments[5]

// var Reversi = require('../app/src/assets/reversi.js')
var Reversi = require('clovers-reversi').default
// var Web3 = require('web3')
var fs = require('fs');
const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._
var BigNumber = require('bignumber.js')

const oldCloversAddress = '0x8A0011ccb1850e18A9D2D4b15bd7F9E9E423c11b'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
module.exports = async function(callback) {
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

  try {
  
    
    var clovers = await Clovers.deployed()
    // var cloversController = await CloversController.deployed()
    var simpleCloversMarket = await SimpleCloversMarket.deployed()
    var totalGas = new web3.BigNumber('0')
    
    const cloverPath = __dirname + '/../clovers/raw-1.json'
    const cloverPath2 = __dirname + '/../clovers/raw-2.json'
    const cloverPath3 = __dirname + '/../clovers/raw-3.json'
    const cloverPath4 = __dirname + '/../clovers/raw-4.json'

    var allCloversString = fs.readFileSync(cloverPath).toString()
    var allCloversJSON = JSON.parse(allCloversString)

    allCloversString = fs.readFileSync(cloverPath2).toString()
    allCloversJSON.push(...JSON.parse(allCloversString))


    allCloversString = fs.readFileSync(cloverPath3).toString()
    allCloversJSON.push(...JSON.parse(allCloversString))


    allCloversString = fs.readFileSync(cloverPath4).toString()
    allCloversJSON.push(...JSON.parse(allCloversString))

  


    getCloversCount = getCloversCount ? getCloversCount : allCloversJSON.length
    console.log(getCloversCount.toString())

    await doFors(getCloversCount, start, i => {
      console.log(i + '/' + getCloversCount)
      return new Promise(async (resolve, reject) => {
        try {
          var clover = allCloversJSON[i]
          var {owner, keep, blockMinted, cloverMoves, reward, symmetries, hash, price} = clover
          price = new BigNumber(price)
          if (owner.toLowerCase() === '0xcde232e835330dafa2ebc629219bbf4fc92cfa24'.toLowerCase()) {
            // some old account that is probably lost
            owner = '0x45e25795A72881a4D80C59B5c60120655215a053'
          }

          if (owner.toLowerCase() === oldCloversAddress.toLowerCase()) {
            // this is owned by old Clovers contract
            // should be owned by new Clovers contract
            owner = clovers.address
          }
          var reversi = new Reversi()
          
          
          // reversi.byteBoardPopulateBoard(tokenId.toString(16))
          
          var first32Moves = cloverMoves[0]
          var lastMoves = cloverMoves[1]
          
          reversi.playGameByteMoves(first32Moves, lastMoves)
          reversi.isSymmetrical()
          let tokenId = '0x' + reversi.byteBoard

          if (!(await clovers.exists(tokenId))) {
            
            // setCloverMoves
            var {receipt} = await clovers.setCloverMoves(tokenId, cloverMoves)
            console.log(_ + 'setCloverMoves - ' + receipt.gasUsed)
            gasToCash(receipt.gasUsed)
            totalGas = totalGas.plus(receipt.gasUsed)
            // console.log(receipt.receipt.status)
            
            if (reversi.symmetrical) {
              // console.log(reversi)
              
              var _symmetries = new web3.BigNumber(0)
              
              _symmetries = _symmetries.add(reversi.RotSym ? '0b10000' : 0)
              _symmetries = _symmetries.add(reversi.Y0Sym ? '0b01000' : 0)
              _symmetries = _symmetries.add(reversi.X0Sym ? '0b00100' : 0)
              _symmetries = _symmetries.add(reversi.XYSym ? '0b00010' : 0)
              _symmetries = _symmetries.add(reversi.XnYSym ? '0b00001' : 0)

              if (!_symmetries.eq(symmetries)) {
                console.error(`symmetries are not the same ${_symmetries} != ${symmetries}`)
              }
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

          
          if (owner == clovers.address) {
            if (price.eq("0")) {
              console.log("empty price now equal to 10")
              price = web3.toWei("10")
            } else {
              console.log(`price is ${price.toString(10)}`)
            }

            var currentPrice = await simpleCloversMarket.sellPrice(tokenId)
            if (!currentPrice.eq(price)) {
              var {receipt} = await simpleCloversMarket.sell(tokenId, price.toString(10))
              console.log(_ + 'added token for sale - ' + receipt.gasUsed)
              gasToCash(receipt.gasUsed)
              totalGas = totalGas.plus(receipt.gasUsed)
            }
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
    callback()
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
