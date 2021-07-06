import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { NFT_CONTRACT_ABI } from './abi';

export const useNFTContract = () => {
  const { chainId } = useWeb3React();

  const getNFTContract = useCallback(
    async address => {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, NFT_CONTRACT_ABI, signer);

      return contract;
    },
    [chainId]
  );

  return { getNFTContract };
};
