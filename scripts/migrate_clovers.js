var Clovers = artifacts.require('./Clovers.sol')
// var CloversController = artifacts.require('./CloversController.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
// var ethers = require('ethers')
var increments = [0, 750, 1500, 2250, 3000, false]
var chunkSize = 25

// var Reversi = require('../app/src/assets/reversi.js')
var Reversi = require('clovers-reversi').default
// var Web3 = require('web3')
var fs = require('fs');
const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._
var BigNumber = require('bignumber.js')

const oldCloversAddress = '0x8A0011ccb1850e18A9D2D4b15bd7F9E9E423c11b'
let clovers
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
module.exports = async function(callback) {
  var run = 0
  var account = process.argv.indexOf('--account')
  if (account > -1 && process.argv.length > account) {
    run = parseInt(process.argv[account + 1])
  }
  var from = web3.currentProvider.addresses[run]
  var start = increments[run]
  var getCloversCount = increments[run + 1]
  console.log({run, from})

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
  
    
    clovers = await Clovers.deployed()
    clovers.synchronization_timeout = 750 // 15 seconds * 50 blocks max = 750

    var simpleCloversMarket = await SimpleCloversMarket.deployed()
    simpleCloversMarket.synchronization_timeout = 750 // 15 seconds * 50 blocks max = 750

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


    allCloversJSON = await filterClovers(allCloversJSON, start, getCloversCount)
      
    var i, j, resArray=[];
    for (i = 0, j = allCloversJSON.length; i < j; i += chunkSize) {
      resArray.push(allCloversJSON.slice(i, i + chunkSize));
    }
    // allCloversJSON = resArray
    getCloversCount = resArray.length
    console.log(getCloversCount.toString())
    console.log(`all clovers ${allCloversJSON.length}`)
    await doFors(resArray.length, 0, i => {
      console.log(i + '/' + getCloversCount)
      return new Promise(async (resolve, reject) => {
        try {

          let chunk = resArray[i];
          let _tos = []
          let _tokenIds = []
          let _movess = []
          let _symmetries = []

          let _sellTokensIds = []
          let _sellTokenPrices = []

          for (var j=0; j < chunk.length; j++) {

            var clover = allCloversJSON[(i * chunkSize) + j]
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

            _tos.push(owner)
            _tokenIds.push(tokenId)
            _movess.push(cloverMoves)
            _symmetries.push(symmetries)

            if (owner == clovers.address) {
              if (price.eq("0")) {
                console.log("empty price now equal to 10")
                price = web3.toWei("10")
              } else {
                console.log(`price is ${price.toString(10)}`)
              }
              _sellTokensIds.push(tokenId)
              _sellTokenPrices.push(price.toString(10))
            }

          }

          var isAdmin = await clovers.isAdmin(from)
          if (!isAdmin) {
            throw new Error(from + ' is not admin on simpleCloversMarket')
          }
          // console.log({_tos, _tokenIds, _movess, _symmetries})
          var {receipt} = await clovers.mintMany(_tos, _tokenIds, _movess, _symmetries, {from})
          console.log(_ + `mintMany - ${_tos.length} ` + receipt.gasUsed)
          gasToCash(receipt.gasUsed)
          totalGas = totalGas.plus(receipt.gasUsed)
          
          if (_sellTokensIds.length > 0) {
          
            var isAdmin = await simpleCloversMarket.isAdmin(from)
            if (!isAdmin) {
              throw new Error(from + ' is not admin on simpleCloversMarket')
            }

            var {receipt} = await simpleCloversMarket.sellMany(_sellTokensIds, _sellTokenPrices, {from})
            console.log(_ + `sellMany - ${_sellTokensIds.length} ` + receipt.gasUsed)
            gasToCash(receipt.gasUsed)
            totalGas = totalGas.plus(receipt.gasUsed)
          }
                    

        } catch (err) {
          console.log('here')
          console.log(err)
        }
        // console.log(receipt.receipt.status)
          // if (!(await clovers.exists(tokenId))) {
            
            // setCloverMoves
            // var {receipt} = await clovers.setCloverMoves(tokenId, cloverMoves, {from})
            // console.log(_ + 'setCloverMoves - ' + receipt.gasUsed)
            // gasToCash(receipt.gasUsed)
            // totalGas = totalGas.plus(receipt.gasUsed)
            // console.log(receipt.receipt.status)



            
            // if (reversi.symmetrical) {
            //   // console.log(reversi)
              
            //   var _symmetries = new web3.BigNumber(0)
              
            //   _symmetries = _symmetries.add(reversi.RotSym ? '0b10000' : 0)
            //   _symmetries = _symmetries.add(reversi.Y0Sym ? '0b01000' : 0)
            //   _symmetries = _symmetries.add(reversi.X0Sym ? '0b00100' : 0)
            //   _symmetries = _symmetries.add(reversi.XYSym ? '0b00010' : 0)
            //   _symmetries = _symmetries.add(reversi.XnYSym ? '0b00001' : 0)

            //   if (!_symmetries.eq(symmetries)) {
            //     console.error(`symmetries are not the same ${_symmetries} != ${symmetries}`)
            //   }
            //   // setSymmetries
            //   var {receipt} = await clovers.setSymmetries(tokenId, symmetries, {from})
            //   console.log(_ + 'setSymmetries - ' + receipt.gasUsed)
            //   gasToCash(receipt.gasUsed)
            //   totalGas = totalGas.plus(receipt.gasUsed)
            // }

            // var {receipt} = await clovers.mint(owner, tokenId, {from})
            // console.log(_ + 'minted - ' + receipt.gasUsed)
            // gasToCash(receipt.gasUsed)
            // totalGas = totalGas.plus(receipt.gasUsed)

          // }

          
          // if (owner == clovers.address) {
          //   if (price.eq("0")) {
          //     console.log("empty price now equal to 10")
          //     price = web3.toWei("10")
          //   } else {
          //     console.log(`price is ${price.toString(10)}`)
          //   }

          //   var currentPrice = await simpleCloversMarket.sellPrice(tokenId)
          //   if (!currentPrice.eq(price)) {
          //     var {receipt} = await simpleCloversMarket.sell(tokenId, price.toString(10), {from})
          //     console.log(_ + 'added token for sale - ' + receipt.gasUsed)
          //     gasToCash(receipt.gasUsed)
          //     totalGas = totalGas.plus(receipt.gasUsed)
          //   }
          // }

          resolve()
         
        // } catch (error) {
          
        //   if (error.message.indexOf('impossibru!!!') !== -1) {
        //     console.log('found a bad game!!!!')
        //     console.log(reversi)
        //     resolve()
        //   } else {
        //     reject(error)
        //   }
        // }
      })
    })

    // // setAllSymmetries
    // var allSymmetries = await clovers.getAllSymmetries()

    // if (
    //   allSymmetries[0].eq(0) &&
    //   allSymmetries[1].eq(0) &&
    //   allSymmetries[2].eq(0) &&
    //   allSymmetries[3].eq(0) &&
    //   allSymmetries[4].eq(0)
    // ) {
    //   allCloversJSON.forEach(clover => {
    //     var {cloverMoves} = clover
          
    //     var first32Moves = cloverMoves[0]
    //     var lastMoves = cloverMoves[1]

    //     var reversi = new Reversi()
    //     reversi.playGameByteMoves(first32Moves, lastMoves)
    //     reversi.isSymmetrical()

    //     allSymmetries[0] = allSymmetries[0].add(reversi.RoSym ? 1 : 0)
    //     allSymmetries[1] = allSymmetries[1].add(reversi.Y0Sym ? 1 : 0)
    //     allSymmetries[2] = allSymmetries[2].add(reversi.X0Sym ? 1 : 0)
    //     allSymmetries[3] = allSymmetries[3].add(reversi.XYSym ? 1 : 0)
    //     allSymmetries[4] = allSymmetries[4].add(reversi.XnYSym ? 1 : 0)
    //   });
    
    //   var {receipt} = await clovers.setAllSymmetries(...allSymmetries, {from})
    //   console.log(_ + 'setAllSymmetries - ' + receipt.gasUsed)
    //   gasToCash(receipt.gasUsed)
    //   totalGas = totalGas.plus(receipt.gasUsed)
    // }
    

    
    console.log(_ + totalGas.toFormat(0) + ' - Total Gas')
    gasToCash(totalGas)
    callback()
  } catch (error) {
    console.log(error)
    callback(error)
  }
}


async function filterClovers(allClovers, start, end, i = 0, unregisteredClovers = []) {
  end = end || allClovers.length

  if ((start + i) === end) {
    return unregisteredClovers
  }

  let clover = allClovers[start + i]
  let tokenId = clover.tokenId
  console.log(`${tokenId} - ${start} + ${i}/ ${end}`)
  // if (clover.price !== "0") {
  //   console.log(`${clover.tokenId} has a price of ${clover.price}`)
  // }
  if (!(await clovers.exists('0x' + tokenId))) {
    unregisteredClovers.push(clover)
  } else {
    console.log(`clover ${clover.tokenId} already registered`)
  }
  return filterClovers(allClovers, start, end, i + 1, unregisteredClovers)
}