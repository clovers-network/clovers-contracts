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
module.exports = async (callback) => {

  // add flag --account with index of account afterwards
  var run = getFlag('account') || 0

  // from account determined by --account flag or default 0
  var from = web3.currentProvider.addresses[run]


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
      if (file.indexOf('.json') < 0) {
        console.log(file)
      }
      allClovers.push(...JSON.parse(fs.readFileSync(cloversDir + file).toString()))
    })

    //   var allSymmetries = await clovers.getAllSymmetries()
      var allSymmetries = [0, 0, 0, 0, 0, 0].map(n => new BigNumber(n))
      console.log(`${allClovers.length} Clovers being calculated`)
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
      callback()
    } catch (error) {
        console.log(error)
        callback()
    }
}

