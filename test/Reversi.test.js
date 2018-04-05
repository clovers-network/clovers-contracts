var utils = require('web3-utils')
var Reversi_ = artifacts.require("./Reversi.sol")
var ReversiMock = artifacts.require("./mocks/ReversiMock.sol")
var Reversi = require('clovers-reversi')
let _ = '        '

contract('Reversi', async function(accounts)  {
  let reversi, reversiMock
  before((done) => {
    (async () => {
      try {
        reversi = await Reversi_.new();

        await ReversiMock.link('Reversi', reversi.address)
        reversiMock = await ReversiMock.new()
        done()
      } catch (error) {
        console.error(error)
        done(false)
      }
    })()
  })

  describe('Reversi.sol', function () {
    let _realTokenId = '0x5555555565556955695566955aa55555'
    let _realMoves = [
      new web3.BigNumber('0xcb76aedd77baf6cfcfbeeb5362d6affb54f9d53971d37f37de9bf87c', 16),
      new web3.BigNumber('0xc5670faa513068f1effd8f32a14ba11b64ca7461c193223c00000000', 16)
    ]    
    let _emptyMoves = [
      new web3.BigNumber('0x0', 16),
      new web3.BigNumber('0x0', 16)
    ]

    let invalid_lastMove = 'F5F4F3F6D6G4F7G7H5D7H7G6C4F2F1G3H3G8C6H2G2E3C7B7B6H4G5F8E7H6A7E8C5B4B5C8C3E1A5A6A8D8H8A4B8C2C1D2A3G1E6E2D3B3D1B1B2A2H1A2' 
    let valid_emptySquares = 'E6F6G6D6C4E3C6C3E2C5C2F4G4' 

    it('should play a valid game without error', async function () {
        let isValid = await reversi.isValid(_realMoves)
        assert(isValid, 'Game was not valid')
    })
    it('should play a valid game with empty squares without error', async function () {
        var r = new Reversi()
        r.playGameMovesString(valid_emptySquares)
        let moves = [
          new web3.BigNumber(r.byteFirst32Moves, 16),
          new web3.BigNumber(r.byteLastMoves, 16)
        ]
        let isValid = await reversi.isValid(moves)
        assert(isValid, 'Game was not valid')
    })
    it('should fail when plaing empty moves game', async function () {
        let isValid = await reversi.isValid(_emptyMoves)
        assert(!isValid, 'Game was in fact valid')
    })
    it('should fail when plaing game where last move is invalid', async function () {
        var r = new Reversi()
        r.playGameMovesString(invalid_lastMove)
        let moves = [
          new web3.BigNumber(r.byteFirst32Moves, 16),
          new web3.BigNumber(r.byteLastMoves, 16)
        ]
        let isValid = await reversi.isValid(moves)
        assert(!isValid, 'Game was in fact valid')
    })
  })

})