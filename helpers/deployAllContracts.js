module.exports = {deployAllContracts}
var utils = require('web3-utils')
const {
    gasToCash,
    _
} = require('./utils')  
var {
    decimals,
} = require('./migVals')

const _overwrites = {
    Reversi: false,
    Support: false,
    Clovers: false,
    CloversMetadata: false,
    CloversController: false,
    ClubTokenController: false,
    SimpleCloversMarket: false,
    ClubToken: false
}

async function deployAllContracts({overwrites, accounts, artifacts, web3, chainId, networks, verbose}) {
    overwrites = overwrites || _overwrites

    var Reversi = artifacts.require('./Reversi.sol')
    var Clovers = artifacts.require('./Clovers.sol')
    var CloversMetadata = artifacts.require('./CloversMetadata.sol')
    var CloversController = artifacts.require('./CloversController.sol')
    var ClubTokenController = artifacts.require('./ClubTokenController.sol')
    var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
    var ClubToken = artifacts.require('./ClubToken.sol')

    let reversi, 
    clovers, 
    cloversMetadata, 
    cloversController, 
    clubTokenController, 
    simpleCloversMarket, 
    clubToken,
    tx

    function alreadyDeployed(contractName) {
        return networks[contractName] && networks[chainId] && networks[chainId].address
    }

    try {
        var totalGas = utils.toBN('0')
      
        // Deploy Clovers.sol (NFT)
        // -w NFT name
        // -w NFT symbol
        if (overwrites['Clovers'] || !alreadyDeployed('Clovers')) {
            clovers = await Clovers.new('Clovers', 'CLVR')
            tx = await web3.eth.getTransactionReceipt(clovers.transactionHash)
            verbose && console.log(_ + 'Deploy clovers - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            clovers = await Clovers.deployed()
        }
    
        // Deploy CloversMetadata.sol
        // -w Clovers address
        if (overwrites['CloversMetadata'] || !alreadyDeployed('CloversMetadata')){
            cloversMetadata = await CloversMetadata.new(clovers.address)
            tx = await web3.eth.getTransactionReceipt(cloversMetadata.transactionHash)
            verbose && console.log(_ + 'Deploy cloversMetadata - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            cloversMetadata = await CloversMetadata.deployed()
        }
    
        // Deploy ClubToken.sol (ERC20)
        // -w ERC20 name
        // -w ERC20 symbol
        // -w ERC20 decimals
        if (overwrites['ClubToken'] || !alreadyDeployed('ClubToken')) {
            clubToken = await ClubToken.new('CloverCoin', 'CLC', decimals)
            tx = await web3.eth.getTransactionReceipt(clubToken.transactionHash)
            verbose && console.log(_ + 'Deploy clubToken - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            clubToken = await ClubToken.at(alreadyDeployed['ClubToken'])
        }
    
        // Deploy Reversi.sol
        if (overwrites['Reversi'] || !alreadyDeployed('Reversi')){
            reversi = await Reversi.new()
            tx = await web3.eth.getTransactionReceipt(reversi.transactionHash)
            verbose && console.log(_ + 'Deploy reversi - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        }else {
            reversi = await Reversi.deployed()
        }
        // Deploy ClubTokenController.sol
        // -w ClubToken address
        if (overwrites['ClubTokenController'] || !alreadyDeployed('ClubTokenController')){
            clubTokenController = await ClubTokenController.new(clubToken.address)
            tx = await web3.eth.getTransactionReceipt(clubTokenController.transactionHash)
            verbose && console.log(_ + 'Deploy clubTokenController - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            clubTokenController = await ClubTokenController.deployed()
        }
        // Deploy CloversController.sol
        if (overwrites['CloversController'] || !alreadyDeployed('CloversController')) {
            // -link w cloversController
            // await CloversController.detectNetwork()
            // CloversController.setNetwork(chainId)
            // CloversController.network_id = chainId
            // CloversController.networks[CloversController.network_id] = {
            //     events: {},
            //     links: {}
            //   }
            // CloversController.network.links["__5b17bcb97970e1ce5ed9096dcff7f451d7_+"] = reversi.address;

            let network = await CloversController.detectNetwork()
            await CloversController.setNetwork(network)
            await CloversController.link(`\\$5b17bcb97970e1ce5ed9096dcff7f451d7\\$`, reversi.address)
            // await CloversController.link('IReversi', reversi.address)

            // -w Clovers address
            // -w ClubToken address
            // -w ClubTokenController address
            cloversController = await CloversController.new(
                clovers.address,
                clubToken.address,
                clubTokenController.address
            )
            tx = await web3.eth.getTransactionReceipt(cloversController.transactionHash)
            verbose && console.log(_ + 'Deploy cloversController - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            cloversController = await CloversController.deployed()
        }
    
        // Deploy SimpleCloversMarket.sol
        // -w Clovers address
        // -w ClubToken address
        // -w ClubTokenController address
        // -w CloversController address
        if (overwrites['SimpleCloversMarket'] || !alreadyDeployed('SimpleCloversMarket')){
            simpleCloversMarket = await SimpleCloversMarket.new(
                clovers.address,
                clubToken.address,
                clubTokenController.address,
                cloversController.address,
            )
            tx = await web3.eth.getTransactionReceipt(simpleCloversMarket.transactionHash)
            verbose && console.log(_ + 'Deploy simpleCloversMarket - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            simpleCloversMarket = await SimpleCloversMarket.deployed()
        }

        return {
            reversi, 
            clovers, 
            cloversMetadata, 
            cloversController, 
            clubTokenController, 
            simpleCloversMarket, 
            clubToken,
            gasUsed: totalGas
        }

    } catch (error) {
        console.error(error)
    }
}
