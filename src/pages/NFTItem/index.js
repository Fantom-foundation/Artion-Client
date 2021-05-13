import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Chart } from 'react-charts';
import cx from 'classnames';
import axios from 'axios';
import { ethers } from 'ethers';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Skeleton from 'react-loading-skeleton';
import TimelineIcon from '@material-ui/icons/Timeline';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import TocIcon from '@material-ui/icons/Toc';
import LabelIcon from '@material-ui/icons/Label';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import BallotIcon from '@material-ui/icons/Ballot';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useWeb3React } from '@web3-react/core';

import Panel from '../../components/Panel';
import ResizableBox from '../../components/ResizableBox';
import {
  fetchTokenURI,
  increaseViewCount,
  getOffers,
  getTradeHistory,
  fetchCollection,
} from '../../api';
import {
  getSalesContract,
  getNFTContract,
  getListing,
  listItem,
  cancelListing,
  updateListing,
  buyItem,
  getWFTMBalance,
  wrapFTM,
  getAllowance,
  approve,
  createOffer,
  cancelOffer,
  acceptOffer,
  getAuctionContract,
  getAuction,
  createAuction,
  cancelAuction,
  updateAuctionStartTime,
  updateAuctionEndTime,
  updateAuctionReservePrice,
  getHighestBidder,
  placeBid,
  withdrawBid,
  resultAuction,
  SALES_CONTRACT_ADDRESS,
  WFTM_ADDRESS,
  AUCTION_CONTRACT_ADDRESS,
} from 'contracts';
import { shortenAddress } from 'utils';
import SellModal from 'components/SellModal';
import OfferModal from 'components/OfferModal';
import AuctionModal from 'components/AuctionModal';
import BidModal from 'components/BidModal';
import Header from 'components/header';

import webIcon from 'assets/svgs/web.svg';
import discordIcon from 'assets/imgs/discord.png';
import telegramIcon from 'assets/imgs/telegram.png';
import twitterIcon from 'assets/imgs/twitter.png';
import mediumIcon from 'assets/svgs/medium.svg';

import styles from './styles.module.scss';

