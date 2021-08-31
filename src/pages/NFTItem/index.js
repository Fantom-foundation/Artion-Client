import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import axios from 'axios';
import { ethers } from 'ethers';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Skeleton from 'react-loading-skeleton';
import ReactResizeDetector from 'react-resize-detector';
import ReactPlayer from 'react-player';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
  Line,
} from 'recharts';
import { ChainId } from '@sushiswap/sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useWeb3React } from '@web3-react/core';
import { ClipLoader } from 'react-spinners';
import { Tooltip, Menu, MenuItem } from '@material-ui/core';
import {
  People as PeopleIcon,
  ViewModule as ViewModuleIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Timeline as TimelineIcon,
  LocalOffer as LocalOfferIcon,
  Toc as TocIcon,
  Label as LabelIcon,
  Ballot as BallotIcon,
  Loyalty as LoyaltyIcon,
  VerticalSplit as VerticalSplitIcon,
  Subject as SubjectIcon,
  Redeem as RedeemIcon,
} from '@material-ui/icons';
import toast from 'react-hot-toast';

import Panel from 'components/Panel';
import Identicon from 'components/Identicon';
import { useApi } from 'api';
import {
  useNFTContract,
  useSalesContract,
  useAuctionContract,
  useBundleSalesContract,
  getSigner,
} from 'contracts';
import { shortenAddress, formatNumber } from 'utils';
import { Contracts } from 'constants/networks';
import showToast from 'utils/toast';
import NFTCard from 'components/NFTCard';
import TransferModal from 'components/TransferModal';
import SellModal from 'components/SellModal';
import OfferModal from 'components/OfferModal';
import AuctionModal from 'components/AuctionModal';
import BidModal from 'components/BidModal';
import OwnersModal from 'components/OwnersModal';
import LikesModal from 'components/LikesModal';
import Header from 'components/header';
import SuspenseImg from 'components/SuspenseImg';
import ModalActions from 'actions/modal.actions';
import CollectionsActions from 'actions/collections.actions';
import HeaderActions from 'actions/header.actions';
import useTokens from 'hooks/useTokens';

import webIcon from 'assets/svgs/web.svg';
import discordIcon from 'assets/svgs/discord.svg';
import telegramIcon from 'assets/svgs/telegram.svg';
import twitterIcon from 'assets/svgs/twitter.svg';
import mediumIcon from 'assets/svgs/medium.svg';
import filterIcon from 'assets/svgs/filter.svg';
import checkIcon from 'assets/svgs/check.svg';
import shareIcon from 'assets/svgs/share.svg';
import iconArtion from 'assets/svgs/logo_small_blue.svg';
import iconFacebook from 'assets/imgs/facebook.png';
import iconTwitter from 'assets/svgs/twitter_blue.svg';

import styles from './styles.module.scss';

const ONE_MIN = 60;
const ONE_HOUR = ONE_MIN * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_MONTH = ONE_DAY * 30;

const filters = ['Trade History', 'Transfer History'];

// eslint-disable-next-line no-undef
const ENV = process.env.REACT_APP_ENV;

