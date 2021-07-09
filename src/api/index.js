import { useCallback } from 'react';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { ChainId } from '@sushiswap/sdk';

export const useApi = () => {
  const { chainId } = useWeb3React();

  const apiUrl = useCallback(() => {
    if (chainId === ChainId.FANTOM) {
      return 'https://api.artion.io';
    }
    return 'https://api.testnet.artion.io';
  }, [chainId]);

  const storageUrl = useCallback(() => {
    if (chainId === ChainId.FANTOM) {
      return 'https://storage.artion.io';
    }
    return 'https://storage.testnet.artion.io';
  }, [chainId]);

  const getAuthToken = async address => {
    let result = await axios({
      method: 'post',
      url: `${apiUrl()}/auth/getToken`,
      data: JSON.stringify({ address: address }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.status == 'success') {
      let token = result.data.token;
      return token;
    }
    return null;
  };

  const getAccountDetails = async authToken => {
    const res = await axios({
      method: 'get',
      url: `${apiUrl()}/account/getaccountinfo`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return res.data;
  };

  const getUserAccountDetails = async address => {
    const data = { address };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/account/getuseraccountinfo`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  };

  const updateAccountDetails = async (alias, email, bio, avatar, authToken) => {
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
      url: `${apiUrl()}/account/accountdetails`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  };

  const updateBanner = async (imageData, authToken) => {
    const formData = new FormData();
    formData.append('imgData', imageData);
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/ipfs/uploadBannerImage2Server`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  };

  const getTokenType = async contractAddress => {
    const { data } = await axios.get(
      `${apiUrl()}/info/getTokenType/${contractAddress}`
    );
    return data.data;
  };

  const get1155Info = async (contractAddress, tokenID) => {
    const { data } = await axios.get(
      `${apiUrl()}/info/get1155info/${contractAddress}/${tokenID}`
    );
    return data;
  };

  const getTokenHolders = async (contractAddress, tokenID) => {
    const { data } = await axios.get(
      `${apiUrl()}/info/getOwnership/${contractAddress}/${tokenID}`
    );
    return data;
  };

  const fetchCollections = async () => {
    const res = await axios.get(`${apiUrl()}/info/getcollections`);
    return res.data;
  };

  const fetchCollection = async contractAddress => {
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/collection/getCollectionInfo`,
      data: JSON.stringify({ contractAddress }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const fetchTokens = async (
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
      url: `${apiUrl()}/nftitems/fetchTokens`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      cancelToken,
    });
    return res.data;
  };

  const getBundleDetails = async bundleID => {
    const data = { bundleID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/bundle/getBundleByID`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const increaseBundleViewCount = async bundleID => {
    const data = { bundleID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/bundle/increaseViews`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const fetchTokenURI = async (contractAddress, tokenID) => {
    const data = { contractAddress, tokenID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/nftitems/getTokenURI`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const increaseViewCount = async (contractAddress, tokenID) => {
    const data = { contractAddress, tokenID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/nftitems/increaseViews`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const getListings = async (contractAddress, tokenID) => {
    const data = { contractAddress, tokenID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/listing/getListings`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const getOffers = async (contractAddress, tokenID) => {
    const data = { contractAddress, tokenID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/offer/getOffers`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const getBundleOffers = async bundleID => {
    const data = { bundleID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/offer/getBundleOffer`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const getTradeHistory = async (contractAddress, tokenID) => {
    const data = { contractAddress, tokenID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/tradehistory/getTradeHistory`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const getBundleTradeHistory = async bundleID => {
    const data = { bundleID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/tradehistory/getBundleTradeHistory`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const getTransferHistory = async (address, tokenID, tokenType) => {
    const data = { address, tokenID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/nftitems/transfer${tokenType}History`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const getAccountActivity = async address => {
    const res = await axios({
      method: 'get',
      url: `${apiUrl()}/info/getAccountActivity/${address}`,
    });
    return res.data;
  };

  const getActivityFromOthers = async address => {
    const res = await axios({
      method: 'get',
      url: `${apiUrl()}/info/getActivityFromOthers/${address}`,
    });
    return res.data;
  };

  const banItem = async (address, tokenID, authToken) => {
    const data = { address, tokenID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/ban/banItem`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  };

  const boostCollection = async (address, authToken) => {
    const data = { address };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/ban/boostCollection`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  };

  const createBundle = async (name, price, items, authToken) => {
    const data = { name, price, items };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/bundle/createBundle`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  };

  const deleteBundle = async (bundleID, authToken) => {
    const data = { bundleID };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/bundle/removeBundle`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  };

  const getFollowing = async (from, to) => {
    const data = { from, to };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/follow/isFollowing`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const followUser = async (follower, follow, authToken) => {
    const data = { follower, status: follow ? 1 : 0 };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/follow/update`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  };

  const getFollowers = async address => {
    const res = await axios({
      method: 'get',
      url: `${apiUrl()}/follow/getFollowers/${address}`,
    });
    return res.data;
  };

  const getFollowings = async address => {
    const res = await axios({
      method: 'get',
      url: `${apiUrl()}/follow/getFollowings/${address}`,
    });
    return res.data;
  };

  const getItemLikes = async (address, tokenID) => {
    const res = await axios({
      method: 'get',
      url: `${apiUrl()}/nftitems/getLikesCount/${address}/${tokenID}`,
    });
    return res.data;
  };

  const getBundleLikes = async bundleID => {
    const res = await axios({
      method: 'get',
      url: `${apiUrl()}/bundle/getLikesCount/${bundleID}`,
    });
    return res.data;
  };

  const isLikingItem = async (contractAddress, tokenID, follower) => {
    const data = {
      type: 'nft',
      contractAddress,
      tokenID,
      follower,
    };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/like/isLiked`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const isLikingBundle = async (bundleID, follower) => {
    const data = {
      type: 'bundle',
      bundleID,
      follower,
    };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/like/isLiked`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const likeItem = async (contractAddress, tokenID, authToken) => {
    const data = {
      type: 'nft',
      contractAddress,
      tokenID,
    };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/like/update`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  };

  const likeBundle = async (bundleID, authToken) => {
    const data = {
      type: 'bundle',
      bundleID,
    };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/like/update`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  };

  const getItemLikeUsers = async (contractAddress, tokenID) => {
    const data = {
      type: 'nft',
      contractAddress,
      tokenID,
    };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/like/getLikes`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  const getBundleLikeUsers = async bundleID => {
    const data = {
      type: 'bundle',
      bundleID,
    };
    const res = await axios({
      method: 'post',
      url: `${apiUrl()}/like/getLikes`,
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  };

  return {
    apiUrl,
    storageUrl,
    getAuthToken,
    getAccountDetails,
    getUserAccountDetails,
    updateAccountDetails,
    updateBanner,
    getTokenType,
    get1155Info,
    getTokenHolders,
    fetchCollections,
    fetchCollection,
    fetchTokens,
    getBundleDetails,
    increaseBundleViewCount,
    fetchTokenURI,
    increaseViewCount,
    getListings,
    getOffers,
    getBundleOffers,
    getTradeHistory,
    getBundleTradeHistory,
    getTransferHistory,
    getAccountActivity,
    getActivityFromOthers,
    banItem,
    boostCollection,
    createBundle,
    deleteBundle,
    getFollowing,
    followUser,
    getFollowers,
    getFollowings,
    getItemLikes,
    getBundleLikes,
    isLikingItem,
    isLikingBundle,
    likeItem,
    likeBundle,
    getItemLikeUsers,
    getBundleLikeUsers,
  };
};
