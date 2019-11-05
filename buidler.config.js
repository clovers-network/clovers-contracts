require("dotenv").config();
usePlugin("@nomiclabs/buidler-solhint");
usePlugin("@nomiclabs/buidler-web3")
usePlugin("@nomiclabs/buidler-truffle5");
usePlugin("@nomiclabs/buidler-etherscan");

require('./tasks')

function generateAddressesFromSeed(seed, count, balance) {
  let bip39 = require("bip39");
  let hdkey = require('ethereumjs-wallet/hdkey');
  let hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(seed));
  let wallet_hdpath = "m/44'/60'/0'/0/";

  let accounts = [];
  for (let i = 0; i < count; i++) {

      let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
      let address = '0x' + wallet.getAddress().toString("hex");
      let privateKey =  '0x' + wallet.getPrivateKey().toString("hex");
      accounts.push({balance, privateKey});
  }

  return accounts;
}
const testnetAccounts = generateAddressesFromSeed(process.env.TRUFFLE_MNEMONIC, 10, '100000000000000000000')
// const mainnetAccounts = generateAddressesFromSeed(process.env.MAINNET_MNEMONIC, 10, '100000000000000000000')
// const rinkebyAccounts = generateAddressesFromSeed(process.env.TESTNET_MNEMONIC, 2, '0')


module.exports = {
  defaultNetwork: "buidlerevm",

  networks: {
    ethermint: {
      chainId: 8,
      url: "http://localhost:8545",
      accounts: {mnemonic: process.env.ETHERMINT}
    },
    buidlerevm: {
      accounts: testnetAccounts
    },
    develop: {
      chainId: 1337,
      url: "http://localhost:8545",
      // gas: 6000000,
      accounts: {mnemonic: process.env.TRUFFLE_MNEMONIC}
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY,
      chainId: 1,
      // gas: 6000000,
      accounts: {mnemonic: process.env.MAINNET_MNEMONIC},
      gasPrice: 15000000000 // 15 GWEI
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY,
      chainId: 4,
      // gas: 6000000,
      accounts: {mnemonic: process.env.TESTNET_MNEMONIC},
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