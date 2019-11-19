var { deployPOAContracts } = require('../../helpers/deployPOAContracts')
var { updatePOAContracts } = require('../../helpers/updatePOAContracts')

task('updatePOA', 'Updates POA contract values')
.addFlag("v", "Add verbose output to the command", false)
.setAction(async ({v, contracts}, env) => {
    var verbose = v
    const accounts = await web3.eth.getAccounts()
    var {
        reversi,
        poaCloversController
    } = contracts || await deployPOAContracts({accounts, artifacts, web3})

    await updatePOAContracts({
        poaCloversController, 
        accounts,
        verbose
    })

})