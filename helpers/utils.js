const utils = require('web3-utils')
const BigNumber = require('bignumber.js')
const oneGwei = new BigNumber('1000000000') // 1 GWEI
const _ = '        '
var Rev = require('clovers-reversi').default
const path = require('path')
var fs = require('fs');


function saveNetworks(contractArray, env) {
  contractArray.forEach((item) => {
      let networkId = item.constructor.network_id
      var contractPath = path.join(env.config.paths.artifacts, item.constructor._json.contractName + '.json')
      var json = JSON.parse(fs.readFileSync(contractPath))
      if (!json.networks) {
          json.networks = {}
      }
      if (!json.networks[networkId]) {
          json.networks[networkId] = {}
      }
      if (!json.transactionHash) {
          json.transactionHash = null
      }
      json.networks[networkId].address = item.address
      json.networks[networkId].transactionHash = item.transactionHash
      fs.writeFileSync(contractPath, JSON.stringify(json, null, 1))
  })
}

function randomGame() {
  const rev = new Rev()
  rev.mine()
  rev.playGameMovesString(rev.movesString)
  const moves = rev.returnByteMoves().map(m => '0x' + m.padStart(56, '0'))
  const tokenId = `0x${rev.byteBoard}`
  const symmetries = rev.returnSymmetriesAsBN()
  return {moves, tokenId, symmetries}
}

async function getLowestPrice(
  contract,
  targetAmount,
  tokenId = null,
  currentPrice = new BigNumber('0'),
  useLittle = false
) {
  if (typeof targetAmount !== 'object')
    targetAmount = new BigNumber(targetAmount)
  let littleIncrement = new BigNumber(utils.toWei('0.001'))
  let bigIncrement = new BigNumber(utils.toWei('0.1'))
  currentPrice = currentPrice.plus(useLittle ? littleIncrement : bigIncrement)
  let resultOfSpend
  if (tokenId) {
    resultOfSpend = await contract.getBuy(tokenId, currentPrice)
  } else {
    resultOfSpend = await contract.getBuy(currentPrice)
  }
  if (resultOfSpend.gt(targetAmount)) {
    return useLittle
      ? currentPrice
      : getLowestPrice(
          contract,
          targetAmount,
          tokenId,
          currentPrice.minus(bigIncrement),
          true
        )
  }
  return getLowestPrice(
    contract,
    targetAmount,
    tokenId,
    currentPrice,
    useLittle
  )
}


function getFlag(flag, value = true) {
  var argIndex = process.argv.indexOf('--' + flag)
  if (argIndex > -1) {
    if (value && process.argv.length > argIndex) {
      return process.argv[argIndex + 1]
    } else {
      return true
    } 
  }
  return false
}


async function alreadyDeployed(contractName, networks, verbose, web3, chainId) {
  let address =  networks && networks[contractName] && networks[contractName][chainId] && networks[contractName][chainId].address
  if (!address) {
      verbose && console.log(_ + 'no address')
      return false
  }
  let code = await web3.eth.getCode(address)
  if (code === '0x') {
      verbose && console.log(_ + 'no code')
      return false
  }
  // let contract = eval(contractName)
  // console.log(contractName, contract._json.bytecode.length, code.length, contract._json.bytecode === code)
  // if (code !== contract._json.bytecode) {
  //     console.log('code doeesnt match')
  //     return false
  // }
  return address
}

var vals = (module.exports = {
  saveNetworks,
  randomGame,
  alreadyDeployed,
  globalGasPrice: oneGwei.toString(10),
  oneGwei,
  getLowestPrice,
  getFlag,
  _,
  gasToCash: function(totalGas, web3) {
    BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: 4 })

    if (typeof totalGas !== 'object' || utils.isBN(totalGas)) {
      totalGas = new BigNumber(totalGas.toString(10))
    }
    let lowGwei = oneGwei.times(new BigNumber('1'))
    let highGwei = oneGwei.times(new BigNumber('10'))
    let ethPrice = new BigNumber('200')
    console.log(
      _ +
        _ +
        '$' +
        new BigNumber(utils.fromWei(totalGas.times(lowGwei).toString(10), 'ether'))
          .times(ethPrice)
          .toFixed(2) +
        ' @ ' + utils.fromWei(lowGwei.toString(10), 'Gwei') + ' GWE & ' +
        ethPrice +
        '/USD'
    )
    console.log(
      _ +
        _ +
        '$' +
        new BigNumber(utils.fromWei(totalGas.times(highGwei).toString(10), 'ether'))
          .times(ethPrice)
          .toFixed(2) +
        ' @ ' + utils.fromWei(highGwei.toString(10), 'Gwei') + ' GWE & ' +
        ethPrice +
        '/USD'
    )
  }
})



function getBlockNumber() {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, result) => {
      if (error) reject(error)
      resolve(result)
    })
  })
}

async function increaseTime(amount) {
  let currentBlock = await new Promise(resolve =>
    web3.eth.getBlockNumber((err, result) => resolve(result))
  )
  let getBlock = await web3.eth.getBlock(currentBlock)
  // console.log("timestamp", getBlock.timestamp);
  await web3.currentProvider.send({
    jsonrpc: '2.0',
    method: 'evm_increaseTime',
    params: [amount],
    id: 0
  })
  await increaseBlock()
  currentBlock = await new Promise(resolve =>
    web3.eth.getBlockNumber((err, result) => resolve(result))
  )
  getBlock = await web3.eth.getBlock(currentBlock)
  // console.log("timestamp", getBlock.timestamp);
}

function increaseBlocks(blocks) {
  return new Promise((resolve, reject) => {
    increaseBlock().then(() => {
      blocks -= 1
      if (blocks == 0) {
        resolve()
      } else {
        increaseBlocks(blocks).then(resolve)
      }
    })
  })
}

function increaseBlock() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: 12345
      },
      (err, result) => {
        if (err) reject(err)
        resolve(result)
      }
    )
  })
}

function decodeEventString(hexVal) {
  return hexVal
    .match(/.{1,2}/g)
    .map(a =>
      a
        .toLowerCase()
        .split('')
        .reduce(
          (result, ch) => result * 16 + '0123456789abcdefgh'.indexOf(ch),
          0
        )
    )
    .map(a => String.fromCharCode(a))
    .join('')
}
