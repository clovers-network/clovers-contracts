const utils = require("web3-utils");
const BigNumber = require("bignumber.js");
const oneGwei = new BigNumber("1000000000"); // 1 GWEI
const _ = "        ";

module.exports = {
  _,
  gasToCash: function(totalGas, web3) {
    BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: 4 });

    if (typeof totalGas !== "object") totalGas = new BigNumber(totalGas);
    let lowGwei = oneGwei.mul(new BigNumber("8"));
    let highGwei = oneGwei.mul(new BigNumber("20"));
    let ethPrice = new BigNumber("450");

    console.log(
      _ +
        _ +
        "$" +
        new BigNumber(utils.fromWei(totalGas.mul(lowGwei).toString()))
          .mul(ethPrice)
          .toFixed(2) +
        " @ 8 GWE & " +
        ethPrice +
        "/USD"
    );
    console.log(
      _ +
        _ +
        "$" +
        new BigNumber(utils.fromWei(totalGas.mul(highGwei).toString()))
          .mul(ethPrice)
          .toFixed(2) +
        " @ 20 GWE & " +
        ethPrice +
        "/USD"
    );
  }
};
