usePlugin("@nomiclabs/buidler-truffle5");
var networks =require('../networks.json')


task('update', 'Updates contract values').
setAction(async (taskArgs, env) => {
    const accounts = await web3.eth.getAccounts()
    const chainId = env.config.networks.chainId

    var {
        reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken
    } = await deployAllContracts({accounts, artifacts, web3, chainId, networks})
    
    await updateAllContracts({
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken,
        accounts
    })

})