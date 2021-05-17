const getTokenURI = async (tkId, fnft_sc) => {
  let tokenId = await fnft_sc.tokenURI(tkId);
  return tokenId;
};

const ERC721Module = {
  getTokenURI,
};

export default ERC721Module;
