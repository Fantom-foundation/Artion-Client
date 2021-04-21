import axios from 'axios';

const getAuthToken = async address => {
  let result = await axios({
    method: 'post',
    url: 'https://fmarket.fantom.network/api/auth/getToken',
    data: JSON.stringify({ address: address }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (result.data.status == 'success') {
    let token = result.data.token;
    return token;
  }
  return null;
};

const General = {
  getAuthToken,
};

export default General;
