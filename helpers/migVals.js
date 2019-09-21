const BigNumber = require('bignumber.js')
const utils = require('web3-utils')
const oneGwei = 1000000000
var vals = (module.exports = {
  // stakeAmount: new BigNumber(529271).times(1000000000).times(40), // gasPrice * 1GWEI * 40 (normal person price)
  stakeAmount: new BigNumber(286774), // gasPrice * 10GWEI (oracle price)
  fastGasPrice: new BigNumber(10).times(oneGwei),
  averageGasPrice: new BigNumber(5).times(oneGwei),
  safeLowGasPrice: new BigNumber(1).times(oneGwei),
  gasBlockMargin: new BigNumber(240), // ~1 hour at 15 second block times
  // stakeAmount: new BigNumber(0).times(1000000000).times(40), // gasPrice * 1GWEI * 40  (nothing)
  ethPrice: new BigNumber('200'),
  oneGwei: new BigNumber('1000000000'), // 1 GWEI
  gasPrice: new BigNumber('1000000000'),
  // stakePeriod: '6000', // at 15 sec block times this is ~25 hours
  stakePeriod: '60000', // at 15 sec block times this is ~250 hours
  payMultiplier: utils.toWei('0.327'),
  priceMultiplier: '3',
  marginOferror: '3',
  basePrice: utils.toWei('3'),
  paused: false,
  limit: utils.toWei('5'),
  decimals: '18',
  oracle: '0xaB0F3326F7F32988963D446543A0b3bbC21B8b92',
  reserveRatio: '750000', // parts per million 500000 / 1000000 = 1/2
  virtualBalance: utils.toWei('10'),
  virtualSupply: utils.toWei('10000'),
  virtualBalanceCM: utils.toWei('33333'),
  virtualSupplyCM: utils.toWei('100000'),
  updateCloversController,
  updateClubTokenController,
  addAsAdmin,
  removeAsAdmin
})

var { gasToCash, _ } = require('./utils')

async function updateCloversController({
  cloversController,
  clubTokenController,
  simpleCloversMarket,
  verbose
}) {

  var totalGas = utils.toBN('0')

  // Update CloversController.sol
  // -w curationMarket
  // -w simpleCloversMarket
  // -w oracle
  // -w stakeAmount
  // -w stakePeriod
  // -w payMultiplier

  var currentClubTokenControllerAddress = await cloversController.clubTokenController()
  if (currentClubTokenControllerAddress.toLowerCase() !== clubTokenController.address.toLowerCase()) {
    verbose && console.log(_ + `cloversController.updateClubTokenController from ${currentClubTokenControllerAddress} to ${clubTokenController.address}`)
    var tx = await cloversController.updateClubTokenController(
      clubTokenController.address
    )
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'clubTokenController hasnt changed')
  }


  var currentSimpleCloversMarket = await cloversController.simpleCloversMarket()
  if (currentSimpleCloversMarket.toLowerCase() !== simpleCloversMarket.address.toLowerCase()) {
    verbose && console.log(_ + `cloversController.updateSimpleCloversMarket from ${currentSimpleCloversMarket} to ${simpleCloversMarket.address}`)
    var tx = await cloversController.updateSimpleCloversMarket(
      simpleCloversMarket.address
    )
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'simpleCloversMarket hasnt changed')
  }

  var currentOracle = await cloversController.oracle()
  if (currentOracle.toLowerCase() !== vals.oracle.toLowerCase()) {
    verbose && console.log(_ + `cloversController.updateOracle from ${currentOracle} to ${vals.oracle}`)
    var tx = await cloversController.updateOracle(vals.oracle)
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'oracle hasnt changed')
  }

  var currentPayMultiplier = await cloversController.payMultiplier()
  if (!currentPayMultiplier.eq(vals.payMultiplier)) {
    verbose && console.log(_ + `cloversController.updatePayMultipier from ${currentPayMultiplier} to ${vals.payMultiplier}`)
    var tx = await cloversController.updatePayMultipier(vals.payMultiplier)  
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'payMultiplier hasnt changed')
  }


  var currentPriceMultiplier = await cloversController.priceMultiplier()
  if (!currentPriceMultiplier.eq(vals.priceMultiplier)) {
    verbose && console.log(_ + `cloversController.updatePriceMultipier from ${currentPriceMultiplier} to ${vals.priceMultiplier}`)
    var tx = await cloversController.updatePriceMultipier(vals.priceMultiplier)  
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'priceMultiplier hasnt changed')
  }


  var currentBasePrice = await cloversController.basePrice()
  if (!currentBasePrice.eq(vals.basePrice)) {
    verbose && console.log(_ + `cloversController.updateBasePrice from ${currentBasePrice} to ${vals.basePrice}`)
    var tx = await cloversController.updateBasePrice(vals.basePrice)  
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'basePrice hasnt changed')
  }


  var currentPaused = await cloversController.paused()
  if (currentPaused !== vals.paused) {
    verbose && console.log(_ + `cloversController.updatePaused from ${currentPaused} to ${vals.paused}`)
    var tx = await cloversController.updatePaused(vals.paused)
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'paused hasnt changed')
  }

  return totalGas
}

