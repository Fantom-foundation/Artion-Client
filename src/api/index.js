import axios from 'axios';

// eslint-disable-next-line no-undef
export const API_URL = process.env.REACT_APP_API_URL;

export const getAuthToken = async address => {
  let result = await axios({
    method: 'post',
    url: `${API_URL}/auth/getToken`,
    data: JSON.stringify({ address: address }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (result.data.status == 'success') {
    let token = result.data.token;
    return token;
  }
  return null;
};

export const getAccountDetails = async authToken => {
  const res = await axios({
    method: 'get',
    url: `${API_URL}/account/getaccountinfo`,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return res.data;
};

export const getUserAccountDetails = async address => {
  const data = { address };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/account/getuseraccountinfo`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.data;
};

export const updateAccountDetails = async (
  alias,
  email,
  bio,
  avatar,
  authToken
) => {
  const formData = new FormData();
  formData.append('alias', alias);
  formData.append('email', email);
  if (bio) {
    formData.append('bio', bio);
  }
  if (avatar) {
    formData.append('imgData', avatar);
  }

  const res = await axios({
    method: 'post',
    url: `${API_URL}/account/accountdetails`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
};

export const updateBanner = async (imageData, authToken) => {
  const formData = new FormData();
  formData.append('imgData', imageData);
  const res = await axios({
    method: 'post',
    url: `${API_URL}/ipfs/uploadBannerImage2Server`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
};

export const getTokenType = async contractAddress => {
  const { data } = await axios.get(
    `${API_URL}/info/getTokenType/${contractAddress}`
  );
  return data.data;
};

export const get1155Info = async (contractAddress, tokenID) => {
  const { data } = await axios.get(
    `${API_URL}/info/get1155info/${contractAddress}/${tokenID}`
  );
  return data;
};

export const getTokenHolders = async (contractAddress, tokenID) => {
  const { data } = await axios.get(
    `${API_URL}/info/getOwnership/${contractAddress}/${tokenID}`
  );
  return data;
};

export const fetchCollections = async () => {
  const res = await axios.get(`${API_URL}/info/getcollections`);
  return res.data;
};

export const fetchCollection = async contractAddress => {
  const res = await axios({
    method: 'post',
    url: `${API_URL}/collection/getCollectionInfo`,
    data: JSON.stringify({ contractAddress }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const fetchTokens = async (
  step,
  type = 'all',
  collections = [],
  category = null,
  sortBy = 'listedAt',
  filterBy = [],
  address = null,
  cancelToken
) => {
  const data = { step, type };
  if (collections.length > 0) {
    data.collectionAddresses = collections;
  }
  if (category !== null) {
    data.category = category;
  }
  if (address) {
    data.address = address;
  }
  if (filterBy.length) {
    data.filterby = filterBy;
  }
  data.sortby = sortBy;
  const res = await axios({
    method: 'post',
    url: `${API_URL}/nftitems/fetchTokens`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    cancelToken,
  });
  return res.data;
};

export const getBundleDetails = async bundleID => {
  const data = { bundleID };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/bundle/getBundleByID`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const increaseBundleViewCount = async bundleID => {
  const data = { bundleID };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/bundle/increaseViews`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const fetchTokenURI = async (contractAddress, tokenID) => {
  const data = { contractAddress, tokenID };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/nftitems/getTokenURI`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const increaseViewCount = async (contractAddress, tokenID) => {
  const data = { contractAddress, tokenID };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/nftitems/increaseViews`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const getListings = async (contractAddress, tokenID) => {
  const data = { contractAddress, tokenID };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/listing/getListings`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const getOffers = async (contractAddress, tokenID) => {
  const data = { contractAddress, tokenID };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/offer/getOffers`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const getTradeHistory = async (contractAddress, tokenID) => {
  const data = { contractAddress, tokenID };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/tradehistory/getTradeHistory`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const getTransferHistory = async (address, tokenID, tokenType) => {
  const data = { address, tokenID };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/nftitems/transfer${tokenType}History`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const getAccountActivity = async address => {
  const res = await axios({
    method: 'get',
    url: `${API_URL}/info/getAccountActivity/${address}`,
  });
  return res.data;
};

export const getActivityFromOthers = async address => {
  const res = await axios({
    method: 'get',
    url: `${API_URL}/info/getActivityFromOthers/${address}`,
  });
  return res.data;
};

export const banItem = async (address, tokenID, authToken) => {
  const data = { address, tokenID };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/ban/banItem`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
};

export const boostCollection = async (address, authToken) => {
  const data = { address };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/ban/boostCollection`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
};

export const createBundle = async (name, price, items, authToken) => {
  const data = { name, price, items };
  const res = await axios({
    method: 'post',
    url: `${API_URL}/bundle/createBundle`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
};
