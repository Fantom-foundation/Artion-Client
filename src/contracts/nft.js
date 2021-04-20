import { ethers } from 'ethers';

import { NFT_CONTRACT_ABI } from './abi';

export const getNFTContract = async address => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, NFT_CONTRACT_ABI, signer);

  return contract;
};