async function updateClubTokenController({
  clubTokenController,
  // curationMarket,
  simpleCloversMarket,
  accounts,
  verbose
}) {
  var totalGas = utils.toBN('0')

  // Update ClubTokenController.sol
  // -w simpleCloversMarket
  // -w curationMarket
  // -w reserveRatio
  // -w virtualSupply
  // -w virtualBalance
  // -w poolBalance
  // -w tokenSupply

  var currentSimpleCloversMarket = await clubTokenController.simpleCloversMarket()
  if (currentSimpleCloversMarket.toLowerCase() !== simpleCloversMarket.address.toLowerCase()) {
    verbose && console.log(_ + `clubTokenController.updateSimpleCloversMarket from ${currentSimpleCloversMarket} to ${simpleCloversMarket.address}`)
    var tx = await clubTokenController.updateSimpleCloversMarket(
      simpleCloversMarket.address
    )
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'simpleCloversMarket hasnt changed')
  }

  // verbose && console.log(_ + 'clubTokenController.updateCurationMarket')
  // var tx = await clubTokenController.updateCurationMarket(
  //   curationMarket.address
  // )

  var currentReserveRatio = await clubTokenController.reserveRatio()
  if (!currentReserveRatio.eq(vals.reserveRatio)) {
    verbose && console.log(_ + `clubTokenController.updateReserveRatio from ${currentReserveRatio} to ${vals.reserveRatio}`)
    var tx = await clubTokenController.updateReserveRatio(vals.reserveRatio)
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'reserveRatio hasnt changed')
  }

  var currentVirtualSupply = await clubTokenController.virtualSupply()
  if (!currentVirtualSupply.eq(vals.virtualSupply)) {
    verbose && console.log(_ + `clubTokenController.updateVirtualSupply from ${currentVirtualSupply.toString()} to ${vals.virtualSupply.toString()}`)
    var tx = await clubTokenController.updateVirtualSupply(vals.virtualSupply)
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'virtualSupply hasnt changed')
  }

  var currentVirtualBalance = await clubTokenController.virtualBalance()
  if (!currentVirtualBalance.eq(vals.virtualBalance)) {
    verbose && console.log(_ + `clubTokenController.updateVirtualBalance from ${currentVirtualBalance.toString()} to ${vals.virtualBalance.toString()}`)
    var tx = await clubTokenController.updateVirtualBalance(vals.virtualBalance)
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'virtualBalance hasnt changed')
  }

  var currentPaused = await clubTokenController.paused()
  if (currentPaused !== vals.paused) {
    verbose && console.log(_ + `clubTokenController.updatePaused from ${currentPaused} to ${vals.paused}`)
    var tx = await clubTokenController.updatePaused(vals.paused)
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + 'paused hasnt changed')
  }

  verbose && console.log(_ + 'remove as admins to clubTokenController')
  // await addAsAdmin(clubTokenController, accounts)
  var gasUsed = await removeAsAdmin(clubTokenController, accounts)
  totalGas = totalGas.add(gasUsed)
  return totalGas
}




