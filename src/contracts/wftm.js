import { useCallback } from 'react';
import { ethers } from 'ethers';
import { ChainId } from '@sushiswap/sdk';
import { useWeb3React } from '@web3-react/core';

import { WFTM_ABI } from './abi';
import { calculateGasMargin } from 'utils';

const WFTM_ADDRESS = {
  [ChainId.FANTOM]: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  [ChainId.FANTOM_TESTNET]: '0x077fab8f7f79178f6718bdfdffd5c3b8d787aed5',
};

export const useWFTMContract = () => {
  const { chainId } = useWeb3React();

  const wftmAddress = useCallback(() => WFTM_ADDRESS[chainId], [chainId]);

  const getWFTMContract = async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(wftmAddress(), WFTM_ABI, signer);

    return contract;
  };

  const getWFTMBalance = async address => {
    const contract = await getWFTMContract();
    return await contract.balanceOf(address);
  };

  const wrapFTM = async (value, from) => {
    const contract = await getWFTMContract();
    const options = {
      value,
      from,
    };
    const gasEstimate = await contract.estimateGas.deposit(options);
    options.gasLimit = calculateGasMargin(gasEstimate);

    return await contract.deposit(options);
  };

  const unwrapFTM = async value => {
    const contract = await getWFTMContract();

    return await contract.withdraw(value);
  };

  const getAllowance = async (owner, spender) => {
    const contract = await getWFTMContract();
    return await contract.allowance(owner, spender);
  };

  const approve = async (address, value) => {
    const contract = await getWFTMContract();
    const tx = await contract.approve(address, value);
    await tx.wait();
  };

  return {
    wftmAddress,
    getWFTMBalance,
    wrapFTM,
    unwrapFTM,
    getAllowance,
    approve,
  };
};
