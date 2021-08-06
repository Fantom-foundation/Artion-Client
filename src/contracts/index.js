import { ethers } from 'ethers';

export * from './abi';
export * from './auctions';
export * from './sales';
export * from './bundleSales';
export * from './nft';
export * from './wftm';
export * from './factory';

export const getSigner = async () => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(
    window.web3.currentProvider
  );
  const signer = provider.getSigner();
  return signer;
};
