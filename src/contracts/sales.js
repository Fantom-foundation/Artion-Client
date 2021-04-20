import { ethers } from 'ethers';

import { SALES_CONTRACT_ADDRESS, SALES_CONTRACT_ABI } from './abi';

const getSalesContract = async () => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    SALES_CONTRACT_ADDRESS,
    SALES_CONTRACT_ABI,
    signer
  );

  return contract;
};

export const getListings = async (nftAddress, tokenId) => {
  const contract = await getSalesContract();
  const res = await contract.listings(nftAddress, tokenId);
  const owner = res[0];
  const quantity = parseFloat(res[1].toString());
  const pricePerItem = parseFloat(res[2].toString()) / 10 ** 18;
  const startingTime = parseFloat(res[3].toString());
  const allowedAddress = res[4];
  const result = [];
  if (pricePerItem > 0) {
    result.push({
      owner,
      quantity,
      pricePerItem,
      startingTime,
      allowedAddress,
    });
  }
  return result;
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
  return await contract.listItem(
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
