import { ChainId } from '@sushiswap/sdk';

import { calculateGasMargin, getHigherGWEI } from 'utils';
import { Contracts } from 'constants/networks';
import useContract from 'hooks/useContract';

import { SALES_CONTRACT_ABI } from './abi';

// eslint-disable-next-line no-undef
const isMainnet = process.env.REACT_APP_ENV === 'MAINNET';
const CHAIN = isMainnet ? ChainId.FANTOM : ChainId.FANTOM_TESTNET;

export const useSalesContract = () => {
  const { getContract } = useContract();

  const getSalesContract = async () =>
    await getContract(Contracts[CHAIN].sales, SALES_CONTRACT_ABI);

  const buyItemETH = async (nftAddress, tokenId, owner, value, from) => {
    const contract = await getSalesContract();
    const args = [nftAddress, tokenId, owner];

    const options = {
      value,
      from,
      gasPrice: getHigherGWEI(),
    };

    const gasEstimate = await contract.estimateGas[
      'buyItem(address,uint256,address)'
    ](...args, options);
    options.gasLimit = calculateGasMargin(gasEstimate);
    return await contract['buyItem(address,uint256,address)'](...args, options);
  };

  const buyItemERC20 = async (nftAddress, tokenId, payToken, owner) => {
    const contract = await getSalesContract();
    const options = {
      gasPrice: getHigherGWEI(),
    };

    return await contract['buyItem(address,uint256,address,address)'](
      nftAddress,
      tokenId,
      payToken,
      owner,
      options
    );
  };

  const cancelListing = async (nftAddress, tokenId) => {
    const contract = await getSalesContract();
    const options = {
      gasPrice: getHigherGWEI(),
    };

    const tx = await contract.cancelListing(nftAddress, tokenId, options);
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

    const options = {
      gasPrice: getHigherGWEI(),
    };

    return await contract.listItem(
      nftAddress,
      tokenId,
      quantity,
      payToken,
      pricePerItem,
      startingTime,
      options
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

    const options = {
      gasPrice: getHigherGWEI(),
    };

    return await contract.updateListing(
      nftAddress,
      tokenId,
      payToken,
      newPrice,
      options
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

    const options = {
      gasPrice: getHigherGWEI(),
    };

    return await contract.createOffer(
      nftAddress,
      tokenId,
      payToken,
      quantity,
      pricePerItem,
      deadline,
      options
    );
  };

  const cancelOffer = async (nftAddress, tokenId) => {
    const contract = await getSalesContract();
    const options = {
      gasPrice: getHigherGWEI(),
    };

    return await contract.cancelOffer(nftAddress, tokenId, options);
  };

  const acceptOffer = async (nftAddress, tokenId, creator) => {
    const contract = await getSalesContract();
    const options = {
      gasPrice: getHigherGWEI(),
    };

    return await contract.acceptOffer(nftAddress, tokenId, creator, options);
  };

  const registerRoyalty = async (nftAddress, tokenId, royalty) => {
    const contract = await getSalesContract();
    const options = {
      gasPrice: getHigherGWEI(),
    };

    return await contract.registerRoyalty(
      nftAddress,
      tokenId,
      royalty,
      options
    );
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
