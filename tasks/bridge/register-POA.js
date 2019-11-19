var { deployPOAContracts } = require('../../helpers/deployPOAContracts.js')
var Reversi = require('clovers-reversi').default
var r = new Reversi()
task("registerPOA", "Register a Clover via POA contracts")
.addFlag("v", "Add verbose output to the command", false)
.addParam("c", "Clover moves", 'C4E3F4C5D6F3D3C2D2E6F5E7C6B6F7B4E8F8G8G5F6B3D8G3G4H5H6H7F2E1B5D7G6A4C8D1C3E2C1B1G1G2H1G7H8C7F1H2H4B2H3A1A2B8B7A8A7A6A5A3')
// .addFlag("a", "Deploy all", false)
// .addOptionalVariadicPositionalParam("overwrite", "Just list the contract names you'd like to overwrite", [])
.setAction(async ({ v, c }, env) => {
    const verbose = v
    const accounts = await web3.eth.getAccounts();

    var {
        poaCloversController
    } = await deployPOAContracts({accounts, artifacts, web3, verbose})
    console.log({c})
    let paused = await poaCloversController.paused()
    console.log({paused})


    let moves = r.stringMovesToByteMoves(c)
    moves = [moves.substr(0, 56), moves.substr(56)].map(s => '0x' + s)


    let isValid = await poaCloversController.isValid(moves)
    console.log({isValid})


    let amb = await poaCloversController.amb()
    console.log({amb})


    // try {
    //     let tx = await poaCloversController.claimCloverWithVerification(moves, false, accounts[0])
    //     console.log({tx})
    // } catch (error) {
    //     console.log(error)
    // }

 });
