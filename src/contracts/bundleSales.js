import { ethers } from 'ethers';

import { calculateGasMargin } from 'utils';

import {
  BUNDLE_SALES_CONTRACT_ADDRESS,
  BUNDLE_SALES_CONTRACT_ABI,
} from './abi';

export const getBundleSalesContract = async () => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    BUNDLE_SALES_CONTRACT_ADDRESS,
    BUNDLE_SALES_CONTRACT_ABI,
    signer
  );

  return contract;
};

export const getBundleListing = async (owner, bundleID) => {
  const contract = await getBundleSalesContract();
  const listing = await contract.getListing(owner, bundleID);
  const price = parseFloat(listing.price.toString()) / 10 ** 18;
  if (price > 0) {
    return {
      // nfts: listing.nfts,
      // tokenIds: listing.tokenIds.map(val => parseInt(val.toString())),
      // quantities: listing.quantities.map(val => parseInt(val.toString())),
      price,
      startingTime: parseInt(listing.startingTime.toString()),
      // allowedAddress: listing.allowedAddress,
    };
  }
  return null;
};

export const buyBundle = async (bundleID, value, from) => {
  const contract = await getBundleSalesContract();
  const args = [bundleID];
  const options = {
    value,
    from,
  };
  const gasEstimate = await contract.estimateGas.buyItem(...args, options);
  options.gasLimit = calculateGasMargin(gasEstimate);
  return await contract.buyItem(...args, options);
};

// export const cancelListing = async (nftAddress, tokenId) => {
//   const contract = await getBundleSalesContract();
//   const tx = await contract.cancelListing(nftAddress, tokenId);
//   await tx.wait();
// };

export const listBundle = async (
  bundleID,
  nftAddresses,
  tokenIds,
  quantities,
  price,
  startingTime,
  allowedAddress
) => {
  const contract = await getBundleSalesContract();
  return await contract.listItem(
    bundleID,
    nftAddresses,
    tokenIds,
    quantities,
    price,
    startingTime,
    allowedAddress
  );
};

export const updateBundleListing = async (bundleID, newPrice) => {
  const contract = await getBundleSalesContract();
  return await contract.updateListing(bundleID, newPrice);
};

export const createBundleOffer = async (
  bundleID,
  payToken,
  price,
  deadline
) => {
  const contract = await getBundleSalesContract();
  return await contract.createOffer(bundleID, payToken, price, deadline);
};

export const cancelBundleOffer = async bundleID => {
  const contract = await getBundleSalesContract();
  return await contract.cancelOffer(bundleID);
};

export const acceptBundleOffer = async (bundleID, creator) => {
  const contract = await getBundleSalesContract();
  return await contract.acceptOffer(bundleID, creator);
};
