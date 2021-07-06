import React, { useEffect, useMemo, useState, useRef, Suspense } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import axios from 'axios';
import { ethers } from 'ethers';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Skeleton from 'react-loading-skeleton';
import ReactResizeDetector from 'react-resize-detector';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
  Line,
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useWeb3React } from '@web3-react/core';
import { ClipLoader } from 'react-spinners';
import { Tooltip, Menu } from '@material-ui/core';
import {
  People as PeopleIcon,
  ViewModule as ViewModuleIcon,
} from '@material-ui/icons';
import toast from 'react-hot-toast';

import Panel from 'components/Panel';
import Identicon from 'components/Identicon';
import { useApi } from 'api';
import {
  useNFTContract,
  useWFTMContract,
  useSalesContract,
  useAuctionContract,
  useBundleSalesContract,
} from 'contracts';
import { shortenAddress, formatNumber } from 'utils';
import { Contracts } from 'constants/networks';
import showToast from 'utils/toast';
import SellModal from 'components/SellModal';
import OfferModal from 'components/OfferModal';
import AuctionModal from 'components/AuctionModal';
import BidModal from 'components/BidModal';
import OwnersModal from 'components/OwnersModal';
import Header from 'components/header';
import SuspenseImg from 'components/SuspenseImg';
import ModalActions from 'actions/modal.actions';

import webIcon from 'assets/svgs/web.svg';
import discordIcon from 'assets/svgs/discord.svg';
import telegramIcon from 'assets/svgs/telegram.svg';
import twitterIcon from 'assets/svgs/twitter.svg';
import mediumIcon from 'assets/svgs/medium.svg';
import filterIcon from 'assets/svgs/filter.svg';
import checkIcon from 'assets/svgs/check.svg';

import styles from './styles.module.scss';

const ONE_MIN = 60;
const ONE_HOUR = ONE_MIN * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_MONTH = ONE_DAY * 30;

const filters = ['Trade History', 'Transfer History'];

