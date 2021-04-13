export const SALES_CONTRACT_ADDRESS =
  '0xeEBe437e79D255aA3745cA6dCD77f2C1e4E6E680';

export const SALES_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_feeRecipient',
        type: 'address',
      },
      { internalType: 'uint256', name: '_platformFee', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      { indexed: true, internalType: 'address', name: 'nft', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ItemCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      { indexed: true, internalType: 'address', name: 'nft', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'pricePerItem',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startingTime',
        type: 'uint256',
      },
      { indexed: false, internalType: 'bool', name: 'isPrivate', type: 'bool' },
      {
        indexed: false,
        internalType: 'address',
        name: 'allowedAddress',
        type: 'address',
      },
    ],
    name: 'ItemListed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      { indexed: true, internalType: 'address', name: 'nft', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'ItemSold',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      { indexed: true, internalType: 'address', name: 'nft', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newPrice',
        type: 'uint256',
      },
    ],
    name: 'ItemUpdated',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '_nftAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
    ],
    name: 'buyItem',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_nftAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
    ],
    name: 'cancelListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeReceipient',
    outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_nftAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'uint256', name: '_quantity', type: 'uint256' },
      { internalType: 'uint256', name: '_pricePerItem', type: 'uint256' },
      { internalType: 'uint256', name: '_startingTime', type: 'uint256' },
      { internalType: 'address', name: '_allowedAddress', type: 'address' },
    ],
    name: 'listItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'listings',
    outputs: [
      { internalType: 'address payable', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
      { internalType: 'uint256', name: 'pricePerItem', type: 'uint256' },
      { internalType: 'uint256', name: 'startingTime', type: 'uint256' },
      { internalType: 'address', name: 'allowedAddress', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_nftAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'uint256', name: '_newPrice', type: 'uint256' },
    ],
    name: 'updateListing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default {
  SALES_CONTRACT_ADDRESS,
  SALES_CONTRACT_ABI,
};
