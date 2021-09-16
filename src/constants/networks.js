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
    artFactory: '0x865AeDe044a707B9a3e127908Ad1F3f4F1086949',
    privateArtFactory: '0x1Ec3452a2A96AEd6A4513D6A036d17a6C3449551',
  },
  [ChainId.FANTOM_TESTNET]: {
    auction: '0xa5568193Ba09dbb934A9Af33A9e8639d1eaC6F43',
    sales: '0xBA8A36804a6BaE272fe4C8A2F5Cf551b03C26A01',
    bundleSales: '0x03b0Dd901E3366f6666c2eb411D14c469b8E8727',
    factory: '0xa92cBC72eef9254909A3f0eB9E2716eBD28171AE',
    privateFactory: '0x130138e2e535304Cce3B3B1B638F54402373391d',
  },
};