const NFTItem = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    storageUrl,
    getBundleDetails,
    fetchTokenURI,
    increaseBundleViewCount,
    increaseViewCount,
    getListings,
    getOffers,
    getBundleOffers: _getBundleOffers,
    getTradeHistory,
    getBundleTradeHistory: _getBundleTradeHistory,
    getTransferHistory,
    fetchCollection,
    getUserAccountDetails,
    getTokenType,
    get1155Info,
    getTokenHolders,
  } = useApi();
  const { getNFTContract } = useNFTContract();
  const {
    wftmAddress,
    getWFTMBalance,
    getAllowance,
    approve,
  } = useWFTMContract();
  const {
    getSalesContract,
    buyItem,
    cancelListing,
    listItem,
    updateListing,
    createOffer,
    cancelOffer,
    acceptOffer,
  } = useSalesContract();
  const {
    getAuctionContract,
    getAuction,
    cancelAuction,
    createAuction,
    getHighestBidder,
    placeBid,
    resultAuction,
    updateAuctionStartTime,
    updateAuctionEndTime,
    updateAuctionReservePrice,
    withdrawBid,
  } = useAuctionContract();
  const {
    getBundleSalesContract,
    getBundleListing,
    buyBundle,
    cancelBundleListing,
    listBundle,
    updateBundleListing,
    createBundleOffer,
    cancelBundleOffer,
    acceptBundleOffer,
  } = useBundleSalesContract();

  const { addr: address, id: tokenID, bundleID } = useParams();

  const { account, chainId } = useWeb3React();

  const [salesContractApproved, setSalesContractApproved] = useState(false);
  const [salesContractApproving, setSalesContractApproving] = useState(false);
  const [
    bundleSalesContractApproved,
    setBundleSalesContractApproved,
  ] = useState({});
  const [auctionContractApproved, setAuctionContractApproved] = useState(false);
  const [auctionContractApproving, setAuctionContractApproving] = useState(
    false
  );

  const [previewIndex, setPreviewIndex] = useState(0);
  const [minBidIncrement, setMinBidIncrement] = useState(0);
  const [withdrawLockTime, setWithdrawLockTime] = useState(0);
  const [bundleInfo, setBundleInfo] = useState();
  const [creator, setCreator] = useState();
  const [creatorInfo, setCreatorInfo] = useState();
  const [creatorInfoLoading, setCreatorInfoLoading] = useState(false);
  const [info, setInfo] = useState();
  const [owner, setOwner] = useState();
  const [ownerInfo, setOwnerInfo] = useState();
  const [ownerInfoLoading, setOwnerInfoLoading] = useState(false);
  const [tokenOwnerLoading, setTokenOwnerLoading] = useState(false);
  const tokenType = useRef();
  const [tokenInfo, setTokenInfo] = useState();
  const holders = useRef([]);
  const [collections, setCollections] = useState([]);
  const [collection, setCollection] = useState();
  const [collectionLoading, setCollectionLoading] = useState(false);

  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [auctionModalVisible, setAuctionModalVisible] = useState(false);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [ownersModalVisible, setOwnersModalVisible] = useState(false);

  const [listingItem, setListingItem] = useState(false);
  const [cancelingListing, setCancelingListing] = useState(false);
  const [priceUpdating, setPriceUpdating] = useState(false);
  const [offerPlacing, setOfferPlacing] = useState(false);
  const [offerCanceling, setOfferCanceling] = useState(false);
  const [offerAccepting, setOfferAccepting] = useState(false);
  const [buyingItem, setBuyingItem] = useState(false);
  const [auctionStarting, setAuctionStarting] = useState(false);
  const [auctionUpdating, setAuctionUpdating] = useState(false);
  const [auctionCanceling, setAuctionCanceling] = useState(false);
  const [bidPlacing, setBidPlacing] = useState(false);
  const [bidWithdrawing, setBidWithdrawing] = useState(false);
  const [resulting, setResulting] = useState(false);
  const [resulted, setResulted] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [bid, setBid] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winningBid, setWinningBid] = useState(null);
  const [views, setViews] = useState();
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const auction = useRef(null);
  const listings = useRef([]);
  const bundleListing = useRef(null);
  const bundleItems = useRef([]);
  const offers = useRef([]);
  const tradeHistory = useRef([]);
  const transferHistory = useRef([]);

  const [filter, setFilter] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const { isConnected: isWalletConnected } = useSelector(
    state => state.ConnectWallet
  );

  const isLoggedIn = () => {
    return isWalletConnected && chainId === 250;
  };

  const getBundleInfo = async () => {
    setLoading(true);
    try {
      const { data } = await getBundleDetails(bundleID);
      setBundleInfo(data.bundle);
      setCreator(data.bundle.creator);
      setOwner(data.bundle.owner);
      bundleListing.current = await getBundleListing(
        data.bundle.owner,
        bundleID
      );
      const items = await Promise.all(
        data.items.map(async item => {
          try {
            const { data: itemData } = await axios.get(item.tokenURI);
            return { ...item, metadata: itemData };
          } catch {
            return item;
          }
        })
      );
      bundleItems.current = items;
      const _addreses = data.items.map(item => item.contractAddress);
      const addresses = [...new Set(_addreses)];
      const collections = await Promise.all(
        addresses.map(async addr => {
          try {
            const { data } = await fetchCollection(addr);
            return data;
          } catch {
            return null;
          }
        })
      );
      setCollections(collections);
    } catch {
      console.log('Bundle does not exist');
      history.replace('/404');
    }
    setLoading(false);
  };

  const getTokenURI = async () => {
    setLoading(true);
    try {
      const { data: tokenURI } = await fetchTokenURI(address, tokenID);
      const { data } = await axios.get(tokenURI);
      setInfo(data);
    } catch {
      console.log('Token URI not available');
      history.replace('/404');
    }
    setLoading(false);
  };

  const getTokenOwner = async () => {
    try {
      setTokenOwnerLoading(true);
      const type = await getTokenType(address);
      tokenType.current = type;
      if (type === 721) {
        const contract = await getNFTContract(address);
        const res = await contract.ownerOf(tokenID);
        setOwner(res);
      } else if (type === 1155) {
        const { data: _tokenInfo } = await get1155Info(address, tokenID);
        setTokenInfo(_tokenInfo);
        try {
          const { data: _holders } = await getTokenHolders(address, tokenID);
          holders.current = _holders;
        } catch {
          holders.current = [];
        }
        setOwner(null);
      }
    } catch {
      setOwner(null);
    } finally {
      setTokenOwnerLoading(false);
    }
  };

  const getCreatorInfo = async () => {
    setCreatorInfoLoading(true);
    try {
      const { data } = await getUserAccountDetails(creator);
      setCreatorInfo(data);
    } catch {
      setCreatorInfo(null);
    }
    setCreatorInfoLoading(false);
  };

  const getOwnerInfo = async () => {
    setOwnerInfoLoading(true);
    try {
      const { data } = await getUserAccountDetails(owner);
      setOwnerInfo(data);
    } catch {
      setOwnerInfo(null);
    }
    setOwnerInfoLoading(false);
  };

  const getItemListings = async () => {
    try {
      const { data } = await getListings(address, tokenID);
      listings.current = data;
    } catch (e) {
      console.log(e);
    }
  };

  const getCurrentOffers = async () => {
    try {
      const { data } = await getOffers(address, tokenID);
      offers.current = data;
    } catch (e) {
      console.log(e);
    }
  };

  const getBundleOffers = async () => {
    try {
      const { data } = await _getBundleOffers(bundleID);
      offers.current = data;
    } catch (e) {
      console.log(e);
    }
  };

  const getItemTradeHistory = async () => {
    setHistoryLoading(true);
    tradeHistory.current = [];
    try {
      const { data } = await getTradeHistory(address, tokenID);
      tradeHistory.current = data.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1
      );
    } catch (e) {
      console.log(e);
    }
    setHistoryLoading(false);
  };

  const getBundleTradeHistory = async () => {
    setHistoryLoading(true);
    tradeHistory.current = [];
    try {
      const { data } = await _getBundleTradeHistory(bundleID);
      tradeHistory.current = data.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1
      );
    } catch (e) {
      console.log(e);
    }
    setHistoryLoading(false);
  };

  const getItemTransferHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data } = await getTransferHistory(
        address,
        tokenID,
        tokenType.current
      );
      transferHistory.current = data.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1
      );
    } catch (e) {
      console.log(e);
    }
    setHistoryLoading(false);
  };

  const getAuctions = async () => {
    try {
      const _auction = await getAuction(address, tokenID);
      if (_auction.endTime !== 0) {
        auction.current = _auction;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getBid = async () => {
    try {
      const bid = await getHighestBidder(address, tokenID);
      if (bid.bid !== 0) {
        setBid(bid);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const eventMatches = (nft, id) => {
    return (
      address?.toLowerCase() === nft?.toLowerCase() &&
      parseFloat(tokenID) === parseFloat(id.toString())
    );
  };

  const itemListedHandler = async (
    owner,
    nft,
    id,
    quantity,
    pricePerItem,
    startingTime
  ) => {
    if (eventMatches(nft, id)) {
      const newListing = {
        owner,
        quantity: parseFloat(quantity.toString()),
        price: parseFloat(pricePerItem.toString()) / 10 ** 18,
        startTime: parseFloat(startingTime.toString()),
      };
      try {
        const { data } = await getUserAccountDetails(owner);
        newListing.alias = data?.alias;
        newListing.image = data?.imageHash;
        listings.current.push(newListing);
      } catch {
        listings.current.push(newListing);
      }
    }
  };

  const itemUpdatedHandler = (owner, nft, id, newPrice) => {
    if (eventMatches(nft, id)) {
      listings.current.map(listing => {
        if (listing.owner.toLowerCase() === owner.toLowerCase()) {
          listing.price = parseFloat(newPrice.toString()) / 10 ** 18;
        }
      });
    }
  };

  const itemCanceledHandler = (owner, nft, id) => {
    if (eventMatches(nft, id)) {
      listings.current = listings.current.filter(
        listing => listing.owner.toLowerCase() !== owner.toLowerCase()
      );
    }
  };

  const itemSoldHandler = async (seller, buyer, nft, id, _quantity, price) => {
    const quantity = parseFloat(_quantity.toString());
    if (eventMatches(nft, id)) {
      listings.current = listings.current.filter(
        listing => listing.owner.toLowerCase() !== seller.toLowerCase()
      );
      if (tokenType.current === 721) {
        setOwner(buyer);
      } else {
        const sellerIndex = holders.current.findIndex(
          holder => holder.address.toLowerCase() === seller.toLowerCase()
        );
        const buyerIndex = holders.current.findIndex(
          holder => holder.address.toLowerCase() === buyer.toLowerCase()
        );
        if (sellerIndex > -1) {
          holders.current[sellerIndex].supply -= quantity;
        }
        if (buyerIndex > -1) {
          holders.current[buyerIndex].supply += quantity;
        } else {
          const buyerInfo = {
            address: buyer,
            supply: quantity,
          };
          try {
            const { data } = await getUserAccountDetails(buyer);
            buyerInfo.alias = data.alias;
            buyerInfo.imageHash = data.imageHash;
          } catch (e) {
            console.log(e);
          }
          holders.current.push(buyerInfo);
        }
        if (holders.current[sellerIndex].supply === 0) {
          holders.current.splice(sellerIndex, 1);
        }
      }
      const newTradeHistory = {
        from: seller,
        to: buyer,
        price: parseFloat(price.toString()) / 10 ** 18,
        value: quantity,
        createdAt: new Date().toISOString(),
      };
      try {
        const from = await getUserAccountDetails(seller);
        newTradeHistory.fromAlias = from?.data.alias;
        newTradeHistory.fromImage = from?.data.imageHash;
      } catch (e) {
        console.log(e);
      }
      try {
        const to = await getUserAccountDetails(buyer);
        newTradeHistory.toAlias = to?.data.alias;
        newTradeHistory.toImage = to?.data.imageHash;
      } catch (e) {
        console.log(e);
      }
      tradeHistory.current = [newTradeHistory, ...tradeHistory.current];
    }
  };

  const offerCreatedHandler = async (
    creator,
    nft,
    id,
    payToken,
    quantity,
    pricePerItem,
    deadline
  ) => {
    if (eventMatches(nft, id)) {
      const newOffer = {
        creator,
        deadline: parseFloat(deadline.toString()) * 1000,
        payToken,
        pricePerItem: parseFloat(pricePerItem.toString()) / 10 ** 18,
        quantity: parseFloat(quantity.toString()),
      };
      try {
        const { data } = await getUserAccountDetails(creator);
        newOffer.alias = data.alias;
        newOffer.image = data.imageHash;
      } catch (e) {
        console.log(e);
      }
      offers.current.push(newOffer);
    }
  };

  const offerCanceledHandler = (creator, nft, id) => {
    if (eventMatches(nft, id)) {
      const newOffers = offers.current.filter(
        offer => offer.creator?.toLowerCase() !== creator?.toLowerCase()
      );
      offers.current = newOffers;
    }
  };

  const bundleListedHandler = (_owner, _bundleID, _price, _startingTime) => {
    if (bundleID.toLowerCase() === _bundleID.toLowerCase()) {
      const price = parseFloat(_price.toString()) / 10 ** 18;
      bundleListing.current = {
        price,
        startingTime: parseInt(_startingTime.toString()),
      };
    }
  };

  const bundleUpdatedHandler = (
    _owner,
    _bundleID,
    _nfts,
    _tokenIds,
    _quantities,
    _newPrice
  ) => {
    const nfts = _nfts.map(val => val);
    const tokenIds = _tokenIds.map(val => parseInt(val.toString()));
    const quantities = _quantities.map(val => parseInt(val.toString()));
    if (bundleID.toLowerCase() === _bundleID.toLowerCase()) {
      const price = parseFloat(_newPrice.toString()) / 10 ** 18;
      bundleListing.current.price = price;
      const newBundleItems = [];
      bundleItems.current.map(item => {
        let idx = 0;
        while (idx < nfts.length) {
          const address = nfts[idx];
          const tokenId = tokenIds[idx];
          const quantity = quantities[idx];
          if (
            address.toLowerCase() === item.contractAddress.toLowerCase() &&
            tokenId === item.tokenID
          ) {
            item.supply = quantity;
            newBundleItems.push(item);
            nfts.splice(idx, 1);
            tokenIds.splice(idx, 1);
            quantities.splice(idx, 1);
            break;
          }
          idx++;
        }
      });
      bundleItems.current = newBundleItems;
    }
  };

  const bundleCanceledHandler = (_owner, _bundleID) => {
    if (bundleID.toLowerCase() === _bundleID.toLowerCase()) {
      bundleListing.current = null;
    }
  };

  const bundleSoldHandler = async (_seller, _buyer, _bundleID, _price) => {
    if (bundleID.toLowerCase() === _bundleID.toLowerCase()) {
      setOwner(_buyer);
      bundleListing.current = null;
      const newTradeHistory = {
        from: _seller,
        to: _buyer,
        price: parseFloat(_price.toString()) / 10 ** 18,
        value: 1,
        createdAt: new Date().toISOString(),
      };
      try {
        const from = await getUserAccountDetails(_seller);
        newTradeHistory.fromAlias = from?.data.alias;
        newTradeHistory.fromImage = from?.data.imageHash;
      } catch (e) {
        console.log(e);
      }
      try {
        const to = await getUserAccountDetails(_buyer);
        newTradeHistory.toAlias = to?.data.alias;
        newTradeHistory.toImage = to?.data.imageHash;
      } catch (e) {
        console.log(e);
      }
      tradeHistory.current = [newTradeHistory, ...tradeHistory.current];
    }
  };

  const bundleOfferCreatedHandler = async (
    _creator,
    _bundleID,
    _payToken,
    _price,
    _deadline
  ) => {
    if (bundleID.toLowerCase() === _bundleID.toLowerCase()) {
      const newOffer = {
        creator: _creator,
        deadline: parseFloat(_deadline.toString()) * 1000,
        payToken: _payToken,
        pricePerItem: parseFloat(_price.toString()) / 10 ** 18,
        quantity: 1,
      };
      try {
        const { data } = await getUserAccountDetails(_creator);
        newOffer.alias = data.alias;
        newOffer.image = data.imageHash;
      } catch (e) {
        console.log(e);
      }
      offers.current.push(newOffer);
    }
  };

  const bundleOfferCanceledHandler = (_creator, _bundleID) => {
    if (bundleID.toLowerCase() === _bundleID.toLowerCase()) {
      const newOffers = offers.current.filter(
        offer => offer.creator?.toLowerCase() !== _creator?.toLowerCase()
      );
      offers.current = newOffers;
    }
  };

  const auctionCreatedHandler = (nft, id) => {
    if (eventMatches(nft, id)) {
      getAuctions();
    }
  };

  const auctionEndTimeUpdatedHandler = (nft, id, _endTime) => {
    if (eventMatches(nft, id)) {
      const endTime = parseFloat(_endTime.toString());
      if (auction.current) {
        const newAuction = { ...auction.current, endTime };
        auction.current = newAuction;
      }
    }
  };

  const auctionStartTimeUpdatedHandler = (nft, id, _startTime) => {
    if (eventMatches(nft, id)) {
      const startTime = parseFloat(_startTime.toString());
      if (auction.current) {
        const newAuction = { ...auction.current, startTime };
        auction.current = newAuction;
      }
    }
  };

  const auctionReservePriceUpdatedHandler = (nft, id, _price) => {
    if (eventMatches(nft, id)) {
      const price = parseFloat(_price.toString()) / 10 ** 18;
      if (auction.current) {
        const newAuction = { ...auction.current, reservePrice: price };
        auction.current = newAuction;
      }
    }
  };

  const minBidIncrementUpdatedHandler = _minBidIncrement => {
    const minBidIncrement = parseFloat(_minBidIncrement.toString());
    setMinBidIncrement(minBidIncrement);
  };

  const bidWithdrawalLockTimeUpdatedHandler = _lockTime => {
    const lockTime = parseFloat(_lockTime.toString());
    setWithdrawLockTime(lockTime);
  };

  const bidPlacedHandler = (nft, id, bidder, _bid) => {
    if (eventMatches(nft, id)) {
      const bid = parseFloat(_bid.toString()) / 10 ** 18;
      setBid({
        bidder,
        bid,
        lastBidTime: Math.floor(new Date().getTime() / 1000),
      });
    }
  };

  const bidWithdrawnHandler = (nft, id) => {
    if (eventMatches(nft, id)) {
      setBid(null);
    }
  };

  const auctionCancelledHandler = (nft, id) => {
    if (eventMatches(nft, id)) {
      auction.current = null;
      setBid(null);
    }
  };

  const auctionResultedHandler = (nft, id, winner, _winningBid) => {
    if (eventMatches(nft, id)) {
      const newAuction = { ...auction.current, resulted: true };
      auction.current = newAuction;
      setWinner(winner);
      const winningBid = parseFloat(_winningBid.toString()) / 10 ** 18;
      setWinningBid(winningBid);
    }
  };

  const addEventListeners = async () => {
    const salesContract = await getSalesContract();
    const auctionContract = await getAuctionContract();

    salesContract.on('ItemListed', itemListedHandler);
    salesContract.on('ItemUpdated', itemUpdatedHandler);
    salesContract.on('ItemCanceled', itemCanceledHandler);
    salesContract.on('ItemSold', itemSoldHandler);
    salesContract.on('OfferCreated', offerCreatedHandler);
    salesContract.on('OfferCanceled', offerCanceledHandler);

    auctionContract.on('AuctionCreated', auctionCreatedHandler);
    auctionContract.on(
      'UpdateAuctionStartTime',
      auctionStartTimeUpdatedHandler
    );
    auctionContract.on('UpdateAuctionEndTime', auctionEndTimeUpdatedHandler);
    auctionContract.on(
      'UpdateAuctionReservePrice',
      auctionReservePriceUpdatedHandler
    );
    auctionContract.on('UpdateMinBidIncrement', minBidIncrementUpdatedHandler);
    auctionContract.on(
      'UpdateBidWithdrawalLockTime',
      bidWithdrawalLockTimeUpdatedHandler
    );
    auctionContract.on('BidPlaced', bidPlacedHandler);
    auctionContract.on('BidWithdrawn', bidWithdrawnHandler);
    auctionContract.on('AuctionCancelled', auctionCancelledHandler);
    auctionContract.on('AuctionResulted', auctionResultedHandler);
  };

  const removeEventListeners = async () => {
    const salesContract = await getSalesContract();
    const auctionContract = await getAuctionContract();

    salesContract.off('ItemListed', itemListedHandler);
    salesContract.off('ItemUpdated', itemUpdatedHandler);
    salesContract.off('ItemCanceled', itemCanceledHandler);
    salesContract.off('ItemSold', itemSoldHandler);
    salesContract.off('OfferCreated', offerCreatedHandler);
    salesContract.off('OfferCanceled', offerCanceledHandler);

    auctionContract.off('AuctionCreated', auctionCreatedHandler);
    auctionContract.off(
      'UpdateAuctionStartTime',
      auctionStartTimeUpdatedHandler
    );
    auctionContract.off('UpdateAuctionEndTime', auctionEndTimeUpdatedHandler);
    auctionContract.off(
      'UpdateAuctionReservePrice',
      auctionReservePriceUpdatedHandler
    );
    auctionContract.off('UpdateMinBidIncrement', minBidIncrementUpdatedHandler);
    auctionContract.off(
      'UpdateBidWithdrawalLockTime',
      bidWithdrawalLockTimeUpdatedHandler
    );
    auctionContract.off('BidPlaced', bidPlacedHandler);
    auctionContract.off('BidWithdrawn', bidWithdrawnHandler);
    auctionContract.off('AuctionCancelled', auctionCancelledHandler);
    auctionContract.off('AuctionResulted', auctionResultedHandler);
  };

  const addBundleEventListeners = async () => {
    const bundleSalesContract = await getBundleSalesContract();

    bundleSalesContract.on('ItemListed', bundleListedHandler);
    bundleSalesContract.on('ItemUpdated', bundleUpdatedHandler);
    bundleSalesContract.on('ItemCanceled', bundleCanceledHandler);
    bundleSalesContract.on('ItemSold', bundleSoldHandler);
    bundleSalesContract.on('OfferCreated', bundleOfferCreatedHandler);
    bundleSalesContract.on('OfferCanceled', bundleOfferCanceledHandler);
  };

  const removeBundleEventListeners = async () => {
    const bundleSalesContract = await getBundleSalesContract();

    bundleSalesContract.off('ItemListed', bundleListedHandler);
    bundleSalesContract.off('ItemUpdated', bundleUpdatedHandler);
    bundleSalesContract.off('ItemCanceled', bundleCanceledHandler);
    bundleSalesContract.off('ItemSold', bundleSoldHandler);
    bundleSalesContract.off('OfferCreated', bundleOfferCreatedHandler);
    bundleSalesContract.off('OfferCanceled', bundleOfferCanceledHandler);
  };

  const getAuctionConfiguration = async () => {
    const contract = await getAuctionContract();

    const _minBidIncrement = await contract.minBidIncrement();
    const minBidIncrement = parseFloat(_minBidIncrement.toString()) / 10 ** 18;
    setMinBidIncrement(minBidIncrement);

    const _lockTime = await contract.bidWithdrawalLockTime();
    const lockTime = parseFloat(_lockTime.toString());
    setWithdrawLockTime(lockTime);
  };

  const getCollection = async () => {
    setCollectionLoading(true);
    try {
      const { data } = await fetchCollection(address);
      setCollection(data);
    } catch (err) {
      console.log(err);
    }
    setCollectionLoading(false);
  };

  useEffect(() => {
    if (!chainId) return;

    if (address && tokenID) {
      addEventListeners();
      getAuctionConfiguration();
    }

    if (bundleID) {
      addBundleEventListeners();
    }

    setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      if (address && tokenID) {
        removeEventListeners();
      }

      if (bundleID) {
        removeBundleEventListeners();
      }
    };
  }, [chainId]);

  useEffect(() => {
    if (!chainId) return;

    if (bundleID) {
      listings.current = [];

      getBundleInfo();
      getBundleOffers();
      getBundleTradeHistory();

      increaseBundleViewCount(bundleID).then(({ data }) => {
        setViews(data);
      });
    } else {
      bundleListing.current = null;

      getTokenURI();
      getTokenOwner();
      getItemListings();
      getCurrentOffers();
      getItemTradeHistory();
      getAuctions();
      getBid();

      increaseViewCount(address, tokenID).then(({ data }) => {
        setViews(data);
      });
    }
  }, [chainId, address, tokenID, bundleID]);

  useEffect(() => {
    if (address && tokenID && tokenType.current && filter === 1) {
      getItemTransferHistory();
    }
  }, [address, tokenID, tokenType.current, filter]);

  useEffect(() => {
    getCreatorInfo();
  }, [creator]);

  useEffect(() => {
    getOwnerInfo();
  }, [owner]);

  const getSalesContractStatus = async () => {
    const contract = await getNFTContract(address);
    try {
      const approved = await contract.isApprovedForAll(
        account,
        Contracts[chainId].sales
      );
      setSalesContractApproved(approved);
    } catch (e) {
      console.log(e);
    }
  };

  const getBundleSalesContractStatus = async () => {
    let contractAddresses = bundleItems.current.map(
      item => item.contractAddress
    );
    contractAddresses = contractAddresses.filter(
      (addr, idx) => contractAddresses.indexOf(addr) === idx
    );
    const approved = {};
    await Promise.all(
      contractAddresses.map(async address => {
        const contract = await getNFTContract(address);
        try {
          const _approved = await contract.isApprovedForAll(
            account,
            Contracts[chainId].bundleSales
          );
          approved[address] = _approved;
        } catch (e) {
          console.log(e);
        }
      })
    );
    setBundleSalesContractApproved(approved);
  };

  const getAuctionContractStatus = async () => {
    const contract = await getNFTContract(address);
    try {
      const approved = await contract.isApprovedForAll(
        account,
        Contracts[chainId].auction
      );
      setAuctionContractApproved(approved);
    } catch (e) {
      console.log(e);
    }
  };

  const addNFTContractEventListeners = async () => {
    const contract = await getNFTContract(address);

    contract.on('ApprovalForAll', (owner, operator, approved) => {
      if (account?.toLowerCase() === owner?.toLowerCase()) {
        if (operator === Contracts[chainId].auction) {
          setAuctionContractApproved(approved);
        } else if (operator === Contracts[chainId].sales) {
          setSalesContractApproved(approved);
        }
      }
    });
  };

  useEffect(() => {
    if (address && account && chainId) {
      getSalesContractStatus();
      getAuctionContractStatus();
    }
  }, [address, account, chainId]);

  useEffect(() => {
    if (bundleItems.current && account && chainId) {
      getBundleSalesContractStatus();
    }
  }, [bundleItems.current, account, chainId]);

  useEffect(() => {
    if (address && chainId) {
      addNFTContractEventListeners();
      getCollection();
    }
  }, [address, chainId]);

  const handleApproveSalesContract = async () => {
    setSalesContractApproving(true);
    try {
      const contract = await getNFTContract(address);
      const tx = await contract.setApprovalForAll(
        Contracts[chainId].sales,
        true
      );
      await tx.wait();
      setSalesContractApproved(true);
    } catch (e) {
      console.log(e);
    } finally {
      setSalesContractApproving(false);
    }
  };

  const handleApproveBundleSalesContract = async () => {
    if (salesContractApproving) return;
    if (bundleItems.current.length === 0) return;

    setSalesContractApproving(true);
    try {
      let contractAddresses = bundleItems.current.map(
        item => item.contractAddress
      );
      contractAddresses = contractAddresses.filter(
        (addr, idx) => contractAddresses.indexOf(addr) === idx
      );
      const approved = {};
      await Promise.all(
        contractAddresses.map(async address => {
          const contract = await getNFTContract(address);
          const _approved = await contract.isApprovedForAll(
            account,
            Contracts[chainId].bundleSales
          );
          if (!_approved) {
            const tx = await contract.setApprovalForAll(
              Contracts[chainId].bundleSales,
              true
            );
            await tx.wait();
          }
          approved[address] = true;
        })
      );
      setBundleSalesContractApproved(approved);
    } catch (e) {
      console.log(e);
    } finally {
      setSalesContractApproving(false);
    }
  };

  const handleApproveAuctionContract = async () => {
    setAuctionContractApproving(true);
    try {
      const contract = await getNFTContract(address);
      const tx = await contract.setApprovalForAll(
        Contracts[chainId].auction,
        true
      );
      await tx.wait();
      setAuctionContractApproved(true);
    } catch (e) {
      console.log(e);
    } finally {
      setAuctionContractApproving(false);
    }
  };

  const myHolding = holders.current.find(
    holder => holder.address.toLowerCase() === account?.toLowerCase()
  );

  const isMine =
    tokenType.current === 721 || bundleID
      ? owner?.toLowerCase() === account?.toLowerCase()
      : !!myHolding;

  const handleListItem = async (_price, quantity) => {
    if (listingItem) return;

    try {
      setListingItem(true);

      if (bundleID) {
        const price = ethers.utils.parseEther(_price);
        const addresses = [];
        const tokenIds = [];
        const quantities = [];
        bundleItems.current.map(item => {
          addresses.push(item.contractAddress);
          tokenIds.push(item.tokenID);
          quantities.push(item.supply);
        });
        const tx = await listBundle(
          bundleID,
          addresses,
          tokenIds,
          quantities,
          price,
          ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000)),
          '0x0000000000000000000000000000000000000000'
        );
        await tx.wait();

        showToast('success', 'Bundle listed successfully!');
      } else {
        const price = ethers.utils.parseEther(_price);
        const tx = await listItem(
          address,
          ethers.BigNumber.from(tokenID),
          ethers.BigNumber.from(quantity),
          price,
          ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000)),
          '0x0000000000000000000000000000000000000000'
        );
        await tx.wait();

        showToast('success', 'Item listed successfully!');
      }

      setSellModalVisible(false);
      setListingItem(false);
    } catch {
      setListingItem(false);
    }
  };

  const isBundleContractApproved = (() => {
    if (bundleItems.current.length === 0) return false;
    let contractAddresses = bundleItems.current.map(
      item => item.contractAddress
    );
    contractAddresses = contractAddresses.filter(
      (addr, idx) => contractAddresses.indexOf(addr) === idx
    );
    const approved = contractAddresses
      .map(addr => bundleSalesContractApproved[addr])
      .reduce((cur, _approved) => cur && _approved, true);
    return approved;
  })();

  const handleUpdatePrice = async (_price, quantity) => {
    if (priceUpdating) return;

    try {
      setPriceUpdating(true);

      const price = ethers.utils.parseEther(_price);
      if (bundleID) {
        const tx = await updateBundleListing(bundleID, price);
        await tx.wait();
      } else {
        const tx = await updateListing(
          address,
          tokenID,
          price,
          ethers.BigNumber.from(quantity)
        );
        await tx.wait();
      }

      showToast('success', 'Price updated successfully!');

      setPriceUpdating(false);
      setSellModalVisible(false);
    } catch (e) {
      setPriceUpdating(false);
    }
  };

  const cancelList = async () => {
    if (cancelingListing) return;

    setCancelingListing(true);
    try {
      if (bundleID) {
        await cancelBundleListing(bundleID);
        bundleListing.current = null;
        showToast('success', 'Bundle unlisted successfully!');
      } else {
        await cancelListing(address, tokenID);
        listings.current = listings.current.filter(
          listing => listing.owner.toLowerCase() !== account.toLowerCase()
        );

        showToast('success', 'Item unlisted successfully!');
      }
    } catch (e) {
      console.log(e);
    }
    setCancelingListing(false);
  };

  const handleBuyItem = async listing => {
    if (buyingItem) return;

    try {
      setBuyingItem(true);
      const _price = listing.price * listing.quantity;
      const price = ethers.utils.parseEther(_price.toString());
      const tx = await buyItem(
        address,
        ethers.BigNumber.from(tokenID),
        listing.owner,
        price,
        account
      );
      await tx.wait();
      setBuyingItem(false);

      showToast('success', 'You have bought the item!');

      listings.current = listings.current.filter(
        _listing => _listing.owner !== listing.owner
      );
    } catch {
      setBuyingItem(false);
    }
  };

  const handleBuyBundle = async () => {
    if (buyingItem) return;

    try {
      setBuyingItem(true);
      const price = ethers.utils.parseEther(
        bundleListing.current.price.toString()
      );
      const tx = await buyBundle(bundleID, price, account);
      await tx.wait();
      setBuyingItem(false);

      showToast('success', 'You have bought the bundle!');

      // eslint-disable-next-line require-atomic-updates
      bundleListing.current = null;
    } catch {
      setBuyingItem(false);
    }
  };

  const handleMakeOffer = async (_price, quantity, endTime) => {
    if (offerPlacing) return;

    try {
      setOfferPlacing(true);
      const price = ethers.utils.parseEther(_price.toString());
      const deadline = Math.floor(endTime.getTime() / 1000);
      const amount = price.mul(quantity);

      const balance = await getWFTMBalance(account);

      if (balance.lt(amount)) {
        const toastId = showToast(
          'error',
          'Insufficient WFTM Balance!',
          'You can wrap FTM in the WFTM station.',
          () => {
            toast.dismiss(toastId);
            setOfferModalVisible(false);
            dispatch(ModalActions.showWFTMModal());
          }
        );
        setOfferPlacing(false);
        return;
      }

      if (bundleID) {
        const allowance = await getAllowance(
          account,
          Contracts[chainId].bundleSales
        );
        if (allowance.lt(amount)) {
          await approve(Contracts[chainId].bundleSales, amount);
        }

        const tx = await createBundleOffer(
          bundleID,
          wftmAddress(),
          price,
          ethers.BigNumber.from(deadline)
        );

        await tx.wait();
      } else {
        const allowance = await getAllowance(account, Contracts[chainId].sales);
        if (allowance.lt(amount)) {
          await approve(Contracts[chainId].sales, amount);
        }

        const tx = await createOffer(
          address,
          ethers.BigNumber.from(tokenID),
          wftmAddress(),
          ethers.BigNumber.from(quantity),
          price,
          ethers.BigNumber.from(deadline)
        );

        await tx.wait();
      }

      showToast('success', 'Offer placed successfully!');

      setOfferModalVisible(false);
    } catch (e) {
      console.log(e);
    } finally {
      setOfferPlacing(false);
    }
  };

  const handleAcceptOffer = async offer => {
    if (offerAccepting) return;

    try {
      setOfferAccepting(true);
      if (bundleID) {
        const tx = await acceptBundleOffer(bundleID, offer.creator);
        await tx.wait();
      } else {
        const tx = await acceptOffer(address, tokenID, offer.creator);
        await tx.wait();
      }
      setOfferAccepting(false);

      showToast('success', 'Offer accepted!');

      offers.current = offers.current.filter(
        _offer => _offer.creator !== offer.creator
      );
    } catch {
      setOfferAccepting(false);
    }
  };

  const handleCancelOffer = async () => {
    if (offerCanceling) return;

    try {
      setOfferCanceling(true);

      if (bundleID) {
        const tx = await cancelBundleOffer(bundleID);
        await tx.wait();
      } else {
        const tx = await cancelOffer(address, tokenID);
        await tx.wait();
      }

      showToast('success', 'You have withdrawn your offer!');

      offerCanceledHandler(account, address, ethers.BigNumber.from(tokenID));

      setOfferCanceling(false);
    } catch {
      setOfferCanceling(false);
    }
  };

  const handleStartAuction = async (_price, _startTime, _endTime) => {
    try {
      setAuctionStarting(true);

      const price = ethers.utils.parseEther(_price);
      const startTime = Math.floor(_startTime.getTime() / 1000);
      const endTime = Math.floor(_endTime.getTime() / 1000);

      const tx = await createAuction(
        address,
        ethers.BigNumber.from(tokenID),
        price,
        ethers.BigNumber.from(startTime),
        ethers.BigNumber.from(endTime)
      );
      await tx.wait();

      showToast('success', 'Auction started!');

      setAuctionStarting(false);
      setAuctionModalVisible(false);
    } catch {
      setAuctionStarting(false);
    }
  };

  const handleUpdateAuction = async (_price, _startTime, _endTime) => {
    if (!auction.current) return;

    try {
      setAuctionUpdating(true);

      if (parseFloat(_price) !== auction.current.reservePrice) {
        const price = ethers.utils.parseEther(_price);
        await updateAuctionReservePrice(
          address,
          ethers.BigNumber.from(tokenID),
          ethers.BigNumber.from(price)
        );

        showToast('success', 'Auction reserve price updated successfully!');
      }

      const startTime = Math.floor(_startTime.getTime() / 1000);
      if (startTime !== auction.current.startTime) {
        await updateAuctionStartTime(
          address,
          ethers.BigNumber.from(tokenID),
          ethers.BigNumber.from(startTime)
        );

        showToast('success', 'Auction start time updated successfully!');
      }

      const endTime = Math.floor(_endTime.getTime() / 1000);
      if (endTime !== auction.current.endTime) {
        await updateAuctionEndTime(
          address,
          ethers.BigNumber.from(tokenID),
          ethers.BigNumber.from(endTime)
        );

        showToast('success', 'Auction end time updated successfully!');
      }

      setAuctionUpdating(false);
      setAuctionModalVisible(false);
    } catch {
      setAuctionUpdating(false);
    }
  };

  const cancelCurrentAuction = async () => {
    if (auctionCanceling) return;

    try {
      setAuctionCanceling(true);
      await cancelAuction(address, tokenID);
      auction.current = null;

      showToast('success', 'Auction canceled!');
    } catch (err) {
      console.log(err);
    } finally {
      setAuctionCanceling(false);
    }
  };

  const handleResultAuction = async () => {
    if (resulting) return;

    try {
      setResulting(true);
      await resultAuction(address, tokenID);
      setResulting(false);
      setResulted(true);
      showToast('success', 'Auction resulted!');
    } catch {
      setResulting(false);
    }
  };

  const handlePlaceBid = async _price => {
    if (bidPlacing) return;

    try {
      setBidPlacing(true);

      const price = ethers.utils.parseEther(_price);
      const tx = await placeBid(
        address,
        ethers.BigNumber.from(tokenID),
        price,
        account
      );
      await tx.wait();

      showToast('success', 'Bid placed successfully!');

      setBidPlacing(false);
      setBidModalVisible(false);
    } catch {
      setBidPlacing(false);
    }
  };

  const handleWithdrawBid = async () => {
    if (bidWithdrawing) return;

    try {
      setBidWithdrawing(true);
      await withdrawBid(address, ethers.BigNumber.from(tokenID));
      setBidWithdrawing(false);
      showToast('success', 'You have withdrawn your bid!');
    } catch {
      setBidWithdrawing(false);
    }
  };

  const hasMyOffer = useMemo(() => {
    return (
      offers.current.findIndex(
        offer =>
          offer.creator?.toLowerCase() === account?.toLowerCase() &&
          offer.deadline >= now.getTime()
      ) > -1
    );
  }, [offers.current]);

  const data = [...tradeHistory.current].reverse().map(history => {
    const saleDate = new Date(history.createdAt);
    return {
      date: `${saleDate.getFullYear()}/${saleDate.getMonth() +
        1}/${saleDate.getDate()}`,
      price: history.price,
      amt: 2100,
    };
  });

  const formatDiff = diff => {
    if (diff >= ONE_MONTH) {
      const m = Math.ceil(diff / ONE_MONTH);
      return `${m} Month${m > 1 ? 's' : ''}`;
    }
    if (diff >= ONE_DAY) {
      const d = Math.ceil(diff / ONE_DAY);
      return `${d} Day${d > 1 ? 's' : ''}`;
    }
    if (diff >= ONE_HOUR) {
      const h = Math.ceil(diff / ONE_HOUR);
      return `${h} Hour${h > 1 ? 's' : ''}`;
    }
    if (diff >= ONE_MIN) {
      const h = Math.ceil(diff / ONE_MIN);
      return `${h} Min${h > 1 ? 's' : ''}`;
    }
    return `${diff} Second${diff > 1 ? 's' : ''}`;
  };

  const formatExpiration = deadline => {
    if (deadline < now.getTime()) return 'Expired';

    let diff = new Date(deadline).getTime() - now.getTime();
    diff = Math.floor(diff / 1000);
    return formatDiff(diff);
  };

  const formatDuration = endTime => {
    const diff = endTime - Math.floor(now.getTime() / 1000);
    return formatDiff(diff);
  };

  const formatDate = _date => {
    const date = new Date(_date);
    const diff = Math.floor((now - date.getTime()) / 1000);
    return `${formatDiff(diff)} Ago`;
  };

  const auctionStarted = now.getTime() / 1000 >= auction.current?.startTime;

  const auctionEnded =
    auction.current?.endTime <= now.getTime() / 1000 || resulted;

  const auctionActive = () => auctionStarted && !auctionEnded;

  const canWithdraw = () =>
    bid?.bidder?.toLowerCase() === account?.toLowerCase() &&
    bid?.lastBidTime + withdrawLockTime < now.getTime() / 1000;

  const withdrawWaitTime = () => {
    if (!bid) return '';

    const s = 20 * 60 - Math.floor(now.getTime() / 1000 - bid.lastBidTime);
    if (s <= 0) return '';

    if (s >= 60) {
      return `${Math.ceil(s / 60)} mins`;
    }
    return `${s} seconds`;
  };

  const myListing = () => {
    return listings.current.find(
      listing => listing.owner.toLowerCase() === account.toLowerCase()
    );
  };

  const hasListing = () => {
    return bundleListing.current || myListing() !== undefined;
  };

  const maxSupply = () => {
    let supply = 0;
    holders.current.map(holder => {
      if (
        holder.address.toLowerCase() !== account.toLowerCase() &&
        holder.supply > supply
      ) {
        supply = holder.supply;
      }
    });
    return supply;
  };

  const handleMenuOpen = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectFilter = _filter => {
    setFilter(_filter);
    handleMenuClose();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      classes={{
        paper: styles.filtermenu,
        list: styles.menuList,
      }}
    >
      <div className={styles.menuTitle}>Filter By</div>
      {filters.map((_filter, idx) => (
        <div
          key={idx}
          className={cx(styles.menu, filter === idx && styles.active)}
          onClick={() => handleSelectFilter(idx)}
        >
          {_filter}
          <img src={checkIcon} />
        </div>
      ))}
    </Menu>
  );

  const renderProperties = properties => {
    const res = [];
    Object.keys(properties).map((key, idx) => {
      if (!['address', 'createdAt'].includes(key)) {
        res.push(
          <div key={idx} className={styles.property}>
            <div className={styles.propertyLabel}>{key} : </div>
            <div className={styles.propertyValue}>
              {key === 'recipient' ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://ftmscan.com/address/${properties[key]}`}
                >
                  {shortenAddress(properties[key])}
                </a>
              ) : (
                properties[key]
              )}
              {key === 'royalty' ? '%' : ''}
            </div>
          </div>
        );
      }
    });
    return res;
  };

  const renderItemInfo = () => (
    <>
      <div className={styles.itemCategory}>
        {collection?.collectionName || collection?.name || ''}
      </div>
      <div className={styles.itemName}>
        {(bundleID ? bundleInfo?.name : info?.name) || ''}
      </div>
      {info?.description && (
        <div className={styles.itemDescription}>{info.description}</div>
      )}
      <div className={styles.itemStats}>
        {(ownerInfoLoading || tokenOwnerLoading || owner || tokenInfo) && (
          <div className={styles.itemOwner}>
            {ownerInfoLoading || tokenOwnerLoading ? (
              <Skeleton width={180} height={25} />
            ) : tokenType.current === 721 || bundleID ? (
              <>
                <div className={styles.ownerAvatar}>
                  {ownerInfo?.imageHash ? (
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${ownerInfo.imageHash}`}
                      className={styles.avatar}
                    />
                  ) : (
                    <Identicon
                      account={owner}
                      size={32}
                      className={styles.avatar}
                    />
                  )}
                </div>
                Owned by&nbsp;
                <Link to={`/account/${owner}`} className={styles.ownerName}>
                  {isMine ? 'Me' : ownerInfo?.alias || shortenAddress(owner)}
                </Link>
              </>
            ) : tokenInfo ? (
              <>
                <div
                  className={cx(styles.itemViews, styles.clickable)}
                  onClick={() => setOwnersModalVisible(true)}
                >
                  <PeopleIcon style={styles.itemIcon} />
                  &nbsp;{formatNumber(holders.current.length)}
                  &nbsp;owner{holders.current.length > 1 && 's'}
                </div>
                <div className={styles.itemViews}>
                  <ViewModuleIcon style={styles.itemIcon} />
                  &nbsp;{formatNumber(tokenInfo.totalSupply)} total
                </div>
              </>
            ) : null}
          </div>
        )}
        <div className={styles.itemViews}>
          <FontAwesomeIcon icon={faEye} color="#00000099" />
          &nbsp;
          {isNaN(views) ? (
            <Skeleton width={80} height={24} />
          ) : (
            `${formatNumber(views)} View${views > 1 ? 's' : ''}`
          )}
        </div>
      </div>
    </>
  );

  const renderBundleItem = (item, idx) => {
    if (!item) {
      return (
        <div className={styles.bundleItem} key={idx}>
          <div className={styles.bundleItemImage}>
            <Skeleton width={60} height={60} />
          </div>
          <div className={styles.bundleItemInfo}>
            <div>
              <Skeleton width={180} height={22} />
            </div>
            <div>
              <Skeleton width={180} height={22} />
            </div>
          </div>
          <div className={styles.bundleItemSupply}>
            <Skeleton width={80} height={20} />
          </div>
        </div>
      );
    }

    const collection = item
      ? collections.find(col => col.erc721Address === item.contractAddress)
      : null;
    return (
      <Link
        to={`/explore/${item.contractAddress}/${item.tokenID}`}
        className={styles.bundleItem}
        key={idx}
      >
        <div className={styles.bundleItemImage}>
          <Suspense
            fallback={
              <Loader type="Oval" color="#007BFF" height={32} width={32} />
            }
          >
            <SuspenseImg src={`${storageUrl()}/image/${item.thumbnailPath}`} />
          </Suspense>
        </div>
        <div className={styles.bundleItemInfo}>
          <div className={styles.bundleItemCategory}>
            {collection?.collectionName || collection?.name}
          </div>
          <div className={styles.bundleItemName}>{item.name}</div>
        </div>
        <div className={styles.bundleItemSupply}>x{item.supply}</div>
      </Link>
    );
  };

  const renderBundleInfoPanel = () => (
    <Panel
      title={<div className={styles.panelTitle}>Bundle Description</div>}
      expanded
    >
      <div className={styles.panelBody}>
        {creatorInfoLoading ? (
          <Skeleton width={180} height={25} />
        ) : (
          <div className={styles.itemOwner}>
            <div className={styles.ownerAvatar}>
              {creatorInfo?.imageHash ? (
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${creatorInfo.imageHash}`}
                  className={styles.avatar}
                />
              ) : (
                <Identicon
                  account={creator}
                  size={32}
                  className={styles.avatar}
                />
              )}
            </div>
            Created by&nbsp;
            <Link to={`/account/${creator}`} className={styles.ownerName}>
              {creator?.toLowerCase() === account?.toLowerCase()
                ? 'Me'
                : creatorInfo?.alias || shortenAddress(creator)}
            </Link>
          </div>
        )}
      </div>
    </Panel>
  );

  const renderAboutPanel = () => (
    <Panel
      title={
        <div className={styles.panelTitle}>
          About&nbsp;
          {collectionLoading ? (
            <Skeleton width={80} height={20} />
          ) : (
            collection?.collectionName || collection?.name
          )}
        </div>
      }
    >
      <div className={styles.panelBody}>
        <div className={styles.collectionDescription}>
          {collection?.description || 'Unverified Collection'}
        </div>

        <div className={styles.socialLinks}>
          {collection?.siteUrl?.length > 0 && (
            <a
              href={collection?.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <img src={webIcon} />
            </a>
          )}
          {collection?.twitterHandle?.length > 0 && (
            <a
              href={`https://twitter.com/${collection?.twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <img src={twitterIcon} />
            </a>
          )}
          {collection?.mediumHandle?.length > 0 && (
            <a
              href={`https://medium.com/${collection?.mediumHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <img src={mediumIcon} />
            </a>
          )}
          {collection?.telegram?.length > 0 && (
            <a
              href={`https://t.me/${collection?.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <img src={telegramIcon} />
            </a>
          )}
          {collection?.discord?.length > 0 && (
            <a
              href={`https://discord.gg/${collection?.discord}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <img src={discordIcon} />
            </a>
          )}
        </div>
      </div>
    </Panel>
  );

  const renderCollectionPanel = () => (
    <Panel title="Chain Info">
      <div className={styles.panelBody}>
        <div className={styles.panelLine}>
          <div className={styles.panelLabel}>Collection</div>
          <a
            href={`https://ftmscan.com/token/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.panelValue}
          >
            {shortenAddress(address)}
          </a>
        </div>
        <div className={styles.panelLine}>
          <div className={styles.panelLabel}>Network</div>
          <div className={styles.panelValue}>Fantom Opera</div>
        </div>
        <div className={styles.panelLine}>
          <div className={styles.panelLabel}>Chain ID</div>
          <div className={styles.panelValue}>250</div>
        </div>
      </div>
    </Panel>
  );

  return (
    <div
      className={cx(styles.container, isLoggedIn() ? styles.withHeader : '')}
    >
      <Header light />
      {isLoggedIn() && (
        <div className={styles.header}>
          {isMine && (
            <>
              {auction.current?.resulted === false ? (
                <div
                  className={cx(
                    styles.headerButton,
                    auctionCanceling && styles.disabled
                  )}
                  onClick={cancelCurrentAuction}
                >
                  Cancel Auction
                </div>
              ) : null}
              {!bundleID &&
                (!auction.current || !auction.current.resulted) &&
                !hasListing() &&
                tokenType.current !== 1155 && (
                  <div
                    className={cx(
                      styles.headerButton,
                      (auctionStarting || auctionUpdating) && styles.disabled
                    )}
                    onClick={() => setAuctionModalVisible(true)}
                  >
                    {auction.current ? 'Update Auction' : 'Start Auction'}
                  </div>
                )}
              {(!auction.current || auction.current.resulted) && (
                <>
                  {hasListing() ? (
                    <div
                      className={cx(
                        styles.headerButton,
                        cancelingListing && styles.disabled
                      )}
                      onClick={cancelList}
                    >
                      Cancel Listing
                    </div>
                  ) : null}
                  <div
                    className={cx(
                      styles.headerButton,
                      (listingItem || priceUpdating) && styles.disabled
                    )}
                    onClick={() =>
                      !(listingItem || priceUpdating)
                        ? setSellModalVisible(true)
                        : null
                    }
                  >
                    {hasListing() ? 'Update Listing' : 'Sell'}
                  </div>
                </>
              )}
            </>
          )}
          {(!isMine ||
            (tokenType.current === 1155 &&
              myHolding.supply < tokenInfo.totalSupply)) &&
            (!auction.current || auction.current.resulted) && (
              <div
                className={cx(
                  styles.headerButton,
                  (offerPlacing || offerCanceling) && styles.disabled
                )}
                onClick={
                  hasMyOffer
                    ? handleCancelOffer
                    : () => setOfferModalVisible(true)
                }
              >
                {hasMyOffer ? 'Withdraw Offer' : 'Make Offer'}
              </div>
            )}
        </div>
      )}
      <div className={styles.inner}>
        <div className={styles.topContainer}>
          <div className={styles.itemSummary}>
            <div className={styles.itemMedia}>
              <div className={styles.media}>
                {loading ? (
                  <Loader
                    type="Oval"
                    color="#007BFF"
                    height={32}
                    width={32}
                    className={styles.loader}
                  />
                ) : !bundleID || bundleItems.current.length ? (
                  <Suspense
                    fallback={
                      <Loader
                        type="Oval"
                        color="#007BFF"
                        height={32}
                        width={32}
                        className={styles.loader}
                      />
                    }
                  >
                    <SuspenseImg
                      src={
                        bundleID
                          ? bundleItems.current[previewIndex].metadata?.image
                          : info?.image
                      }
                    />
                  </Suspense>
                ) : null}
              </div>
              {bundleID && (
                <div className={styles.previewList}>
                  {(loading ? [null, null, null] : bundleItems.current).map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className={cx(
                          styles.preview,
                          !loading && idx === previewIndex && styles.active
                        )}
                        onClick={() => setPreviewIndex(idx)}
                      >
                        {item ? (
                          <Suspense
                            fallback={
                              <Loader
                                type="Oval"
                                color="#007BFF"
                                height={32}
                                width={32}
                                className={styles.loader}
                              />
                            }
                          >
                            <SuspenseImg
                              src={
                                item.thumbnailPath?.length > 10
                                  ? `${storageUrl()}/image/${
                                      item.thumbnailPath
                                    }`
                                  : item.metadata?.image
                              }
                            />
                          </Suspense>
                        ) : (
                          <Skeleton width={72} height={72} />
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            <div className={styles.itemInfo}>{renderItemInfo()}</div>
            <div className={styles.itemInfoCont}>
              {info?.properties && (
                <Panel title="Properties">
                  <div className={styles.panelBody}>
                    {renderProperties(info.properties)}
                  </div>
                </Panel>
              )}
              {bundleID && renderBundleInfoPanel()}
              {!bundleID && renderAboutPanel()}
              {!bundleID && renderCollectionPanel()}
            </div>
          </div>
          <div className={styles.itemMain}>
            <div className={styles.itemInfoWrapper}>{renderItemInfo()}</div>
            {info?.properties && (
              <div className={cx(styles.panelWrapper, styles.infoPanel)}>
                <Panel title="Properties">
                  <div className={styles.panelBody}>
                    {renderProperties(info.properties)}
                  </div>
                </Panel>
              </div>
            )}
            {bundleID && (
              <div className={cx(styles.panelWrapper, styles.infoPanel)}>
                {renderBundleInfoPanel()}
              </div>
            )}
            {!bundleID && (
              <div className={cx(styles.panelWrapper, styles.infoPanel)}>
                {renderAboutPanel()}
              </div>
            )}
            {!bundleID && (
              <div className={cx(styles.panelWrapper, styles.infoPanel)}>
                {renderCollectionPanel()}
              </div>
            )}
            {(winner || auction.current?.resulted === false) && (
              <div className={styles.panelWrapper}>
                <Panel
                  title={
                    auctionStarted
                      ? auctionEnded
                        ? 'Sale ended'
                        : `Sale ends in ${formatDuration(
                            auction.current.endTime
                          )} (${new Date(
                            auction.current.endTime * 1000
                          ).toLocaleString()})`
                      : `Sale starts in ${formatDuration(
                          auction.current.startTime
                        )}`
                  }
                  fixed
                >
                  <div className={styles.bids}>
                    {auctionEnded ? (
                      <div className={styles.result}>
                        {auction.current.resulted ? (
                          <>
                            {'Winner: '}
                            <Link to={`/account/${winner}`}>
                              {winner?.toLowerCase() === account?.toLowerCase()
                                ? 'Me'
                                : shortenAddress(winner)}
                            </Link>
                            {` (${formatNumber(winningBid)} FTM)`}
                          </>
                        ) : (
                          'Waiting for result'
                        )}
                      </div>
                    ) : bid ? (
                      <div>
                        <div className={styles.bidtitle}>
                          Reserve Price :&nbsp;
                          {formatNumber(auction.current.reservePrice)} FTM
                        </div>
                        <div className={styles.bidtitle}>
                          Highest Bid
                          {bid.bid < auction.current.reservePrice
                            ? ' -- Reserve price not met.'
                            : ''}
                        </div>
                        <div className={styles.bidAmount}>
                          {formatNumber(bid.bid)} FTM
                        </div>
                      </div>
                    ) : (
                      <div className={styles.bidtitle}>
                        No bids yet ( Reserve Price :{' '}
                        {formatNumber(auction.current.reservePrice)} FTM )
                      </div>
                    )}
                    {!isMine &&
                      auctionActive() &&
                      (bid?.bidder?.toLowerCase() === account?.toLowerCase() ? (
                        <Tooltip
                          title={`You can withdraw bid after ${withdrawWaitTime()}.`}
                          classes={{
                            tooltip: cx(
                              styles.tooltip,
                              withdrawWaitTime().length === 0 && styles.hidden
                            ),
                          }}
                        >
                          <div
                            className={cx(
                              styles.withdrawBid,
                              (!canWithdraw() || bidWithdrawing) &&
                                styles.disabled
                            )}
                            onClick={() =>
                              canWithdraw() ? handleWithdrawBid() : null
                            }
                          >
                            {bidWithdrawing
                              ? 'Withdrawing Bid...'
                              : 'Withdraw Bid'}
                          </div>
                        </Tooltip>
                      ) : (
                        <div
                          className={cx(
                            styles.placeBid,
                            bidPlacing && styles.disabled
                          )}
                          onClick={() => setBidModalVisible(true)}
                        >
                          Place Bid
                        </div>
                      ))}
                    {isMine && auctionEnded && !auction.current.resulted && (
                      <div
                        className={cx(
                          styles.placeBid,
                          resulting && styles.disabled
                        )}
                        onClick={handleResultAuction}
                      >
                        {resulting ? 'Resulting...' : 'Result'}
                      </div>
                    )}
                  </div>
                </Panel>
              </div>
            )}
            {!bundleID && (
              <div className={styles.panelWrapper}>
                <Panel title="Price History">
                  <ReactResizeDetector>
                    {({ width }) =>
                      width > 0 ? (
                        <div className={styles.chartWrapper}>
                          <div className={styles.chart}>
                            <LineChart
                              width={width}
                              height={250}
                              data={data}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <XAxis dataKey="date" />
                              <YAxis />
                              <ChartTooltip />
                              <CartesianGrid stroke="#eee" />
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#2479FA"
                              />
                            </LineChart>
                          </div>
                        </div>
                      ) : (
                        <div>{width}</div>
                      )
                    }
                  </ReactResizeDetector>
                </Panel>
              </div>
            )}
            <div className={styles.panelWrapper}>
              <Panel title="Listings" expanded>
                <div className={styles.listings}>
                  <div className={cx(styles.listing, styles.heading)}>
                    <div className={styles.owner}>From</div>
                    <div className={styles.price}>Price</div>
                    {tokenInfo?.totalSupply > 1 && (
                      <div className={styles.quantity}>Quantity</div>
                    )}
                    <div className={styles.buy} />
                  </div>
                  {bundleID
                    ? bundleListing.current && (
                        <div className={styles.listing}>
                          <div className={styles.owner}>
                            {loading ? (
                              <Skeleton width={120} height={24} />
                            ) : (
                              <Link to={`/account/${owner}`}>
                                <div className={styles.userAvatarWrapper}>
                                  {ownerInfo?.imageHash ? (
                                    <img
                                      src={`https://gateway.pinata.cloud/ipfs/${ownerInfo.imageHash}`}
                                      className={styles.userAvatar}
                                    />
                                  ) : (
                                    <Identicon
                                      account={owner}
                                      size={24}
                                      className={styles.userAvatar}
                                    />
                                  )}
                                </div>
                                {isMine
                                  ? 'Me'
                                  : ownerInfo?.alias || shortenAddress(owner)}
                              </Link>
                            )}
                          </div>
                          <div className={styles.price}>
                            {loading ? (
                              <Skeleton width={100} height={24} />
                            ) : (
                              `${formatNumber(bundleListing.current.price)} FTM`
                            )}
                          </div>
                          <div className={styles.buy}>
                            {!isMine && (
                              <div
                                className={cx(
                                  styles.buyButton,
                                  (salesContractApproving || buyingItem) &&
                                    styles.disabled
                                )}
                                onClick={handleBuyBundle}
                              >
                                {buyingItem ? (
                                  <ClipLoader color="#FFF" size={16} />
                                ) : (
                                  'Buy'
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    : listings.current.map((listing, idx) => (
                        <div className={styles.listing} key={idx}>
                          <div className={styles.owner}>
                            <Link to={`/account/${listing.owner}`}>
                              <div className={styles.userAvatarWrapper}>
                                {listing.image ? (
                                  <img
                                    src={`https://gateway.pinata.cloud/ipfs/${listing.image}`}
                                    className={styles.userAvatar}
                                  />
                                ) : (
                                  <Identicon
                                    account={listing.owner}
                                    size={24}
                                    className={styles.userAvatar}
                                  />
                                )}
                              </div>
                              {listing.alias || listing.owner.substr(0, 6)}
                            </Link>
                          </div>
                          <div className={styles.price}>
                            {formatNumber(listing.price)} FTM
                          </div>
                          {tokenInfo?.totalSupply > 1 && (
                            <div className={styles.quantity}>
                              {formatNumber(listing.quantity)}
                            </div>
                          )}
                          <div className={styles.buy}>
                            {listing.owner.toLowerCase() !==
                              account.toLowerCase() && (
                              <div
                                className={cx(
                                  styles.buyButton,
                                  (salesContractApproving || buyingItem) &&
                                    styles.disabled
                                )}
                                onClick={() => handleBuyItem(listing)}
                              >
                                {buyingItem ? (
                                  <ClipLoader color="#FFF" size={16} />
                                ) : (
                                  'Buy'
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                </div>
              </Panel>
            </div>
            <div className={styles.panelWrapper}>
              <Panel title="Offers" expanded>
                <div className={styles.offers}>
                  <div className={cx(styles.offer, styles.heading)}>
                    <div className={styles.owner}>From</div>
                    <div className={styles.price}>Price</div>
                    {tokenInfo?.totalSupply > 1 && (
                      <div className={styles.quantity}>Quantity</div>
                    )}
                    <div className={styles.deadline}>Expires In</div>
                    <div className={styles.buy} />
                  </div>
                  {offers.current
                    .filter(offer => offer.deadline > now.getTime())
                    .sort((a, b) => (a.pricePerItem < b.pricePerItem ? 1 : -1))
                    .map((offer, idx) => (
                      <div className={styles.offer} key={idx}>
                        <div className={styles.owner}>
                          <Link to={`/account/${offer.creator}`}>
                            <div className={styles.userAvatarWrapper}>
                              {offer.image ? (
                                <img
                                  src={`https://gateway.pinata.cloud/ipfs/${offer.image}`}
                                  className={styles.userAvatar}
                                />
                              ) : (
                                <Identicon
                                  account={offer.creator}
                                  size={24}
                                  className={styles.userAvatar}
                                />
                              )}
                            </div>
                            {offer.alias || offer.creator.substr(0, 6)}
                          </Link>
                        </div>
                        <div className={styles.price}>
                          {formatNumber(offer.pricePerItem || offer.price)} FTM
                        </div>
                        {tokenInfo?.totalSupply > 1 && (
                          <div className={styles.quantity}>
                            {formatNumber(offer.quantity)}
                          </div>
                        )}
                        <div className={styles.deadline}>
                          {formatExpiration(offer.deadline)}
                        </div>
                        <div className={styles.buy}>
                          {(isMine ||
                            (myHolding &&
                              myHolding.supply >= offer.quantity)) &&
                            offer.creator?.toLowerCase() !==
                              account?.toLowerCase() && (
                              <div
                                className={cx(
                                  styles.buyButton,
                                  (salesContractApproving || offerAccepting) &&
                                    styles.disabled
                                )}
                                onClick={
                                  bundleID
                                    ? isBundleContractApproved
                                      ? () => handleAcceptOffer(offer)
                                      : handleApproveBundleSalesContract
                                    : salesContractApproved
                                    ? () => handleAcceptOffer(offer)
                                    : handleApproveSalesContract
                                }
                              >
                                {!(bundleID
                                  ? isBundleContractApproved
                                  : salesContractApproved) ? (
                                  salesContractApproving ? (
                                    <ClipLoader color="#FFF" size={16} />
                                  ) : (
                                    'Approve'
                                  )
                                ) : offerAccepting ? (
                                  <ClipLoader color="#FFF" size={16} />
                                ) : (
                                  'Accept'
                                )}
                              </div>
                            )}
                          {offer.creator?.toLowerCase() ===
                            account?.toLowerCase() && (
                            <div
                              className={cx(
                                styles.buyButton,
                                offerCanceling && styles.disabled
                              )}
                              onClick={() => handleCancelOffer()}
                            >
                              {offerCanceling ? (
                                <ClipLoader color="#FFF" size={16} />
                              ) : (
                                'Withdraw'
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </Panel>
            </div>
            {bundleID && (
              <div className={styles.panelWrapper}>
                <Panel title="Items" expanded>
                  <div className={styles.items}>
                    {(loading
                      ? [null, null, null]
                      : bundleItems.current
                    ).map((item, idx) => renderBundleItem(item, idx))}
                  </div>
                </Panel>
              </div>
            )}
          </div>
        </div>
        <div className={styles.tradeHistoryWrapper}>
          <div className={styles.tradeHistoryHeader}>
            <div className={styles.tradeHistoryTitle}>{filters[filter]}</div>
            {!bundleID && (
              <div className={styles.filter} onClick={handleMenuOpen}>
                <img src={filterIcon} className={styles.filterIcon} />
              </div>
            )}
          </div>
          <div className={styles.histories}>
            <div className={cx(styles.history, styles.heading)}>
              {filter === 0 && <div className={styles.historyPrice}>Price</div>}
              {tokenType.current === 1155 && (
                <div className={styles.quantity}>Quantity</div>
              )}
              <div className={styles.from}>From</div>
              <div className={styles.to}>To</div>
              <div className={styles.saleDate}>Date</div>
            </div>
            {(historyLoading
              ? [null, null, null]
              : filter === 0
              ? tradeHistory.current
              : transferHistory.current
            ).map((history, idx) => {
              const saleDate = history ? new Date(history.createdAt) : null;
              return (
                <div className={styles.history} key={idx}>
                  {filter === 0 && (
                    <div className={styles.historyPrice}>
                      {history ? (
                        `${formatNumber(history.price)} FTM`
                      ) : (
                        <Skeleton width={120} height={25} />
                      )}
                    </div>
                  )}
                  {tokenType.current === 1155 && (
                    <div className={styles.quantity}>
                      {history ? (
                        formatNumber(history.value)
                      ) : (
                        <Skeleton width={120} height={25} />
                      )}
                    </div>
                  )}
                  <div className={styles.from}>
                    {history ? (
                      <Link to={`/account/${history.from}`}>
                        <div className={styles.userAvatarWrapper}>
                          {history.fromImage ? (
                            <img
                              src={`https://gateway.pinata.cloud/ipfs/${history.fromImage}`}
                              className={styles.userAvatar}
                            />
                          ) : (
                            <Identicon
                              account={history.from}
                              size={24}
                              className={styles.userAvatar}
                            />
                          )}
                        </div>
                        {history.fromAlias || history.from.substr(0, 6)}
                      </Link>
                    ) : (
                      <Skeleton width={200} height={25} />
                    )}
                  </div>
                  <div className={styles.to}>
                    {history ? (
                      <Link to={`/account/${history.to}`}>
                        <div className={styles.userAvatarWrapper}>
                          {history.toImage ? (
                            <img
                              src={`https://gateway.pinata.cloud/ipfs/${history.toImage}`}
                              className={styles.userAvatar}
                            />
                          ) : (
                            <Identicon
                              account={history.to}
                              size={24}
                              className={styles.userAvatar}
                            />
                          )}
                        </div>
                        {history.toAlias || history.to.substr(0, 6)}
                      </Link>
                    ) : (
                      <Skeleton width={200} height={25} />
                    )}
                  </div>
                  <div className={styles.saleDate}>
                    {saleDate ? (
                      formatDate(saleDate)
                    ) : (
                      <Skeleton width={180} height={25} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {renderMenu}

      <SellModal
        visible={sellModalVisible}
        onClose={() => setSellModalVisible(false)}
        onSell={hasListing() ? handleUpdatePrice : handleListItem}
        startPrice={
          bundleID
            ? bundleListing.current?.price || 0
            : myListing()?.pricePerItem || 0
        }
        confirming={listingItem || priceUpdating}
        approveContract={
          bundleID
            ? handleApproveBundleSalesContract
            : handleApproveSalesContract
        }
        contractApproving={salesContractApproving}
        contractApproved={
          bundleID ? isBundleContractApproved : salesContractApproved
        }
        totalSupply={tokenType.current === 1155 ? myHolding?.supply : null}
      />
      <OfferModal
        visible={offerModalVisible}
        onClose={() => setOfferModalVisible(false)}
        onMakeOffer={handleMakeOffer}
        confirming={offerPlacing}
        totalSupply={tokenType.current === 1155 ? maxSupply() : null}
      />
      <AuctionModal
        visible={auctionModalVisible}
        onClose={() => setAuctionModalVisible(false)}
        onStartAuction={
          auction.current ? handleUpdateAuction : handleStartAuction
        }
        auction={auction.current}
        auctionStarted={auctionStarted}
        confirming={auctionStarting || auctionUpdating}
        approveContract={handleApproveAuctionContract}
        contractApproving={auctionContractApproving}
        contractApproved={auctionContractApproved}
      />
      <BidModal
        visible={bidModalVisible}
        onClose={() => setBidModalVisible(false)}
        onPlaceBid={handlePlaceBid}
        minBidAmount={(bid?.bid || 0) + minBidIncrement}
        confirming={bidPlacing}
      />
      <OwnersModal
        visible={ownersModalVisible}
        onClose={() => setOwnersModalVisible(false)}
        holders={holders.current}
      />
    </div>
  );
};

export default NFTItem;
