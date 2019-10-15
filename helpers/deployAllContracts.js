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

async function deployAllContracts({overwrites, accounts, artifacts, web3, chainId, networks, verbose, testing}) {
    overwrites = overwrites || _overwrites
    networks = networks || _networks
    chainId = chainId || await web3.eth.net.getId()

    if (testing) {
        Object.keys(overwrites).forEach((key) => {
            overwrites[key] = true
        })
    }

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

    async function alreadyDeployed(contractName) {
        let address =  networks && networks[contractName] && networks[contractName][chainId] && networks[contractName][chainId].address
        if (!address) {
            // console.log('no address')
            return false
        }
        let code = await web3.eth.getCode(address)
        if (code === '0x') {
            // console.log('no code')
            return false
        }
        // let contract = eval(contractName)
        // console.log(contractName, contract._json.bytecode.length, code.length, contract._json.bytecode === code)
        // if (code !== contract._json.bytecode) {
        //     console.log('code doeesnt match')
        //     return false
        // }
        return address
    }

    try {
        var totalGas = utils.toBN('0')
      
        // Deploy Clovers.sol (NFT)
        // -w NFT name
        // -w NFT symbol
        let cloversAddress = await alreadyDeployed('Clovers')
        if (overwrites['Clovers'] || !cloversAddress) {
            clovers = await Clovers.new('Clovers', 'CLVR')
            tx = await web3.eth.getTransactionReceipt(clovers.transactionHash)
            verbose && console.log(_ + `Deploy clovers at ${clovers.address} - ` + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            clovers = await Clovers.at(cloversAddress)
            verbose && console.log(_ + `Already deployed Clovers at ${cloversAddress}`)
        }
    
        // Deploy CloversMetadata.sol
        // -w Clovers address
        let cloversMetadataAddress = await alreadyDeployed('CloversMetadata')
        if (overwrites['CloversMetadata'] || !cloversMetadataAddress){
            cloversMetadata = await CloversMetadata.new(clovers.address)
            tx = await web3.eth.getTransactionReceipt(cloversMetadata.transactionHash)
            verbose && console.log(_ + `Deploy cloversMetadata at ${cloversMetadata.address} - ` + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            cloversMetadata = await CloversMetadata.at(cloversMetadataAddress)
            verbose && console.log(_ + `Already deployed CloversMetadata at ${cloversMetadataAddress}`)
        }
    
        // Deploy ClubToken.sol (ERC20)
        // -w ERC20 name
        // -w ERC20 symbol
        // -w ERC20 decimals
        let clubTokenAddress = await alreadyDeployed('ClubToken')
        if (overwrites['ClubToken'] || !clubTokenAddress) {
            clubToken = await ClubToken.new('CloverCoin', 'CLC', decimals)
            tx = await web3.eth.getTransactionReceipt(clubToken.transactionHash)
            verbose && console.log(_ + `Deploy clubToken at ${clubToken.address} - ` + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            clubToken = await ClubToken.at(clubTokenAddress)
            verbose && console.log(_ + `Already deployed ClubToken at ${clubTokenAddress}`)
        }
    
        // Deploy Reversi.sol
        let reversiAddress = await alreadyDeployed('Reversi')
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
        // Deploy ClubTokenController.sol
        // -w ClubToken address
        let clubTokenControllerAddress = await alreadyDeployed('ClubTokenController')
        if (overwrites['ClubTokenController'] || !clubTokenControllerAddress){
            clubTokenController = await ClubTokenController.new(clubToken.address)
            tx = await web3.eth.getTransactionReceipt(clubTokenController.transactionHash)
            verbose && console.log(_ + `Deploy clubTokenController at ${clubTokenController.address} - ` + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            clubTokenController = await ClubTokenController.at(clubTokenControllerAddress)
            verbose && console.log(_ + `Already deployed ClubTokenController at ${clubTokenControllerAddress}`)
        }

        // Deploy CloversController.sol
        let cloversControllerAdress = await alreadyDeployed('CloversController')
        if (overwrites['CloversController'] || overwrites['Reversi'] || !cloversControllerAdress) {
            // -link w cloversController
            // CloversController.network.links["__5b17bcb97970e1ce5ed9096dcff7f451d7_+"] = reversi.address;
            await CloversController.link(reversi)
            

            // -w Clovers address
            // -w ClubToken address
            // -w ClubTokenController address
            cloversController = await CloversController.new(
                clovers.address,
                clubToken.address,
                clubTokenController.address
            )
            tx = await web3.eth.getTransactionReceipt(cloversController.transactionHash)
            verbose && console.log(_ + `Deploy cloversController at ${cloversController.address} - ` + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            cloversController = await CloversController.at(cloversControllerAdress)
            verbose && console.log(_ + `Already deployed CloversController at ${cloversControllerAdress}`)
        }
    
        // Deploy SimpleCloversMarket.sol
        // -w Clovers address
        // -w ClubToken address
        // -w ClubTokenController address
        // -w CloversController address
        let simpleCloversMarketAddress = await alreadyDeployed('SimpleCloversMarket')
        if (overwrites['SimpleCloversMarket'] || !simpleCloversMarketAddress){
            simpleCloversMarket = await SimpleCloversMarket.new(
                clovers.address,
                clubToken.address,
                clubTokenController.address,
                cloversController.address,
            )
            tx = await web3.eth.getTransactionReceipt(simpleCloversMarket.transactionHash)
            verbose && console.log(_ + `Deploy simpleCloversMarket at ${simpleCloversMarket.address} - ` + tx.gasUsed)
            verbose && gasToCash(tx.gasUsed)
            totalGas = totalGas.add(utils.toBN(tx.gasUsed))
        } else {
            simpleCloversMarket = await SimpleCloversMarket.at(simpleCloversMarketAddress)
            verbose && console.log(_ + `Already deployed SimpleCloversMarket at ${simpleCloversMarketAddress}`)
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
