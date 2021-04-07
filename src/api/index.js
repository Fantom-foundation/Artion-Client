import axios from 'axios';

const BASE_URL = 'https://nifty.fantom.network';

export const fetchCollections = async () => {
  const res = await axios.get(`${BASE_URL}/api/info/geterc721contracts`);
  return res.data;
};
