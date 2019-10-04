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
    }
   ],
   "name": "deleteClover",
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
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "unmint",
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
   "address": "0xB55C5cAc5014C662fDBF21A2C59Cd45403C482Fd",
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
  },
  "1234": {
   "address": "0xF4f7F9CD9b912D8f3EA0e1a686942978B573723D",
   "transactionHash": "0x5d28d949ef517bff6dfd633a37541127d22192f0a744914c785d2f4e3a921b05"
  },
  "1569787081442": {
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
   "address": "0x2a599ded533402d20dcc74225134c4ad41ae1839",
   "transactionHash": "0x3f90ad30278a5f24715f05bd30504435168f7e8a3d6a8795e71276869469b16b"
  }
 }
},
CloversController: {
 "abi": [
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
   "constant": true,
   "inputs": [
    {
     "name": "moves",
     "type": "bytes28[2]"
    }
   ],
   "name": "getGame",
   "outputs": [
    {
     "name": "error",
     "type": "bool"
    },
    {
     "name": "complete",
     "type": "bool"
    },
    {
     "name": "symmetrical",
     "type": "bool"
    },
    {
     "name": "board",
     "type": "bytes16"
    },
    {
     "name": "currentPlayer",
     "type": "uint8"
    },
    {
     "name": "moveKey",
     "type": "uint8"
    }
   ],
   "payable": false,
   "stateMutability": "pure",
   "type": "function"
  },
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
   "inputs": [
    {
     "name": "hash",
     "type": "bytes32"
    },
    {
     "name": "signature",
     "type": "bytes"
    }
   ],
   "name": "recover",
   "outputs": [
    {
     "name": "",
     "type": "address"
    }
   ],
   "payable": false,
   "stateMutability": "pure",
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
     "name": "keep",
     "type": "bool"
    }
   ],
   "name": "claimCloverWithVerification",
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
   "constant": true,
   "inputs": [
    {
     "name": "moves",
     "type": "bytes28[2]"
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
   "stateMutability": "pure",
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
     "name": "tokenId",
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
   "stateMutability": "pure",
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
     "name": "tokenId",
     "type": "uint256"
    },
    {
     "name": "_price",
     "type": "uint256"
    }
   ],
   "name": "updateSalePrice",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "tokenId",
     "type": "uint256"
    },
    {
     "name": "moves",
     "type": "bytes28[2]"
    },
    {
     "name": "symmetries",
     "type": "uint256"
    },
    {
     "name": "keep",
     "type": "bool"
    },
    {
     "name": "recepient",
     "type": "address"
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
   "constant": false,
   "inputs": [
    {
     "name": "movesHashWithRecepient",
     "type": "bytes32"
    }
   ],
   "name": "claimCloverSecurelyPartOne",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
   "type": "function"
  },
  {
   "constant": true,
   "inputs": [
    {
     "name": "tokenId",
     "type": "uint256"
    },
    {
     "name": "moves",
     "type": "bytes28[2]"
    },
    {
     "name": "symmetries",
     "type": "uint256"
    },
    {
     "name": "keep",
     "type": "bool"
    },
    {
     "name": "recepient",
     "type": "address"
    },
    {
     "name": "signature",
     "type": "bytes"
    },
    {
     "name": "signer",
     "type": "address"
    }
   ],
   "name": "checkSignature",
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
   "inputs": [
    {
     "name": "tokenId",
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
   "constant": true,
   "inputs": [],
   "name": "gasLastUpdated_fastGasPrice_averageGasPrice_safeLowGasPrice",
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
   "name": "isOwner",
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
     "name": "hash",
     "type": "bytes32"
    }
   ],
   "name": "toEthSignedMessageHash",
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
   "inputs": [
    {
     "name": "tokenId",
     "type": "uint256"
    },
    {
     "name": "moves",
     "type": "bytes28[2]"
    },
    {
     "name": "symmetries",
     "type": "uint256"
    },
    {
     "name": "keep",
     "type": "bool"
    },
    {
     "name": "signature",
     "type": "bytes"
    }
   ],
   "name": "claimCloverWithSignature",
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
   "inputs": [],
   "name": "gasBlockMargin",
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
   "stateMutability": "pure",
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
     "name": "movesHash",
     "type": "bytes32"
    }
   ],
   "name": "claimCloverSecurelyPartTwo",
   "outputs": [],
   "payable": false,
   "stateMutability": "nonpayable",
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
   "constant": true,
   "inputs": [
    {
     "name": "symmetries",
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
   "constant": true,
   "inputs": [
    {
     "name": "symmetries",
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
   "constant": true,
   "inputs": [
    {
     "name": "movesHash",
     "type": "bytes32"
    },
    {
     "name": "recepient",
     "type": "address"
    }
   ],
   "name": "getMovesHashWithRecepient",
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
   "constant": false,
   "inputs": [
    {
     "name": "newOwner",
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
     "name": "tokenId",
     "type": "uint256"
    },
    {
     "indexed": false,
     "name": "moves",
     "type": "bytes28[2]"
    },
    {
     "indexed": false,
     "name": "sender",
     "type": "address"
    },
    {
     "indexed": false,
     "name": "recepient",
     "type": "address"
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
     "name": "moves",
     "type": "bytes28[2]"
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
 ],
 "networks": {
  "1": {
   "events": {
    "0x4c0f83654ac2972673e4d81058f833de298389df1dce04cc2db9f231b907d5ff": {
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
     "type": "event",
     "signature": "0x4c0f83654ac2972673e4d81058f833de298389df1dce04cc2db9f231b907d5ff"
    },
    "0xbffd4880cee44a71d4266cf8dcf3179608df035c1883808a2370a9cfd180f6ed": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "tokenId",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "moves",
       "type": "bytes28[2]"
      },
      {
       "indexed": false,
       "name": "sender",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "recepient",
       "type": "address"
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
     "type": "event",
     "signature": "0xbffd4880cee44a71d4266cf8dcf3179608df035c1883808a2370a9cfd180f6ed"
    },
    "0x36b306723b6493a90002bbf27460db864a9ac8ce1af82ad1f0183f83c0cecc39": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "tokenId",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "moves",
       "type": "bytes28[2]"
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
      }
     ],
     "name": "cloverChallenged",
     "type": "event",
     "signature": "0x36b306723b6493a90002bbf27460db864a9ac8ce1af82ad1f0183f83c0cecc39"
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
     "type": "event",
     "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
    }
   },
   "links": {
    "Reversi": "0xF640b022ab52A003466dAAefb5E87bBEE7aC1bdF",
    "\\$b2fca45de5ef9c5a18731e56fbc51add96\\$": "0xF640b022ab52A003466dAAefb5E87bBEE7aC1bdF"
   },
   "address": "0xD3B55Ba131CE66c1F4299917e1347533Ad16E06c",
   "transactionHash": "0x44eb4bb2744ef16f6639a8971d9b73d06e6f46563299207d529be20735a6cf4b"
  },
  "4": {
   "events": {},
   "links": {
    "Reversi": "0xbff258e5c379ac4fe61ac005f4f341476a2ab180"
   },
   "address": "0x83550091623dbf42c9762cea09f74ee5f7f32686",
   "transactionHash": "0x33828d5696099bea8d051581e73d1f27562a1f60f043b7d65b23b7bf7d4d5812"
  },
  "42": {
   "events": {},
   "links": {
    "Reversi": "0xad82a0cd12c8d7a632190eae388b2c00cd3c58e9"
   },
   "address": "0xf0c6d63656e012dbd3bc017176c75d08360dcd55",
   "transactionHash": null
  },
  "1234": {
   "events": {
    "0x4c0f83654ac2972673e4d81058f833de298389df1dce04cc2db9f231b907d5ff": {
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
     "type": "event",
     "signature": "0x4c0f83654ac2972673e4d81058f833de298389df1dce04cc2db9f231b907d5ff"
    },
    "0xbffd4880cee44a71d4266cf8dcf3179608df035c1883808a2370a9cfd180f6ed": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "tokenId",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "moves",
       "type": "bytes28[2]"
      },
      {
       "indexed": false,
       "name": "sender",
       "type": "address"
      },
      {
       "indexed": false,
       "name": "recepient",
       "type": "address"
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
     "type": "event",
     "signature": "0xbffd4880cee44a71d4266cf8dcf3179608df035c1883808a2370a9cfd180f6ed"
    },
    "0x36b306723b6493a90002bbf27460db864a9ac8ce1af82ad1f0183f83c0cecc39": {
     "anonymous": false,
     "inputs": [
      {
       "indexed": false,
       "name": "tokenId",
       "type": "uint256"
      },
      {
       "indexed": false,
       "name": "moves",
       "type": "bytes28[2]"
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
      }
     ],
     "name": "cloverChallenged",
     "type": "event",
     "signature": "0x36b306723b6493a90002bbf27460db864a9ac8ce1af82ad1f0183f83c0cecc39"
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
     "type": "event",
     "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
    }
   },
   "links": {
    "\\$b2fca45de5ef9c5a18731e56fbc51add96\\$": "0xd08DA2D161b0B1a363372Cc7A76c2044f35F6743",
    "Reversi": "0xd08DA2D161b0B1a363372Cc7A76c2044f35F6743"
   },
   "address": "0x83f43A2D67Cb3C020c61975b04Ef0f44a9B9ee1F",
   "transactionHash": "0x0400875f838026664bad0e3fdd47987884c1cf3241534a29040389362a732fab"
  },
  "1569787081442": {
   "events": {},
   "links": {
    "Reversi": "0x18fa2fef14708bf4525535191f7962cadb88ad1c"
   },
   "address": "0x188bf9edbd3ca89ab40b53949fd2b5490d094ea7",
   "transactionHash": "0x8acb065bab4c737b56cf4f0ba50d228efd49852d2ee7ef3f956300e06ba8d80d"
  }
 }
},
ClubToken: {
 "abi": [
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
  }
 ],
 "networks": {
  "1": {
   "events": {},
   "links": {},
   "address": "0x1A94656A6245379bC0d9c64C402197528EdB2bD1",
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
  },
  "1234": {
   "address": "0x738453Ff13e066a3f85B3F7adc9557C62f16C86B",
   "transactionHash": "0xf3b51501392d1ba8d577b78a0e86fb5fb6252003ed6a092b51ea7b1d451d3c6b"
  },
  "1569787081442": {
   "events": {},
   "links": {},
   "address": "0x7099486810ec38c71928934500d20b7241c1d75b",
   "transactionHash": "0x2f52a0be9e949661a27975f833be3312afb3bca0908375c6102d7d17515f33c3"
  }
 }
},
ClubTokenController: {
 "abi": [
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
   "address": "0x1754a612cA578F72d678196bcC16710f01DB7655",
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
  },
  "1234": {
   "address": "0x58223d5361760199Def28F2dad2f1bb5Ee51Ee5A",
   "transactionHash": "0x0648dd3e5399feeca08398441c061be5994f77cdacf8e43f1d5748c8936af44c"
  },
  "1569787081442": {
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
   "address": "0x403ab4cf4a0b6f75e36c764640fc96202dade321",
   "transactionHash": "0x88de220395a121d02c474ba47c2a752a464b1bf72ddcecc353b770ba3f0b49b2"
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
     "name": "_tokenId",
     "type": "uint256"
    }
   ],
   "name": "buy",
   "outputs": [],
   "payable": true,
   "stateMutability": "payable",
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
   "address": "0x6ebD97252D34645263c1d074f202F1d7546CE06b",
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
  },
  "1234": {
   "address": "0xbbB611EAa01253522D53B23067A30ceA8743bCcE",
   "transactionHash": "0x78fb432c24afa2c39464055f7d44bcd59e4557cf9d1119cdfcfad9b274894b8a"
  },
  "1569787081442": {
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
   "address": "0xe5873988b81af2109b9d415cd38e9a76c0aa2883",
   "transactionHash": "0xb6699bb85aa510a63fd6462a588c1facee90bd4d83a0b059018987d7087a3bd5"
  }
 }
}
};