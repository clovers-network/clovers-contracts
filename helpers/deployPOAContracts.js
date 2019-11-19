module.exports = {deployPOAContracts}
var utils = require('web3-utils')
var _networks = require('../networks.json')
const {
    gasToCash,
    _,
    alreadyDeployed
} = require('./utils')  
var {
    decimals,
    poaAMB,
    executionGasLimit
} = require('./migVals.js')

const _overwrites = {
    Reversi: false,
    CloversController: false,
}

async function deployPOAContracts({overwrites, accounts, artifacts, web3, chainId, networks, verbose, deployAll}) {
    overwrites = overwrites || _overwrites
    networks = networks || _networks
    chainId = chainId || await web3.eth.net.getId()


    if (deployAll) {
        Object.keys(overwrites).forEach((key) => {
            overwrites[key] = true
        })
    }

    var Reversi = artifacts.require('./Reversi.sol')
    var POACloversController = artifacts.require('./POACloversController.sol')

    let reversi, 
    poaCloversController, 
    tx

    try {
        var totalGas = utils.toBN('0')

        // Deploy Reversi.sol
        let reversiAddress = await alreadyDeployed('Reversi', networks, verbose, web3, chainId)
        if (overwrites['Reversi'] || overwrites['CloversController'] || !reversiAddress){
            reversi = await Reversi.new()
            tx = await web3.eth.getTransactionReceipt(reversi.transactionHash)
            verbose && console.log(_ + `Deploy reversi at ${reversi.address} - ` + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        }else {
            reversi = await Reversi.at(reversiAddress)
            verbose && console.log(_ + `Already deployed Reversi at ${reversiAddress}`)
        }

        // Deploy POACloversController.sol
        let poaCloversControllerAddress = await alreadyDeployed('POACloversController', networks, verbose, web3, chainId)
        if (overwrites['POACloversController'] || overwrites['Reversi'] || !poaCloversControllerAddress) {
            // -link w poaCloversController
            // POACloversController.network.links["__5b17bcb97970e1ce5ed9096dcff7f451d7_+"] = reversi.address;
            await POACloversController.link(reversi)

            // -w Clovers address
            // -w ClubToken address
            // -w ClubTokenController address
            poaCloversController = await POACloversController.new(
                poaAMB,
                executionGasLimit
            )
            tx = await web3.eth.getTransactionReceipt(poaCloversController.transactionHash)
            verbose && console.log(_ + `Deploy poaCloversController at ${poaCloversController.address} - ` + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            poaCloversController = await POACloversController.at(poaCloversControllerAddress)
            verbose && console.log(_ + `Already deployed POACloversController at ${poaCloversControllerAddress}`)
        }

        return {
            reversi, 
            poaCloversController, 
            gasUsed: totalGas
        }

    } catch (error) {
        console.error(error)
    }
}
