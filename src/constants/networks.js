import { ChainId } from '@sushiswap/sdk';

export const NETWORK_LABEL = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.FANTOM_TESTNET]: 'Fantom Testnet',
  [ChainId.MATIC]: 'Matic',
  [ChainId.MATIC_TESTNET]: 'Matic Testnet',
  [ChainId.XDAI]: 'xDai',
  [ChainId.BSC]: 'BSC',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
  [ChainId.MOONBASE]: 'Moonbase',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.FUJI]: 'Fuji',
  [ChainId.HECO]: 'HECO',
  [ChainId.HECO_TESTNET]: 'HECO Testnet',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.HARMONY_TESTNET]: 'Harmony Testnet',
};

export const Contracts = {
  [ChainId.FANTOM]: {
    auction: '0x951Cc69504d39b3eDb155CA99f555E47E044c2F1',
    sales: '0xa06aecbb8CD9328667f8E05f288e5b3ac1CFf852',
    bundleSales: '0x56aD389A02Ea9d63f13106cB0c161342f537a92e',
    factory: '0xCC7A2eC7A8A0564518fD3D2ca0Df8B2137626144', //FantomNFTFactory
    privateFactory: '0xe5841838Dd7e522f217DfFBCEaef82F04EC649Cd', //FantomNFTFactoryPrivate
    artFactory: '0x520DaB621f93F59d3557174280AB1B6d4FB8c956', //FantomArtFactory
    privateArtFactory: '0x736Eae40AdFf88570b92378c97a0D11b44E1C953', //FantomArtFactoryPrivate
  },
  [ChainId.FANTOM_TESTNET]: {
    auction: '0xDC8e329b0bA326f7Fcdbb5d42B437FfC7EA7C7a8',
    sales: '0x35123486C0a742da0aA320d037e5226bA4F9bf21',
    bundleSales: '0x52352D4a5fB2a79722a875bBdF2a6D00A152a3C5',
    factory: '0x7C8a9F8D04d9f7601E04B4bd3f594F6aB42b1231', //FantomNFTFactory
    privateFactory: '0x7d3bb8dD1f3b123C6DFEf882709Fadc007ee4532', //FantomNFTFactoryPrivate
    artFactory: '0x980A2fAC219CD4e26033E82A44D6798F7488aDb2', //FantomArtFactory
    privateArtFactory: '0x0106fe87F41BAa91D6fe52c508723e8cf5082c49', //FantomArtFactoryPrivate
  },
};
