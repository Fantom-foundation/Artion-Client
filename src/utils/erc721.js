const getTokenURI = async (tkId, fnft_sc) => {
  let tokenId = await fnft_sc.tokenURI(tkId);
  return tokenId;
};

const getBalanceOfNFTPerAddress = async (address, fnft_sc) => {
  let balance = await fnft_sc.balanceOf(address);
  balance = balance.toNumber();
  return balance;
};

const getTokenOwnerAddress = async (tkId, fnft_sc) => {
  let address = await fnft_sc.ownerOf(tkId);
  return address;
};

const ERC721Module = {
  getTokenURI,
  getBalanceOfNFTPerAddress,
  getTokenOwnerAddress,
};

export default ERC721Module;
