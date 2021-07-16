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

  const getPlatformFee = async () => {
    const contract = await getFactoryContract();
    const _fee = await contract.platformFee();
    return parseFloat(_fee.toString()) / 10 ** 18;
  };

  const getPlatformFeePrivate = async () => {
    const contract = await getPrivateFactoryContract();
    const _fee = await contract.platformFee();
    return parseFloat(_fee.toString()) / 10 ** 18;
  };

  const createNFTContract = async (name, symbol, value, from) => {
    const contract = await getFactoryContract();
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

  const createPrivateNFTContract = async (name, symbol, value, from) => {
    const contract = await getPrivateFactoryContract();
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
    getPlatformFee,
    getPlatformFeePrivate,
    createNFTContract,
    createPrivateNFTContract,
  };
};
