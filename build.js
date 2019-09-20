var fs = require('fs');
var Clovers = require("./artifacts/Clovers.json");
var CloversController = require("./artifacts/CloversController.json");
// var CloversMetadata = require("./artifacts/CloversMetadata.json");
var ClubToken = require("./artifacts/ClubToken.json");
var ClubTokenController = require("./artifacts/ClubTokenController.json");
// var Reversi = require("./artifacts/Reversi.json");
var SimpleCloversMarket = require("./artifacts/SimpleCloversMarket.json");
var Support = require("./artifacts/Support.json");
// var CurationMarket = require("./artifacts/CurationMarket.json");

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
  Clovers: ${JSON.stringify(Clovers, null, 1)},
  CloversController: ${JSON.stringify(CloversController, null, 1)},
  ClubToken: ${JSON.stringify(ClubToken, null, 1)},
  ClubTokenController: ${JSON.stringify(ClubTokenController, null, 1)},
  SimpleCloversMarket: ${JSON.stringify(SimpleCloversMarket, null, 1)},
  Support: ${JSON.stringify(Support, null, 1)}
};`

fs.writeFile('index.js', printable, function (err) {
  if (err) throw err;
  console.log('Replaced!');
});