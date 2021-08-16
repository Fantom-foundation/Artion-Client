import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import {
  ERC20_CONTRACT_ABI,
  ERC721_CONTRACT_ABI,
  ERC1155_CONTRACT_ABI,
} from './abi';

export const useNFTContract = () => {
  const { chainId } = useWeb3React();

  const getERC20Contract = useCallback(
    async address => {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, ERC20_CONTRACT_ABI, signer);

      return contract;
    },
    [chainId]
  );

  const getERC721Contract = useCallback(
    async address => {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        address,
        ERC721_CONTRACT_ABI,
        signer
      );

      return contract;
    },
    [chainId]
  );

  const getERC1155Contract = useCallback(
    async address => {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        address,
        ERC1155_CONTRACT_ABI,
        signer
      );

      return contract;
    },
    [chainId]
  );

  return { getERC20Contract, getERC721Contract, getERC1155Contract };
};
