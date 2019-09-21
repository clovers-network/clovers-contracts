var utils = require('web3-utils')
var {deployAllContracts} = require('../helpers/deployAllContracts')
var {updateAllContracts} = require('../helpers/updateAllContracts')
var networks =require('../networks.json')
const {
  gasToCash,
  _
} = require('../helpers/utils')

contract('Clovers.sol', async function(accounts) {
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

  describe('Clovers.sol', function() {
    it('should be able to read metadata', async function() {
      let metadata = await clovers.tokenURI(666)
      let _metadata = await cloversMetadata.tokenURI(666)
      assert(_metadata === metadata, '_metadata != metadata')
    })
  })

})