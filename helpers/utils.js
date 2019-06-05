const utils = require('web3-utils')
const BigNumber = require('bignumber.js')
const oneGwei = new BigNumber('1000000000') // 1 GWEI
const _ = '        '

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
  currentPrice = currentPrice.add(useLittle ? littleIncrement : bigIncrement)
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
          currentPrice.sub(bigIncrement),
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

var vals = (module.exports = {
  getLowestPrice,
  _,
  gasToCash: function(totalGas, web3) {
    BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: 4 })

    if (typeof totalGas !== 'object') totalGas = new BigNumber(totalGas)
    let lowGwei = oneGwei.mul(new BigNumber('8'))
    let highGwei = oneGwei.mul(new BigNumber('20'))
    let ethPrice = new BigNumber('250')

    console.log(
      _ +
        _ +
        '$' +
        new BigNumber(utils.fromWei(totalGas.mul(lowGwei).toString()))
          .mul(ethPrice)
          .toFixed(2) +
        ' @ 8 GWE & ' +
        ethPrice +
        '/USD'
    )
    console.log(
      _ +
        _ +
        '$' +
        new BigNumber(utils.fromWei(totalGas.mul(highGwei).toString()))
          .mul(ethPrice)
          .toFixed(2) +
        ' @ 20 GWE & ' +
        ethPrice +
        '/USD'
    )
  }
})
