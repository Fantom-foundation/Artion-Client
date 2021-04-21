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

const calculateGasMargin = value => {
  return value
    .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
    .div(ethers.BigNumber.from(10000));
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

export const buyItem = async (nftAddress, tokenId, value, from) => {
  const contract = await getSalesContract();
  const args = [nftAddress, tokenId];
  const options = {
    value,
    from,
  };
  const gasEstimate = await contract.estimateGas.buyItem(...args, options);
  options.from = from;
  options.gasLimit = calculateGasMargin(gasEstimate);
  return await contract.buyItem(...args, options);
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
  return await contract.updateListing(nftAddress, tokenId, newPrice);
};
