var { deployAllContracts } = require('../helpers/deployAllContracts')
var { updateAllContracts } = require('../helpers/updateAllContracts')
var networks = require('../networks.json')
task('update', 'Updates contract values')
.addFlag("v", "Add verbose output to the command", false)
.setAction(async ({v, contracts}, env) => {
    var verbose = v
    const accounts = await web3.eth.getAccounts()
    var {
        reversi, 
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken
    } = contracts || await deployAllContracts({accounts, artifacts, web3})

    await updateAllContracts({
        clovers, 
        cloversMetadata, 
        cloversController, 
        clubTokenController, 
        simpleCloversMarket, 
        clubToken,
        accounts,
        verbose,
        networks
    })

})