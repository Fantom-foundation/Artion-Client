export const abbrAddress = address => {
  if (address.length <= 8) return address;

  return address.slice(0, 4) + '...' + address.slice(-4);
};
