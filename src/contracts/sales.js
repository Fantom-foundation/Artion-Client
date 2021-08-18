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

  const buyItemETH = async (nftAddress, tokenId, owner, value, from) => {
    const contract = await getSalesContract();
    const args = [nftAddress, tokenId, owner];
    const options = {
      value,
      from,
    };
    const gasEstimate = await contract.estimateGas[
      'buyItem(address,uint256,address)'
    ](...args, options);
    options.gasLimit = calculateGasMargin(gasEstimate);
    return await contract['buyItem(address,uint256,address)'](...args, options);
  };

  const buyItemERC20 = async (nftAddress, tokenId, payToken, owner) => {
    const contract = await getSalesContract();
    return await contract['buyItem(address,uint256,address,address)'](
      nftAddress,
      tokenId,
      payToken,
      owner
    );
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
    payToken,
    pricePerItem,
    startingTime
  ) => {
    const contract = await getSalesContract();
    return await contract.listItem(
      nftAddress,
      tokenId,
      quantity,
      payToken,
      pricePerItem,
      startingTime
    );
  };

  const updateListing = async (
    nftAddress,
    tokenId,
    payToken,
    newPrice
    // quantity
  ) => {
    const contract = await getSalesContract();
    return await contract.updateListing(
      nftAddress,
      tokenId,
      payToken,
      newPrice
      // quantity
    );
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

  const getCollectionRoyalty = async nftAddress => {
    const contract = await getSalesContract();
    return await contract.collectionRoyalties(nftAddress);
  };

  return {
    getSalesContract,
    buyItemETH,
    buyItemERC20,
    cancelListing,
    listItem,
    updateListing,
    createOffer,
    cancelOffer,
    acceptOffer,
    registerRoyalty,
    getCollectionRoyalty,
  };
};
