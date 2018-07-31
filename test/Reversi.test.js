var utils = require("web3-utils");
var Reversi_ = artifacts.require("./Reversi.sol");
var ReversiMock = artifacts.require("./mocks/ReversiMock.sol");
var Reversi = require("clovers-reversi").default;
const gasToCash = require("./helpers/utils").gasToCash;
const _ = require("../helpers/utils")._;

contract("Reversi", async function(accounts) {
  let reversi, reversiMock;
  before(done => {
    (async () => {
      try {
        reversi = await Reversi_.new();

        await ReversiMock.link("Reversi", reversi.address);
        reversiMock = await ReversiMock.new();
        done();
      } catch (error) {
        console.error(error);
        done(false);
      }
    })();
  });

  describe("Reversi.sol", function() {
    let _realTokenId = "0x5555555565556955695566955aa55555";
    let _realMoves = [
      new web3.BigNumber(
        "0xb58b552a986549b132451cbcbd69d106af0e3ae6cead82cc297427c3",
        16
      ),
      new web3.BigNumber(
        "0xbb9af45dbeefd78f120678dd7ef4dfe69f3d9bbe7eeddfc7f0000000",
        16
      )
    ];
    let _emptyMoves = [
      new web3.BigNumber("0x0", 16),
      new web3.BigNumber("0x0", 16)
    ];

    let invalid_lastMove =
      "C4C5C6C3E3B5C2B2A4E2A2B3F5C7C8B6A6B1F3A7B7D6F2G2G3A5B4C1D2A3H2D1F4G5G4F1F6D8H4H3H1E1A1H5G1F7F8E7H6B8D3D7E6G6E8G8G7H7A8A2";
    let valid_emptySquares = "C4C3C2C5E6F4C6F6G4D6G6E3E2";

    it("should get cost to play a game", async function() {
      let tx = await reversiMock.logGame(_realMoves);
      console.log(_ + "reversiMock.logGame - " + tx.receipt.gasUsed);
      gasToCash(tx.receipt.gasUsed);
    });

    it("should play a valid game without error", async function() {
      let isValid = await reversi.isValid(_realMoves);
      assert(isValid, "Game was not valid");
    });
    it("should play a valid game with empty squares without error", async function() {
      var r = new Reversi();
      r.playGameMovesString(valid_emptySquares);
      let moves = [
        new web3.BigNumber(r.byteFirst32Moves, 16),
        new web3.BigNumber(r.byteLastMoves, 16)
      ];
      let isValid = await reversi.isValid(moves);
      assert(isValid, "Game was not valid");
    });
    it("should fail when plaing empty moves game", async function() {
      let isValid = await reversi.isValid(_emptyMoves);
      assert(!isValid, "Game was in fact valid");
    });
    it("should fail when plaing game where last move is invalid", async function() {
      var r = new Reversi();
      r.playGameMovesString(invalid_lastMove);
      let moves = [
        new web3.BigNumber(r.byteFirst32Moves, 16),
        new web3.BigNumber(r.byteLastMoves, 16)
      ];
      let isValid = await reversi.isValid(moves);
      assert(!isValid, "Game was in fact valid");
    });
  });
});
