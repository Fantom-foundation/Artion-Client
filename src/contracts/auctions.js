import { ethers } from 'ethers';

import { AUCTION_CONTRACT_ADDRESS, AUCTION_CONTRACT_ABI } from './abi';

const getAuctionContract = async () => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const contract = new ethers.Contract(
    AUCTION_CONTRACT_ADDRESS,
    AUCTION_CONTRACT_ABI,
    provider
  );

  return contract;
};

export const cancelAuction = async (nftAddress, tokenId) => {
  const contract = await getAuctionContract();
  await contract.cancelAuction(nftAddress, tokenId);
};

export const createAuction = async (
  nftAddress,
  tokenId,
  reservePrice,
  startTimestamp,
  endTimestamp
) => {
  const contract = await getAuctionContract();
  await contract.createAuction(
    nftAddress,
    tokenId,
    reservePrice,
    startTimestamp,
    endTimestamp
  );
};

export const placeBid = async (amount, nftAddress, tokenId) => {
  const contract = await getAuctionContract();
  await contract.placeBid(amount, nftAddress, tokenId);
};

export const reclaimERC20 = async tokenContract => {
  const contract = await getAuctionContract();
  await contract.reclaimERC20(tokenContract);
};

export const resultAuction = async (nftAddress, tokenId) => {
  const contract = await getAuctionContract();
  await contract.resultAuction(nftAddress, tokenId);
};

export const updateAuctionStartTime = async (
  nftAddress,
  tokenId,
  startTime
) => {
  const contract = await getAuctionContract();
  await contract.updateAuctionStartTime(nftAddress, tokenId, startTime);
};

export const updateAuctionEndTime = async (
  nftAddress,
  tokenId,
  endTimestamp
) => {
  const contract = await getAuctionContract();
  await contract.updateAuctionEndTime(nftAddress, tokenId, endTimestamp);
};

export const updateAuctionReservePrice = async (
  nftAddress,
  tokenId,
  reservePrice
) => {
  const contract = await getAuctionContract();
  await contract.updateAuctionEndTime(nftAddress, tokenId, reservePrice);
};

export const withdrawBid = async (nftAddress, tokenId) => {
  const contract = await getAuctionContract();
  await contract.withdrawBid(nftAddress, tokenId);
};
