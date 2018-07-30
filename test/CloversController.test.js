var utils = require("web3-utils");
var Reversi = artifacts.require("./Reversi.sol");
var Clovers = artifacts.require("./Clovers.sol");
var CloversMetadata = artifacts.require("./CloversMetadata.sol");
var CloversController = artifacts.require("./CloversController.sol");
var ClubTokenController = artifacts.require("./ClubTokenController.sol");
var ClubToken = artifacts.require("./ClubToken.sol");

const ethPrice = new web3.BigNumber("440");
const oneGwei = new web3.BigNumber("1000000000"); // 1 GWEI
let gasPrice = oneGwei.toString(10);

let stakeAmount = utils.toWei("0.1");
// let stakePeriod = "6000"; // at 15 sec block times this is ~25 hours
let stakePeriod = "10"; // make 10 for speed of tests
let payMultiplier = "10";
let priceMultiplier = "10";
let basePrice = utils.toWei("0.001");

let decimals = "18";

let reserveRatio = "500000"; // parts per million 500000 / 1000000 = 1/2
let virtualBalance = utils.toWei("1000");
let virtualSupply = utils.toWei("1000");

let _ = "        ";

contract("Clovers", async function(accounts) {
  let clovers,
    cloversMetadata,
    clubToken,
    reversi,
    cloversController,
    clubTokenController;
  before(done => {
    (async () => {
      try {
        var totalGas = new web3.BigNumber("0");

        // Deploy Clovers.sol (NFT)
        clovers = await Clovers.new("Clovers", "CLVR");
        var tx = web3.eth.getTransactionReceipt(clovers.transactionHash);

        console.log(_ + "Deploy clovers - " + tx.gasUsed);
        gasToCash(tx.gasUsed);

        totalGas = totalGas.plus(tx.gasUsed);

        // Deploy CloversMetadata.sol
        // -w Clovers address
        cloversMetadata = await CloversMetadata.new(clovers.address);
        var tx = web3.eth.getTransactionReceipt(
          cloversMetadata.transactionHash
        );
        console.log(_ + "Deploy cloversMetadata - " + tx.gasUsed);
        gasToCash(tx.gasUsed);

        totalGas = totalGas.plus(tx.gasUsed);

        // Update Clovers.sol
        // -w CloversMetadata address
        var tx = await clovers.updateCloversMetadataAddress(
          cloversMetadata.address
        );

        console.log(_ + "Update clovers - " + tx.receipt.gasUsed);
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        // Deploy ClubToken.sol (ERC20)
        clubToken = await ClubToken.new("ClubToken", "CLB", decimals);
        var tx = web3.eth.getTransactionReceipt(clubToken.transactionHash);

        console.log(_ + "Deploy clubToken - " + tx.gasUsed);
        gasToCash(tx.gasUsed);

        totalGas = totalGas.plus(tx.gasUsed);

        // Deploy Reversi.sol
        // -link w cloversController
        reversi = await Reversi.new();
        var tx = web3.eth.getTransactionReceipt(reversi.transactionHash);

        console.log(_ + "Deploy reversi - " + tx.gasUsed);
        gasToCash(tx.gasUsed);

        totalGas = totalGas.plus(tx.gasUsed);

        await CloversController.link("Reversi", reversi.address);

        // Deploy ClubTokenController.sol
        // -w ClubToken address
        clubTokenController = await ClubTokenController.new(clubToken.address);
        var tx = web3.eth.getTransactionReceipt(
          clubTokenController.transactionHash
        );

        console.log(_ + "Deploy clubTokenController - " + tx.gasUsed);
        gasToCash(tx.gasUsed);

        totalGas = totalGas.plus(tx.gasUsed);

        // Deploy CloversController.sol
        // -w Clovers address
        // -w ClubToken address
        // -w ClubTokenController address
        cloversController = await CloversController.new(
          clovers.address,
          clubToken.address,
          clubTokenController.address
        );
        var tx = web3.eth.getTransactionReceipt(
          cloversController.transactionHash
        );

        console.log(_ + "Deploy cloversController - " + tx.gasUsed);
        gasToCash(tx.gasUsed);

        totalGas = totalGas.plus(tx.gasUsed);

        // Update Clovers.sol
        // -w CloversController address
        var tx = await clovers.updateCloversControllerAddress(
          cloversController.address
        );

        console.log(
          _ + "clovers.updateCloversControllerAddress - " + tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        // Update ClubToken.sol
        // -w CloversController address
        var tx = await clubToken.updateCloversControllerAddress(
          cloversController.address
        );
        console.log(
          _ + "clubToken.updateCloversControllerAddress - " + tx.receipt.gasUsed
        );

        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        // Update ClubToken.sol
        // -w ClubTokenController address
        var tx = await clubToken.updateClubTokenControllerAddress(
          clubTokenController.address
        );

        console.log(
          _ +
            "clubToken.updateClubTokenControllerAddress - " +
            tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        // Update CloversController.sol
        // -w stakeAmount
        // -w stakePeriod
        // -w payMultiplier
        var tx = await cloversController.updateStakeAmount(stakeAmount);
        console.log(
          _ + "cloversController.updateStakeAmount - " + tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        var tx = await cloversController.updateStakePeriod(stakePeriod);
        console.log(
          _ + "cloversController.updateStakePeriod - " + tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        var tx = await cloversController.updatePayMultipier(payMultiplier);
        console.log(
          _ + "cloversController.updatePayMultipier - " + tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        var tx = await cloversController.updatePriceMultipier(priceMultiplier);
        console.log(
          _ + "cloversController.updatePriceMultipier - " + tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        var tx = await cloversController.updateBasePrice(basePrice);
        console.log(
          _ + "cloversController.updateBasePrice - " + tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        // Update ClubTokenController.sol
        // -w reserveRatio
        // -w virtualSupply
        // -w virtualBalance
        var tx = await clubTokenController.updateReserveRatio(reserveRatio);
        console.log(
          _ + "clubTokenController.updateReserveRatio - " + tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        var tx = await clubTokenController.updateVirtualSupply(virtualSupply);
        console.log(
          _ + "clubTokenController.updateVirtualSupply - " + tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        var tx = await clubTokenController.updateVirtualBalance(virtualBalance);
        console.log(
          _ + "clubTokenController.updateVirtualBalance - " + tx.receipt.gasUsed
        );
        gasToCash(tx.receipt.gasUsed);

        totalGas = totalGas.plus(tx.receipt.gasUsed);

        console.log(_ + totalGas.toFormat(0) + " - Total Gas");
        gasToCash(totalGas);

        done();
      } catch (error) {
        console.log("error:", error);

        done(false);
      }
    })();
  });

  describe("Clovers.sol", function() {
    it("should be able to read metadata", async function() {
      let metadata = await clovers.tokenURI(666);
      let _metadata = await cloversMetadata.tokenURI(666);
      assert(_metadata === metadata, "_metadata != metadata");
    });
  });

  describe("ClubTokenController.sol", function() {
    it("should read parameters that were set", async function() {
      let _reserveRatio = await clubTokenController.reserveRatio();
      assert(
        _reserveRatio.toString(10) === reserveRatio,
        "reserveRatio " +
          _reserveRatio.toString(10) +
          " not equal to " +
          reserveRatio
      );

      let _virtualSupply = await clubTokenController.virtualSupply();
      assert(
        _virtualSupply.toString(10) === virtualSupply,
        "virtualSupply " +
          _virtualSupply.toString(10) +
          " not equal to " +
          virtualSupply
      );

      let _virtualBalance = await clubTokenController.virtualBalance();
      assert(
        _virtualBalance.toString(10) === virtualBalance,
        "virtualBalance " +
          _virtualBalance.toString(10) +
          " not equal to " +
          virtualBalance
      );
    });

    it("should mint new tokens", async function() {
      let _depositAmount = utils.toWei("1");
      let buyer = accounts[5];

      let _virtualSupply = await clubTokenController.virtualSupply();
      let _totalSupply = await clubToken.totalSupply();
      let _supply = _virtualSupply.add(_totalSupply);

      let _virtualBalance = await clubTokenController.virtualBalance();
      let _poolBalance = await clubTokenController.poolBalance();
      let _connectorBalance = _virtualBalance.add(_poolBalance);

      let _connectorWeight = await clubTokenController.reserveRatio();

      let expectedReturn = await clubTokenController.calculatePurchaseReturn(
        _supply,
        _connectorBalance,
        _connectorWeight,
        _depositAmount
      );

      let balanceBefore = await clubToken.balanceOf(buyer);
      try {
        tx = await clubTokenController.buy(buyer, {
          from: buyer,
          value: _depositAmount
        });
        console.log(
          _ + "clubTokenController.buy - " + tx.receipt.cumulativeGasUsed
        );
        gasToCash(tx.receipt.cumulativeGasUsed);
      } catch (error) {
        console.log("error:", error);

        assert(false, "buy tx receipt should not have thrown an error");
      }

      let balanceAfter = await clubToken.balanceOf(buyer);
      assert(
        balanceBefore.add(expectedReturn).toString(10) ===
          balanceAfter.toString(10),
        "balanceBefore plus expectedReturn (" +
          balanceBefore.add(expectedReturn).toString(10) +
          ") did not equal balanceAfter (" +
          balanceAfter.toString(10) +
          ")"
      );
    });
    it("should sell the new tokens", async function() {
      let buyer = accounts[5];
      let _depositAmount = utils.toWei("1");

      let _virtualSupply = await clubTokenController.virtualSupply();
      let _totalSupply = await clubToken.totalSupply();
      let _supply = _virtualSupply.add(_totalSupply);

      let _virtualBalance = await clubTokenController.virtualBalance();
      let _poolBalance = await clubTokenController.poolBalance();
      let _connectorBalance = _virtualBalance.add(_poolBalance);

      let _connectorWeight = await clubTokenController.reserveRatio();

      let _sellAmount = await clubToken.balanceOf(buyer);

      let expectedReturn = await clubTokenController.calculateSaleReturn(
        _supply,
        _connectorBalance,
        _connectorWeight,
        _sellAmount
      );

      let difference = new web3.BigNumber(_depositAmount).sub(expectedReturn);
      assert(
        difference.lte(1),
        "difference of expectedReturn (" +
          expectedReturn.toString(10) +
          ") and _depositAmount (" +
          _depositAmount.toString(10) +
          ") by a margin of more than 1 WEI (" +
          difference.toString(10) +
          ")"
      );

      let balanceBefore = await web3.eth.getBalance(buyer);

      try {
        var tx = await clubTokenController.sell(_sellAmount, {
          from: buyer,
          gasPrice
        });
        console.log(
          _ + "clubTokenController.sell - " + tx.receipt.cumulativeGasUsed
        );
        gasToCash(tx.receipt.cumulativeGasUsed);
      } catch (error) {
        console.log("error:", error);

        assert(false, "sell tx receipt should not have thrown an error");
      }
      gasSpent = tx.receipt.cumulativeGasUsed;
      let gasCost = gasSpent * parseInt(gasPrice);

      let balanceAfter = await web3.eth.getBalance(buyer);

      assert(
        balanceBefore
          .sub(gasCost.toString())
          .add(expectedReturn.toString())
          .toString() === balanceAfter.toString(),
        "balanceBefore (" +
          utils.fromWei(balanceBefore.toString()) +
          ") minus gasCosts (" +
          gasCost.toString() +
          ") plus expectedReturn (" +
          utils.fromWei(expectedReturn.toString()) +
          ") did not equal balanceAfter (" +
          utils.fromWei(balanceAfter.toString()) +
          ")"
      );
    });
  });

  describe("CloversController.sol", function() {
    let balance,
      _balance,
      tx,
      clubBalance,
      gasEstimate,
      newStakeAmount,
      gasSpent;

    let _invalidTokenId = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
    let _invalidMoves = [
      new web3.BigNumber(
        "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
        16
      ),
      new web3.BigNumber(
        "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
        16
      )
    ];

    let _tokenId = "0x55555aa5569955695569555955555555";

    let _moves = [
      new web3.BigNumber(
        "0xb58b552a986549b132451cbcbd69d106af0e3ae6cead82cc297427c3",
        16
      ),
      new web3.BigNumber(
        "0xbb9af45dbeefd78f120678dd7ef4dfe69f3d9bbe7eeddfc7f0000000",
        16
      )
    ];

    it("should convert correctly", async function() {
      let game = await reversi.getGame(_moves);
      let boardUint = await cloversController.convertBytes16ToUint(game[3]);
      assert(
        "0x" + boardUint.toString(16) === _tokenId,
        "_tokenId !== boardUint"
      );
    });

    it("should read parameters that were set", async function() {
      let _stakeAmount = await cloversController.stakeAmount();

      assert(_stakeAmount.toString() === stakeAmount, "stake amount not equal");

      let _stakePeriod = await cloversController.stakePeriod();
      assert(_stakePeriod.toString() === stakePeriod, "stake period not equal");

      let _payMultiplier = await cloversController.payMultiplier();
      assert(
        _payMultiplier.toString() === payMultiplier,
        "payMultiplier not equal"
      );

      let _priceMultiplier = await cloversController.priceMultiplier();
      assert(
        _priceMultiplier.toString() === priceMultiplier,
        "priceMultiplier not equal"
      );

      let _basePrice = await cloversController.basePrice();
      assert(_basePrice.toString() === basePrice, "basePrice not equal");
    });

    it("should make sure token doesn't exist", async function() {
      balance = web3.eth.getBalance(accounts[0]);
      try {
        await clovers.ownerOf(_tokenId);
      } catch (error) {
        assert(true, "ownerOf should have failed while no one owns it");
      }
    });

    it("should make sure claimClover (_keep = false) is successful using valid game w/ invalid symmetries", async function() {
      try {
        let options = [
          _moves,
          new web3.BigNumber(_tokenId, 16),
          new web3.BigNumber("0x1F", 16), // invalid symmetries
          false,
          {
            value: new web3.BigNumber(stakeAmount),
            gasPrice
          }
        ];

        tx = await cloversController.claimClover(...options);
        console.log(
          _ + "cloversController.claimClover - " + tx.receipt.cumulativeGasUsed
        );
        gasToCash(tx.receipt.cumulativeGasUsed);

        gasSpent = tx.receipt.cumulativeGasUsed;
        assert(
          new web3.BigNumber(tx.receipt.status).eq(1),
          "claimClover tx receipt should have been 0x01 (successful) but was instead " +
            tx.receipt.status
        );
      } catch (error) {
        console.log("error:", error);
        assert(false, "claimClover tx receipt should not have thrown an error");
      }
    });

    it("should make sure stake amount was removed from your account", async function() {
      let gasCost = gasSpent * parseInt(gasPrice);
      _balance = web3.eth.getBalance(accounts[0]);
      assert(
        balance
          .sub(_balance)
          .sub(gasCost)
          .eq(stakeAmount),
        "original balance " +
          web3.fromWei(balance).toString() +
          " minus new balance " +
          web3.fromWei(_balance).toString() +
          " minus gas " +
          web3.fromWei(gasCost).toString() +
          " did not equal stakeAmount " +
          web3.fromWei(stakeAmount).toString()
      );
    });

    it("should make sure it's not verified yet", async function() {
      let isVerified = await cloversController.isVerified(_tokenId, {
        from: accounts[1]
      });
      assert(!isVerified, "clover is already verified somehow");
    });

    it("should check the cost of challenging this clover w invalid symmetries", async function() {
      try {
        gasEstimate = await cloversController.challengeClover.estimateGas(
          _tokenId
        );
        console.log(_ + "challengeClover gasEstimate", gasEstimate.toString());
        gasToCash(gasEstimate.toString());
      } catch (error) {
        console.log("error:", error);

        assert(
          false,
          "cloversController.challengeClover should have succeeded"
        );
      }
    });

    it("should update the stake amount with the gas Estimate from challengeClover", async function() {
      try {
        newStakeAmount = new web3.BigNumber(gasEstimate).mul(gasPrice).mul(40);
        tx = await cloversController.updateStakeAmount(newStakeAmount, {
          gasPrice
        });

        console.log(
          _ +
            "cloversController.updateStakeAmount - " +
            tx.receipt.cumulativeGasUsed
        );
        gasToCash(tx.receipt.cumulativeGasUsed);

        gasSpent += tx.receipt.cumulativeGasUsed;
        assert(
          new web3.BigNumber(tx.receipt.status).eq(1),
          "updateStakeAmount tx receipt should have been 0x01 (successful) but was instead " +
            tx.receipt.status
        );
      } catch (error) {
        console.log("error:", error);

        assert(false, "updateStakeAmount tx should not have thrown an error");
      }
    });

    it("should check the stake amount for the token in question", async function() {
      let _movesHashSol = await cloversController.getMovesHash(_tokenId);
      let currentStake = await cloversController.getStake(_movesHashSol);
      assert(
        currentStake.toString() === stakeAmount,
        "currentStake " +
          currentStake.toString() +
          " doest not equal stakeAmount " +
          stakeAmount
      );
    });

    it("should make sure it is verified after blocks increase", async function() {
      await increaseBlocks(stakePeriod);
      isVerified = await cloversController.isVerified(_tokenId, {
        from: accounts[1]
      });
      assert(
        isVerified,
        "clover wasn't verified when it should have been already"
      );
      clubBalance = await clubToken.balanceOf(accounts[0]);
    });

    it("should make sure retrieveStake tx was successful", async function() {
      try {
        tx = await cloversController.retrieveStake(_tokenId, { gasPrice });

        console.log(
          _ +
            "cloversController.retrieveStake - " +
            tx.receipt.cumulativeGasUsed
        );
        gasToCash(tx.receipt.cumulativeGasUsed);

        gasSpent += tx.receipt.cumulativeGasUsed;
        assert(
          new web3.BigNumber(tx.receipt.status).eq(1),
          "retrieveStake tx receipt should have been 0x01 (successful) but was instead " +
            tx.receipt.status
        );
      } catch (error) {
        console.log("error:", error);

        assert(false, "retrieveStake tx should not have thrown an error");
      }
    });

    it("should make sure token exists & is owned by this clovers contract", async function() {
      try {
        let owner = await clovers.ownerOf(_tokenId);
        assert(
          clovers.address === owner,
          "owner of token should have been clovers.address (" +
            accounts[0] +
            ") but was " +
            owner
        );
      } catch (error) {
        console.log("error:", error);

        assert(false, "ownerOf should have succeeded");
      }
    });

    it("should make sure reward was received", async function() {
      let _clubBalance = await clubToken.balanceOf(accounts[0]);
      assert(
        _clubBalance.gt(clubBalance),
        "new balance of " +
          _clubBalance.toString() +
          " is not more than previous Balance of " +
          clubBalance.toString()
      );
    });

    it("should make sure stake amount was retured to your account", async function() {
      gasCost = gasSpent * gasPrice;
      _balance = web3.eth.getBalance(accounts[0]);
      let result = balance.minus(gasCost);
      assert(
        result.eq(_balance),
        "original balance " +
          web3.fromWei(balance).toString() +
          " minus all gas costs " +
          web3.fromWei(gasCost).toString() +
          " did not equal new balance " +
          web3.fromWei(_balance).toString() +
          " but rather " +
          result.toString()
      );
    });
  });
});

function gasToCash(totalGas) {
  web3.BigNumber.config({ DECIMAL_PLACES: 2, ROUNDING_MODE: 4 });

  if (typeof totalGas !== "object") totalGas = new web3.BigNumber(totalGas);
  let lowGwei = oneGwei.mul(new web3.BigNumber("8"));
  let highGwei = oneGwei.mul(new web3.BigNumber("20"));
  let ethPrice = new web3.BigNumber("450");

  console.log(
    _ +
      _ +
      "$" +
      new web3.BigNumber(utils.fromWei(totalGas.mul(lowGwei).toString()))
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
      new web3.BigNumber(utils.fromWei(totalGas.mul(highGwei).toString()))
        .mul(ethPrice)
        .toFixed(2) +
      " @ 20 GWE & " +
      ethPrice +
      "/USD"
  );
}

function getBlockNumber() {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}

async function increaseTime(amount) {
  let currentBlock = await new Promise(resolve =>
    web3.eth.getBlockNumber((err, result) => resolve(result))
  );
  let getBlock = await web3.eth.getBlock(currentBlock);
  // console.log("timestamp", getBlock.timestamp);
  await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [amount],
    id: 0
  });
  await increaseBlock();
  currentBlock = await new Promise(resolve =>
    web3.eth.getBlockNumber((err, result) => resolve(result))
  );
  getBlock = await web3.eth.getBlock(currentBlock);
  // console.log("timestamp", getBlock.timestamp);
}

function increaseBlocks(blocks) {
  return new Promise((resolve, reject) => {
    increaseBlock().then(() => {
      blocks -= 1;
      if (blocks == 0) {
        resolve();
      } else {
        increaseBlocks(blocks).then(resolve);
      }
    });
  });
}

function increaseBlock() {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        id: 12345
      },
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
}

function decodeEventString(hexVal) {
  return hexVal
    .match(/.{1,2}/g)
    .map(a =>
      a
        .toLowerCase()
        .split("")
        .reduce(
          (result, ch) => result * 16 + "0123456789abcdefgh".indexOf(ch),
          0
        )
    )
    .map(a => String.fromCharCode(a))
    .join("");
}
