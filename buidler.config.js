require("dotenv").config();
usePlugin("@nomiclabs/buidler-solhint");
usePlugin("@nomiclabs/buidler-web3")
usePlugin("@nomiclabs/buidler-truffle5");

require('./tasks')

 
module.exports = {
  defaultNetwork: "develop",

  networks: {
    develop: {
      // chainId: 1337,
      url: "http://localhost:8545",
      gas: 6000000,
      timeout: 50000,
      // accounts: {
      //   mnemonic: process.env.TRUFFLE_MNEMONIC
      // }
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY,
      chainId: 1,
      // gas: 6000000,
      // timeout: 50000,
      accounts: {
        mnemonic: process.env.MAINNET_MNEMONIC
      },
      gasPrice: 15000000000 // 15 GWEI
    }
  },

  solc: {
    version: "0.5.9",
    optimizer: {
      enabled: true,
      runs: 10000
    }
  },

  paths: {
    sources: "./contracts/v5",
    tests: "./test", 
    cache: "./cache",
    artifacts: "./artifacts"
  }
};