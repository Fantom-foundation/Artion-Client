import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { calculateGasMargin } from 'utils';
import { Contracts } from 'constants/networks';

import { FACTORY_ABI } from './abi';

export const useFactoryContract = () => {
  const { chainId } = useWeb3React();

  const getFactoryContract = useCallback(async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if (!chainId) return null;

    const contract = new ethers.Contract(
      Contracts[chainId].factory,
      FACTORY_ABI,
      signer
    );

    return contract;
  }, [chainId]);

  const getPrivateFactoryContract = useCallback(async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if (!chainId) return null;

    const contract = new ethers.Contract(
      Contracts[chainId].privateFactory,
      FACTORY_ABI,
      signer
    );

    return contract;
  }, [chainId]);

  const getArtFactoryContract = useCallback(async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if (!chainId) return null;

    const contract = new ethers.Contract(
      Contracts[chainId].artFactory,
      FACTORY_ABI,
      signer
    );

    return contract;
  }, [chainId]);

  const getPrivateArtFactoryContract = useCallback(async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if (!chainId) return null;

    const contract = new ethers.Contract(
      Contracts[chainId].privateArtFactory,
      FACTORY_ABI,
      signer
    );

    return contract;
  }, [chainId]);

  const createNFTContract = async (contract, name, symbol, value, from) => {
    const args = [name, symbol];
    const options = {
      value,
      from,
    };
    const gasEstimate = await contract.estimateGas.createNFTContract(
      ...args,
      options
    );
    options.gasLimit = calculateGasMargin(gasEstimate);
    return await contract.createNFTContract(...args, options);
  };

  return {
    getFactoryContract,
    getPrivateFactoryContract,
    getArtFactoryContract,
    getPrivateArtFactoryContract,
    createNFTContract,
  };
};
