
const ClubTokenArtifacts = require('../../build/contracts/ClubToken.json')

const Web3 = require('web3')
const BN = Web3.utils.BN
const ZeroClientProvider = require('web3-provider-engine/zero.js')

class ClubToken {
  constructor (options) {

    this.ClubToken = null

    this.pollingInterval = null
    this.account = null
    this.unlocked = false
    this.balanceWei = 0
    this.balance = 0
    this.address = 'REPLACE_WITH_CONTRACT_ADDRESS'
    this.genesisBlock = 0
    this.loading = false
    this.options = {
      readonlyRpcURL: 'https://mainnet.infura.io',
      autoInit: true,
      getPastEvents: false,
      watchFutureEvents: false,
      connectionRetries: 3
    }
    Object.assign(this.options, options)
    if (this.options.autoInit) this.initWeb3()
  }

  // hello world : )
  helloWorld () {
    console.log('hello world!')
  }

  /*
   * Connect
   */

  initWeb3 () {
    return new Promise((resolve, reject) => {

      let web3Provider = false

      // check for metamask
      if (global.web3) {
        web3Provider = global.web3.currentProvider
        // attempt to try again if no web3Provider
      } else if (this.options.connectionRetries > 0){
        this.options.connectionRetries -= 1
        setTimeout(() => {
          this.initWeb3().then(resolve).catch((error) => {
            reject(new Error(error))
          })
        }, 1000)
        // revert to a read only version using infura endpoint
      } else {
        this.readOnly = true
        web3Provider = ZeroClientProvider({
          getAccounts: function(){},
          rpcUrl: this.options.readonlyRpcURL
        })
      }

      if (web3Provider) {
        global.web3 = new Web3(web3Provider)
        this.startChecking()

        if (this.options.getPastEvents) this.getPastEvents()
        if (this.options.watchFutureEvents) this.watchFutureEvents()
      }
    })

  }

  /*
   * Check every second for switching network or switching wallet
   */

  startChecking () {
    if (this.pollingInterval) clearInterval(this.pollingInterval)
    this.getGenesisBlock()
    .then(() => {
      this.pollingInterval = setInterval(this.check.bind(this), 1000)
    })
    .catch((err) => {
      throw new Error(err)
    })
  }

  check () {
    this.checkNetwork()
    .then(this.checkAccount.bind(this))
    .catch((error) => {
      console.error(error)
      throw new Error(error)
    })
  }

  checkNetwork () {
    return global.web3.eth.net.getId((err, netId) => {
      if (err) console.error(err)
      if (!err && this.network !== netId) {
        this.network = netId
        return this.deployContract()
      }
    })
  }

  deployContract () {
    if (!this.address || this.address === 'REPLACE_WITH_CONTRACT_ADDRESS') return new Error('Please provide a contract address')
    this.ClubToken = new global.web3.eth.Contract(ClubTokenArtifacts.abi, this.address)
  }

  checkAccount () {
    return global.web3.eth.getAccounts((error, accounts) => {
      if (error) throw new Error(error)
      if (accounts.length && this.account !== accounts[0]) {
        this.unlocked = true
        this.account = accounts[0]
      } else if (!accounts.length) {
        this.unlocked = false
        this.account = null
      }
    })
  }


  /*
   * Not Yet Implemented vvvv
   */

  getGenesisBlock () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  getPastEvents () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  watchFutureEvents () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }




  /*
   *
   * Constant Functions
   *
   */

  totalSupply () {
    return this.ClubToken.methods.totalSupply().call()
    .then((resp) => {
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  balanceOf (_owner) {
    return this.ClubToken.methods.balanceOf(_owner).call()
    .then((resp) => {
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  owner () {
    return this.ClubToken.methods.owner().call()
    .then((resp) => {
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  allowance (_owner, _spender) {
    return this.ClubToken.methods.allowance(_owner, _spender).call()
    .then((resp) => {
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }

  /*
   *
   * Transaction Functions
   *
   */

  approve (_spender, _value) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.approve(_spender, new BN(_value, 10)).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  increaseApproval (_spender, _addedValue, _data) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.increaseApproval(_spender, new BN(_addedValue, 10), _data).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  transferFrom (_from, _to, _value) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.transferFrom(_from, _to, new BN(_value, 10)).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  approve (_spender, _value, _data) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.approve(_spender, new BN(_value, 10), _data).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  decreaseApproval (_spender, _subtractedValue) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.decreaseApproval(_spender, new BN(_subtractedValue, 10)).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  decreaseApproval (_spender, _subtractedValue, _data) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.decreaseApproval(_spender, new BN(_subtractedValue, 10), _data).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  transfer (_to, _value) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.transfer(_to, new BN(_value, 10)).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  transferFrom (_from, _to, _value, _data) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.transferFrom(_from, _to, new BN(_value, 10), _data).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  transfer (_to, _value, _data) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.transfer(_to, new BN(_value, 10), _data).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  increaseApproval (_spender, _addedValue) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.increaseApproval(_spender, new BN(_addedValue, 10)).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  transferOwnership (newOwner) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.transferOwnership(newOwner).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  updateCloversControllerAddress (_cloversController) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.updateCloversControllerAddress(_cloversController).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  burn (_from, _value) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.burn(_from, new BN(_value, 10)).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  mint (_to, _amount) {
    if (!this.account) return Promise.reject(new Error('Unlock Account'))
    return this.ClubToken.methods.mint(_to, new BN(_amount, 10)).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
    .then((resp) => {
      this.loading = false
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }

  /*
   *
   * Events
   *
   */




}

module.exports = ClubToken
