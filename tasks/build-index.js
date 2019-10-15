

task("buildIndex", "Build index.js for contracts to be used in app")
.setAction(async (argVals, { run }) => {
  var fs = require('fs');
  var Clovers = require("../build/contracts/Clovers.json");
  var CloversController = require("../build/contracts/CloversController.json");
  var ClubToken = require("../build/contracts/ClubToken.json");
  var ClubTokenController = require("../build/contracts/ClubTokenController.json");
  // var Reversi = require("../build/contracts/Reversi.json");
  var SimpleCloversMarket = require("../build/contracts/SimpleCloversMarket.json");

  Clovers = {
    abi: Clovers.abi,
    networks: Clovers.networks
  }
  CloversController = {
    abi: CloversController.abi,
    networks: CloversController.networks
  }
  ClubToken = {
    abi: ClubToken.abi,
    networks: ClubToken.networks
  }
  ClubTokenController = {
    abi: ClubTokenController.abi,
    networks: ClubTokenController.networks
  }
  SimpleCloversMarket = {
    abi: SimpleCloversMarket.abi,
    networks: SimpleCloversMarket.networks
  }
  let printable = `module.exports = {
  Clovers: ${JSON.stringify(Clovers, null, 1)},
  CloversController: ${JSON.stringify(CloversController, null, 1)},
  ClubToken: ${JSON.stringify(ClubToken, null, 1)},
  ClubTokenController: ${JSON.stringify(ClubTokenController, null, 1)},
  SimpleCloversMarket: ${JSON.stringify(SimpleCloversMarket, null, 1)}
  };`


  return new Promise((resolve, reject) => {
    fs.writeFile('./index.js', printable, (err) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          console.log('Success!');
          resolve()
        }
    });
  })
})