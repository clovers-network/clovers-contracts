usePlugin("@nomiclabs/buidler-truffle5");
var networks =require('../networks.json')
var { deployAllContracts } = require('../helpers/deployAllContracts')
var { updateAllContracts } = require('../helpers/updateAllContracts')

const verbose = true

task('update', 'Updates contract values').
setAction(async (taskArgs, env) => {
    const accounts = await web3.eth.getAccounts()
    var {
        reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken
    } = await deployAllContracts({accounts, artifacts, web3})
    
    await updateAllContracts({
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken,
        accounts,
        verbose
    })

})