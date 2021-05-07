import { getAddress } from '@ethersproject/address';

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}
