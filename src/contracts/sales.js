import { ethers } from 'ethers';

import { SALES_CONTRACT_ADDRESS, SALES_CONTRACT_ABI } from './abi';

const getSalesContract = async () => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const contract = new ethers.Contract(
    SALES_CONTRACT_ADDRESS,
    SALES_CONTRACT_ABI,
    provider
  );

  return contract;
};

export const getListings = async (nftAddress, tokenId) => {
  const contract = await getSalesContract();
  const res = await contract.listings(nftAddress, tokenId);
  const owner = res[0];
  const quantity = res[1].toNumber();
  const pricePerItem = res[2].toNumber();
  const startingTime = res[3].toNumber();
  const allowedAddress = res[4];
  const listings = [];
  console.log(owner, quantity, pricePerItem, startingTime, allowedAddress);
  return listings;
};

export const buyItem = async (amount, nftAddress, tokenId) => {
  const contract = await getSalesContract();
  await contract.buyItem(amount, nftAddress, tokenId);
};

export const cancelListing = async (nftAddress, tokenId) => {
  const contract = await getSalesContract();
  await contract.cancelListing(nftAddress, tokenId);
};

export const listItem = async (
  nftAddress,
  tokenId,
  quantity,
  pricePerItem,
  startingTime,
  allowedAddress
) => {
  const contract = await getSalesContract();
  await contract.listItem(
    nftAddress,
    tokenId,
    quantity,
    pricePerItem,
    startingTime,
    allowedAddress
  );
};

export const updateListing = async (nftAddress, tokenId, newPrice) => {
  const contract = await getSalesContract();
  await contract.updateListing(nftAddress, tokenId, newPrice);
};
