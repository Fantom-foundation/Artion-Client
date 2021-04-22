import { ethers } from 'ethers';

import { WFTM_ADDRESS, WFTM_ABI } from './abi';
import { calculateGasMargin } from './sales';

const getWFTMContract = async () => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(WFTM_ADDRESS, WFTM_ABI, signer);

  return [contract, provider];
};

export const getWFTMBalance = async address => {
  const [contract] = await getWFTMContract();
  return await contract.balanceOf(address);
};

export const wrapFTM = async (value, from) => {
  const [contract, provider] = await getWFTMContract();
  const options = {
    value,
    from,
  };
  const gasEstimate = await contract.estimateGas.deposit(options);
  options.gasLimit = calculateGasMargin(gasEstimate);

  const tx = await contract.deposit(options);
  await provider.waitForTransaction(tx.hash);
};