async function addAsAdmin(contract, accounts, verbose) {

  var secondOwner = await contract.isAdmin(accounts[0])
  if (!secondOwner) {
    verbose && console.log(_ + `adding ${accounts[0]} as admin in contract`)
    await contract.transferAdminship(accounts[0])
  } else {
    verbose && console.log(_ + `${accounts[0]} is already an admin in contract`)
  }


  var secondOwner = await contract.isAdmin(accounts[1])
  if (!secondOwner) {
    verbose && console.log(_ + `adding ${accounts[1]} as admin in contract`)
    await contract.transferAdminship(accounts[1])
  } else {
    verbose && console.log(_ + `${accounts[1]} is already an admin in contract`)
  }

  var secondOwner = await contract.isAdmin(accounts[2])
  if (!secondOwner) {
    verbose && console.log(_ + `adding ${accounts[2]} as admin in contract`)
    await contract.transferAdminship(accounts[2])
  } else {
    verbose && console.log(_ + `${accounts[2]} is already an admin in contract`)
  }

  var secondOwner = await contract.isAdmin(accounts[3])
  if (!secondOwner) {
    verbose && console.log(_ + `adding ${accounts[3]} as admin in contract`)
    await contract.transferAdminship(accounts[3])
  } else {
    verbose && console.log(_ + `${accounts[3]} is already an admin in contract`)
  }

  var secondOwner = await contract.isAdmin(accounts[4])
  if (!secondOwner) {
    verbose && console.log(_ + `adding ${accounts[4]} as admin in contract`)
    await contract.transferAdminship(accounts[4])
  } else {
    verbose && console.log(_ + `${accounts[4]} is already an admin in contract`)
  }
}

async function removeAsAdmin(contract, accounts, verbose) {
  var totalGas = utils.toBN('0')

  var secondOwner = await contract.isAdmin(accounts[1])
  if (secondOwner) {
    verbose && console.log(_ + `removing ${accounts[1]} as admin in contract`)
    var tx = await contract.renounceAdminship(accounts[1])
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + `${accounts[1]} is already removed as an admin in contract`)
  }

  var secondOwner = await contract.isAdmin(accounts[2])
  if (secondOwner) {
    verbose && console.log(_ + `removing ${accounts[2]} as admin in contract`)
    var tx = await contract.renounceAdminship(accounts[2])
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + `${accounts[2]} is already removed as an admin in contract`)
  }

  var secondOwner = await contract.isAdmin(accounts[3])
  if (secondOwner) {
    verbose && console.log(_ + `removing ${accounts[3]} as admin in contract`)
    var tx = await contract.renounceAdminship(accounts[3])
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + `${accounts[3]} is already removed as an admin in contract`)
  }

  var secondOwner = await contract.isAdmin(accounts[4])
  if (secondOwner) {
    verbose && console.log(_ + `removing ${accounts[4]} as admin in contract`)
    var tx = await contract.renounceAdminship(accounts[4])
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + `${accounts[4]} is already removed as an admin in contract`)
  }

  var secondOwner = await contract.isAdmin(accounts[0])
  if (secondOwner) {
    verbose && console.log(_ + `removing ${accounts[0]} as admin in contract`)
    var tx = await contract.renounceAdminship(accounts[0])
    verbose && gasToCash(tx.receipt.gasUsed)
    totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
  } else {
    verbose && console.log(_ + `${accounts[0]} is already removed as an admin in contract`)
  }
  return totalGas
}