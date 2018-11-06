var utils = require('web3-utils')

var Clovers = artifacts.require('./Clovers.sol')
var CloversMetadata = artifacts.require('./CloversMetadata.sol')

const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._

var {
  stakeAmount,
  ethPrice,
  oneGwei,
  gasPrice,
  stakePeriod,
  payMultiplier,
  priceMultiplier,
  basePrice,
  decimals,
  reserveRatio,
  virtualBalance,
  virtualSupply,
  updateClubTokenController
} = require('../helpers/migVals')

module.exports = (deployer, network, accounts) => {
  if (network === 'test') return
  deployer.then(async () => {
    try {
      web3.eth.getBalance(accounts[0], (err, res) => {
        console.log(utils.fromWei(res.toString()))
      })
      var totalGas = new web3.BigNumber('0')


      clovers = await Clovers.deployed()
      // Deploy CloversMetadata.sol
      // -w Clovers address
      await deployer.deploy(CloversMetadata, clovers.address, {
        overwrite: true
      })
      cloversMetadata = await CloversMetadata.deployed()

      // Update Clovers.sol
      // -w CloversMetadata address
      var tx = await clovers.updateCloversMetadataAddress(
        cloversMetadata.address
      )

    } catch (error) {
      console.log(error)
    }
  })
}
