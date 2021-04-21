import axios from 'axios';

const BASE_URL = 'https://nifty.fantom.network';

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
  const res = await axios.get(`${BASE_URL}/api/info/geterc721contracts`);
  return res.data;
};

export const fetchTokens = async step => {
  const data = { step };
  const res = await axios({
    method: 'post',
    url: `${BASE_URL}/api/erc721token/fetchTokens`,
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
    url: `${BASE_URL}/api/erc721token/getTokenURI`,
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
    url: `${BASE_URL}/api/erc721token/increaseViews`,
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};
