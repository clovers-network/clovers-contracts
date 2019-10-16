require("dotenv").config();
usePlugin("@nomiclabs/buidler-solhint");
usePlugin("@nomiclabs/buidler-web3")
usePlugin("@nomiclabs/buidler-truffle5");
usePlugin("@nomiclabs/buidler-etherscan");

require('./tasks')

 
module.exports = {
  defaultNetwork: "buidlerevm",

  networks: {
    buidlerevm: {
      accounts: { mnemonic: process.env.TRUFFLE_MNEMONIC },
      timeout: 50000,
    },
    develop: {
      chainId: 1234,
      url: "http://localhost:8545",
      gas: 6000000,
      timeout: 50000,
      accounts: {
        mnemonic: process.env.TRUFFLE_MNEMONIC
      }
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
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY,
      chainId: 4,
      // gas: 6000000,
      // timeout: 50000,
      accounts: {
        mnemonic: process.env.TESTNET_MNEMONIC
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
  etherscan: {
    apiKey: process.env.ETHERSCAN,
    url: "https://api-rinkeby.etherscan.io/api"
  },
  paths: {
    sources: "./contracts/v5",
    tests: "./test", 
    cache: "./cache",
    artifacts: "./build/contracts"
  }
};