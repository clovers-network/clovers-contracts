var utils = require('web3-utils')
var Reversi_ = artifacts.require('./Reversi.sol')
var ReversiMock = artifacts.require('./mocks/ReversiMock.sol')
var Reversi = require('clovers-reversi').default
const gasToCash = require('../helpers/utils').gasToCash
const _ = require('../helpers/utils')._
var assert = require('assert');

const { contract } = require("@nomiclabs/buidler")

contract('Reversi', async (accounts)=>  {
  let reversi, reversiMock
  before(done => {
    ;(async () => {
      try {
        reversi = await Reversi_.new()
        reversiMock = await ReversiMock.new()
        done()
      } catch (error) {
        console.error(error)
        done(false)
      }
    })()
  })

  describe('Reversi.sol', () => {
    let _realTokenId = '0x55555aa5569955695569555955555555'
    let _realMoves = [
        '0xb58b552a986549b132451cbcbd69d106af0e3ae6cead82cc297427c3',
        '0xbb9af45dbeefd78f120678dd7ef4dfe69f3d9bbe7eeddfc7f0000000',
    ]
    let _emptyMoves = [
      '0x0',
      '0x0'
    ]

    let invalid_lastMove =
      'C4C5C6C3E3B5C2B2A4E2A2B3F5C7C8B6A6B1F3A7B7D6F2G2G3A5B4C1D2A3H2D1F4G5G4F1F6D8H4H3H1E1A1H5G1F7F8E7H6B8D3D7E6G6E8G8G7H7A8A2'
    let valid_emptySquares = 'C4C3C2C5E6F4C6F6G4D6G6E3E2'
    let invalid_swap_color = 'C4F5'
    let valid_game_invalid_start = 'D3C3C4C5B3D2C2B2B4E3E2A4F3G3E6F5B5E1D6D7F4G4G5C6F2H5F6G6H4G2H2H3F7F8H6A3A2H1G1F1D1C1B1A1H7G7H8E7D8C7B8C8E8G8B7B6A5A7A8A6'

    it('should have correct emptyBoard', async () => {
      // function returnTile (bytes16 board, uint8 col, uint8 row) public pure returns (uint8){
      let emptyBoard = await reversi.emptyBoard()
      assert(emptyBoard === '0xfffffffffffffe7ffdbfffffffffffff', `empty board is wrong ${emptyBoard}`)
      // console.log({emptyBoard})
      // reversi.returnTile()
    })

    it('should get a game', async () => {
      let game = await reversi.getGame(_realMoves)
      assert(game.complete && !game.error, `game had an error`)
      assert(game.board === _realTokenId, `token IDs did not match ${game.board} !== ${_realTokenId}`)
      // console.log({game})

    })

    it('should return symmetricals correctly', async () => {
      let result, rResult
      let r = new Reversi()
      for (let i = 0; i < 2; i ++) {
        for (let j = 0; j < 2; j ++) {
          for (let k = 0; k < 2; k++) {
            for (let l = 0; l < 2; l ++) {
              for (let m = 0; m < 2; m ++) {
                result = await reversi.returnSymmetricals(i == 0, j == 0, k == 0, l == 0, m == 0)
                r.RotSym = i == 0
                r.Y0Sym = j == 0
                r.X0Sym = k == 0
                r.XYSym = l == 0
                r.XnYSym = m == 0
                rResult = r.returnSymmetriesAsBN()
                // console.log(i == 0, j == 0, k == 0, l == 0, m == 0, result.toString(2).padStart(5, '0'), rResult.toString(2).padStart(5, '0'))
                assert(rResult.toString(2) === result.toString(2), `Results were different: ${result.toString(2).padStart(5, '0')} and ${rResult.toString(2).padStart(5, '0')}`)
              }
            }
          }
        }
      }

    })

    it('should get cost to play a game', async () => {
      let tx = await reversiMock.logGame(_realMoves)
      console.log(_ + 'reversiMock.logGame - ' + tx.receipt.gasUsed)
      gasToCash(tx.receipt.gasUsed)
    })

    it('should play a valid game without error', async () => {
      let isValid = await reversi.isValid(_realMoves)
      assert(isValid, 'Game was not valid')
    })
    it('should play a valid game with empty squares without error', async () => {
      var r = new Reversi()
      r.playGameMovesString(valid_emptySquares)
      let moves = [
       '0x' + r.byteFirst32Moves,
       '0x' + r.byteLastMoves
      ]
      let isValid = await reversi.isValid(moves)
      assert(isValid, 'Game was not valid')
    })
    it('should fail when plaing empty moves game', async () => {
      let isValid = await reversi.isValid(_emptyMoves)
      assert(!isValid, 'Game was in fact valid')
    })
    it('should fail when plaing game where last move is invalid', async () => {
      var r = new Reversi()
      r.playGameMovesString(invalid_lastMove)
      let moves = [
        '0x' + r.byteFirst32Moves,
        '0x' + r.byteLastMoves
      ]
      let isValid = await reversi.isValid(moves)
      assert(!isValid, 'Game was in fact valid')
    })
    it('should fail when playing game with swapping player colors', async () => {
      var r = new Reversi()
      r.playGameMovesString(invalid_swap_color)
      let moves = [
        '0x' + r.byteFirst32Moves,
        '0x' + r.byteLastMoves
      ]
      let isValid = await reversi.isValid(moves)
      assert(!isValid, 'Game was in fact valid')
    })
    it('should fail when playing valid game with invalid start', async () => {
      var r = new Reversi()
      r.playGameMovesString(valid_game_invalid_start)
      let moves = [
        '0x' + r.byteFirst32Moves,
        '0x' + r.byteLastMoves
      ]
      let isValid = await reversi.isValid(moves)
      assert(!isValid, 'Game was in fact valid')
    })
  })
})
