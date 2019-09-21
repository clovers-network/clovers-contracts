usePlugin("@nomiclabs/buidler-truffle5");
var networks =require('../networks.json')
var deployAllContracts = require('../helpers/deployAllContracts')
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
    } = await deployAllContracts({overwrites, accounts, artifacts, web3, chainId, networks})
 });