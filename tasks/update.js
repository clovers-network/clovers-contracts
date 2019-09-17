usePlugin("@nomiclabs/buidler-truffle5");

var Reversi = artifacts.require('./Reversi.sol')
var Support = artifacts.require('./Support.sol')
var Clovers = artifacts.require('./Clovers.sol')
var CloversMetadata = artifacts.require('./CloversMetadata.sol')
var CloversController = artifacts.require('./CloversController.sol')
var ClubTokenController = artifacts.require('./ClubTokenController.sol')
var ClubToken = artifacts.require('./ClubToken.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')

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
    oracle,
    updateCloversController,
    updateClubTokenController,
    addAsAdmin,
    removeAsAdmin
} = require('../helpers/migVals')
task('update', 'Updates contract values').
setAction(async (taskArgs, env) => {
    let accounts = env.accounts
    let clovers, cloversMetadata, clubToken, reversi, support, clubTokenController, cloversController, simpleCloversMarket
    try {
        clovers = await Clovers.deployed()
        cloversMetadata = await CloversMetadata.deployed()
        clubToken = await ClubToken.deployed()
        reversi = await Reversi.deployed()
        support = await Support.deployed()
        clubTokenController = await ClubTokenController.deployed()
        cloversController = await CloversController.deployed()
        simpleCloversMarket = await SimpleCloversMarket.deployed()

        /* ----------------------------------------------------------------------------------------------------------- */
        // Update Clovers.sol
        // -w CloversMetadata address
        // -w CloversController address
        // -w ClubTokenController address
        // -w multiple owners        
        var currentMetadataAddress = await clovers.cloversMetadata()
        if (currentMetadataAddress.toLowerCase() !== cloversMetadata.address.toLowerCase()) {
            console.log(`update clovers with currentMetadataAddress from ${currentMetadataAddress} to ${cloversMetadata.address}`)
            var tx = await clovers.updateCloversMetadataAddress(
                cloversMetadata.address
            )
        } else {
            console.log('currentMetadataAddress didnt change in clovers') 
        }

        var currentCloversControllerAddress = await clovers.cloversController()
        if (currentCloversControllerAddress.toLowerCase() !== cloversController.address.toLowerCase()) {
            console.log(`update clovers with cloversControllerAddress from ${currentCloversControllerAddress} to ${cloversController.address}`)
            var tx = await clovers.updateCloversControllerAddress(
                cloversController.address
                )
        } else {
            console.log('cloversController didnt change in clovers')
        }
        
        var currentClubTokenControllerAddress = await clovers.clubTokenController()
        if (currentClubTokenControllerAddress.toLowerCase() !== clubTokenController.address.toLowerCase()) {
            console.log(`update clovers with clubTokenControllerAddress from ${currentClubTokenControllerAddress} to ${clubTokenController.address}`)
            var tx = await clovers.updateClubTokenController(
                clubTokenController.address
            )
        } else {
            console.log('clubTokenController didnt change in clovers')
        }
  
        console.log('remove admins for clovers')
        // await addAsAdmin(clovers, accounts);
        await removeAsAdmin(clovers, accounts);
        
        
        /* ----------------------------------------------------------------------------------------------------------- */
        // Update ClubToken.sol
        // -w CloversController address
        // -w ClubTokenController address
        
        var currentCloversControllerAddress = await clubToken.cloversController()
        if (currentCloversControllerAddress.toLowerCase() !== cloversController.address.toLowerCase()) {
            console.log(`update clubToken with cloversController from ${currentCloversControllerAddress} to ${cloversController.address}`)
            var tx = await clubToken.updateCloversControllerAddress(
                cloversController.address
            )
        } else {
            console.log('cloversController didnt change in clubToken')
        }
        
        var currentClubTokenControllerAddress = await clubToken.clubTokenController()
        if (currentClubTokenControllerAddress.toLowerCase() !== clubTokenController.address.toLowerCase()) {
            console.log(`update clubToken with clubTokenControllerAddress from ${currentClubTokenControllerAddress} to ${clubTokenController.address}`)
            var tx = await clubToken.updateClubTokenControllerAddress(
                clubTokenController.address
            )
        } else {
            console.log(`clubTokenController didnt change in clubToken`)
        }

        /* ----------------------------------------------------------------------------------------------------------- */
        // Update CloversController.sol
        await updateCloversController({
            cloversController,
            clubTokenController,
            simpleCloversMarket
        })

        /* ----------------------------------------------------------------------------------------------------------- */
        // Update ClubTokenController.sol
        await updateClubTokenController({
            clubTokenController,
            simpleCloversMarket,
            support,
            accounts
        })
        
        /* ----------------------------------------------------------------------------------------------------------- */
        // update simpleCloversMarket.sol
        console.log('remove admins for simpleCloversMarket')
        // await addAsAdmin(simpleCloversMarket, accounts);
        await removeAsAdmin(simpleCloversMarket, accounts);
        
        var currentCloversControllerAddress = await simpleCloversMarket.cloversController()
        if (currentCloversControllerAddress.toLowerCase() !== cloversController.address.toLowerCase()) {
            console.log(`updating simpleCloversMarket with cloversControllerAddress from ${currentCloversControllerAddress} to ${cloversController.address}`)
            await simpleCloversMarket.updateCloversController(cloversController.address)
        } else {
            console.log(`simpleCloversMarket has correct cloversController`)
        }
        
        var currentClubTokenControllerAddress = await simpleCloversMarket.clubTokenController()
        if (currentClubTokenControllerAddress.toLowerCase() !== clubTokenController.address.toLowerCase()) {
            console.log(`updating simpleCloversMarket with clubTokenControllerAddress from ${currentClubTokenControllerAddress} to ${clubTokenController.address}`)
            await simpleCloversMarket.updateClubTokenController(clubTokenController.address)
        } else {
            console.log(`simpleCloversMarket has correct clubTokenController`)
        }
        
    } catch (error) {
        console.log(error)
    }
})