var fs = require('fs');
var Clovers = require("./build/contracts/Clovers.json");
var CloversController = require("./build/contracts/CloversController.json");
// var CloversMetadata = require("./build/contracts/CloversMetadata.json");
var ClubToken = require("./build/contracts/ClubToken.json");
var ClubTokenController = require("./build/contracts/ClubTokenController.json");
// var Reversi = require("./build/contracts/Reversi.json");
var SimpleCloversMarket = require("./build/contracts/SimpleCloversMarket.json");
var Support = require("./build/contracts/Support.json");
// var CurationMarket = require("./build/contracts/CurationMarket.json");

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
Support = {
  abi: Support.abi,
  networks: Support.networks
}
// CurationMarket = {
//   abi: CurationMarket.abi,
//   networks: CurationMarket.networks
// }
let printable = `module.exports = {
  Clovers: ${JSON.stringify(Clovers)},
  CloversController: ${JSON.stringify(CloversController)},
  ClubToken: ${JSON.stringify(ClubToken)},
  ClubTokenController: ${JSON.stringify(ClubTokenController)},
  SimpleCloversMarket: ${JSON.stringify(SimpleCloversMarket)},
  Support: ${JSON.stringify(Support)}
};`

fs.writeFile('index.js', printable, function (err) {
  if (err) throw err;
  console.log('Replaced!');
});