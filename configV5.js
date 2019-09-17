require("dotenv").config();

require('./tasks')
 
module.exports = {
  defaultNetwork: "develop",

  networks: {
    develop: {
      gas: 6000000,
      timeout: 50000,
      accounts: {
        mnemonic: process.env.TRUFFLE_MNEMONIC
      }
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
    tests: "./tests", 
    cache: "./cache",
    artifacts: "./build/contracts/"
  }
};