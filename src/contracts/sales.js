import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { calculateGasMargin } from 'utils';
import { Contracts } from 'constants/networks';

import { SALES_CONTRACT_ABI } from './abi';

export const useSalesContract = () => {
  const { chainId } = useWeb3React();

  const getSalesContract = useCallback(async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if (!chainId) return null;

    const contract = new ethers.Contract(
      Contracts[chainId].sales,
      SALES_CONTRACT_ABI,
      signer
    );

    return contract;
  }, [chainId]);

  const buyItem = async (nftAddress, tokenId, owner, value, from) => {
    const contract = await getSalesContract();
    const args = [nftAddress, tokenId, owner];
    const options = {
      value,
      from,
    };
    const gasEstimate = await contract.estimateGas.buyItem(...args, options);
    options.gasLimit = calculateGasMargin(gasEstimate);
    return await contract.buyItem(...args, options);
  };

  const cancelListing = async (nftAddress, tokenId) => {
    const contract = await getSalesContract();
    const tx = await contract.cancelListing(nftAddress, tokenId);
    await tx.wait();
  };

  const listItem = async (
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

  const updateListing = async (nftAddress, tokenId, newPrice) => {
    const contract = await getSalesContract();
    return await contract.updateListing(nftAddress, tokenId, newPrice);
  };

  const createOffer = async (
    nftAddress,
    tokenId,
    payToken,
    quantity,
    pricePerItem,
    deadline
  ) => {
    const contract = await getSalesContract();
    return await contract.createOffer(
      nftAddress,
      tokenId,
      payToken,
      quantity,
      pricePerItem,
      deadline
    );
  };

  const cancelOffer = async (nftAddress, tokenId) => {
    const contract = await getSalesContract();
    return await contract.cancelOffer(nftAddress, tokenId);
  };

  const acceptOffer = async (nftAddress, tokenId, creator) => {
    const contract = await getSalesContract();
    return await contract.acceptOffer(nftAddress, tokenId, creator);
  };

  const registerRoyalty = async (nftAddress, tokenId, royalty) => {
    const contract = await getSalesContract();
    return await contract.registerRoyalty(nftAddress, tokenId, royalty);
  };

  return {
    getSalesContract,
    buyItem,
    cancelListing,
    listItem,
    updateListing,
    createOffer,
    cancelOffer,
    acceptOffer,
    registerRoyalty,
  };
};
