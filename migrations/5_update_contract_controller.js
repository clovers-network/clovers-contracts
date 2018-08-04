var utils = require('web3-utils')
var Reversi = artifacts.require('./Reversi.sol')
var Clovers = artifacts.require('./Clovers.sol')
var CloversController = artifacts.require('./CloversController.sol')
var ClubTokenController = artifacts.require('./ClubTokenController.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
var CurationMarket = artifacts.require('./CurationMarket.sol')
var ClubToken = artifacts.require('./ClubToken.sol')

const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._

let stakeAmount = 529271 * 1000000000 * 40 // gasPrice * 1GWEI * 40

let multiplier = 10

const ethPrice = new web3.BigNumber('440')
const oneGwei = new web3.BigNumber('1000000000') // 1 GWEI
let gasPrice = oneGwei.toString(10)

let stakePeriod = '6000' // at 15 sec block times this is ~25 hours

let payMultiplier = '10'
let priceMultiplier = '10'
let basePrice = utils.toWei('0.001')

let decimals = '18'

let reserveRatio = '333333' // parts per million 500000 / 1000000 = 1/2
let virtualBalance = utils.toWei('3333')
let virtualSupply = utils.toWei('100000')

module.exports = (deployer, helper, accounts) => {
	deployer.then(async () => {
		try {
			var totalGas = new web3.BigNumber('0')

			reversi = await Reversi.deployed()
			clovers = await Clovers.deployed()
			clubToken = await ClubToken.deployed()
			curationMarket = await CurationMarket.deployed()
			simpleCloversMarket = await SimpleCloversMarket.deployed()
			clubTokenController = await ClubTokenController.deployed()

			await CloversController.link('Reversi', reversi.address)

			cloversController = await CloversController.deployed()
			await deployer.deploy(
				CloversController,
				clovers.address,
				clubToken.address,
				clubTokenController.address,
				{ overwrite: true }
			)
			cloversController = await CloversController.deployed()

			await simpleCloversMarket.updateCloversController(
				cloversController.address
			)

			await curationMarket.updateCloversController(cloversController.address)
			await clovers.updateCloversControllerAddress(cloversController.address)
			await clubToken.updateCloversControllerAddress(cloversController.address)
		} catch (error) {
			console.log(error)
		}
	})
}
