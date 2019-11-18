var {
    oracle,
    paused,
    poaAMB,
    ethID,
    poaID,
    executionGasLimit
} = require('./migVals')
var utils = require('web3-utils')
var networks = require('../networks.json')

module.exports = {
    updatePOAContracts
}
const {
    gasToCash,
    _
} = require('./utils')  
async function updatePOAContracts({
    poaCloversController, 
    accounts,
    verbose
}) {
    var totalGas = utils.toBN('0')

    try {
        /* ----------------------------------------------------------------------------------------------------------- */
        // Update POACloversController.sol
       
        // paused
        var currentPaused = await poaCloversController.paused()
        if (currentPaused !== paused) {
          verbose && console.log(_ + `poaCloversController.updatePaused from ${currentPaused} to ${paused}`)
          var tx = await poaCloversController.updatePaused(paused)
          verbose && gasToCash(tx.receipt.gasUsed)
          totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
          verbose && console.log(_ + 'paused hasnt changed')
        }

        // oracle
        var currentOracle = await poaCloversController.oracle()
        if (currentOracle.toLowerCase() !== oracle.toLowerCase()) {
            verbose && console.log(_ + `poaCloversController.updateOracle from ${currentOracle} to ${oracle}`)
            var tx = await poaCloversController.updateOracle(oracle)
            verbose && gasToCash(tx.receipt.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
            verbose && console.log(_ + 'oracle hasn\'t changed')
        }

        // amb
        var currentAMB = await poaCloversController.amb()
        if (currentAMB.toLowerCase() !== poaAMB.toLowerCase()) {
          verbose && console.log(_ + `poaCloversController.updateAMB from ${currentAMB} to ${poaAMB}`)
          var tx = await poaCloversController.updateAMB(poaAMB)
          verbose && gasToCash(tx.receipt.gasUsed)
          totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
          verbose && console.log(_ + 'poaAMB hasnt changed')
        }

        // executionGasLimit
        var currentExecutionGasLimit = await poaCloversController.executionGasLimit()
        if ('0x' + utils.toBN(currentExecutionGasLimit).toString(16) !== executionGasLimit) {
          verbose && console.log(_ + `poaCloversController.updateExecutionGasLimit from ${currentExecutionGasLimit} to ${executionGasLimit}`)
          var tx = await poaCloversController.updateExecutionGasLimit(executionGasLimit)
          verbose && gasToCash(tx.receipt.gasUsed)
          totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
        } else {
          verbose && console.log(_ + 'executionGasLimit hasnt changed')
        }

        try {
            const cloversControllerAddress = networks['CloversController'][ethID].address

            // eth cloversController
            var currentCloversController = await poaCloversController.cloversController()
            if (currentCloversController.toLowerCase() !== cloversControllerAddress.toLowerCase()) {
            verbose && console.log(_ + `poaCloversController.updateCloversController from ${currentCloversController} to ${cloversControllerAddress}`)
            var tx = await poaCloversController.updateCloversController(cloversControllerAddress)
            verbose && gasToCash(tx.receipt.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.receipt.gasUsed))
            } else {
            verbose && console.log(_ + 'cloversControllerAddress hasnt changed')
            }
        } catch (error) {
            console.log(`-------------Problem updating Clovers Controller from network ${ethID} on network ${poaID}-------------`)
            console.error(error)
        }

        return { gasUsed: totalGas}

    } catch (error) {
        console.error(error)
    }
}