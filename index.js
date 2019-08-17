module.exports = {
  Clovers: {
 "abi": [
  {
   "constant": true,
   "inputs": [
    {
     "name": "_interfaceId",
     "type": "bytes4"
    }
   ],
   "name": "supportsInterface",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "name",
   "outputs": [
    {
     "name": "",
     "type": "string"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "getApproved",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "approve",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "cloversController",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "totalSupply",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "InterfaceId_ERC165",
   "outputs": [
    {
     "name": "",
     "type": "bytes4"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_from",
     "type": "address"
    },
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "transferFrom",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_admin",
     "type": "address"
    }
   ],
   "name": "isAdmin",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_owner",
     "type": "address"
    },
    {
     "name": "_index",
     "type": "uint256"
    }
   ],
   "name": "tokenOfOwnerByIndex",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_from",
     "type": "address"
    },
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "safeTransferFrom",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "name": "admins",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "exists",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_index",
     "type": "uint256"
    }
   ],
   "name": "tokenByIndex",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "totalSymmetries",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_newAdmin",
     "type": "address"
    }
   ],
   "name": "transferAdminship",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "ownerOf",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_previousAdmin",
     "type": "address"
    }
   ],
   "name": "renounceAdminship",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "name": "clovers",
   "outputs": [
    {
     "name": "keep",
     "type": "bool"
    },
    {
     "name": "symmetries",
     "type": "uint256"
    },
    {
     "name": "blockMinted",
     "type": "uint256"
    },
    {
     "name": "rewards",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_owner",
     "type": "address"
    }
   ],
   "name": "balanceOf",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "renounceOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "cloversMetadata",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "owner",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "symbol",
   "outputs": [
    {
     "name": "",
     "type": "string"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_approved",
     "type": "bool"
    }
   ],
   "name": "setApprovalForAll",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "clubTokenController",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_from",
     "type": "address"
    },
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_tokenId",
     "type": "uint256"
    },
    {
     "name": "_data",
     "type": "bytes"
    }
   ],
   "name": "safeTransferFrom",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_owner",
     "type": "address"
    },
    {
     "name": "_operator",
     "type": "address"
    }
   ],
   "name": "isApprovedForAll",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_newOwner",
     "type": "address"
    }
   ],
   "name": "transferOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "inputs": [
    {
     "name": "name",
     "type": "string"
    },
    {
     "name": "symbol",
     "type": "string"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "constructor"
  },
  {
   "payable": true,
   "stateMutability": "payable",
   "type": "fallback"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipRenounced",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "newOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipTransferred",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousAdmin",
     "type": "address"
    }
   ],
   "name": "AdminshipRenounced",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousAdmin",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "newAdmin",
     "type": "address"
    }
   ],
   "name": "AdminshipTransferred",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "_from",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "_to",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "Transfer",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "_owner",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "_approved",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "Approval",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "_owner",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "_operator",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "_approved",
     "type": "bool"
    }
   ],
   "name": "ApprovalForAll",
   "type": "event"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "implementation",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "tokenURI",
   "outputs": [
    {
     "name": "_infoUrl",
     "type": "string"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "moves",
     "type": "bytes28[2]"
    }
   ],
   "name": "getHash",
   "outputs": [
    {
     "name": "",
     "type": "bytes32"
    }
   ],
   "payable": false,
   "stateMutability": "pure",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "getKeep",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "getBlockMinted",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "getCloverMoves",
   "outputs": [
    {
     "name": "",
     "type": "bytes28[2]"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "getReward",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "getSymmetries",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "getAllSymmetries",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    },
    {
     "name": "",
     "type": "uint256"
    },
    {
     "name": "",
     "type": "uint256"
    },
    {
     "name": "",
     "type": "uint256"
    },
    {
     "name": "",
     "type": "uint256"
    },
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_amount",
     "type": "uint256"
    }
   ],
   "name": "moveEth",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_amount",
     "type": "uint256"
    },
    {
     "name": "_token",
     "type": "address"
    }
   ],
   "name": "moveToken",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_amount",
     "type": "uint256"
    },
    {
     "name": "_token",
     "type": "address"
    }
   ],
   "name": "approveToken",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    },
    {
     "name": "value",
     "type": "bool"
    }
   ],
   "name": "setKeep",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    },
    {
     "name": "value",
     "type": "uint256"
    }
   ],
   "name": "setBlockMinted",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    },
    {
     "name": "moves",
     "type": "bytes28[2]"
    }
   ],
   "name": "setCloverMoves",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    },
    {
     "name": "_amount",
     "type": "uint256"
    }
   ],
   "name": "setReward",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    },
    {
     "name": "_symmetries",
     "type": "uint256"
    }
   ],
   "name": "setSymmetries",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_totalSymmetries",
     "type": "uint256"
    },
    {
     "name": "RotSym",
     "type": "uint256"
    },
    {
     "name": "Y0Sym",
     "type": "uint256"
    },
    {
     "name": "X0Sym",
     "type": "uint256"
    },
    {
     "name": "XYSym",
     "type": "uint256"
    },
    {
     "name": "XnYSym",
     "type": "uint256"
    }
   ],
   "name": "setAllSymmetries",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "deleteClover",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_cloversController",
     "type": "address"
    }
   ],
   "name": "updateCloversControllerAddress",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_cloversMetadata",
     "type": "address"
    }
   ],
   "name": "updateCloversMetadataAddress",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_clubTokenController",
     "type": "address"
    }
   ],
   "name": "updateClubTokenController",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "mint",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tos",
     "type": "address[]"
    },
    {
     "name": "_tokenIds",
     "type": "uint256[]"
    },
    {
     "name": "_movess",
     "type": "bytes28[2][]"
    },
    {
     "name": "_symmetries",
     "type": "uint256[]"
    }
   ],
   "name": "mintMany",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "unmint",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  }
 ],
 "networks": {
  "1": {
   "events": {
    "0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipRenounced",
     "type": "event"
    },
    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipTransferred",
     "type": "event"
    },
    "0x1a2dbeec1a0714342f862f53c671a69a6cb438bf5aa44fc01a7ccff6fbde85ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipRenounced",
     "type": "event"
    },
    "0x2931ebb3d190545dcf6801c37aa686b74f2e1000e753d0fac6e471a2aa5a6213": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipTransferred",
     "type": "event"
    },
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "_from",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_to",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_tokenId",
       "type": "uint256"
      }
     ],
     "name": "Transfer",
     "type": "event"
    },
    "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "_owner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_approved",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_tokenId",
       "type": "uint256"
      }
     ],
     "name": "Approval",
     "type": "event"
    },
    "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "_owner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_operator",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "_approved",
       "type": "bool"
      }
     ],
     "name": "ApprovalForAll",
     "type": "event"
    }
   },
   "links": {},
   "address": "0xb55c5cac5014c662fdbf21a2c59cd45403c482fd",
   "transactionHash": null
  },
  "4": {
   "events": {
    "0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipRenounced",
     "type": "event"
    },
    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipTransferred",
     "type": "event"
    },
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "_from",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_to",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_tokenId",
       "type": "uint256"
      }
     ],
     "name": "Transfer",
     "type": "event"
    },
    "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "_owner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_approved",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_tokenId",
       "type": "uint256"
      }
     ],
     "name": "Approval",
     "type": "event"
    },
    "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "_owner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_operator",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "_approved",
       "type": "bool"
      }
     ],
     "name": "ApprovalForAll",
     "type": "event"
    },
    "0x1a2dbeec1a0714342f862f53c671a69a6cb438bf5aa44fc01a7ccff6fbde85ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipRenounced",
     "type": "event"
    },
    "0x2931ebb3d190545dcf6801c37aa686b74f2e1000e753d0fac6e471a2aa5a6213": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipTransferred",
     "type": "event"
    }
   },
   "links": {},
   "address": "0xe312398f2741e2ab4c0c985c8d91adcc4a995a59",
   "transactionHash": null
  },
  "42": {
   "events": {
    "0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipRenounced",
     "type": "event"
    },
    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipTransferred",
     "type": "event"
    },
    "0x1a2dbeec1a0714342f862f53c671a69a6cb438bf5aa44fc01a7ccff6fbde85ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipRenounced",
     "type": "event"
    },
    "0x2931ebb3d190545dcf6801c37aa686b74f2e1000e753d0fac6e471a2aa5a6213": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipTransferred",
     "type": "event"
    },
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "_from",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_to",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_tokenId",
       "type": "uint256"
      }
     ],
     "name": "Transfer",
     "type": "event"
    },
    "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "_owner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_approved",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_tokenId",
       "type": "uint256"
      }
     ],
     "name": "Approval",
     "type": "event"
    },
    "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "_owner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "_operator",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "_approved",
       "type": "bool"
      }
     ],
     "name": "ApprovalForAll",
     "type": "event"
    }
   },
   "links": {},
   "address": "0xe05e2bdc5a003515b8b4f4901dd0da495b6f6c96",
   "transactionHash": null
  }
 }
},
  CloversController: {
 "abi": [
  {
   "constant": true,
   "inputs": [],
   "name": "clovers",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "token",
     "type": "address"
    }
   ],
   "name": "reclaimToken",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "payMultiplier",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "bytes32"
    }
   ],
   "name": "commits",
   "outputs": [
    {
     "name": "collected",
     "type": "bool"
    },
    {
     "name": "stake",
     "type": "uint256"
    },
    {
     "name": "committer",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "paused",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "stakeAmount",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "renounceOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "curationMarket",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "oracle",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "owner",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "simpleCloversMarket",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "reclaimEther",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "clubTokenController",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "from_",
     "type": "address"
    },
    {
     "name": "value_",
     "type": "uint256"
    },
    {
     "name": "data_",
     "type": "bytes"
    }
   ],
   "name": "tokenFallback",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "stakePeriod",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "basePrice",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "priceMultiplier",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "clubToken",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_newOwner",
     "type": "address"
    }
   ],
   "name": "transferOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "inputs": [
    {
     "name": "_clovers",
     "type": "address"
    },
    {
     "name": "_clubToken",
     "type": "address"
    },
    {
     "name": "_clubTokenController",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "constructor"
  },
  {
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "fallback"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": false,
     "name": "movesHash",
     "type": "bytes32"
    },
    {
     "indexed": false,
     "name": "owner",
     "type": "address"
    }
   ],
   "name": "cloverCommitted",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": false,
     "name": "moves",
     "type": "bytes28[2]"
    },
    {
     "indexed": false,
     "name": "tokenId",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "owner",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "stake",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "reward",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "symmetries",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "keep",
     "type": "bool"
    }
   ],
   "name": "cloverClaimed",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": false,
     "name": "tokenId",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "owner",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "stake",
     "type": "uint256"
    }
   ],
   "name": "stakeRetrieved",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": false,
     "name": "moves",
     "type": "bytes28[2]"
    },
    {
     "indexed": false,
     "name": "tokenId",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "owner",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "challenger",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "stake",
     "type": "uint256"
    }
   ],
   "name": "cloverChallenged",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipRenounced",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "newOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipTransferred",
   "type": "event"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "movesHash",
     "type": "bytes32"
    }
   ],
   "name": "getStake",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "movesHash",
     "type": "bytes32"
    }
   ],
   "name": "getCommit",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "getMovesHash",
   "outputs": [
    {
     "name": "",
     "type": "bytes32"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "moves",
     "type": "bytes28[2]"
    }
   ],
   "name": "isValid",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "error",
     "type": "bool"
    },
    {
     "name": "complete",
     "type": "bool"
    }
   ],
   "name": "isValidGame",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "pure",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "isVerified",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_symmetries",
     "type": "uint256"
    }
   ],
   "name": "calculateReward",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_symmetries",
     "type": "uint256"
    }
   ],
   "name": "getPrice",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "moves",
     "type": "bytes28[2]"
    },
    {
     "name": "_tokenId",
     "type": "uint256"
    },
    {
     "name": "_symmetries",
     "type": "uint256"
    },
    {
     "name": "_keep",
     "type": "bool"
    }
   ],
   "name": "claimClover",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": true,
   "stateMutability": "payable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "retrieveStake",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": true,
   "stateMutability": "payable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_board",
     "type": "bytes16"
    }
   ],
   "name": "convertBytes16ToUint",
   "outputs": [
    {
     "name": "number",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "challengeClover",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_from",
     "type": "address"
    },
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "transferFrom",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_paused",
     "type": "bool"
    }
   ],
   "name": "updatePaused",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_curationMarket",
     "type": "address"
    }
   ],
   "name": "updateCurationMarket",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_oracle",
     "type": "address"
    }
   ],
   "name": "updateOracle",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_simpleCloversMarket",
     "type": "address"
    }
   ],
   "name": "updateSimpleCloversMarket",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_clubTokenController",
     "type": "address"
    }
   ],
   "name": "updateClubTokenController",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_stakeAmount",
     "type": "uint256"
    }
   ],
   "name": "updateStakeAmount",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_stakePeriod",
     "type": "uint256"
    }
   ],
   "name": "updateStakePeriod",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_payMultiplier",
     "type": "uint256"
    }
   ],
   "name": "updatePayMultipier",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_priceMultiplier",
     "type": "uint256"
    }
   ],
   "name": "updatePriceMultipier",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_basePrice",
     "type": "uint256"
    }
   ],
   "name": "updateBasePrice",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "movesHash",
     "type": "bytes32"
    },
    {
     "name": "committer",
     "type": "address"
    }
   ],
   "name": "_setCommit",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  }
 ],
 "networks": {
  "1": {
   "events": {},
   "links": {
    "Reversi": "0xd6e4737118f6d12468edb0746755281e223eaaaa"
   },
   "address": "0x521d32f3d23f1fc82b1dbe306edc3ef668e5d973",
   "transactionHash": null
  },
  "4": {
   "events": {},
   "links": {
    "Reversi": "0xbff258e5c379ac4fe61ac005f4f341476a2ab180"
   },
   "address": "0x6485744704ec0775e3f39d9e9544afaf8b7c7955",
   "transactionHash": null
  },
  "42": {
   "events": {},
   "links": {
    "Reversi": "0xad82a0cd12c8d7a632190eae388b2c00cd3c58e9"
   },
   "address": "0xf0c6d63656e012dbd3bc017176c75d08360dcd55",
   "transactionHash": null
  }
 }
},
  ClubToken: {
 "abi": [
  {
   "constant": true,
   "inputs": [],
   "name": "mintingFinished",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "name",
   "outputs": [
    {
     "name": "",
     "type": "string"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_spender",
     "type": "address"
    },
    {
     "name": "_value",
     "type": "uint256"
    }
   ],
   "name": "approve",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "cloversController",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "totalSupply",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "decimals",
   "outputs": [
    {
     "name": "",
     "type": "uint8"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_amount",
     "type": "uint256"
    }
   ],
   "name": "mint",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_spender",
     "type": "address"
    },
    {
     "name": "_subtractedValue",
     "type": "uint256"
    }
   ],
   "name": "decreaseApproval",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_owner",
     "type": "address"
    }
   ],
   "name": "balanceOf",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "renounceOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "finishMinting",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "owner",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "symbol",
   "outputs": [
    {
     "name": "",
     "type": "string"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "clubTokenController",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_value",
     "type": "uint256"
    }
   ],
   "name": "transfer",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_spender",
     "type": "address"
    },
    {
     "name": "_addedValue",
     "type": "uint256"
    }
   ],
   "name": "increaseApproval",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_owner",
     "type": "address"
    },
    {
     "name": "_spender",
     "type": "address"
    }
   ],
   "name": "allowance",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_newOwner",
     "type": "address"
    }
   ],
   "name": "transferOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "inputs": [
    {
     "name": "_name",
     "type": "string"
    },
    {
     "name": "_symbol",
     "type": "string"
    },
    {
     "name": "_decimals",
     "type": "uint8"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "constructor"
  },
  {
   "payable": true,
   "stateMutability": "payable",
   "type": "fallback"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "burner",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "value",
     "type": "uint256"
    }
   ],
   "name": "Burn",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "to",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "amount",
     "type": "uint256"
    }
   ],
   "name": "Mint",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [],
   "name": "MintFinished",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipRenounced",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "newOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipTransferred",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "owner",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "spender",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "value",
     "type": "uint256"
    }
   ],
   "name": "Approval",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "from",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "to",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "value",
     "type": "uint256"
    }
   ],
   "name": "Transfer",
   "type": "event"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_clubTokenController",
     "type": "address"
    }
   ],
   "name": "updateClubTokenControllerAddress",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_cloversController",
     "type": "address"
    }
   ],
   "name": "updateCloversControllerAddress",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_from",
     "type": "address"
    },
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_value",
     "type": "uint256"
    }
   ],
   "name": "transferFrom",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_value",
     "type": "uint256"
    }
   ],
   "name": "burn",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_burner",
     "type": "address"
    },
    {
     "name": "_value",
     "type": "uint256"
    }
   ],
   "name": "burn",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_amount",
     "type": "uint256"
    }
   ],
   "name": "moveEth",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_amount",
     "type": "uint256"
    },
    {
     "name": "_token",
     "type": "address"
    }
   ],
   "name": "moveToken",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_to",
     "type": "address"
    },
    {
     "name": "_amount",
     "type": "uint256"
    },
    {
     "name": "_token",
     "type": "address"
    }
   ],
   "name": "approveToken",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  }
 ],
 "networks": {
  "1": {
   "events": {},
   "links": {},
   "address": "0x1a94656a6245379bc0d9c64c402197528edb2bd1",
   "transactionHash": null
  },
  "4": {
   "events": {},
   "links": {},
   "address": "0x60217dcbf6a41bdf68df163199412f25992bc08b",
   "transactionHash": null
  },
  "42": {
   "events": {},
   "links": {},
   "address": "0x3cba2b53e6c90e99192e9ff2ed9f81ac969efac1",
   "transactionHash": null
  }
 }
},
  ClubTokenController: {
 "abi": [
  {
   "constant": true,
   "inputs": [],
   "name": "reserveRatio",
   "outputs": [
    {
     "name": "",
     "type": "uint32"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "support",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_admin",
     "type": "address"
    }
   ],
   "name": "isAdmin",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "virtualSupply",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_supply",
     "type": "uint256"
    },
    {
     "name": "_connectorBalance",
     "type": "uint256"
    },
    {
     "name": "_connectorWeight",
     "type": "uint32"
    },
    {
     "name": "_depositAmount",
     "type": "uint256"
    }
   ],
   "name": "calculatePurchaseReturn",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "name": "admins",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_supply",
     "type": "uint256"
    },
    {
     "name": "_connectorBalance",
     "type": "uint256"
    },
    {
     "name": "_connectorWeight",
     "type": "uint32"
    },
    {
     "name": "_sellAmount",
     "type": "uint256"
    }
   ],
   "name": "calculateSaleReturn",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "version",
   "outputs": [
    {
     "name": "",
     "type": "string"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_newAdmin",
     "type": "address"
    }
   ],
   "name": "transferAdminship",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "paused",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_fromConnectorBalance",
     "type": "uint256"
    },
    {
     "name": "_fromConnectorWeight",
     "type": "uint32"
    },
    {
     "name": "_toConnectorBalance",
     "type": "uint256"
    },
    {
     "name": "_toConnectorWeight",
     "type": "uint32"
    },
    {
     "name": "_amount",
     "type": "uint256"
    }
   ],
   "name": "calculateCrossConnectorReturn",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_previousAdmin",
     "type": "address"
    }
   ],
   "name": "renounceAdminship",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "renounceOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "curationMarket",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "owner",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "simpleCloversMarket",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "clubToken",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "virtualBalance",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_newOwner",
     "type": "address"
    }
   ],
   "name": "transferOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "inputs": [
    {
     "name": "_clubToken",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "constructor"
  },
  {
   "payable": true,
   "stateMutability": "payable",
   "type": "fallback"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": false,
     "name": "buyer",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "tokens",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "value",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "poolBalance",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "tokenSupply",
     "type": "uint256"
    }
   ],
   "name": "Buy",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": false,
     "name": "seller",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "tokens",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "value",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "poolBalance",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "tokenSupply",
     "type": "uint256"
    }
   ],
   "name": "Sell",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipRenounced",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "newOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipTransferred",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousAdmin",
     "type": "address"
    }
   ],
   "name": "AdminshipRenounced",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousAdmin",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "newAdmin",
     "type": "address"
    }
   ],
   "name": "AdminshipTransferred",
   "type": "event"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "poolBalance",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "buyValue",
     "type": "uint256"
    }
   ],
   "name": "getBuy",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "sellAmount",
     "type": "uint256"
    }
   ],
   "name": "getSell",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_paused",
     "type": "bool"
    }
   ],
   "name": "updatePaused",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_reserveRatio",
     "type": "uint32"
    }
   ],
   "name": "updateReserveRatio",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_virtualSupply",
     "type": "uint256"
    }
   ],
   "name": "updateVirtualSupply",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_virtualBalance",
     "type": "uint256"
    }
   ],
   "name": "updateVirtualBalance",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_simpleCloversMarket",
     "type": "address"
    }
   ],
   "name": "updateSimpleCloversMarket",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_curationMarket",
     "type": "address"
    }
   ],
   "name": "updateCurationMarket",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_support",
     "type": "address"
    }
   ],
   "name": "updateSupport",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "donate",
   "outputs": [],
   "payable": true,
   "stateMutability": "payable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "from",
     "type": "address"
    },
    {
     "name": "amount",
     "type": "uint256"
    }
   ],
   "name": "burn",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "from",
     "type": "address"
    },
    {
     "name": "to",
     "type": "address"
    },
    {
     "name": "amount",
     "type": "uint256"
    }
   ],
   "name": "transferFrom",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "buyer",
     "type": "address"
    }
   ],
   "name": "buy",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": true,
   "stateMutability": "payable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "sellAmount",
     "type": "uint256"
    }
   ],
   "name": "sell",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  }
 ],
 "networks": {
  "1": {
   "events": {
    "0x064fb1933e186be0b289a87e98518dc18cc9856ecbc9f1353d1a138ddf733ec5": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "buyer",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "tokens",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "value",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "poolBalance",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "tokenSupply",
       "type": "uint256"
      }
     ],
     "name": "Buy",
     "type": "event"
    },
    "0x483f8aec0fd892ac72ad1ba8d0e9c9e73db59c12d263fd71de480b5b3deeae3c": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "seller",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "tokens",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "value",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "poolBalance",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "tokenSupply",
       "type": "uint256"
      }
     ],
     "name": "Sell",
     "type": "event"
    },
    "0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipRenounced",
     "type": "event"
    },
    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipTransferred",
     "type": "event"
    },
    "0x1a2dbeec1a0714342f862f53c671a69a6cb438bf5aa44fc01a7ccff6fbde85ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipRenounced",
     "type": "event"
    },
    "0x2931ebb3d190545dcf6801c37aa686b74f2e1000e753d0fac6e471a2aa5a6213": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipTransferred",
     "type": "event"
    }
   },
   "links": {},
   "address": "0x1754a612ca578f72d678196bcc16710f01db7655",
   "transactionHash": null
  },
  "4": {
   "events": {
    "0x064fb1933e186be0b289a87e98518dc18cc9856ecbc9f1353d1a138ddf733ec5": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "buyer",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "tokens",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "value",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "poolBalance",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "tokenSupply",
       "type": "uint256"
      }
     ],
     "name": "Buy",
     "type": "event"
    },
    "0x483f8aec0fd892ac72ad1ba8d0e9c9e73db59c12d263fd71de480b5b3deeae3c": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "seller",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "tokens",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "value",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "poolBalance",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "tokenSupply",
       "type": "uint256"
      }
     ],
     "name": "Sell",
     "type": "event"
    },
    "0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipRenounced",
     "type": "event"
    },
    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipTransferred",
     "type": "event"
    },
    "0x1a2dbeec1a0714342f862f53c671a69a6cb438bf5aa44fc01a7ccff6fbde85ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipRenounced",
     "type": "event"
    },
    "0x2931ebb3d190545dcf6801c37aa686b74f2e1000e753d0fac6e471a2aa5a6213": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipTransferred",
     "type": "event"
    }
   },
   "links": {},
   "address": "0x05adcbf9cb71d1d9f62015011e3760bbedc41123",
   "transactionHash": null
  },
  "42": {
   "events": {
    "0x064fb1933e186be0b289a87e98518dc18cc9856ecbc9f1353d1a138ddf733ec5": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "buyer",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "tokens",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "value",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "poolBalance",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "tokenSupply",
       "type": "uint256"
      }
     ],
     "name": "Buy",
     "type": "event"
    },
    "0x483f8aec0fd892ac72ad1ba8d0e9c9e73db59c12d263fd71de480b5b3deeae3c": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "seller",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "tokens",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "value",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "poolBalance",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "tokenSupply",
       "type": "uint256"
      }
     ],
     "name": "Sell",
     "type": "event"
    },
    "0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipRenounced",
     "type": "event"
    },
    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipTransferred",
     "type": "event"
    },
    "0x1a2dbeec1a0714342f862f53c671a69a6cb438bf5aa44fc01a7ccff6fbde85ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipRenounced",
     "type": "event"
    },
    "0x2931ebb3d190545dcf6801c37aa686b74f2e1000e753d0fac6e471a2aa5a6213": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipTransferred",
     "type": "event"
    }
   },
   "links": {},
   "address": "0xa1c6a75cac4f25660e58be05ac4cdc69d9c680fd",
   "transactionHash": null
  }
 }
},
  SimpleCloversMarket: {
 "abi": [
  {
   "constant": true,
   "inputs": [],
   "name": "clovers",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "cloversController",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_admin",
     "type": "address"
    }
   ],
   "name": "isAdmin",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "name": "admins",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_newAdmin",
     "type": "address"
    }
   ],
   "name": "transferAdminship",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_previousAdmin",
     "type": "address"
    }
   ],
   "name": "renounceAdminship",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "renounceOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "owner",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "clubTokenController",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "clubToken",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_newOwner",
     "type": "address"
    }
   ],
   "name": "transferOwnership",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "inputs": [
    {
     "name": "_clovers",
     "type": "address"
    },
    {
     "name": "_clubToken",
     "type": "address"
    },
    {
     "name": "_clubTokenController",
     "type": "address"
    },
    {
     "name": "_cloversController",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "constructor"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": false,
     "name": "_tokenId",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "price",
     "type": "uint256"
    }
   ],
   "name": "updatePrice",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousAdmin",
     "type": "address"
    }
   ],
   "name": "AdminshipRenounced",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousAdmin",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "newAdmin",
     "type": "address"
    }
   ],
   "name": "AdminshipTransferred",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipRenounced",
   "type": "event"
  },
  {
   "anonymous": false,
   "inputs": [
    {
     "indexed": true,
     "name": "previousOwner",
     "type": "address"
    },
    {
     "indexed": true,
     "name": "newOwner",
     "type": "address"
    }
   ],
   "name": "OwnershipTransferred",
   "type": "event"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "sellFrom",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "sellPrice",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_clubTokenController",
     "type": "address"
    }
   ],
   "name": "updateClubTokenController",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_cloversController",
     "type": "address"
    }
   ],
   "name": "updateCloversController",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_clubToken",
     "type": "address"
    }
   ],
   "name": "updateClubToken",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_clovers",
     "type": "address"
    }
   ],
   "name": "updateClovers",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "removeSell",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    },
    {
     "name": "price",
     "type": "uint256"
    }
   ],
   "name": "sell",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenIds",
     "type": "uint256[]"
    },
    {
     "name": "_prices",
     "type": "uint256[]"
    }
   ],
   "name": "sellMany",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "buy",
   "outputs": [],
   "payable": true,
   "stateMutability": "payable",
   "type": "function"
  }
 ],
 "networks": {
  "1": {
   "events": {
    "0x82367b2d6e4540d07b2a6e64ecb6a2f8130985e6a17e157c3e556591c6b54f69": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "_tokenId",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "price",
       "type": "uint256"
      }
     ],
     "name": "updatePrice",
     "type": "event"
    },
    "0x1a2dbeec1a0714342f862f53c671a69a6cb438bf5aa44fc01a7ccff6fbde85ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipRenounced",
     "type": "event"
    },
    "0x2931ebb3d190545dcf6801c37aa686b74f2e1000e753d0fac6e471a2aa5a6213": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipTransferred",
     "type": "event"
    },
    "0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipRenounced",
     "type": "event"
    },
    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipTransferred",
     "type": "event"
    }
   },
   "links": {},
   "address": "0x6ebd97252d34645263c1d074f202f1d7546ce06b",
   "transactionHash": null
  },
  "4": {
   "events": {
    "0x82367b2d6e4540d07b2a6e64ecb6a2f8130985e6a17e157c3e556591c6b54f69": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "_tokenId",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "price",
       "type": "uint256"
      }
     ],
     "name": "updatePrice",
     "type": "event"
    },
    "0x1a2dbeec1a0714342f862f53c671a69a6cb438bf5aa44fc01a7ccff6fbde85ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipRenounced",
     "type": "event"
    },
    "0x2931ebb3d190545dcf6801c37aa686b74f2e1000e753d0fac6e471a2aa5a6213": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipTransferred",
     "type": "event"
    },
    "0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipRenounced",
     "type": "event"
    },
    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipTransferred",
     "type": "event"
    }
   },
   "links": {},
   "address": "0xe8d64ede6322c8208017dcdf33c7da8a5e4697cf",
   "transactionHash": null
  },
  "42": {
   "events": {
    "0x82367b2d6e4540d07b2a6e64ecb6a2f8130985e6a17e157c3e556591c6b54f69": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "_tokenId",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "price",
       "type": "uint256"
      }
     ],
     "name": "updatePrice",
     "type": "event"
    },
    "0x1a2dbeec1a0714342f862f53c671a69a6cb438bf5aa44fc01a7ccff6fbde85ef": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipRenounced",
     "type": "event"
    },
    "0x2931ebb3d190545dcf6801c37aa686b74f2e1000e753d0fac6e471a2aa5a6213": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousAdmin",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newAdmin",
       "type": "address"
      }
     ],
     "name": "AdminshipTransferred",
     "type": "event"
    },
    "0xf8df31144d9c2f0f6b59d69b8b98abd5459d07f2742c4df920b25aae33c64820": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipRenounced",
     "type": "event"
    },
    "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": true,
       "name": "previousOwner",
       "type": "address"
      },
      {
       "indexed": true,
       "name": "newOwner",
       "type": "address"
      }
     ],
     "name": "OwnershipTransferred",
     "type": "event"
    }
   },
   "links": {},
   "address": "0x845f0297348a37c28d849b99d7bfa5c285dc8dd6",
   "transactionHash": null
  }
 }
},
  Support: {
 "abi": [
  {
   "constant": true,
   "inputs": [],
   "name": "active",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "totalContributions",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "name": "contributions",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "name": "withdrawn",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "totalTokens",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "owner",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "name": "whitelist",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "limit",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "done",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "remainingTokens",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [],
   "name": "bondingCurve",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "inputs": [
    {
     "name": "_limit",
     "type": "uint256"
    },
    {
     "name": "_bondingCurve",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "constructor"
  },
  {
   "payable": true,
   "stateMutability": "payable",
   "type": "fallback"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "whitelisted",
     "type": "address"
    }
   ],
   "name": "addToWhitelist",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "whitelisted",
     "type": "address"
    }
   ],
   "name": "onWhitelist",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "whitelisted",
     "type": "address"
    }
   ],
   "name": "hasWithdrawn",
   "outputs": [
    {
     "name": "",
     "type": "bool"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "whitelisted",
     "type": "address"
    }
   ],
   "name": "currentContribution",
   "outputs": [
    {
     "name": "",
     "type": "uint256"
    }
   ],
   "payable": false,
   "stateMutability": "view",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "blacklisted",
     "type": "address"
    }
   ],
   "name": "removeFromWhitelist",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "support",
   "outputs": [],
   "payable": true,
   "stateMutability": "payable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_active",
     "type": "bool"
    }
   ],
   "name": "setActive",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [
    {
     "name": "_limit",
     "type": "uint256"
    }
   ],
   "name": "setLimit",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "makeBuy",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": false,
   "inputs": [],
   "name": "withdraw",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  }
 ],
 "networks": {
  "1": {
   "events": {},
   "links": {},
   "address": "0x7f5426690350db17415a719a417335c0ae33e477",
   "transactionHash": null
  },
  "4": {
   "events": {},
   "links": {},
   "address": "0xe280ccac20476ab7cd59ee5dfd92b1f1bc3b6574",
   "transactionHash": null
  },
  "42": {
   "events": {},
   "links": {},
   "address": "0xaf12b28b96ff4e047a4d318d87d74fdd131350f8",
   "transactionHash": null
  }
 }
}
};