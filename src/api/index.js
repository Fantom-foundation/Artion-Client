import axios from 'axios';

const BASE_URL = 'https://fmarket.fantom.network';

export const getAccountDetails = async authToken => {
  const res = await axios({
    method: 'get',
    url: `${BASE_URL}/api/account/getaccountinfo`,
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
    url: `${BASE_URL}/api/account/getuseraccountinfo`,
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
  formData.append('imgData', avatar);

  const res = await axios({
    method: 'post',
    url: `${BASE_URL}/api/account/accountdetails`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${authToken}`,
    },
  });
  return res.data;
};

export const fetchCollections = async () => {
  const res = await axios.get(`${BASE_URL}/api/info/getcollections`);
  return res.data;
};

export const fetchTokens = async (step, collections = [], address = null) => {
  const data = { step };
  if (collections.length > 0) {
    data.contractAddress = collections;
  }
  if (address) {
    data.address = address;
  }
  const res = await axios({
    method: 'post',
    url: `${BASE_URL}/api/nftitems/fetchTokens`,
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
    url: `${BASE_URL}/api/nftitems/getTokenURI`,
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
    url: `${BASE_URL}/api/nftitems/increaseViews`,
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
    url: `${BASE_URL}/api/offer/getOffers`,
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
    url: `${BASE_URL}/api/tradehistory/getTradeHistory`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};