const NFTItem = () => {
  const { addr: address, id: tokenID } = useParams();

  const { account, chainId } = useWeb3React();

  const [salesContractApproved, setSalesContractApproved] = useState(false);
  const [salesContractApproving, setSalesContractApproving] = useState(false);
  const [auctionContractApproved, setAuctionContractApproved] = useState(false);
  const [auctionContractApproving, setAuctionContractApproving] = useState(
    false
  );

  const [minBidIncrement, setMinBidIncrement] = useState(0);
  const [withdrawLockTime, setWithdrawLockTime] = useState(0);
  const [info, setInfo] = useState();
  const [owner, setOwner] = useState();
  const [collection, setCollection] = useState();
  const [collectionLoading, setCollectionLoading] = useState(false);

  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [auctionModalVisible, setAuctionModalVisible] = useState(false);
  const [bidModalVisible, setBidModalVisible] = useState(false);

  const [itemListing, setItemListing] = useState(false);
  const [priceUpdating, setPriceUpdating] = useState(false);
  const [offerPlacing, setOfferPlacing] = useState(false);
  const [offerCancelling, setOfferCancelling] = useState(false);
  const [auctionStarting, setAuctionStarting] = useState(false);
  const [bidPlacing, setBidPlacing] = useState(false);

  const [listing, setListing] = useState(null);
  const [offers, setOffers] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [auction, setAuction] = useState(null);
  const [bid, setBid] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winningBid, setWinningBid] = useState(null);
  const [views, setViews] = useState();
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const { isConnected: isWalletConnected } = useSelector(
    state => state.ConnectWallet
  );

  const isLoggedIn = () => {
    return isWalletConnected && chainId === 250;
  };

  const getTokenURI = async () => {
    setLoading(true);
    try {
      const { data: tokenURI } = await fetchTokenURI(address, tokenID);
      const { data } = await axios.get(tokenURI);
      setInfo(data);
    } catch {
      console.log('Token URI not available');
    }
    setLoading(false);
  };

  const getTokenOwner = async () => {
    try {
      const [contract] = await getNFTContract(address);
      const res = await contract.ownerOf(tokenID);
      setOwner(res);
    } catch {
      setOwner(null);
    }
  };

  const getItemListings = async () => {
    try {
      const listing = await getListing(address, tokenID);
      setListing(listing);
    } catch (e) {
      console.log(e);
    }
  };

  const getCurrentOffers = async () => {
    try {
      const { data } = await getOffers(address, tokenID);
      setOffers(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getItemTradeHistory = async () => {
    try {
      const { data } = await getTradeHistory(address, tokenID);
      setTradeHistory(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getAuctions = async () => {
    try {
      const auction = await getAuction(address, tokenID);
      if (auction.endTime !== 0) {
        setAuction(auction);
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
      address.toLowerCase() === nft.toLowerCase() &&
      parseFloat(tokenID) === parseFloat(id.toString())
    );
  };

  const addEventListeners = async () => {
    const salesContract = await getSalesContract();

    salesContract.on(
      'ItemListed',
      (
        owner,
        nft,
        id,
        quantity,
        pricePerItem,
        startingTime,
        isPrivate,
        allowedAddress
      ) => {
        if (eventMatches(nft, id)) {
          setListing({
            owner,
            quantity: parseFloat(quantity.toString()),
            pricePerItem: parseFloat(pricePerItem.toString()) / 10 ** 18,
            startingTime: parseFloat(startingTime.toString()),
            allowedAddress,
          });
        }
      }
    );

    salesContract.on('ItemUpdated', (owner, nft, id, newPrice) => {
      if (eventMatches(nft, id)) {
        const newListing = {
          ...listing,
          pricePerItem: parseFloat(newPrice.toString()) / 10 ** 18,
        };
        setListing(newListing);
      }
    });

    salesContract.on('ItemCanceled', (owner, nft, id) => {
      if (eventMatches(nft, id)) {
        setListing(null);
      }
    });

    salesContract.on('ItemSold', (seller, buyer, nft, id, price) => {
      if (eventMatches(nft, id)) {
        setListing(null);
        setOwner(buyer);
        const newTradeHistory = [...tradeHistory];
        newTradeHistory.push({
          from: seller,
          to: buyer,
          price: parseFloat(price.toString()) / 10 ** 18,
          saleDate: new Date().toISOString(),
        });
        setTradeHistory(newTradeHistory);
      }
    });

    salesContract.on(
      'OfferCreated',
      (creator, nft, id, payToken, quantity, pricePerItem, deadline) => {
        if (eventMatches(nft, id)) {
          const newOffers = [...offers];
          newOffers.push({
            creator,
            deadline: parseFloat(deadline.toString()),
            payToken,
            pricePerItem: parseFloat(pricePerItem.toString()) / 10 ** 18,
            quantity: parseFloat(quantity.toString()),
          });
          setOffers(newOffers);
        }
      }
    );

    salesContract.on('OfferCanceled', (creator, nft, id) => {
      if (eventMatches(nft, id)) {
        const newOffers = offers.filter(
          offer => offer.creator.toLowerCase() === creator.toLowerCase()
        );
        setOffers(newOffers);
      }
    });

    const auctionContract = await getAuctionContract();

    auctionContract.on('AuctionCreated', (nft, id) => {
      if (eventMatches(nft, id)) {
        getAuctions();
      }
    });

    auctionContract.on('UpdateAuctionEndTime', (nft, id, _endTime) => {
      if (eventMatches(nft, id)) {
        const endTime = parseFloat(_endTime.toString());
        if (auction) {
          const newAuction = { ...auction, endTime };
          setAuction(newAuction);
        }
      }
    });

    auctionContract.on('UpdateAuctionStartTime', (nft, id, _startTime) => {
      if (eventMatches(nft, id)) {
        const startTime = parseFloat(_startTime.toString());
        if (auction) {
          const newAuction = { ...auction, startTime };
          setAuction(newAuction);
        }
      }
    });

    auctionContract.on('UpdateAuctionReservePrice', (nft, id, _price) => {
      if (eventMatches(nft, id)) {
        const price = parseFloat(_price.toString()) / 10 ** 18;
        if (auction) {
          const newAuction = { ...auction, reservePrice: price };
          setAuction(newAuction);
        }
      }
    });

    auctionContract.on('UpdateMinBidIncrement', _minBidIncrement => {
      const minBidIncrement = parseFloat(_minBidIncrement.toString());
      setMinBidIncrement(minBidIncrement);
    });

    auctionContract.on('UpdateBidWithdrawalLockTime', _lockTime => {
      const lockTime = parseFloat(_lockTime.toString());
      setWithdrawLockTime(lockTime);
    });

    auctionContract.on('BidPlaced', (nft, id, bidder, _bid) => {
      if (eventMatches(nft, id)) {
        const bid = parseFloat(_bid.toString()) / 10 ** 18;
        setBid({
          bidder,
          bid,
          lastBidTime: Math.floor(new Date().getTime() / 1000),
        });
      }
    });

    auctionContract.on('BidWithdrawn', (nft, id) => {
      if (eventMatches(nft, id)) {
        setBid(null);
      }
    });

    auctionContract.on('AuctionCancelled', (nft, id) => {
      if (eventMatches(nft, id)) {
        setAuction(null);
        setBid(null);
      }
    });

    auctionContract.on('AuctionResulted', (nft, id, winner, _winningBid) => {
      if (eventMatches(nft, id)) {
        const newAuction = { ...auction, resulted: true };
        setAuction(newAuction);
        setWinner(winner);
        const winningBid = parseFloat(_winningBid.toString()) / 10 ** 18;
        setWinningBid(winningBid);
      }
    });
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
    addEventListeners();
    getAuctionConfiguration();
    setInterval(() => {
      setNow(new Date());
    }, 1000);
  }, []);

  useEffect(() => {
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
  }, [address, tokenID]);

  const getSalesContractStatus = async () => {
    const [contract] = await getNFTContract(address);
    try {
      const approved = await contract.isApprovedForAll(
        account,
        SALES_CONTRACT_ADDRESS
      );
      setSalesContractApproved(approved);
    } catch (e) {
      console.log(e);
    }
  };

  const getAuctionContractStatus = async () => {
    const [contract] = await getNFTContract(address);
    try {
      const approved = await contract.isApprovedForAll(
        account,
        AUCTION_CONTRACT_ADDRESS
      );
      setAuctionContractApproved(approved);
    } catch (e) {
      console.log(e);
    }
  };

  const addNFTContractEventListeners = async () => {
    const [contract] = await getNFTContract(address);

    contract.on('ApprovalForAll', (owner, operator, approved) => {
      if (account === owner) {
        if (operator === AUCTION_CONTRACT_ADDRESS) {
          setAuctionContractApproved(approved);
        } else if (operator === SALES_CONTRACT_ADDRESS) {
          setSalesContractApproved(approved);
        }
      }
    });
  };

  useEffect(() => {
    getSalesContractStatus();
    getAuctionContractStatus();
  }, [address, account]);

  useEffect(() => {
    addNFTContractEventListeners();
    getCollection();
  }, [address]);

  const handleApproveSalesContract = async () => {
    setSalesContractApproving(true);
    try {
      const [contract, provider] = await getNFTContract(address);
      const tx = await contract.setApprovalForAll(SALES_CONTRACT_ADDRESS, true);
      await provider.waitForTransaction(tx.hash);
      setSalesContractApproved(true);
    } catch (e) {
      console.log(e);
    } finally {
      setSalesContractApproving(false);
    }
  };

  const handleApproveAuctionContract = async () => {
    setAuctionContractApproving(true);
    try {
      const [contract, provider] = await getNFTContract(address);
      const tx = await contract.setApprovalForAll(
        AUCTION_CONTRACT_ADDRESS,
        true
      );
      await provider.waitForTransaction(tx.hash);
      setAuctionContractApproved(true);
    } catch (e) {
      console.log(e);
    } finally {
      setAuctionContractApproving(false);
    }
  };

  const isMine = owner === account;

  const handleListItem = async _price => {
    try {
      setItemListing(true);

      const price = ethers.utils.parseEther(_price);
      const tx = await listItem(
        address,
        ethers.BigNumber.from(tokenID),
        ethers.BigNumber.from(1),
        price,
        ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000)),
        '0x0000000000000000000000000000000000000000'
      );

      setSellModalVisible(false);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.waitForTransaction(tx.hash);

      setItemListing(false);
    } catch {
      setItemListing(false);
    }
  };

  const handleUpdatePrice = async _price => {
    try {
      setPriceUpdating(true);

      const price = ethers.utils.parseEther(_price);
      const tx = await updateListing(address, tokenID, price);

      setSellModalVisible(false);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.waitForTransaction(tx.hash);

      setPriceUpdating(false);
    } catch (e) {
      setPriceUpdating(false);
    }
  };

  const cancelList = async () => {
    await cancelListing(address, tokenID);
    setListing(null);
  };

  const handleBuyItem = async _price => {
    const price = ethers.utils.parseEther(_price.toString());
    const tx = await buyItem(
      address,
      ethers.BigNumber.from(tokenID),
      price,
      account
    );

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.waitForTransaction(tx.hash);
  };

  const handleMakeOffer = async (_price, endTime) => {
    try {
      setOfferPlacing(true);
      const price = ethers.utils.parseEther(_price.toString());
      const deadline = Math.floor(endTime.getTime() / 1000);

      const balance = await getWFTMBalance(account);

      if (balance.lt(price)) {
        await wrapFTM(price, account);
      }

      const allowance = await getAllowance(account, SALES_CONTRACT_ADDRESS);
      if (allowance.lt(price)) {
        await approve(SALES_CONTRACT_ADDRESS, price);
      }

      const tx = await createOffer(
        address,
        ethers.BigNumber.from(tokenID),
        WFTM_ADDRESS,
        ethers.BigNumber.from(1),
        price,
        ethers.BigNumber.from(deadline)
      );

      setOfferModalVisible(false);

      console.log('Transaction submitted: ', tx.hash);
    } catch (e) {
      console.log(e);
    } finally {
      setOfferPlacing(false);
    }
  };

  const handleAcceptOffer = async offer => {
    const tx = await acceptOffer(address, tokenID, offer.creator);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.waitForTransaction(tx.hash);
  };

  const handleCancelOffer = async () => {
    try {
      setOfferCancelling(true);

      const tx = await cancelOffer(address, tokenID);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.waitForTransaction(tx.hash);

      setOfferCancelling(false);
    } catch {
      setOfferCancelling(false);
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
      setAuctionModalVisible(false);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.waitForTransaction(tx.hash);

      setAuctionStarting(false);
    } catch {
      setAuctionStarting(false);
    }
  };

  const handleUpdateAuction = async (_price, _startTime, _endTime) => {
    if (!auction) return;

    if (parseFloat(_price) !== auction.reservePrice) {
      const price = ethers.utils.parseEther(_price);
      await updateAuctionReservePrice(
        address,
        ethers.BigNumber.from(tokenID),
        ethers.BigNumber.from(price)
      );
    }

    const startTime = Math.floor(_startTime.getTime() / 1000);
    if (startTime !== auction.startTime) {
      await updateAuctionStartTime(
        address,
        ethers.BigNumber.from(tokenID),
        ethers.BigNumber.from(startTime)
      );
    }

    const endTime = Math.floor(_endTime.getTime() / 1000);
    if (endTime !== auction.endTime) {
      await updateAuctionEndTime(
        address,
        ethers.BigNumber.from(tokenID),
        ethers.BigNumber.from(endTime)
      );
    }

    setAuctionModalVisible(false);
  };

  const cancelCurrentAuction = async () => {
    await cancelAuction(address, tokenID);
    setAuction(null);
  };

  const handleResultAuction = async () => {
    await resultAuction(address, tokenID);
  };

  const handlePlaceBid = async _price => {
    try {
      setBidPlacing(true);

      const price = ethers.utils.parseEther(_price);
      const tx = await placeBid(
        address,
        ethers.BigNumber.from(tokenID),
        price,
        account
      );
      setBidModalVisible(false);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.waitForTransaction(tx.hash);

      setBidPlacing(false);
    } catch {
      setBidPlacing(false);
    }
  };

  const handleWithdrawBid = async () => {
    await withdrawBid(address, ethers.BigNumber.from(tokenID));
  };

  const hasMyOffer = useMemo(() => {
    return offers.findIndex(offer => offer.creator === account) > -1;
  }, [offers]);

  const series = useMemo(
    () => ({
      showPoints: false,
    }),
    []
  );

  const axes = useMemo(
    () => [
      {
        primary: true,
        type: 'time',
        position: 'bottom',
        show: [true, false],
      },
      { type: 'linear', position: 'left' },
    ],
    []
  );

  const data = tradeHistory.map(history => {
    const saleDate = new Date(history.saleDate);
    return {
      primary: saleDate,
      secondary: history.price,
    };
  });

  const formatExpiration = deadline => {
    const duration = new Date(deadline * 1000).getTime() - now.getTime();
    let s = Math.floor(duration / 1000);
    let m = Math.floor(s / 60);
    s %= 60;
    let h = Math.floor(m / 60);
    m %= 60;
    const d = Math.floor(h / 24);
    h %= 24;
    const res = [];
    if (d > 0) {
      res.push(`${d} days`);
    }
    if (d > 0 || h > 0) {
      res.push(`${h} hours`);
    }
    if (d > 0 || h > 0 || m > 0) {
      res.push(`${m} mins`);
    }
    res.push(`${s}s`);
    return res.join(' ');
  };

  const formatDiff = endTime => {
    const diff = endTime - Math.floor(now.getTime() / 1000);
    let m = Math.floor(diff / 60);
    const s = diff % 60;
    let h = Math.floor(m / 60);
    m %= 60;
    const d = Math.floor(h / 24);
    h %= 24;

    if (d) return `${d} days`;
    if (h) return `${h} hours`;
    if (m) return `${m} minutes`;
    return `${s} seconds`;
  };

  const auctionStarted = () => now.getTime() / 1000 >= auction?.startTime;

  const auctionEnded = () => auction?.endTime <= now.getTime() / 1000;

  const auctionActive = () => auctionStarted() && !auctionEnded();

  const canWithdraw = () =>
    bid?.bidder === account &&
    bid?.lastBidTime + withdrawLockTime < now.getTime() / 1000;

  return (
    <div
      className={cx(styles.container, isLoggedIn() ? styles.withHeader : '')}
    >
      <Header light />
      {isLoggedIn() && (
        <div className={styles.header}>
          {isMine ? (
            <>
              {auction?.resulted === false ? (
                <div
                  className={styles.headerButton}
                  onClick={cancelCurrentAuction}
                >
                  Cancel Auction
                </div>
              ) : null}
              {(!auction || auction.endTime > now.getTime() / 1000) && (
                <div
                  className={styles.headerButton}
                  onClick={() => setAuctionModalVisible(true)}
                >
                  {auction ? 'Update Auction' : 'Start Auction'}
                </div>
              )}
              {listing ? (
                <div className={styles.headerButton} onClick={cancelList}>
                  Cancel Listing
                </div>
              ) : null}
              <div
                className={cx(
                  styles.headerButton,
                  (itemListing || priceUpdating) && styles.disabled
                )}
                onClick={() =>
                  !(itemListing || priceUpdating) && setSellModalVisible(true)
                }
              >
                {listing ? 'Update Listing' : 'Sell'}
              </div>
            </>
          ) : (
            <>
              <div
                className={cx(
                  styles.headerButton,
                  (offerPlacing || offerCancelling) && styles.disabled
                )}
                onClick={
                  hasMyOffer
                    ? handleCancelOffer
                    : () => setOfferModalVisible(true)
                }
              >
                {hasMyOffer
                  ? offerCancelling
                    ? 'Cancelling...'
                    : 'Cancel Offer'
                  : 'Make Offer'}
              </div>
            </>
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
                ) : (
                  <img src={info?.image} />
                )}
              </div>
            </div>
            <div className={styles.itemInfoCont}>
              {info?.properties && (
                <Panel icon={LabelIcon} title="Properties">
                  <div />
                </Panel>
              )}
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
              <Panel icon={BallotIcon} title="Chain Info">
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
            </div>
          </div>
          <div className={styles.itemMain}>
            <div className={styles.wrapper}>
              <div className={styles.itemCategory}>
                {collection?.name || ''}
              </div>
              <div className={styles.itemName}>{info?.name || ''}</div>
              <div className={styles.itemViews}>
                <FontAwesomeIcon icon={faEye} color="#777" />
                &nbsp;{views} Views
              </div>
            </div>
            {(winner || auction?.resulted === false) && (
              <div className={styles.panelWrapper}>
                <Panel
                  icon={AccessTimeIcon}
                  title={
                    auctionStarted()
                      ? auctionEnded()
                        ? 'Sale ended'
                        : `Sale ends in ${formatDiff(
                            auction.endTime
                          )} (${new Date(
                            auction.endTime * 1000
                          ).toLocaleString()})`
                      : `Sale starts in ${formatDiff(auction.startTime)}`
                  }
                  fixed
                >
                  <div className={styles.bids}>
                    {auctionEnded() ? (
                      <div className={styles.result}>
                        {auction.resulted ? (
                          <>
                            {'Winner: '}
                            <Link to={`/address/${winner}`}>
                              {winner === account
                                ? 'Me'
                                : shortenAddress(winner)}
                            </Link>
                            {` (${winningBid} FTM)`}
                          </>
                        ) : (
                          'Waiting for result'
                        )}
                      </div>
                    ) : bid ? (
                      <div>
                        <div className={styles.bidtitle}>
                          Highest Bid
                          {bid.bid < auction.reservePrice
                            ? ' -- Reserve price not met.'
                            : ''}
                        </div>
                        <div className={styles.bidAmount}>{bid.bid} FTM</div>
                      </div>
                    ) : (
                      <div className={styles.bidtitle}>No bids yet</div>
                    )}
                    {!isMine &&
                      auctionActive() &&
                      (bid?.bidder === account ? (
                        <div
                          className={cx(
                            styles.withdrawBid,
                            !canWithdraw() && styles.disabled
                          )}
                          onClick={() => canWithdraw() && handleWithdrawBid()}
                        >
                          Withdraw Bid
                        </div>
                      ) : (
                        <div
                          className={styles.placeBid}
                          onClick={() => setBidModalVisible(true)}
                        >
                          Place Bid
                        </div>
                      ))}
                    {isMine && auctionEnded() && !auction.resulted && (
                      <div
                        className={styles.placeBid}
                        onClick={handleResultAuction}
                      >
                        Result
                      </div>
                    )}
                  </div>
                </Panel>
              </div>
            )}
            <div className={styles.panelWrapper}>
              <Panel icon={TimelineIcon} title="Price History">
                <div className={styles.chartWrapper}>
                  <ResizableBox width="100%" height={250} resizable={false}>
                    <Chart
                      data={[{ label: 'Price', data }]}
                      series={series}
                      axes={axes}
                      tooltip
                    />
                  </ResizableBox>
                </div>
              </Panel>
            </div>
            <div className={styles.panelWrapper}>
              <Panel icon={LocalOfferIcon} title="Listings">
                <div className={styles.listings}>
                  {listing && (
                    <div className={styles.listing}>
                      <div className={styles.owner}>
                        {shortenAddress(listing.owner)}
                      </div>
                      <div className={styles.price}>
                        {listing.pricePerItem} FTM
                      </div>
                      {!isMine && (
                        <div
                          className={styles.buyButton}
                          onClick={() => handleBuyItem(listing.pricePerItem)}
                        >
                          Buy
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Panel>
            </div>
            <div className={styles.panelWrapper}>
              <Panel icon={TocIcon} title="Offers">
                <div className={styles.offers}>
                  <div className={styles.offer}>
                    <div className={styles.owner}>From</div>
                    <div className={styles.price}>Price</div>
                    <div className={styles.deadline}>Expires In</div>
                  </div>
                  {offers.map((offer, idx) => (
                    <div className={styles.offer} key={idx}>
                      <div className={styles.owner}>
                        {shortenAddress(offer.creator)}
                      </div>
                      <div className={styles.price}>
                        {offer.pricePerItem} FTM
                      </div>
                      <div className={styles.deadline}>
                        {formatExpiration(offer.deadline)}
                      </div>
                      {isMine && (
                        <div
                          className={styles.buyButton}
                          onClick={() => handleAcceptOffer(offer)}
                        >
                          Accept
                        </div>
                      )}
                      {offer.creator === account && (
                        <div
                          className={cx(
                            styles.buyButton,
                            offerCancelling && styles.disabled
                          )}
                          onClick={() => handleCancelOffer()}
                        >
                          {offerCancelling ? 'Withdrawing...' : 'Withdraw'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </div>
        <div className={styles.panelWrapper}>
          <Panel icon={SwapVertIcon} title="Trade History">
            <div className={styles.listings}>
              <div className={styles.listing}>
                <div className={styles.from}>From</div>
                <div className={styles.to}>To</div>
                <div className={styles.historyPrice}>Price</div>
                <div className={styles.saleDate}>Date</div>
              </div>
              {tradeHistory.map((history, idx) => {
                const saleDate = new Date(history.saleDate);
                return (
                  <div className={styles.listing} key={idx}>
                    <Link
                      to={`/address/${history.from}`}
                      className={styles.from}
                    >
                      {history.from}
                    </Link>
                    <Link to={`/address/${history.to}`} className={styles.to}>
                      {history.to}
                    </Link>
                    <div className={styles.historyPrice}>
                      {history.price} FTM
                    </div>
                    <div className={styles.saleDate}>
                      {saleDate.toUTCString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>

      <SellModal
        visible={sellModalVisible}
        onClose={() => setSellModalVisible(false)}
        onSell={listing ? handleUpdatePrice : handleListItem}
        startPrice={listing?.pricePerItem || 0}
        confirming={itemListing || priceUpdating}
        approveContract={handleApproveSalesContract}
        contractApproving={salesContractApproving}
        contractApproved={salesContractApproved}
      />
      <OfferModal
        visible={offerModalVisible}
        onClose={() => setOfferModalVisible(false)}
        onMakeOffer={handleMakeOffer}
        confirming={offerPlacing}
        approveContract={handleApproveSalesContract}
        contractApproving={salesContractApproving}
        contractApproved={salesContractApproved}
      />
      <AuctionModal
        visible={auctionModalVisible}
        onClose={() => setAuctionModalVisible(false)}
        onStartAuction={auction ? handleUpdateAuction : handleStartAuction}
        auction={auction}
        confirming={auctionStarting}
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
        approveContract={handleApproveAuctionContract}
        contractApproving={auctionContractApproving}
        contractApproved={auctionContractApproved}
      />
    </div>
  );
};

export default NFTItem;
