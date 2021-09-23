import { ethers } from 'ethers';
import { getAddress } from '@ethersproject/address';

import { Categories } from '../constants/filter.constants.js';

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export const formatPrice = (price = 0, payToken) => {
  if (
    payToken === process.env.REACT_APP_USDC ||
    payToken === process.env.REACT_APP_FUSDT
  ) {
    return price / 1e12;
  }

  return price;
};

export function shortenAddress(address, chars = 4) {
  if (!address) return '';

  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export const getHigherGWEI = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const price = (await provider.getGasPrice()) * 2;

  return price;
};

export const formatNumber = num => {
  if (isNaN(num) || num === null) return '';
  let parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const formatCategory = category => {
  return Categories.find(item => item.id === category).label;
};

export const formatError = error => {
  let startIndex = error.indexOf('message');
  let finalString = String(error.substr(startIndex + 10).replace(`"}}}'`, ''));

  return finalString;
};

const intlFormat = num => {
  return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
};

export const formatFollowers = num => {
  if (num >= 1000000) return intlFormat(num / 1000000) + 'M';
  if (num >= 1000) return intlFormat(num / 1000) + 'k';
  return intlFormat(num);
};

export const calculateGasMargin = value => {
  return value
    .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
    .div(ethers.BigNumber.from(10000));
};
