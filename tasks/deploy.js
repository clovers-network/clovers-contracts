const Artifactor = require("@truffle/artifactor");
var { deployAllContracts } = require('../helpers/deployAllContracts')
const extractNetworks = require('@gnosis.pm/util-contracts/src/util/extractNetworks')
const injectNetworks = require('@gnosis.pm/util-contracts/src/util/injectNetworks')
const path = require('path')
var fs = require('fs');

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
.addFlag("a", "Deploy all", false)
.addOptionalVariadicPositionalParam("overwrite", "Just list the contract names you'd like to overwrite", [])
.setAction(async ({ overwrite, v, a }, env) => {
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
    } = await deployAllContracts({
        overwrites, 
        accounts, 
        artifacts, 
        web3, 
        verbose,
        deployAll: a
    })

    // save contract info inside of ./build/contracts
    saveNetworks([reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken], env)

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

function saveNetworks(contractArray, env) {
    contractArray.forEach((item) => {
        let networkId = item.constructor.network_id
        contractPath = path.join(env.config.paths.artifacts, item.constructor._json.contractName + '.json')
        json = JSON.parse(fs.readFileSync(contractPath))
        if (!json.networks[networkId]) {
            json.networks[networkId] = {}
        }
        json.networks[networkId].address = item.address
        json.networks[networkId].transactionHash = item.transactionHash
        fs.writeFileSync(contractPath, JSON.stringify(json, null, 1))
    })
 }