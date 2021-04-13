import { ethers } from 'ethers';

import { SALES_CONTRACT_ADDRESS, SALES_CONTRACT_ABI } from './abi';

export const getSalesContract = async () => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const contract = new ethers.Contract(
    SALES_CONTRACT_ADDRESS,
    SALES_CONTRACT_ABI,
    provider
  );

  return contract;
};

export default {
  getSalesContract,
};
