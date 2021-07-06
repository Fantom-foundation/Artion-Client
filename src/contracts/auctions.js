import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { calculateGasMargin } from 'utils';
import { Contracts } from 'constants/networks';

import { AUCTION_CONTRACT_ABI } from './abi';

export const useAuctionContract = () => {
  const { chainId } = useWeb3React();

  const getAuctionContract = useCallback(async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if (!chainId) return null;

    const contract = new ethers.Contract(
      Contracts[chainId].auction,
      AUCTION_CONTRACT_ABI,
      signer
    );

    return contract;
  }, [chainId]);

  const getAuction = async (nftAddress, tokenId) => {
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

  const cancelAuction = async (nftAddress, tokenId) => {
    const contract = await getAuctionContract();
    return await contract.cancelAuction(nftAddress, tokenId);
  };

  const createAuction = async (
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

  const getHighestBidder = async (nftAddress, tokenId) => {
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

  const placeBid = async (nftAddress, tokenId, value, from) => {
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

  const resultAuction = async (nftAddress, tokenId) => {
    const contract = await getAuctionContract();
    const tx = await contract.resultAuction(nftAddress, tokenId);
    await tx.wait();
  };

  const updateAuctionStartTime = async (nftAddress, tokenId, startTime) => {
    const contract = await getAuctionContract();
    const tx = await contract.updateAuctionStartTime(
      nftAddress,
      tokenId,
      startTime
    );
    await tx.wait();
  };

  const updateAuctionEndTime = async (nftAddress, tokenId, endTimestamp) => {
    const contract = await getAuctionContract();
    const tx = await contract.updateAuctionEndTime(
      nftAddress,
      tokenId,
      endTimestamp
    );
    await tx.wait();
  };

  const updateAuctionReservePrice = async (
    nftAddress,
    tokenId,
    reservePrice
  ) => {
    const contract = await getAuctionContract();
    const tx = await contract.updateAuctionReservePrice(
      nftAddress,
      tokenId,
      reservePrice
    );
    await tx.wait();
  };

  const withdrawBid = async (nftAddress, tokenId) => {
    const contract = await getAuctionContract();
    const tx = await contract.withdrawBid(nftAddress, tokenId);
    await tx.wait();
  };

  return {
    getAuctionContract,
    getAuction,
    cancelAuction,
    createAuction,
    getHighestBidder,
    placeBid,
    resultAuction,
    updateAuctionStartTime,
    updateAuctionEndTime,
    updateAuctionReservePrice,
    withdrawBid,
  };
};
