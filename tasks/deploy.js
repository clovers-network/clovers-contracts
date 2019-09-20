usePlugin("@nomiclabs/buidler-truffle5");
var networks =require('../networks.json')

const overwrites = {
    Reversi: false,
    Support: false,
    Clovers: false,
    CloversMetadata: false,
    CloversController: false,
    ClubTokenController: false,
    SimpleCloversMarket: false,
    ClubToken: false
  }
  
  var {
    limit,
    decimals,
  } = require('../helpers/migVals')

task("deploy", "Deploys contracts")
 .setAction(async (taskArgs, env) => {

    const accounts = await web3.eth.getAccounts(); 

    var Reversi = artifacts.require('./Reversi.sol')
    console.log({Reversi})
    var Clovers = artifacts.require('./Clovers.sol')
    var CloversMetadata = artifacts.require('./CloversMetadata.sol')
    var CloversController = artifacts.require('./CloversController.sol')
    var ClubTokenController = artifacts.require('./ClubTokenController.sol')
    var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
    var ClubToken = artifacts.require('./ClubToken.sol')
    var Support = artifacts.require('./Support.sol')
    const chainId = env.config.networks.chainId

    function alreadyDeployed(contractName) {
        return networks[contractName] && networks[chainId] && networks[chainId].address
    }

    //  console.log({taskArgs}, {env}, env.config.networks.chainId, env.network.config)
    try {
        console.log(`running task as ${accounts[0]}`)


        // Deploy Clovers.sol (NFT)
        // -w NFT name
        // -w NFT symbol
        if (overwrites['Clovers'] || !alreadyDeployed('Clovers'))
            await Clovers.new('Clovers', 'CLVR')
        clovers = await Clovers.deployed()
    
        // Deploy CloversMetadata.sol
        // -w Clovers address
        if (overwrites['CloversMetadata'] || !alreadyDeployed('CloversMetadata'))
            await CloversMetadata.new(clovers.address)
        cloversMetadata = await CloversMetadata.deployed()
    
        // Deploy ClubToken.sol (ERC20)
        // -w ERC20 name
        // -w ERC20 symbol
        // -w ERC20 decimals
        if (overwrites['ClubToken'] || !alreadyDeployed('ClubToken')) {
            let {address} = await ClubToken.new('CloverCoin', 'CLC', decimals)
            networks['ClubToken'][chainId] = {address}
        } else {
            clubToken = await ClubToken.at(alreadyDeployed['ClubToken'])
        }
    
        // Deploy Reversi.sol
        if (overwrites['Reversi'] || !alreadyDeployed('Reversi'))
            await Reversi.new()
        reversi = await Reversi.deployed()
    
        // Deploy ClubTokenController.sol
        // -w ClubToken address
        if (overwrites['ClubTokenController'] || !alreadyDeployed('ClubTokenController'))
            await ClubTokenController.new(clubToken.address)
        clubTokenController = await ClubTokenController.deployed()
    
        // Deploy CloversController.sol
        if (overwrites['CloversController'] || !alreadyDeployed('CloversController')) {
            // -link w cloversController
            await CloversController.link(reversi); 
            // await CloversController.link('Reversi', reversi.address)
            // -w Clovers address
            // -w ClubToken address
            // -w ClubTokenController address
            await CloversController.new(
                clovers.address,
                clubToken.address,
                clubTokenController.address
            )
        }
        cloversController = await CloversController.deployed()
    
        // Deploy SimpleCloversMarket.sol
        // -w Clovers address
        // -w ClubToken address
        // -w ClubTokenController address
        // -w CloversController address
        if (overwrites['SimpleCloversMarket'] || !alreadyDeployed('SimpleCloversMarket')){
            await SimpleCloversMarket.new(
                clovers.address,
                clubToken.address,
                clubTokenController.address,
                cloversController.address,
            )
        }
        simpleCloversMarket = await SimpleCloversMarket.deployed()

    } catch (error) {
        console.log(error)
    }
 });