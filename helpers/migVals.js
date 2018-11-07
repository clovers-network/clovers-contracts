const BigNumber = require('bignumber.js')
const utils = require('web3-utils')

var vals = (module.exports = {
  // stakeAmount: new BigNumber(529271).mul(1000000000).mul(40), // gasPrice * 1GWEI * 40 (normal person price)
  stakeAmount: new BigNumber(96842).mul(1000000000).mul(40), // gasPrice * 1GWEI * 40 (oracle price)
  // stakeAmount: new BigNumber(0).mul(1000000000).mul(40), // gasPrice * 1GWEI * 40  (nothing)
  ethPrice: new BigNumber('400'),
  oneGwei: new BigNumber('1000000000'), // 1 GWEI
  gasPrice: new BigNumber('1000000000'),
  // stakePeriod: '6000', // at 15 sec block times this is ~25 hours
  stakePeriod: '60000', // at 15 sec block times this is ~250 hours
  payMultiplier: utils.toWei('0.1'),
  priceMultiplier: '10',
  basePrice: utils.toWei('1'),

  decimals: '18',
  oracle: '0xb20fbdc70c19d0ebcee204d32e1828fca9c2fb09',
  reserveRatio: '333333', // parts per million 500000 / 1000000 = 1/2
  virtualBalance: utils.toWei('33'),
  virtualSupply: utils.toWei('100000'),
  virtualBalanceCM: utils.toWei('33333'),
  virtualSupplyCM: utils.toWei('100000'),
  updateCloversController,
  updateClubTokenController,
  deployCloversController
})

async function deployCloversController({
  deployer,
  CloversController,
  reversi,
  clovers,
  clubToken,
  clubTokenController,
  overwrite
}) {
  // -link w cloversController
  await CloversController.link('Reversi', reversi.address)
  // -w Clovers address
  // -w ClubToken address
  // -w ClubTokenController address
  await deployer.deploy(
    CloversController,
    clovers.address,
    clubToken.address,
    clubTokenController.address,
    { overwrite }
  )
}
async function updateCloversController({
  cloversController,
  curationMarket,
  simpleCloversMarket
}) {
  // Update CloversController.sol
  // -w curationMarket
  // -w simpleCloversMarket
  // -w oracle
  // -w stakeAmount
  // -w stakePeriod
  // -w payMultiplier
  console.log('cloversController.updateCurationMarket')
  var tx = await cloversController.updateCurationMarket(curationMarket.address)

  console.log('cloversController.updateSimpleCloversMarket')
  var tx = await cloversController.updateSimpleCloversMarket(
    simpleCloversMarket.address
  )

  console.log('cloversController.updateOracle')
  var tx = await cloversController.updateOracle(vals.oracle)

  console.log('cloversController.updateStakeAmount')
  var tx = await cloversController.updateStakeAmount(vals.stakeAmount)

  console.log('cloversController.updateStakePeriod')
  var tx = await cloversController.updateStakePeriod(vals.stakePeriod)

  console.log('cloversController.updatePayMultipier')
  var tx = await cloversController.updatePayMultipier(vals.payMultiplier)

  console.log('cloversController.updatePriceMultipier')
  var tx = await cloversController.updatePriceMultipier(vals.priceMultiplier)

  console.log('cloversController.updateBasePrice')
  var tx = await cloversController.updateBasePrice(vals.basePrice)
}

async function updateClubTokenController({
  clubTokenController,
  curationMarket,
  simpleCloversMarket
}) {
  // Update ClubTokenController.sol
  // -w simpleCloversMarket
  // -w curationMarket
  // -w reserveRatio
  // -w virtualSupply
  // -w virtualBalance
  // -w poolBalance
  // -w tokenSupply
  console.log('clubTokenController.updateSimpleCloversMarket')
  var tx = await clubTokenController.updateSimpleCloversMarket(
    simpleCloversMarket.address
  )
  console.log('clubTokenController.updateCurationMarket')
  var tx = await clubTokenController.updateCurationMarket(
    curationMarket.address
  )

  console.log('clubTokenController.updateReserveRatio')
  var tx = await clubTokenController.updateReserveRatio(vals.reserveRatio)

  console.log('clubTokenController.updateVirtualSupply')
  var tx = await clubTokenController.updateVirtualSupply(vals.virtualSupply)

  console.log('clubTokenController.updateVirtualBalance')
  var tx = await clubTokenController.updateVirtualBalance(vals.virtualBalance)
  //
  // let poolBalance = await web3.eth.getBalance(clubToken.address)
  // console.log('poolBalance is ' + poolBalance.toString())
  // console.log('clubTokenController.updatePoolBalance')
  // var tx = await clubTokenController.updatePoolBalance(poolBalance)
}
