var Clovers = artifacts.require('./Clovers.sol')
var SimpleCloversMarket = artifacts.require('./SimpleCloversMarket.sol')
// var CloversController = artifacts.require('./CloversController.sol')
// var ethers = require('ethers')
var start = 3000
var getCloversCount = 4000
var filename = 'raw-5.json'
// var Reversi = require('../app/src/assets/reversi.js')
// var Reversi = require('clovers-reversi').default
// var Web3 = require('web3')
var fs = require('fs');
const getFlag = require('../helpers/utils').getFlag
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
// const oldCloversAddress = '0x8A0011ccb1850e18A9D2D4b15bd7F9E9E423c11b'
const oldCloversAddress = '0xe312398f2741E2Ab4C0C985c8d91AdcC4a995a59'

const badAccounts = [
    '0xcde232e835330dafa2ebc629219bbf4fc92cfa24',
    '0x5899c1651653E1e4A110Cd45C7f4E9F576dE0670',
    '0x35b701E4550f0FCC45d854040562e35A4600e4Ee',
    '0x284bAAE3a186f6272309f7cc955AA76f21cF5375'
]
const goodOwner = '0x45e25795A72881a4D80C59B5c60120655215a053' // clovers "goodPlayer" account
module.exports = async function(callback) {

    var clovers = await Clovers.at(oldCloversAddress)
    var simpleCloversMarket = await SimpleCloversMarket.deployed()
    
    let getCloversCount = await clovers.totalSupply()
    var run = getFlag('account') || 0
    var limit = getFlag('limit') || 500
    var start = limit * run
    var end = start + limit
    if (getCloversCount.lt(end)) {
        end = getCloversCount.toFixed()
    }

    let checkForRFTs = getFlag('rft') || false
    
    var filename = getFlag('filename') || `raw-${run}.json`
    const filePath = __dirname + `/../clovers/${filename}`
    console.log(filePath)
    fs.writeFileSync(filePath, '[]')

    try {
        // var getCloversCount = await clovers.totalSupply()
        await doFors(end, start, i => {
            console.log(`${i}/${end} (${getCloversCount.toString(10)})`)
            return new Promise(async (resolve, reject) => {
                try {
                    var tokenId = await clovers.tokenByIndex(i)
                    let owner = await clovers.ownerOf('0x' + tokenId.toString(16))

                    console.log({tokenId: tokenId.toString(16)})
                    console.log({owner})

                    let addressContent = '0x'
                    if (checkForRFTs) {
                        addressContent = await new Promise((resolve, reject) => {
                            web3.eth.getCode(owner, (err, res) => {
                                if (err) {
                                    reject(err)
                                } else {
                                    resolve(res)
                                }
                            })
                        })
                    }
                    if (badAccounts.map( a => a.replace("0x", "").toLowerCase()).includes(owner.toLowerCase().replace("0x", ""))) {
                        console.log('owned by bad account')
                        owner = goodOwner
                    } else if(addressContent !== '0x' && owner.toLowerCase() !== clovers.address.toLowerCase()) {
                        console.log('address content !== 0x' )
                        owner = goodOwner
                    }
                    
                    // let keep = await clovers.getKeep( tokenId)
                    // let blockMinted = await clovers.getBlockMinted(tokenId)
                    let cloverMoves = await clovers.getCloverMoves(tokenId)
                    // let reward = await clovers.getReward(tokenId)
                    // let hash = await clovers.getHash(cloverMoves)
                    let symmetries = await clovers.getSymmetries(tokenId)
                    let price = '0'
                    
                    if (owner.toLowerCase() === oldCloversAddress.toLowerCase()) {
                        console.log('owned by contract')
                        price = await simpleCloversMarket.sellPrice(tokenId)
                    }
                    
                    if (owner === ZERO_ADDRESS) resolve()
                    
                    let clover = {
                        tokenId: tokenId.toString(16), owner, cloverMoves, symmetries, price
                    }

                    let allCloversJSON = JSON.parse(fs.readFileSync(filePath).toString())
                    allCloversJSON.push(clover) 
                    fs.writeFileSync(filePath, JSON.stringify(allCloversJSON, null, 1))
                    resolve() 
                } catch (error) {
                    if (error.message.indexOf('impossibru!!!') !== -1) {
                        console.log('found a bad game!!!!')
                        console.log(reversi)
                        resolve()
                    } else {
                        reject(error)
                    }
                }
            })
        })
        callback()
    } catch (error) {
        console.log(error)
        callback(error)
    }
}



var doFors = (n, i = 0, func) => {
    return new Promise((resolve, reject) => {
        try {
            if (i === n) {
                resolve()
            } else {
                func(i)
                .then(() => {
                    doFors(n, i + 1, func)
                    .then(() => {
                        resolve()
                    })
                    .catch(error => {
                        console.log(error)
                    })
                })
                .catch(error => {
                    console.log(error)
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}