const NFTItem = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    explorerUrl,
    storageUrl,
    getBundleDetails,
    fetchItemDetails,
    increaseBundleViewCount,
    increaseViewCount,
    getBundleOffers: _getBundleOffers,
    getBundleTradeHistory: _getBundleTradeHistory,
    getTransferHistory,
    fetchCollection,
    fetchCollections,
    getUserAccountDetails,
    get1155Info,
    getTokenHolders,
    getBundleLikes,
    isLikingItem,
    isLikingBundle,
    likeItem,
    likeBundle,
    getItemLikeUsers,
    getBundleLikeUsers,
    getItemsLiked,
    getNonce,
    retrieveUnlockableContent,
  } = useApi();
  const {
    getERC20Contract,
    getERC721Contract,
    getERC1155Contract,
  } = useNFTContract();
  const {
    getSalesContract,
    buyItemETH,
    buyItemERC20,
    cancelListing,
    listItem,
    updateListing,
    createOffer,
    cancelOffer,
    acceptOffer,
    getCollectionRoyalty,
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
    buyBundleETH,
    buyBundleERC20,
    cancelBundleListing,
    listBundle,
    updateBundleListing,
    createBundleOffer,
    cancelBundleOffer,
    acceptBundleOffer,
  } = useBundleSalesContract();

  const { addr: address, id: tokenID, bundleID } = useParams();
  const { getTokenByAddress, tokens } = useTokens();

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
  const contentType = useRef();
  const [tokenInfo, setTokenInfo] = useState();
  const holders = useRef([]);
  const likeUsers = useRef([]);
  const [collections, setCollections] = useState([]);
  const [collection, setCollection] = useState();
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [fetchInterval, setFetchInterval] = useState(null);
  const [collectionRoyalty, setCollectionRoyalty] = useState(null);

  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [auctionModalVisible, setAuctionModalVisible] = useState(false);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [ownersModalVisible, setOwnersModalVisible] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);

  const [transferring, setTransferring] = useState(false);
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
  const [likeUsersFetching, setLikeUsersFetching] = useState(false);
  const [likeFetching, setLikeFetching] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [liked, setLiked] = useState();
  const [hasUnlockable, setHasUnlockable] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [unlockableContent, setUnlockableContent] = useState('');

  const [bid, setBid] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winningToken, setWinningToken] = useState(null);
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
  const moreItems = useRef([]);
  const [prices, setPrices] = useState({});
  const [priceInterval, setPriceInterval] = useState(null);

  const [likeCancelSource, setLikeCancelSource] = useState(null);
  const [filter, setFilter] = useState(0);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const { authToken } = useSelector(state => state.ConnectWallet);

  const isLoggedIn = () => {
    return (
      account &&
      (ENV === 'MAINNET'
        ? chainId === ChainId.FANTOM
        : chainId === ChainId.FANTOM_TESTNET)
    );
  };

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(true));
  }, []);

  const getPrices = async () => {
    try {
      const salesContract = await getSalesContract();
      const data = await Promise.all(
        tokens.map(async token => [
          token.address,
          await salesContract.getPrice(
            token.address || ethers.constants.AddressZero
          ),
        ])
      );
      const _prices = {};
      data.map(([addr, price]) => {
        _prices[addr] = parseFloat(ethers.utils.formatUnits(price, 18));
      });
      setPrices(_prices);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!tokens) return;

    if (priceInterval) {
      clearInterval(priceInterval);
    }

    getPrices();
    setPriceInterval(setInterval(getPrices, 1000 * 10));

    return () => {
      if (priceInterval) {
        clearInterval(priceInterval);
      }
    };
  }, [tokens]);

  const getBundleInfo = async () => {
    setLoading(true);
    try {
      const { data } = await getBundleDetails(bundleID);
      setBundleInfo(data.bundle);
      setCreator(data.bundle.creator);
      setOwner(data.bundle.owner);
      const _bundleListing = await getBundleListing(
        data.bundle.owner,
        bundleID
      );
      if (_bundleListing) {
        _bundleListing.token = getTokenByAddress(data.bundle.paymentToken);
      }
      bundleListing.current = _bundleListing;
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
      history.replace('/404');
    }
    setLoading(false);
  };

  const getItemDetails = async () => {
    setLoading(true);
    setTokenOwnerLoading(true);
    setHistoryLoading(true);
    tradeHistory.current = [];
    try {
      const {
        data: {
          contentType: _contentType,
          history,
          likes,
          listings: _listings,
          offers: _offers,
          nfts,
          tokenType: type,
          uri,
          hasUnlockable: _hasUnlockable,
        },
      } = await fetchItemDetails(address, tokenID);

      contentType.current = _contentType;
      tradeHistory.current = history
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .map(history => ({
          ...history,
          token: getTokenByAddress(history.paymentToken),
        }));
      setLiked(likes);
      setHasUnlockable(_hasUnlockable);
      listings.current = _listings.map(listing => ({
        ...listing,
        token: getTokenByAddress(listing.paymentToken),
      }));
      offers.current = _offers.map(offer => ({
        ...offer,
        token: getTokenByAddress(offer.paymentToken),
      }));
      moreItems.current = nfts;

      try {
        tokenType.current = type;
        if (type === 721) {
          const contract = await getERC721Contract(address);
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
      }

      const { data } = await axios.get(uri);
      setInfo(data);
    } catch {
      try {
        const contract = await getERC721Contract(address);
        const tokenURI = await contract.tokenURI(tokenID);
        const { data } = await axios.get(tokenURI);
        setInfo(data);
      } catch {
        history.replace('/404');
      }
    }
    setLoading(false);
    setTokenOwnerLoading(false);
    setHistoryLoading(false);
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

  const getBundleOffers = async () => {
    try {
      const { data } = await _getBundleOffers(bundleID);
      offers.current = data.map(offer => ({
        ...offer,
        token: getTokenByAddress(offer.paymentToken),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const getBundleTradeHistory = async () => {
    setHistoryLoading(true);
    tradeHistory.current = [];
    try {
      const { data } = await _getBundleTradeHistory(bundleID);
      tradeHistory.current = data
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .map(history => ({
          ...history,
          token: getTokenByAddress(history.paymentToken),
        }));
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
        const token = getTokenByAddress(_auction.payToken);
        const reservePrice = parseFloat(
          ethers.utils.formatUnits(_auction.reservePrice, token.decimals)
        );
        auction.current = { ..._auction, reservePrice, token };
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
    paymentToken,
    pricePerItem,
    startingTime
  ) => {
    if (eventMatches(nft, id)) {
      const token = getTokenByAddress(paymentToken);
      const newListing = {
        owner,
        quantity: parseFloat(quantity.toString()),
        token,
        price: parseFloat(
          ethers.utils.formatUnits(pricePerItem, token.decimals)
        ),
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
      listings.current = listings.current.sort((a, b) =>
        a.price > b.price ? 1 : -1
      );
    }
  };

  const itemUpdatedHandler = (owner, nft, id, paymentToken, newPrice) => {
    if (eventMatches(nft, id)) {
      const token = getTokenByAddress(paymentToken);
      listings.current.map(listing => {
        if (listing.owner.toLowerCase() === owner.toLowerCase()) {
          listing.token = token;
          listing.price = parseFloat(
            ethers.utils.formatUnits(newPrice, token.decimals)
          );
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

  const itemSoldHandler = async (
    seller,
    buyer,
    nft,
    id,
    _quantity,
    paymentToken,
    unitPrice,
    price
  ) => {
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
      const token = getTokenByAddress(paymentToken);
      const _price = parseFloat(
        ethers.utils.formatUnits(price, token.decimals)
      );
      const newTradeHistory = {
        from: seller,
        to: buyer,
        price: _price,
        value: quantity,
        createdAt: new Date().toISOString(),
        paymentToken,
        token,
        priceInUSD:
          parseFloat(ethers.utils.formatUnits(unitPrice, 18)) * _price,
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
    quantity,
    payToken,
    pricePerItem,
    deadline
  ) => {
    if (eventMatches(nft, id)) {
      const token = getTokenByAddress(payToken);
      const newOffer = {
        creator,
        deadline: parseFloat(deadline.toString()) * 1000,
        token,
        pricePerItem: parseFloat(
          ethers.utils.formatUnits(pricePerItem, token.decimals)
        ),
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

  const bundleListedHandler = (
    _owner,
    _bundleID,
    _payToken,
    _price,
    _startingTime
  ) => {
    if (bundleID.toLowerCase() === _bundleID.toLowerCase()) {
      const token = getTokenByAddress(_payToken);
      const price = parseFloat(
        ethers.utils.formatUnits(_price, token.decimals)
      );
      bundleListing.current = {
        price,
        startingTime: parseInt(_startingTime.toString()),
        token,
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
      if (nfts.length === 0) {
        history.push('/exploreall');
      }

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

  const bundleSoldHandler = async (
    _seller,
    _buyer,
    _bundleID,
    _payToken,
    _unitPrice,
    _price
  ) => {
    if (bundleID.toLowerCase() === _bundleID.toLowerCase()) {
      setOwner(_buyer);
      bundleListing.current = null;
      const token = getTokenByAddress(_payToken);
      const price = parseFloat(
        ethers.utils.formatUnits(_price, token.decimals)
      );
      const newTradeHistory = {
        from: _seller,
        to: _buyer,
        price,
        value: 1,
        createdAt: new Date().toISOString(),
        token,
        priceInUSD:
          parseFloat(ethers.utils.formatUnits(_unitPrice, 18)) * price,
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
      const token = getTokenByAddress(_payToken);
      const newOffer = {
        creator: _creator,
        deadline: parseFloat(_deadline.toString()) * 1000,
        pricePerItem: parseFloat(
          ethers.utils.formatUnits(_price, token.decimals)
        ),
        quantity: 1,
        token,
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

  const auctionReservePriceUpdatedHandler = (nft, id, _payToken, _price) => {
    if (eventMatches(nft, id)) {
      if (auction.current) {
        const price = ethers.utils.formatUnits(
          _price,
          auction.current.token.decimals
        );
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

  function auctionResultedHandler(
    nft,
    id,
    winner,
    payToken,
    unitPrice,
    _winningBid
  ) {
    if (eventMatches(nft, id)) {
      const newAuction = { ...auction.current, resulted: true };
      auction.current = newAuction;
      setWinner(winner);
      const token = getTokenByAddress(payToken);
      setWinningToken(token);
      const winningBid = parseFloat(_winningBid.toString()) / 10 ** 18;
      setWinningBid(winningBid);
    }
  }

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

  const updateCollections = async () => {
    try {
      dispatch(CollectionsActions.fetchStart());
      const res = await fetchCollections();
      if (res.status === 'success') {
        const verified = [];
        const unverified = [];
        res.data.map(item => {
          if (item.isVerified) verified.push(item);
          else unverified.push(item);
        });
        dispatch(CollectionsActions.fetchSuccess([...verified, ...unverified]));
      }
    } catch {
      dispatch(CollectionsActions.fetchFailed());
    }
  };

  useEffect(() => {
    if (!chainId) return;

    if (address && tokenID) {
      addEventListeners();
      getAuctionConfiguration();

      if (fetchInterval) {
        clearInterval(fetchInterval);
      }

      updateCollections();
      setFetchInterval(setInterval(updateCollections, 1000 * 60 * 10));
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

    setLiked(null);

    if (bundleID) {
      listings.current = [];

      getBundleInfo();
      getBundleOffers();
      getBundleTradeHistory();

      increaseBundleViewCount(bundleID).then(({ data }) => {
        setViews(data);
      });
      getBundleLikes(bundleID).then(({ data }) => {
        setLiked(data);
      });
      isLikingBundle(bundleID, account).then(({ data }) => {
        setIsLike(data);
      });
    } else {
      bundleListing.current = null;

      getItemDetails();
      getAuctions();
      getBid();

      increaseViewCount(address, tokenID).then(({ data }) => {
        setViews(data);
      });
      isLikingItem(address, tokenID, account).then(({ data }) => {
        setIsLike(data);
      });
    }

    getLikeInfo();
  }, [chainId, address, tokenID, bundleID]);

  useEffect(() => {
    if (!chainId || !address) {
      setCollectionRoyalty(null);
      return;
    }

    getCollectionRoyalty(address)
      .then(res => {
        if (res.royalty) {
          setCollectionRoyalty({
            royalty: res.royalty / 100,
            feeRecipient: res.feeRecipient,
          });
        } else {
          setCollectionRoyalty(null);
        }
      })
      .catch(console.log);
  }, [chainId, address]);

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

  const updateItems = async () => {
    try {
      const missingTokens = moreItems.current
        .map((tk, index) =>
          tk.items
            ? {
                index,
                isLiked: tk.isLiked,
                bundleID: tk._id,
              }
            : {
                index,
                isLiked: tk.isLiked,
                contractAddress: tk.contractAddress,
                tokenID: tk.tokenID,
              }
        )
        .filter(tk => tk.isLiked === undefined);

      if (missingTokens.length === 0) return;

      const cancelTokenSource = axios.CancelToken.source();
      setLikeCancelSource(cancelTokenSource);
      const { data, status } = await getItemsLiked(
        missingTokens,
        authToken,
        cancelTokenSource.token
      );
      if (status === 'success') {
        const newTokens = [...moreItems.current];
        missingTokens.map((tk, idx) => {
          newTokens[tk.index].isLiked = data[idx].isLiked;
        });
        // eslint-disable-next-line require-atomic-updates
        moreItems.current = newTokens;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLikeCancelSource(null);
    }
  };

  useEffect(() => {
    if (likeCancelSource) {
      likeCancelSource.cancel();
    }
    if (authToken && moreItems.current.length) {
      updateItems();
    }
  }, [moreItems, authToken]);

  const getLikeInfo = async () => {
    setLikeFetching(true);
    try {
      if (bundleID) {
        const { data } = await isLikingBundle(bundleID, account);
        setIsLike(data);
      } else {
        const { data } = await isLikingItem(address, tokenID, account);
        setIsLike(data);
      }
    } catch (err) {
      console.log(err);
    }
    setLikeFetching(false);
  };

  const toggleFavorite = async e => {
    e.preventDefault();
    if (isLiking) return;

    setIsLiking(true);
    try {
      if (bundleID) {
        const { data } = await likeBundle(bundleID, authToken);
        setLiked(data);
      } else {
        const { data } = await likeItem(address, tokenID, authToken);
        setLiked(data);
      }
    } catch (err) {
      console.log(err);
    }
    setIsLike(!isLike);
    setIsLiking(false);
  };

  const showLikeUsers = async () => {
    if (likeUsersFetching) return;

    setLikesModalVisible(true);
    setLikeUsersFetching(true);
    try {
      if (bundleID) {
        const { data } = await getBundleLikeUsers(bundleID);
        likeUsers.current = data;
      } else {
        const { data } = await getItemLikeUsers(address, tokenID);
        likeUsers.current = data;
      }
    } catch (err) {
      console.log(err);
    }
    setLikeUsersFetching(false);
  };

  const getSalesContractStatus = async () => {
    const contract = await getERC721Contract(address);
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
        const contract = await getERC721Contract(address);
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
    const contract = await getERC721Contract(address);
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
    const contract = await getERC721Contract(address);

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
      const contract = await getERC721Contract(address);
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
          const contract = await getERC721Contract(address);
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
      const contract = await getERC721Contract(address);
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

  const handleTransfer = async (to, quantity) => {
    if (bundleID) return;

    if (!ethers.utils.isAddress(to)) {
      showToast('error', 'Invalid Aaddress!');
      return;
    }

    if (transferring) return;

    setTransferring(true);

    try {
      if (tokenType.current === 721) {
        const contract = await getERC721Contract(address);
        const tx = await contract.safeTransferFrom(account, to, tokenID);
        await tx.wait();
        showToast('success', 'Item transferred successfully!');
        setTransferModalVisible(false);
        getItemDetails();
      } else {
        const contract = await getERC1155Contract(address);
        const tx = await contract.safeTransferFrom(
          account,
          to,
          tokenID,
          quantity,
          '0x'
        );
        await tx.wait();
        showToast('success', 'Item transferred successfully!');
        setTransferModalVisible(false);
        getItemDetails();
      }
    } catch (err) {
      console.log(err);
      showToast('error', 'Failed to transfer item!');
    }

    setTransferring(false);
  };

  const handleListItem = async (token, _price, quantity) => {
    if (listingItem) return;

    try {
      setListingItem(true);

      const price = ethers.utils.parseUnits(_price, token.decimals);
      if (bundleID) {
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
          token.address === '' ? ethers.constants.AddressZero : token.address,
          price,
          ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000))
        );
        await tx.wait();

        showToast('success', 'Bundle listed successfully!');
      } else {
        const tx = await listItem(
          address,
          ethers.BigNumber.from(tokenID),
          ethers.BigNumber.from(quantity),
          token.address === '' ? ethers.constants.AddressZero : token.address,
          price,
          ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000))
        );
        await tx.wait();

        showToast('success', 'Item listed successfully!');
      }

      setSellModalVisible(false);
      setListingItem(false);
    } catch (err) {
      console.log(err);
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

  const handleRevealContent = async () => {
    if (revealing) return;

    try {
      setRevealing(true);

      const { data: nonce } = await getNonce(account, authToken);
      let signature;
      let addr;
      try {
        const signer = await getSigner();
        const msg = `Approve Signature on Artion.io with nonce ${nonce}`;
        signature = await signer.signMessage(msg);
        addr = ethers.utils.verifyMessage(msg, signature);
      } catch {
        showToast(
          'error',
          'You need to sign the message to be able to update account settings.'
        );
        setRevealing(false);
        return;
      }

      const { data } = await retrieveUnlockableContent(
        address,
        tokenID,
        signature,
        addr,
        authToken
      );
      setUnlockableContent(data);
      setRevealing(false);
    } catch {
      setRevealing(false);
    }
  };

  const handleUpdateListing = async (token, _price, quantity) => {
    if (priceUpdating) return;

    try {
      setPriceUpdating(true);

      const price = ethers.utils.parseUnits(_price, token.decimals);
      if (bundleID) {
        const tx = await updateBundleListing(bundleID, price);
        await tx.wait();
      } else {
        const tx = await updateListing(
          address,
          tokenID,
          token.address === '' ? ethers.constants.AddressZero : token.address,
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
      if (listing.token.address === '') {
        const price = ethers.utils.parseEther(_price.toString());
        const tx = await buyItemETH(
          address,
          ethers.BigNumber.from(tokenID),
          listing.owner,
          price,
          account
        );
        await tx.wait();
      } else {
        const erc20 = await getERC20Contract(listing.token.address);
        const balance = await erc20.balanceOf(account);
        const price = ethers.utils.parseUnits(
          _price.toString(),
          listing.token.decimals
        );
        if (balance.lt(price)) {
          const toastId = showToast(
            'error',
            `Insufficient ${listing.token.symbol} Balance!`,
            listing.token.symbol === 'WFTM'
              ? 'You can wrap FTM in the WFTM station.'
              : `You can exchange ${listing.token.symbol} on other exchange site.`,
            () => {
              toast.dismiss(toastId);
              if (listing.token.symbol === 'WFTM') {
                dispatch(ModalActions.showWFTMModal());
              }
            }
          );
          setBuyingItem(false);
          return;
        }
        const salesContract = await getSalesContract();
        const allowance = await erc20.allowance(account, salesContract.address);
        if (allowance.lt(price)) {
          const tx = await erc20.approve(salesContract.address, price);
          await tx.wait();
        }
        const tx = await buyItemERC20(
          address,
          ethers.BigNumber.from(tokenID),
          listing.token.address,
          listing.owner
        );
        await tx.wait();
      }
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
      const { token } = bundleListing.current;
      const price = ethers.utils.parseUnits(
        bundleListing.current.price.toString(),
        token.decimals
      );
      if (token.address === '') {
        const tx = await buyBundleETH(bundleID, price, account);
        await tx.wait();
      } else {
        const erc20 = await getERC20Contract(token.address);
        const balance = await erc20.balanceOf(account);
        if (balance.lt(price)) {
          const toastId = showToast(
            'error',
            `Insufficient ${token.symbol} Balance!`,
            token.symbol === 'WFTM'
              ? 'You can wrap FTM in the WFTM station.'
              : `You can exchange ${token.symbol} on other exchange site.`,
            () => {
              toast.dismiss(toastId);
              if (token.symbol === 'WFTM') {
                dispatch(ModalActions.showWFTMModal());
              }
            }
          );
          setBuyingItem(false);
          return;
        }
        const salesContract = await getBundleSalesContract();
        const allowance = await erc20.allowance(account, salesContract.address);
        if (allowance.lt(price)) {
          const tx = await erc20.approve(salesContract.address, price);
          await tx.wait();
        }

        const tx = await buyBundleERC20(bundleID, token.address);
        await tx.wait();
      }
      setBuyingItem(false);

      showToast('success', 'You have bought the bundle!');

      // eslint-disable-next-line require-atomic-updates
      bundleListing.current = null;
    } catch {
      setBuyingItem(false);
    }
  };

  const handleMakeOffer = async (token, _price, quantity, endTime) => {
    if (offerPlacing) return;

    try {
      setOfferPlacing(true);
      const price = ethers.utils.parseUnits(_price, token.decimals);
      const deadline = Math.floor(endTime.getTime() / 1000);
      const amount = price.mul(quantity);

      const erc20 = await getERC20Contract(token.address);
      const balance = await erc20.balanceOf(account);

      if (balance.lt(amount)) {
        const toastId = showToast(
          'error',
          `Insufficient ${token.symbol} Balance!`,
          token.symbol === 'WFTM'
            ? 'You can wrap FTM in the WFTM station.'
            : `You can exchange ${token.symbol} on other exchange site.`,
          () => {
            toast.dismiss(toastId);
            setOfferModalVisible(false);
            if (token.symbol === 'WFTM') {
              dispatch(ModalActions.showWFTMModal());
            }
          }
        );
        setOfferPlacing(false);
        return;
      }

      if (bundleID) {
        const allowance = await erc20.allowance(
          account,
          Contracts[chainId].bundleSales
        );
        if (allowance.lt(amount)) {
          const tx = await erc20.approve(
            Contracts[chainId].bundleSales,
            amount
          );
          await tx.wait();
        }

        const tx = await createBundleOffer(
          bundleID,
          token.address,
          price,
          ethers.BigNumber.from(deadline)
        );

        await tx.wait();
      } else {
        const allowance = await erc20.allowance(
          account,
          Contracts[chainId].sales
        );
        if (allowance.lt(amount)) {
          const tx = await erc20.approve(Contracts[chainId].sales, amount);
          await tx.wait();
        }

        const tx = await createOffer(
          address,
          ethers.BigNumber.from(tokenID),
          token.address,
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

  const handleStartAuction = async (token, _price, _startTime, _endTime) => {
    try {
      setAuctionStarting(true);

      const price = ethers.utils.parseUnits(_price, token.decimals);
      const startTime = Math.floor(_startTime.getTime() / 1000);
      const endTime = Math.floor(_endTime.getTime() / 1000);

      const tx = await createAuction(
        address,
        ethers.BigNumber.from(tokenID),
        token.address === '' ? ethers.constants.AddressZero : token.address,
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

  const handleUpdateAuction = async (token, _price, _startTime, _endTime) => {
    if (!auction.current) return;

    try {
      setAuctionUpdating(true);

      if (parseFloat(_price) !== auction.current.reservePrice) {
        const price = ethers.utils.parseUnits(_price, token.decimals);
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

      const { token } = auction.current;
      const price = ethers.utils.parseUnits(_price, token.decimals);
      if (token.address !== '') {
        const erc20 = await getERC20Contract(token.address);
        const balance = await erc20.balanceOf(account);
        if (balance.lt(price)) {
          const toastId = showToast(
            'error',
            `Insufficient ${token.symbol} Balance!`,
            token.symbol === 'WFTM'
              ? 'You can wrap FTM in the WFTM station.'
              : `You can exchange ${token.symbol} on other exchange site.`,
            () => {
              toast.dismiss(toastId);
              setBidModalVisible(false);
              if (token.symbol === 'WFTM') {
                dispatch(ModalActions.showWFTMModal());
              }
            }
          );
          setBidPlacing(false);
          return;
        }
        const auctionContract = await getAuctionContract();
        const allowance = await erc20.allowance(
          account,
          auctionContract.address
        );
        if (allowance.lt(price)) {
          const tx = await erc20.approve(auctionContract.address, price);
          await tx.wait();
        }
      }
      const tx = await placeBid(
        address,
        ethers.BigNumber.from(tokenID),
        token.address === '' ? ethers.constants.AddressZero : token.address,
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

  const hasMyOffer = (() =>
    offers.current.findIndex(
      offer =>
        offer.creator?.toLowerCase() === account?.toLowerCase() &&
        offer.deadline >= now.getTime()
    ) > -1)();

  const data = [...tradeHistory.current].reverse().map(history => {
    const saleDate = new Date(history.createdAt);
    return {
      date: `${saleDate.getFullYear()}/${saleDate.getMonth() +
        1}/${saleDate.getDate()}`,
      price: history.priceInUSD,
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

  const hasListing = (() => {
    return bundleListing.current || myListing() !== undefined;
  })();

  const bestListing = (() => {
    if (bundleID) return bundleListing.current;
    let idx = 0;
    while (
      idx < listings.current.length &&
      listings.current[idx].owner.toLowerCase() === account.toLowerCase()
    ) {
      idx++;
    }
    if (idx < listings.current.length) return listings.current[idx];
    return null;
  })();

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

  const onTransferClick = async () => {
    if (auction.current?.resulted === false) {
      showToast('warning', 'Please cancel current auction before transfer.');
      return;
    }
    if (hasListing) {
      showToast(
        'warning',
        'You have listed your item. Please cancel listing before transfer.'
      );
      return;
    }
    setTransferModalVisible(true);
  };

  const handleMenuOpen = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setShareAnchorEl(null);
  };

  const handleCopyLink = () => {
    handleClose();
    showToast('success', 'Link copied to clipboard!');
  };

  const handleShareOnFacebook = () => {
    handleClose();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      '_blank'
    );
  };

  const handleShareToTwitter = () => {
    handleClose();
    window.open(
      `https://twitter.com/intent/tweet?text=Check%20out%20this%item%20on%20Artion&url=${window.location.href}`,
      '_blank'
    );
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

  const renderMedia = (image, contentType) => {
    if (contentType === 'video' || image?.includes('youtube')) {
      return (
        <ReactPlayer
          className={styles.content}
          url={image}
          controls={true}
          width="100%"
          height="100%"
        />
      );
    } else if (contentType === 'embed') {
      return <iframe className={styles.content} src={image} />;
    } else if (contentType === 'image' || contentType === 'gif') {
      return (
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
          <SuspenseImg className={styles.content} src={image} />
        </Suspense>
      );
    }
  };

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
                  href={`${explorerUrl}/address/${properties[key]}`}
                >
                  {shortenAddress(properties[key])}
                </a>
              ) : key === 'IP_Rights' ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={properties[key]}
                >
                  {properties[key]}
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
      <div className={styles.itemMenu}>
        {isMine && !bundleID && (
          <div className={styles.itemMenuBtn} onClick={onTransferClick}>
            <RedeemIcon src={shareIcon} className={styles.itemMenuIcon} />
          </div>
        )}
        <div
          className={styles.itemMenuBtn}
          onClick={e => setShareAnchorEl(e.currentTarget)}
        >
          <img src={shareIcon} className={styles.itemMenuIcon} />
        </div>
      </div>
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
              <Skeleton width={150} height={20} />
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
          <FontAwesomeIcon icon={faEye} color="#A2A2AD" />
          &nbsp;
          {isNaN(views) ? (
            <Skeleton width={80} height={20} />
          ) : (
            `${formatNumber(views)} view${views !== 1 ? 's' : ''}`
          )}
        </div>
        <div
          className={cx(
            styles.itemViews,
            styles.clickable,
            isLike && styles.liking
          )}
        >
          {isNaN(liked) || likeFetching ? (
            <Skeleton width={80} height={20} />
          ) : (
            <>
              {isLike ? (
                <FavoriteIcon
                  className={styles.favIcon}
                  onClick={toggleFavorite}
                />
              ) : (
                <FavoriteBorderIcon
                  className={styles.favIcon}
                  onClick={toggleFavorite}
                />
              )}
              &nbsp;
              <span onClick={liked ? showLikeUsers : null}>
                {formatNumber(liked || 0)} favorite{liked !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </div>
      {hasUnlockable && (
        <div className={styles.bestBuy}>
          <div
            className={styles.unlockableLabel}
          >{`This item has unlockable content.${
            !isMine ? ' Only owners can see the content.' : ''
          }`}</div>
          {isMine ? (
            unlockableContent ? (
              <textarea
                className={styles.unlockableContent}
                value={unlockableContent}
                readOnly
              />
            ) : (
              <div
                className={cx(styles.revealBtn, revealing && styles.disabled)}
                onClick={handleRevealContent}
              >
                {revealing ? (
                  <ClipLoader color="#FFF" size={16} />
                ) : (
                  `Reveal Content`
                )}
              </div>
            )
          ) : null}
        </div>
      )}
      {bestListing && (
        <div className={styles.bestBuy}>
          <div className={styles.currentPriceLabel}>Current price</div>
          <div className={styles.currentPriceWrapper}>
            <div className={styles.tokenLogo}>
              <img src={bestListing.token.icon} />
            </div>
            <div className={styles.currentPrice}>{bestListing.price}</div>
            <div className={styles.currentPriceUSD}>
              (
              {prices[bestListing.token.address] ? (
                `$${(
                  bestListing.price * prices[bestListing.token.address]
                ).toFixed(3)}`
              ) : (
                <Skeleton width={80} height={24} />
              )}
              )
            </div>
          </div>
          {!isMine && (
            <div
              className={cx(styles.buyNow, buyingItem && styles.disabled)}
              onClick={
                bundleID ? handleBuyBundle : () => handleBuyItem(bestListing)
              }
            >
              {buyingItem ? <ClipLoader color="#FFF" size={16} /> : 'Buy Now'}
            </div>
          )}
        </div>
      )}
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
            <SuspenseImg
              src={
                item.thumbnailPath.length > 10
                  ? `${storageUrl}/image/${item.thumbnailPath}`
                  : item.metadata.image
              }
            />
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
    <Panel title="Bundle Description" icon={SubjectIcon} expanded>
      <div className={styles.panelBody}>
        {creatorInfoLoading ? (
          <Skeleton width={150} height={20} />
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
                  size={24}
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
      icon={VerticalSplitIcon}
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
              href={`https://${collection?.siteUrl}`}
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
    <Panel title="Chain Info" icon={BallotIcon}>
      <div className={styles.panelBody}>
        <div className={styles.panelLine}>
          <div className={styles.panelLabel}>Collection</div>
          <a
            href={`${explorerUrl}/token/${address}`}
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

  const renderRoyaltyPanel = () =>
    collectionRoyalty && (
      <Panel title="Royalty" icon={LoyaltyIcon}>
        <div className={styles.panelBody}>
          <div className={styles.panelLine}>
            <div className={styles.panelLabel}>Royalty</div>
            <div className={styles.panelValue}>
              {collectionRoyalty.royalty}%
            </div>
          </div>
          <div className={styles.panelLine}>
            <div className={styles.panelLabel}>Fee Recipient</div>
            <div className={styles.panelValue}>
              {collectionRoyalty.feeRecipient}
            </div>
          </div>
        </div>
      </Panel>
    );

  return (
    <div className={styles.container}>
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
                !hasListing &&
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
                  {hasListing ? (
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
                    {hasListing ? 'Update Listing' : 'Sell'}
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
                  bundleID ? (
                    renderMedia(
                      bundleItems.current[previewIndex].metadata?.image,
                      bundleItems.current[previewIndex].contentType
                    )
                  ) : (
                    renderMedia(info?.image, contentType.current)
                  )
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
                                  ? `${storageUrl}/image/${item.thumbnailPath}`
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
                <Panel title="Properties" icon={LabelIcon}>
                  <div className={styles.panelBody}>
                    {renderProperties(info.properties)}
                  </div>
                </Panel>
              )}
              {bundleID && renderBundleInfoPanel()}
              {!bundleID && renderAboutPanel()}
              {!bundleID && renderCollectionPanel()}
              {!bundleID && renderRoyaltyPanel()}
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
            {!bundleID && (
              <div className={cx(styles.panelWrapper, styles.infoPanel)}>
                {renderRoyaltyPanel()}
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
                            &nbsp;(
                            <img
                              src={winningToken.icon}
                              className={styles.tokenIcon}
                            />
                            {formatNumber(winningBid)})
                          </>
                        ) : (
                          'Waiting for result'
                        )}
                      </div>
                    ) : bid ? (
                      <div>
                        <div className={styles.bidtitle}>
                          Reserve Price :&nbsp;
                          <img
                            src={auction.current.token.icon}
                            className={styles.tokenIcon}
                          />
                          {formatNumber(auction.current.reservePrice)}
                        </div>
                        <div className={styles.bidtitle}>
                          Highest Bid
                          {bid.bid < auction.current.reservePrice
                            ? ' -- Reserve price not met.'
                            : ''}
                        </div>
                        <div className={styles.bidAmount}>
                          <img
                            src={auction.current.token.icon}
                            className={styles.tokenIcon}
                          />
                          {formatNumber(bid.bid)}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.bidtitle}>
                        No bids yet ( Reserve Price :&nbsp;
                        <img
                          src={auction.current.token.icon}
                          className={styles.tokenIcon}
                        />
                        {formatNumber(auction.current.reservePrice)} )
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
                <Panel title="Price History" icon={TimelineIcon}>
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
              <Panel title="Listings" icon={LocalOfferIcon} expanded>
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
                              <Skeleton width={100} height={20} />
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
                              <Skeleton width={100} height={20} />
                            ) : (
                              <>
                                <img
                                  src={bundleListing.current.token.icon}
                                  className={styles.tokenIcon}
                                />
                                {formatNumber(bundleListing.current.price)}
                              </>
                            )}
                          </div>
                          <div className={styles.buy}>
                            {!isMine && (
                              <div
                                className={cx(
                                  styles.buyButton,
                                  buyingItem && styles.disabled
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
                              {listing.alias || listing.owner?.substr(0, 6)}
                            </Link>
                          </div>
                          <div className={styles.price}>
                            <img
                              src={listing.token.icon}
                              className={styles.tokenIcon}
                            />
                            {formatNumber(listing.price)}&nbsp;(
                            {prices[listing.token.address] !== undefined ? (
                              `$${(
                                listing.price * prices[listing.token.address]
                              ).toFixed(3)}`
                            ) : (
                              <Skeleton width={60} height={24} />
                            )}
                            )
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
                                  buyingItem && styles.disabled
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
              <Panel title="Offers" icon={TocIcon} expanded>
                <div className={styles.offers}>
                  {offers.current.length ? (
                    <>
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
                        .sort((a, b) =>
                          a.pricePerItem < b.pricePerItem ? 1 : -1
                        )
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
                                {offer.alias || offer.creator?.substr(0, 6)}
                              </Link>
                            </div>
                            <div className={styles.price}>
                              <img
                                src={offer.token.icon}
                                className={styles.tokenIcon}
                              />
                              {formatNumber(offer.pricePerItem || offer.price)}
                              &nbsp;(
                              {prices[offer.token.address] !== undefined ? (
                                `$${(
                                  (offer.pricePerItem || offer.price) *
                                  prices[offer.token.address]
                                ).toFixed(3)}`
                              ) : (
                                <Skeleton width={60} height={24} />
                              )}
                              )
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
                                      (salesContractApproving ||
                                        offerAccepting) &&
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
                    </>
                  ) : (
                    <div className={styles.noOffers}>
                      <div className={styles.noOffersLabel}>No Offers Yet</div>
                      {(!isMine ||
                        (tokenType.current === 1155 &&
                          myHolding.supply < tokenInfo.totalSupply)) &&
                        (!auction.current || auction.current.resulted) && (
                          <div
                            className={cx(
                              styles.makeOffer,
                              offerPlacing && styles.disabled
                            )}
                            onClick={() => setOfferModalVisible(true)}
                          >
                            Make Offer
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </Panel>
            </div>
            {bundleID && (
              <div className={styles.panelWrapper}>
                <Panel title="Items" icon={ViewModuleIcon} expanded>
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
                        <>
                          <img
                            src={history.token.icon}
                            className={styles.tokenIcon}
                          />
                          {formatNumber(history.price)}
                          &nbsp;( ${formatNumber(
                            history.priceInUSD.toFixed(3)
                          )}{' '}
                          )
                        </>
                      ) : (
                        <Skeleton width={100} height={20} />
                      )}
                    </div>
                  )}
                  {tokenType.current === 1155 && (
                    <div className={styles.quantity}>
                      {history ? (
                        formatNumber(history.value)
                      ) : (
                        <Skeleton width={100} height={20} />
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
                        {history.fromAlias || history.from?.substr(0, 6)}
                      </Link>
                    ) : (
                      <Skeleton width={180} height={20} />
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
                        {history.toAlias || history.to?.substr(0, 6)}
                      </Link>
                    ) : (
                      <Skeleton width={180} height={20} />
                    )}
                  </div>
                  <div className={styles.saleDate}>
                    {saleDate ? (
                      formatDate(saleDate)
                    ) : (
                      <Skeleton width={150} height={20} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {!bundleID && (
            <div className={styles.panelWrapper}>
              <Panel
                title="More from this collection"
                icon={ViewModuleIcon}
                responsive
              >
                <div className={styles.panelBody}>
                  {loading ? (
                    <div className={styles.loadingIndicator}>
                      <ClipLoader color="#007BFF" size={16} />
                    </div>
                  ) : (
                    <div className={styles.itemsList}>
                      {moreItems.current.map((item, idx) => (
                        <div key={idx} className={styles.moreItem}>
                          <NFTCard item={item} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Panel>
            </div>
          )}
        </div>
      </div>

      {renderMenu}

      <Menu
        id="simple-menu"
        anchorEl={shareAnchorEl}
        keepMounted
        open={Boolean(shareAnchorEl)}
        onClose={handleClose}
        classes={{ paper: styles.shareMenu, list: styles.shareMenuList }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <CopyToClipboard text={window.location.href} onCopy={handleCopyLink}>
          <MenuItem classes={{ root: styles.menuItem }}>
            <img src={iconArtion} />
            Copy Link
          </MenuItem>
        </CopyToClipboard>
        <MenuItem
          classes={{ root: styles.menuItem }}
          onClick={handleShareOnFacebook}
        >
          <img src={iconFacebook} />
          Share on Facebook
        </MenuItem>
        <MenuItem
          classes={{ root: styles.menuItem }}
          onClick={handleShareToTwitter}
        >
          <img src={iconTwitter} />
          Share to Twitter
        </MenuItem>
      </Menu>
      <TransferModal
        visible={transferModalVisible}
        totalSupply={tokenType.current === 1155 ? myHolding?.supply : null}
        transferring={transferring}
        onTransfer={handleTransfer}
        onClose={() => setTransferModalVisible(false)}
      />
      <SellModal
        visible={sellModalVisible}
        onClose={() => setSellModalVisible(false)}
        onSell={hasListing ? handleUpdateListing : handleListItem}
        startPrice={
          bundleID ? bundleListing.current?.price || 0 : myListing()?.price || 0
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
        token={auction.current?.token}
      />
      <OwnersModal
        visible={ownersModalVisible}
        onClose={() => setOwnersModalVisible(false)}
        holders={holders.current}
      />
      <LikesModal
        visible={likesModalVisible}
        onClose={() => setLikesModalVisible(false)}
        users={likeUsersFetching ? new Array(5).fill(null) : likeUsers.current}
      />
    </div>
  );
};

export default NFTItem;
