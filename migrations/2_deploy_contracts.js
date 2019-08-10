var Reversi = artifacts.require('./Reversi.sol')
var Clovers = artifacts.require('./Clovers.sol')
var CloversMetadata = artifacts.require('./CloversMetadata.sol')
var CloversController = artifacts.require('./CloversController.sol')
var ClubTokenController = artifacts.require('./ClubTokenController.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
// var CurationMarket = artifacts.require('./CurationMarket.sol')
var ClubToken = artifacts.require('./ClubToken.sol')
var Support = artifacts.require('./Support.sol')

const overwrites = {
  Reversi: true,
  Support: true,
  Clovers: true,
  CloversMetadata: true,
  CloversController: true,
  ClubTokenController: true,
  SimpleCloversMarket: true,
  // CurationMarket: true,
  ClubToken: true
}

const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._

var {
  limit,
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
  virtualBalanceCM,
  virtualSupplyCM,
  deployCloversController
} = require('../helpers/migVals')

module.exports = (deployer, network, accounts) => {
  if (network === 'test') return
  deployer.then(async () => {
    try {
      var totalGas = new web3.BigNumber('0')

      // Deploy Clovers.sol (NFT)
      // -w NFT name
      // -w NFT symbol
      await deployer.deploy(Clovers, 'Clovers', 'CLV', {
        overwrite: overwrites['Clovers']
      })
      clovers = await Clovers.deployed()

      // Deploy CloversMetadata.sol
      // -w Clovers address
      await deployer.deploy(CloversMetadata, clovers.address, {
        overwrite: overwrites['CloversMetadata']
      })
      cloversMetadata = await CloversMetadata.deployed()

      // Update Clovers.sol
      // -w CloversMetadata address
      var tx = await clovers.updateCloversMetadataAddress(
        cloversMetadata.address
      )

      // Deploy ClubToken.sol (ERC20)
      // -w ERC20 name
      // -w ERC20 symbol
      // -w ERC20 decimals
      await deployer.deploy(ClubToken, 'CloverCoin', 'CLC', decimals, {
        overwrite: overwrites['ClubToken']
      })
      clubToken = await ClubToken.deployed()

      // Deploy Reversi.sol
      await deployer.deploy(Reversi, { overwrite: overwrites['Reversi'] })
      reversi = await Reversi.deployed()

      // Deploy ClubTokenController.sol
      // -w ClubToken address
      await deployer.deploy(ClubTokenController, clubToken.address, {
        overwrite: overwrites['ClubTokenController']
      })
      clubTokenController = await ClubTokenController.deployed()

      // Deploy CloversController.sol
      await deployCloversController({
        deployer,
        CloversController,
        reversi,
        clovers,
        clubToken,
        clubTokenController,
        overwrite: overwrites['CloversController']
      })
      cloversController = await CloversController.deployed()

      // Deploy SimpleCloversMarket.sol
      // -w Clovers address
      // -w ClubToken address
      // -w ClubTokenController address
      // -w CloversController address
      await deployer.deploy(
        SimpleCloversMarket,
        clovers.address,
        clubToken.address,
        clubTokenController.address,
        cloversController.address,
        { overwrite: overwrites['SimpleCloversMarket'] }
      )
      simpleCloversMarket = await SimpleCloversMarket.deployed()

      // Deploy Support.sol
        // -w limit
        // -w clubTokenController
        await deployer.deploy(
          Support,
          limit,
          clubTokenController.address,
          { overwrite: overwrites['Support'] }
        )
        support = await Support.deployed()



      // // Deploy CurationMarket.sol
      // // -w virtualSupply
      // // -w virtualBalance
      // // -w reserveRatio
      // // -w Clovers address
      // // -w CloversController address
      // // -w ClubToken address
      // // -w ClubTokenController address
      // await deployer.deploy(
      //   CurationMarket,
      //   virtualSupplyCM,
      //   virtualBalanceCM,
      //   reserveRatio,
      //   clovers.address,
      //   cloversController.address,
      //   clubToken.address,
      //   clubTokenController.address,
      //   { overwrite: overwrites['CurationMarket'] }
      // )
      // curationMarket = await CurationMarket.deployed()
    } catch (error) {
      console.log(error)
    }
  })
}
