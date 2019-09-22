var utils = require('web3-utils')
var {deployAllContracts} = require('../helpers/deployAllContracts')
var {updateAllContracts} = require('../helpers/updateAllContracts')
var networks =require('../networks.json')
const {
  gasToCash,
  getLowestPrice,
  _
} = require('../helpers/utils')

contract('SimpleCloversMarket.sol', async function(accounts) {
  var
    clovers, 
    cloversMetadata, 
    cloversController, 
    clubTokenController, 
    simpleCloversMarket, 
    clubToken
  before(async () => {
      try {
        var totalGas = utils.toBN('0')
        const chainId = await web3.eth.net.getId()
        var allContracts = await deployAllContracts({accounts, artifacts, web3, chainId, networks})
        
        clovers = allContracts.clovers 
        cloversMetadata = allContracts.cloversMetadata 
        cloversController = allContracts.cloversController 
        clubTokenController = allContracts.clubTokenController 
        simpleCloversMarket = allContracts.simpleCloversMarket 
        clubToken = allContracts.clubToken
        gasUsed = allContracts.gasUsed       

        totalGas = totalGas.add(utils.toBN(gasUsed))

        var {gasUsed} = await updateAllContracts({
            clovers, 
            cloversMetadata, 
            cloversController, 
            clubTokenController, 
            simpleCloversMarket, 
            clubToken,
            accounts
        })
        // totalGas = totalGas.add(utils.toBN(gasUsed))

        // console.log(_ + totalGas.toString(10) + ' - Total Gas')
        // gasToCash(totalGas)

      } catch (error) {
        console.log('error:', error)
      }
  })

  describe('SimpleCloversMarket.sol', function() {
    let _tokenId = '0x666'
    let _seller = accounts[9]
    let _buyer = accounts[8]
    let _price = utils.toBN(utils.toWei('0.5'))
    it('should have correct contract addresses', async function() {
      let _clovers = await simpleCloversMarket.clovers()
      assert(
        _clovers === clovers.address,
        'clovers contract address is incorrect ' +
          _clovers +
          '!=' +
          clovers.address
      )

      let _clubToken = await simpleCloversMarket.clubToken()
      assert(
        _clubToken === clubToken.address,
        'clubToken contract address is incorrect ' +
          _clubToken +
          '!=' +
          clubToken.address
      )

      let _clubTokenController = await simpleCloversMarket.clubTokenController()
      assert(
        _clubTokenController === clubTokenController.address,
        'clubTokenController contract address is incorrect ' +
          _clubTokenController +
          '!=' +
          clubTokenController.address
      )
    })

    it('should list a clover for sale', async function() {
      try {
        tx = await clovers.mint(_seller, _tokenId)
        console.log(_ + 'clovers.mint - ' + tx.receipt.cumulativeGasUsed)
        gasToCash(tx.receipt.cumulativeGasUsed)
        let owner = await clovers.ownerOf(_tokenId)
        assert(
          owner.toString() === _seller.toString(),
          'owner is not seller ' + owner.toString() + '!=' + _seller.toString()
        )
      } catch (error) {
        assert(false, error.message)
      }
      try {
        tx = await simpleCloversMarket.sell(_tokenId, _price, {
          from: _seller
        })
        console.log(
          _ + 'simpleCloversMarket.sell - ' + tx.receipt.cumulativeGasUsed
        )
        gasToCash(tx.receipt.cumulativeGasUsed)

        let _price_ = await simpleCloversMarket.sellPrice(_tokenId)
        assert(
          _price_.toString() === _price.toString(),
          'prices do not match ' +
            _price_.toString() +
            '!==' +
            _price.toString()
        )
      } catch (error) {
        assert(false, error.message)
      }
    })

    it('should buy the clover by minting ClubToken before', async () => {
      let buyerBalance = await clubToken.balanceOf(_buyer)
      let amountToSpend, tx
      try {
        if (buyerBalance.lt(_price)) {
          amountToSpend = await getLowestPrice(clubTokenController, _price)
        } else {
          amountToSpend = '0'
        }
      } catch (error) {
        assert(false, error.message)
      }

      let resultOfSpend = await clubTokenController.getBuy(amountToSpend.toString(10))
      assert(resultOfSpend.gt(_price), `resultOfSpend (${utils.fromWei(resultOfSpend.toString())}) is less than price (${utils.fromWei(_price.toString(10))})`)

      let cloversControllerAddress = await simpleCloversMarket.cloversController()
      assert(cloversControllerAddress.toLowerCase() === cloversController.address.toLowerCase(), "cloversControllerAddress does not match")

      let simpleCloversMarketAddress = await cloversController.simpleCloversMarket()
      assert(simpleCloversMarketAddress.toLowerCase() === simpleCloversMarket.address.toLowerCase(), "SimpleCloversMarket Addresses do not match in CloversControllerl")

      try {
        let from = await simpleCloversMarket.sellFrom(_tokenId)
        let owner = await clovers.ownerOf(_tokenId)
        assert(
          from.toString() === owner.toString(),
          'for sale from wrong person'
        )
        tx = await simpleCloversMarket.buy(_tokenId, {
          from: _buyer,
          value: amountToSpend.toString(10)
        })
        console.log(
          _ + 'simpleCloversMarket.buy - ' + tx.receipt.cumulativeGasUsed
        )
        gasToCash(tx.receipt.cumulativeGasUsed)
        let newOwner = await clovers.ownerOf(_tokenId)
        assert(
          newOwner.toString() === _buyer.toString(),
          'buyer was unable to buy'
        )
      } catch (error) {
        assert(false, `UHOH: ${error.message}`)
      }
    })
  })

})