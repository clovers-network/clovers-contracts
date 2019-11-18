var {
    updateCloversController,
    updateClubTokenController,
    // addAsAdmin,
    removeAsAdmin
} = require('./migVals')
var utils = require('web3-utils')

module.exports = {
    updateAllContracts
}
const {
    gasToCash,
    _
} = require('./utils')  
async function updateAllContracts({
    clovers, 
    cloversMetadata, 
    cloversController, 
    clubTokenController, 
    simpleCloversMarket, 
    clubToken,
    accounts,
    verbose,
    networks
}) {
    var totalGas = utils.toBN('0')

    try {

        /* ----------------------------------------------------------------------------------------------------------- */
        // Update Clovers.sol
        // -w CloversMetadata address
        // -w CloversController address
        // -w ClubTokenController address
        // -w multiple owners        
        var currentMetadataAddress = await clovers.cloversMetadata()
        if (currentMetadataAddress.toLowerCase() !== cloversMetadata.address.toLowerCase()) {
            verbose && console.log(_ + `update clovers with currentMetadataAddress from ${currentMetadataAddress} to ${cloversMetadata.address}`)
            var tx = await clovers.updateCloversMetadataAddress(
                cloversMetadata.address
            )
            verbose && gasToCash(tx.receipt.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
            verbose && console.log(_ + 'currentMetadataAddress didnt change in clovers') 
        }

        var currentCloversControllerAddress = await clovers.cloversController()
        if (currentCloversControllerAddress.toLowerCase() !== cloversController.address.toLowerCase()) {
            verbose && console.log(_ + `update clovers with cloversControllerAddress from ${currentCloversControllerAddress} to ${cloversController.address}`)
            var tx = await clovers.updateCloversControllerAddress(
                cloversController.address
            )
            verbose && gasToCash(tx.receipt.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
            verbose && console.log(_ + 'cloversController didnt change in clovers')
        }
        
        var currentClubTokenControllerAddress = await clovers.clubTokenController()
        if (currentClubTokenControllerAddress.toLowerCase() !== clubTokenController.address.toLowerCase()) {
            verbose && console.log(_ + `update clovers with clubTokenControllerAddress from ${currentClubTokenControllerAddress} to ${clubTokenController.address}`)
            var tx = await clovers.updateClubTokenController(
                clubTokenController.address
            )
            verbose && gasToCash(tx.receipt.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
            verbose && console.log(_ + 'clubTokenController didnt change in clovers')
        }
  
        verbose && console.log(_ + 'remove admins for clovers')
        // await addAsAdmin(clovers, accounts);
        totalGas = await removeAsAdmin(clovers, accounts);
        
        
        /* ----------------------------------------------------------------------------------------------------------- */
        // Update ClubToken.sol
        // -w CloversController address
        // -w ClubTokenController address
        
        var currentCloversControllerAddress = await clubToken.cloversController()
        if (currentCloversControllerAddress.toLowerCase() !== cloversController.address.toLowerCase()) {
            verbose && console.log(_ + `update clubToken with cloversController from ${currentCloversControllerAddress} to ${cloversController.address}`)
            var tx = await clubToken.updateCloversControllerAddress(
                cloversController.address
            )
            verbose && gasToCash(tx.receipt.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
            verbose && console.log(_ + 'cloversController didnt change in clubToken')
        }
        
        var currentClubTokenControllerAddress = await clubToken.clubTokenController()
        if (currentClubTokenControllerAddress.toLowerCase() !== clubTokenController.address.toLowerCase()) {
            verbose && console.log(_ + `update clubToken with clubTokenControllerAddress from ${currentClubTokenControllerAddress} to ${clubTokenController.address}`)
            var tx = await clubToken.updateClubTokenControllerAddress(
                clubTokenController.address
            )
            verbose && gasToCash(tx.receipt.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
            verbose && console.log(_ + `clubTokenController didnt change in clubToken`)
        }

        /* ----------------------------------------------------------------------------------------------------------- */
        // Update CloversController.sol
        totalGas = await updateCloversController({
            cloversController,
            clubTokenController,
            simpleCloversMarket,
            verbose,
            networks
        })

        /* ----------------------------------------------------------------------------------------------------------- */
        // Update ClubTokenController.sol
        totalGas = await updateClubTokenController({
            clubTokenController,
            simpleCloversMarket,
            accounts,
            verbose
        })
        
        /* ----------------------------------------------------------------------------------------------------------- */
        // update simpleCloversMarket.sol
        verbose && console.log(_ + 'remove admins for simpleCloversMarket')
        // await addAsAdmin(simpleCloversMarket, accounts);
        totalGas = await removeAsAdmin(simpleCloversMarket, accounts);
        
        var currentCloversControllerAddress = await simpleCloversMarket.cloversController()
        if (currentCloversControllerAddress.toLowerCase() !== cloversController.address.toLowerCase()) {
            verbose && console.log(_ + `updating simpleCloversMarket with cloversControllerAddress from ${currentCloversControllerAddress} to ${cloversController.address}`)
            var tx = await simpleCloversMarket.updateCloversController(cloversController.address)
            verbose && gasToCash(tx.receipt.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
            verbose && console.log(_ + `simpleCloversMarket has correct cloversController`)
        }
        
        var currentClubTokenControllerAddress = await simpleCloversMarket.clubTokenController()
        if (currentClubTokenControllerAddress.toLowerCase() !== clubTokenController.address.toLowerCase()) {
            verbose && console.log(_ + `updating simpleCloversMarket with clubTokenControllerAddress from ${currentClubTokenControllerAddress} to ${clubTokenController.address}`)
            var tx = await simpleCloversMarket.updateClubTokenController(clubTokenController.address)
            verbose && gasToCash(tx.receipt.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
            verbose && console.log(_ + `simpleCloversMarket has correct clubTokenController`)
        }
        return { gasUsed: totalGas}

    } catch (error) {
        console.error(error)
    }
}