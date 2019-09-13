usePlugin("@nomiclabs/buidler-truffle5");

module.exports = {
  defaultNetwork: "develop",

  networks: {
    develop: {
      gas: 6721975
    }
  },

  solc: {
    version: "0.5.9",
    optimizer: {
      enabled: true,
      runs: 200
    }
  },

  paths: {
    sources: "./contracts/v5",
    tests: "./tests", 
    cache: "./cache",
    artifacts: "./artifacts"
  },

  mocha: {
    timeout: 10000
  }
};