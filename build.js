var fs = require('fs');
var Clovers = require("./build/contracts/Clovers.json");
var CloversController = require("./build/contracts/CloversController.json");
// var CloversMetadata = require("./build/contracts/CloversMetadata.json");
var ClubToken = require("./build/contracts/ClubToken.json");
var ClubTokenController = require("./build/contracts/ClubTokenController.json");
// var IClovers = require("./build/contracts/IClovers.json");
// var ICloversController = require("./build/contracts/ICloversController.json");
// var Reversi = require("./build/contracts/Reversi.json");
var SimpleCloversMarket = require("./build/contracts/SimpleCloversMarket.json");
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
  CurationMarket: ${JSON.stringify(CurationMarket)}
};`

fs.writeFile('index.js', printable, function (err) {
  if (err) throw err;
  console.log('Replaced!');
});