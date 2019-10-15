const Artifactor = require("@truffle/artifactor");
var { deployAllContracts } = require('../helpers/deployAllContracts')
const extractNetworks = require('@gnosis.pm/util-contracts/src/util/extractNetworks')
const injectNetworks = require('@gnosis.pm/util-contracts/src/util/injectNetworks')
const path = require('path')

const confFile = path.join(__dirname, '../conf/network-restore')
const conf = require(confFile)
const artifactor = new Artifactor(conf.buildPath);

let overwrites = {
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
.addFlag("v", "Add verbose output to the command", false)
.addOptionalVariadicPositionalParam("overwrite", "Just list the contract names you'd like to overwrite", [])
.setAction(async ({ overwrite, v }, env) => {
    const verbose = v
    overwrite.forEach(element => {
        if (overwrites[element] === undefined) throw new Error(`${element} does not exist`)
        overwrites[element] = true
    });

    // make sure no info from networks.json is missing from the build folder
    await injectNetworks(confFile)

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
    return {
        reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken
    }
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