import { ethers } from 'ethers';

import { WFTM_ADDRESS, WFTM_ABI } from './abi';
import { calculateGasMargin } from 'utils';

const getWFTMContract = async () => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(WFTM_ADDRESS, WFTM_ABI, signer);

  return contract;
};

export const getWFTMBalance = async address => {
  const contract = await getWFTMContract();
  return await contract.balanceOf(address);
};

export const wrapFTM = async (value, from) => {
  const contract = await getWFTMContract();
  const options = {
    value,
    from,
  };
  const gasEstimate = await contract.estimateGas.deposit(options);
  options.gasLimit = calculateGasMargin(gasEstimate);

  return await contract.deposit(options);
};

export const unwrapFTM = async value => {
  const contract = await getWFTMContract();

  return await contract.withdraw(value);
};

export const getAllowance = async (owner, spender) => {
  const contract = await getWFTMContract();
  return await contract.allowance(owner, spender);
};

export const approve = async (address, value) => {
  const contract = await getWFTMContract();
  const tx = await contract.approve(address, value);
  await tx.wait();
};
