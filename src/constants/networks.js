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
    auction: '0xdb404BF33c90b51176cA3db85288296B8594D134',
    sales: '0x19fD7C9B72cd944f987E0aB1FdD33fF8f68Cf87C',
    bundleSales: '0x0EeB6B95B52dfDFb86CcF960F8408a211555b63b',
    factory: '0x39B7788d6bb04d1860aaA6685F109aFD95D79Db3', //FantomNFTFactory
    privateFactory: '0x21CC778A6Ab21CBbB0ea62f0bFC7e6163C06dD75', //FantomNFTFactoryPrivate
    artFactory: '0x865AeDe044a707B9a3e127908Ad1F3f4F1086949', //FantomArtFactory
    privateArtFactory: '0x1Ec3452a2A96AEd6A4513D6A036d17a6C3449551', //FantomArtFactoryPrivate
  },
  [ChainId.FANTOM_TESTNET]: {
    auction: '0xc40AE55E423256E3Ad570cA17402A6613FE20608',
    sales: '0x9a4642Cc182ac038258f5B47be7c5538dB6f8399',
    bundleSales: '0x1779D9B53098a275d8d71429f0336fdDf4944d86',
    factory: '0x6F124f6DABA769Eb351a1EeC4C0224F9A0a524cE',
    privateFactory: '0x49191888c75134E60889c5407A87Cf07F836f677',
    artFactory: '0x56059938534AD39616b0b57B7F3c3FE074C3ab39', //FantomArtFactory
    privateArtFactory: '0xC6A8025f10F87620A165E9A53844eBa6217D5406', //FantomArtFactoryPrivate
  },
};
