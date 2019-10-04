usePlugin("@nomiclabs/buidler-truffle5");

task("sign", "sign")
.setAction(async (taskArgs, env) => {

    var {
        signMessage,
        toEthSignedMessageHash,
        fixSignature,
        getSignFor
    } = require('../helpers/sign.js')

    const ECDSAMock = artifacts.require('ECDSAMock');
    this.ecdsa = await ECDSAMock.new();

    const tokenId = '0x123'
    const moves = ['0x12', '0x23']

    const prefix = '\u0019Ethereum Signed Message:\n'

    let accounts = await web3.eth.getAccounts()
    const other = accounts[0]
    // const TEST_MESSAGE = web3.utils.sha3('OpenZeppelin');
    const TEST_MESSAGE = web3.utils.soliditySha3({type: "uint256", value: tokenId}, {type:"bytes28[2]", value: moves})


    const sig1 = await web3.eth.sign(TEST_MESSAGE, other)   
    const sig2 = fixSignature(sig1);
    const jsHashWithPrefix = toEthSignedMessageHash(TEST_MESSAGE)

    // Recover the signer address from the generated message and sig2.
    let result = await this.ecdsa.recover(
        jsHashWithPrefix,
        sig2
    )
    if (result !== other) {
        throw new Error(`addresses don't match ${result} != ${other}`)
    }

    result = await this.ecdsa.checkClover(other, sig2, tokenId, moves)
    if (!result) {
        throw new Error(`result was false with checkClover`)
    }
    console.log(`Success!`)
})