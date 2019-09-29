usePlugin("@nomiclabs/buidler-truffle5");
const Artifactor = require("@truffle/artifactor");
// var networks = require('../networks.json')
var {deployAllContracts} = require('../helpers/deployAllContracts')
const extractNetworks = require('@gnosis.pm/util-contracts/src/util/extractNetworks')
const path = require('path')

const confFile = path.join(__dirname, '../conf/network-restore')
const artifactor = new Artifactor(confFile.buildDir);

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
task("deploy", "Deploys contracts")
 .setAction(async (taskArgs, env) => {
    const accounts = await web3.eth.getAccounts();
    const chainId = env.config.networks.chainId
    var {
        reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken
    } = await deployAllContracts({overwrites, accounts, artifacts, web3, chainId})
    await saveNetworks([reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken])
    await extractNetworks(confFile)
 });

 function saveNetworks(contractArray) {
    artifactor.saveAll(contractArray.reduce((result, item) => {
        let networkId = item.constructor.network_id
        let json = item.constructor._json
        if (!json.networks[networkId]) {
            json.networks[networkId] = {}
        }
        json.networks[networkId].address = item.address
        json.networks[networkId].transactionHash = item.transactionHash
        result[json.contractName] = json
        return result
    }, {}))
 }