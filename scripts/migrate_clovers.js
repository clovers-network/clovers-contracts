var Clovers = artifacts.require('./Clovers.sol')
// var CloversController = artifacts.require('./CloversController.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
// var ethers = require('ethers')

// var Reversi = require('../app/src/assets/reversi.js')
var Reversi = require('clovers-reversi').default
var fs = require('fs');
const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._
const getFlag = require('../helpers/utils').getFlag
var BigNumber = require('bignumber.js')
const goodOwner = '0x45e25795A72881a4D80C59B5c60120655215a053' // clovers "goodPlayer" account

const oldCloversAddresses = ['0x8A0011ccb1850e18A9D2D4b15bd7F9E9E423c11b', '0xe312398f2741E2Ab4C0C985c8d91AdcC4a995a59']
let clovers
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
module.exports = async function(callback) {



  // add flag --account with index of account afterwards
  var run = getFlag('account') || 0

  // add flag --filter with "minted" to only filter and check for minting clovers
  // add "market" (or anything else) to filter for simpleMarket clovers
  var filterBy = getFlag('filter') || 'none' // 'minted', 'sell'

  // add flag --setSymmetries if the command should setAllSymmetries
  var setAllSymmetries = getFlag('setSymmetries', false) || false

  // from account determined by --account flag or default 0
  var from = web3.currentProvider.addresses[run]

  var limit = getFlag('limit') || 500
  var chunkSize = getFlag('chunk') || 50

  console.log({run, from})
  try {

    // deploy the new Clovers contract
    clovers = await Clovers.deployed()
    // delay block timeout period for maximum 50 blocks (15 secods * 50 = 750)
    clovers.synchronization_timeout = 750

    // deploy the new simpleCloversMarket
    var simpleCloversMarket = await SimpleCloversMarket.deployed()
    // delay block timeout period for maximum 50 blocks (15 secods * 50 = 750)
    simpleCloversMarket.synchronization_timeout = 750

    // begin gas counting operations at 0
    var totalGas = new web3.BigNumber('0')

    // read all previously recorded clovers from JSON files and combine them into allClovers
    var cloversDir = __dirname + '/../clovers/'
    var cloverFiles = fs.readdirSync(cloversDir)
    var allClovers = []
    cloverFiles.forEach((file) => {
      if (file.indexOf('.json') < 0) continue
      allClovers.push(...JSON.parse(fs.readFileSync(file).toString()))
    })

    var start = limit * run
    var end = start + limit
    if (allClovers.length < end) {
        end = allClovers.length
    }

    // filter allClovers by those needing to be minted or those needing to be listed as for sale
    var filteredClovers = await filterClovers(filterBy, allClovers, start, end)

    // break the filtered Clovers into chunks that will be deployed as groups
    var chunkedClovers = [];
    for (i = 0 ; i < filteredClovers.length; i += chunkSize) {
      chunkedClovers.push(filteredClovers.slice(i, i + chunkSize));
    }

    console.log(`chunked clovers length: ${chunkedClovers.length}`)

    // go through each chunk once at a time synchronously and perform the function contained within doFors
    await doFors(chunkedClovers.length, 0, i => {
      console.log(i + '/' + chunkedClovers.length)
      return new Promise(async (resolve, reject) => {
        try {
          let chunk = chunkedClovers[i];
          let _tos = []
          let _tokenIds = []
          let _movess = []
          let _symmetries = []

          let _sellTokensIds = []
          let _sellTokenPrices = []

          for (var j=0; j < chunk.length; j++) {

            var clover = filteredClovers[(i * chunkSize) + j]
            var {owner, keep, blockMinted, cloverMoves, reward, symmetries, hash, price, tokenId} = clover
            price = new BigNumber(price)

            // if the owner is the clovers contract (new or old) make sure the new one owns it
            if (owner == clovers.address || oldCloversAddresses.findIndex(a => owner.toLowerCase() === a.toLowerCase()) > -1) {
              owner = clovers.address
              if (price.eq("0")) {
                price = web3.toWei("10")
              }
              _sellTokensIds.push(tokenId)
              _sellTokenPrices.push(price.toString(10))
            }

            // make sure game is valid and/or symmetrical
            var reversi = new Reversi()
            var first32Moves = cloverMoves[0]
            var lastMoves = cloverMoves[1]
            reversi.playGameByteMoves(first32Moves, lastMoves)
            reversi.isSymmetrical()

            if (!reversi.complete || reversi.error) {
              console.log('Invalid game!!!')
              continue
            }

            // check tokenIds match
            if (tokenId !== '0x' + reversi.byteBoard) {
              console.log(`Inconsistent tokenIds: ${tokenId} 0x${reversi.byteBoard}`)
            }

            // add clovers to grouped parameters for minting
            _tos.push(owner)
            _tokenIds.push(tokenId)
            _movess.push(cloverMoves)
            _symmetries.push(symmetries)
          }

 

          // if there are some tokens to mint and filterBy is set to minted, mint them
          if (_tos.length > 0 && filterBy !== 'sell') {
            // Confirm it is an admin running these commands
            var isAdmin = await clovers.isAdmin(from)
            if (!isAdmin) {
              throw new Error(from + ' is not admin on clovers')
            }
            var {receipt} = await clovers.mintMany(_tos, _tokenIds, _movess, _symmetries, {from})
            console.log(_ + `mintMany - ${_tos.length} ` + receipt.gasUsed)
            gasToCash(receipt.gasUsed)
            totalGas = totalGas.plus(receipt.gasUsed)
          }

          // if there are some tokens to sell and filterBy is not set to minted, sell them
          if (_sellTokensIds.length > 0 && filterBy !== 'minted') {
            // Confirm it is an admin running these commands
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
          console.log(err)
        }
        resolve()
      })
    })

    if (setAllSymmetries) {
      var allSymmetries = await clovers.getAllSymmetries()
      var allSymmetries = [0, 0, 0, 0, 0, 0].map(n => new BigNumber(n))
      console.log(allClovers.length)
      allClovers.forEach(clover => {
        var {cloverMoves} = clover
          
        var first32Moves = cloverMoves[0]
        var lastMoves = cloverMoves[1]

        var reversi = new Reversi()
        reversi.playGameByteMoves(first32Moves, lastMoves)
        if (!reversi.error && reversi.complete) {
          reversi.isSymmetrical()
          allSymmetries[0] = allSymmetries[0].add(reversi.symmetrical ? 1 : 0)
          allSymmetries[1] = allSymmetries[1].add(reversi.RotSym ? 1 : 0)
          allSymmetries[2] = allSymmetries[2].add(reversi.Y0Sym ? 1 : 0)
          allSymmetries[3] = allSymmetries[3].add(reversi.X0Sym ? 1 : 0)
          allSymmetries[4] = allSymmetries[4].add(reversi.XYSym ? 1 : 0)
          allSymmetries[5] = allSymmetries[5].add(reversi.XnYSym ? 1 : 0)
        } else {
          console.log(`invalid game`)
        }
      });
      console.log(...(allSymmetries.map(n => n.toString(10))))
      var {receipt} = await clovers.setAllSymmetries(...(allSymmetries.map(n => n.toString(10))), {from})
      console.log(_ + 'setAllSymmetries - ' + receipt.gasUsed)
      gasToCash(receipt.gasUsed)
      totalGas = totalGas.plus(receipt.gasUsed)
    }
   
    
    // console.log(_ + totalGas.toFormat(0) + ' - Total Gas')
    // gasToCash(totalGas)
    callback()
  } catch (error) {
    console.log(error)
    callback(error)
  }
}


async function filterClovers(filterBy, allClovers, start, end, i = 0, unregisteredClovers = []) {
  if ((start + i) === end) {
    return unregisteredClovers
  }

  let clover = allClovers[start + i]
  let tokenId = clover.tokenId
  console.log(`${tokenId} - ${start} + ${i}/ ${end}`)

  if (filterBy === 'minted') {
    // if clover doesnt exist it needs to be minted
    if (!(await clovers.exists('0x' + tokenId))) {
      unregisteredClovers.push(clover)
    } else {
      console.log(`clover ${clover.tokenId} already registered`)
    }
  } else if (filterBy === 'sell') {
    // if this clover is owned by the clovers.contract it needs to be set for sale
    if (oldCloversAddresses.findIndex(a => clover.owner.toLowerCase() === a.toLowerCase()) > -1) {
      unregisteredClovers.push(clover)
    }else {
      console.log(`clover ${clover.tokenId} not for sale`)
    }
  } else {
    unregisteredClovers.push(clover)
  }
  return filterClovers(filterBy, allClovers, start, end, i + 1, unregisteredClovers)
}


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

