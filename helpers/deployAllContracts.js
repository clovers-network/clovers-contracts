module.exports = {deployAllContracts}
var utils = require('web3-utils')
var _networks = require('../networks.json')
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
    networks = networks || _networks

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
        return  networks && networks[contractName] && networks[contractName][chainId] && networks[contractName][chainId].address
    }

    try {
        var totalGas = utils.toBN('0')
      
        // Deploy Clovers.sol (NFT)
        // -w NFT name
        // -w NFT symbol
        let cloversAddress = alreadyDeployed('Clovers')
        if (overwrites['Clovers'] || !cloversAddress) {
            clovers = await Clovers.new('Clovers', 'CLVR')
            tx = await web3.eth.getTransactionReceipt(clovers.transactionHash)
            verbose && console.log(_ + 'Deploy clovers - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            clovers = await Clovers.at(cloversAddress)
        }
    
        // Deploy CloversMetadata.sol
        // -w Clovers address
        let cloversMetadataAddress = alreadyDeployed('CloversMetadata')
        if (overwrites['CloversMetadata'] || !cloversMetadataAddress){
            cloversMetadata = await CloversMetadata.new(clovers.address)
            tx = await web3.eth.getTransactionReceipt(cloversMetadata.transactionHash)
            verbose && console.log(_ + 'Deploy cloversMetadata - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            cloversMetadata = await CloversMetadata.at(cloversMetadataAddress)
        }
    
        // Deploy ClubToken.sol (ERC20)
        // -w ERC20 name
        // -w ERC20 symbol
        // -w ERC20 decimals
        let clubTokenAddress = alreadyDeployed('ClubToken')
        if (overwrites['ClubToken'] || !clubTokenAddress) {
            clubToken = await ClubToken.new('CloverCoin', 'CLC', decimals)
            tx = await web3.eth.getTransactionReceipt(clubToken.transactionHash)
            verbose && console.log(_ + 'Deploy clubToken - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            clubToken = await ClubToken.at(clubTokenAddress)
        }
    
        // Deploy Reversi.sol
        let reversiAddress = alreadyDeployed('Reversi')
        if (overwrites['Reversi'] || overwrites['CloversController'] || !reversiAddress){
            reversi = await Reversi.new()
            tx = await web3.eth.getTransactionReceipt(reversi.transactionHash)
            verbose && console.log(_ + 'Deploy reversi - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        }else {
            reversi = await Reversi.at(reversiAddress)
        }
        // Deploy ClubTokenController.sol
        // -w ClubToken address
        let clubTokenControllerAddress = alreadyDeployed('ClubTokenController')
        if (overwrites['ClubTokenController'] || !clubTokenControllerAddress){
            clubTokenController = await ClubTokenController.new(clubToken.address)
            tx = await web3.eth.getTransactionReceipt(clubTokenController.transactionHash)
            verbose && console.log(_ + 'Deploy clubTokenController - ' + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            clubTokenController = await ClubTokenController.at(clubTokenControllerAddress)
        }

        // Deploy CloversController.sol
        let cloversControllerAdress = alreadyDeployed('CloversController')
        if (overwrites['CloversController'] || overwrites['Reversi'] || !cloversControllerAdress) {
            // -link w cloversController
            // CloversController.network.links["__5b17bcb97970e1ce5ed9096dcff7f451d7_+"] = reversi.address;
            await CloversController.setNetwork(chainId)
            await CloversController.link(`\\$b2fca45de5ef9c5a18731e56fbc51add96\\$`, reversi.address)
            await CloversController.link('Reversi', reversi.address)

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
            cloversController = await CloversController.at(cloversControllerAdress)
        }
    
        // Deploy SimpleCloversMarket.sol
        // -w Clovers address
        // -w ClubToken address
        // -w ClubTokenController address
        // -w CloversController address
        let simpleCloversMarketAddress = alreadyDeployed('SimpleCloversMarket')
        if (overwrites['SimpleCloversMarket'] || !simpleCloversMarketAddress){
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
            simpleCloversMarket = await SimpleCloversMarket.at(simpleCloversMarketAddress)
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
