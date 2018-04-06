require('dotenv').config()
// require('babel-register')
// require('babel-polyfill')

const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    develop: {
      provider() {
        return new HDWalletProvider(process.env.TRUFFLE_MNEMONIC, 'http://localhost:8545');
      },
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 10000000
    },
    ganache: {
      provider() {
        return new HDWalletProvider(process.env.TRUFFLE_MNEMONIC, 'http://localhost:7545');
      },
      host: 'localhost',
      port: 7545,
      network_id: 5777,
      gas: 10000000,
      gasPrice: 1000000000
    },
    kovan: {
      provider() {
        // using wallet at index 1 ----------------------------------------------------------------------------------------v
        return new HDWalletProvider(process.env.RINKEBY_MNEMONIC, 'https://kovan.infura.io/' + process.env.INFURA_API_KEY, 1);
      },
      network_id: 42,
      // gas: 5561260
    },
    rinkeby: {
      provider() {
        return new HDWalletProvider(process.env.RINKEBY_MNEMONIC, 'https://rinkeby.infura.io/' + process.env.INFURA_API_KEY);
      },
      network_id: 4,
      // gas: 4700000,
      // gasPrice: 20000000000
    },
    ropsten: {
      provider() {
        return new HDWalletProvider(process.env.RINKEBY_MNEMONIC, 'https://ropsten.infura.io/' + process.env.INFURA_API_KEY);
      },
      network_id: 2,
      // gas: 4700000
    },
    sokol: {
      provider() {
        return new HDWalletProvider(process.env.RINKEBY_MNEMONIC, 'https://sokol.poa.network');
      },
      gasPrice: 1000000000,
      network_id: 77
    },
    poa: {
      provider() {
        return new HDWalletProvider(process.env.RINKEBY_MNEMONIC, 'https://core.poa.network');
      },
      gasPrice: 1000000000,
      network_id: 99
    }
  }
}
