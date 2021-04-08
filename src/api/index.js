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

  await axios({
    method: 'post',
    url: `${BASE_URL}/api/account/accountdetails`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const fetchCollections = async () => {
  const res = await axios.get(`${BASE_URL}/api/info/geterc721contracts`);
  return res.data;
};
