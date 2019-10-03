usePlugin("@nomiclabs/buidler-truffle5");
const Artifactor = require("@truffle/artifactor");
var { deployAllContracts } = require('../helpers/deployAllContracts')
const extractNetworks = require('@gnosis.pm/util-contracts/src/util/extractNetworks')
const path = require('path')

const confFile = path.join(__dirname, '../conf/network-restore')
const conf = require(confFile)
const artifactor = new Artifactor(conf.buildPath);
const verbose = true
const overwrites = {
    Reversi: true,
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
    var {
        reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken
    } = await deployAllContracts({overwrites, accounts, artifacts, web3, verbose})
    // save contract info inside of ./truffle/
    await saveNetworks([reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken])
    // save network info inside of ./networks.json
    await extractNetworks(confFile)
 });

 async function saveNetworks(contractArray) {
     const contractArrayModified = contractArray.reduce((result, item) => {
        let networkId = item.constructor.network_id
        let json = item.constructor._json
        if (!json.networks[networkId]) {
            json.networks[networkId] = {}
        }
        json.networks[networkId].address = item.address
        json.networks[networkId].transactionHash = item.transactionHash
        result[json.contractName] = json
        return result
    }, {})
    return artifactor.saveAll(contractArrayModified)
 }