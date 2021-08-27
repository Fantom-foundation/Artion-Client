import { useCallback, useMemo } from 'react';
import { ChainId } from '@sushiswap/sdk';
import { useWeb3React } from '@web3-react/core';

import iconFTM from 'assets/imgs/ftm.png';
import iconWFTM from 'assets/imgs/wftm.png';
import iconUSDT from 'assets/imgs/usdt.png';
import iconUSDC from 'assets/imgs/usdc.png';
import iconDAI from 'assets/imgs/dai.png';

const Tokens = {
  [ChainId.FANTOM]: [
    {
      address: '',
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
      icon: iconFTM,
    },
    {
      address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
      name: 'Wrapped Fantom',
      symbol: 'WFTM',
      decimals: 18,
      icon: iconWFTM,
    },
    {
      address: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      icon: iconUSDT,
    },
    {
      address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      icon: iconUSDC,
    },
    {
      address: '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      icon: iconDAI,
    },
  ],
  [ChainId.FANTOM_TESTNET]: [
    {
      address: '',
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
      icon: iconFTM,
    },
    {
      address: '0x077fab8f7f79178f6718bdfdffd5c3b8d787aed5',
      name: 'Wrapped Fantom',
      symbol: 'WFTM',
      decimals: 18,
      icon: iconWFTM,
    },
  ],
};

export default function useTokens() {
  const { chainId } = useWeb3React();

  const getTokenByAddress = useCallback(
    addr => {
      const address =
        !addr ||
        addr === '0x0000000000000000000000000000000000000000' ||
        addr === 'ftm'
          ? ''
          : addr;
      return (Tokens[chainId] || []).find(
        tk => tk.address.toLowerCase() === address.toLowerCase()
      );
    },
    [chainId]
  );

  const tokens = useMemo(() => Tokens[chainId], [chainId]);

  return { getTokenByAddress, tokens };
}
