import { ethers } from 'ethers';

import { AUCTION_CONTRACT_ADDRESS, AUCTION_CONTRACT_ABI } from './abi';
import { calculateGasMargin } from './sales';

const getAuctionContract = async () => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    AUCTION_CONTRACT_ADDRESS,
    AUCTION_CONTRACT_ABI,
    signer
  );

  return contract;
};

export const getAuction = async (nftAddress, tokenId) => {
  const contract = await getAuctionContract();
  const res = await contract.getAuction(nftAddress, tokenId);
  const owner = res[0];
  const reservePrice = parseFloat(res[1].toString()) / 10 ** 18;
  const startTime = parseFloat(res[2].toString());
  const endTime = parseFloat(res[3].toString());
  const resulted = res[4];
  return {
    owner,
    reservePrice,
    startTime,
    endTime,
    resulted,
  };
};

export const cancelAuction = async (nftAddress, tokenId) => {
  const contract = await getAuctionContract();
  return await contract.cancelAuction(nftAddress, tokenId);
};

export const createAuction = async (
  nftAddress,
  tokenId,
  reservePrice,
  startTimestamp,
  endTimestamp
) => {
  const contract = await getAuctionContract();
  return await contract.createAuction(
    nftAddress,
    tokenId,
    reservePrice,
    startTimestamp,
    endTimestamp
  );
};

export const getHighestBidder = async (nftAddress, tokenId) => {
  const contract = await getAuctionContract();
  const res = await contract.getHighestBidder(nftAddress, tokenId);
  const bidder = res[0];
  const bid = parseFloat(res[1].toString()) / 10 ** 18;
  const lastBidTime = parseFloat(res[2].toString());
  return {
    bidder,
    bid,
    lastBidTime,
  };
};

export const placeBid = async (nftAddress, tokenId, value, from) => {
  const contract = await getAuctionContract();
  const args = [nftAddress, tokenId];
  const options = {
    value,
    from,
  };
  const gasEstimate = await contract.estimateGas.placeBid(...args, options);
  options.gasLimit = calculateGasMargin(gasEstimate);
  return await contract.placeBid(...args, options);
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
  return await contract.withdrawBid(nftAddress, tokenId);
};
