import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, Redirect } from 'react-router-dom';
import cx from 'classnames';
import { Edit as EditIcon } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import { useWeb3React } from '@web3-react/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Skeleton from 'react-loading-skeleton';

import NFTsGrid from 'components/NFTsGrid';
import Header from 'components/header';
import Identicon from 'components/Identicon';
import NewBundleModal from 'components/NewBundleModal';
import { isAddress, shortenAddress } from 'utils';
import {
  getUserAccountDetails,
  fetchCollections,
  fetchTokens,
  updateBanner,
  getAccountActivity,
  getActivityFromOthers,
} from 'api';
import HeaderActions from 'actions/header.actions';
import ModalActions from 'actions/modal.actions';
import CollectionsActions from 'actions/collections.actions';

import iconCopy from 'assets/svgs/copy.svg';
import iconSettings from 'assets/svgs/settings.svg';

import styles from './styles.module.scss';

const ONE_MIN = 60;
const ONE_HOUR = ONE_MIN * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_MONTH = ONE_DAY * 30;

const tabs = [
  'Single Items',
  'Bundles',
  'Listings & Offers',
  'Received Offers',
];

const AccountDetails = () => {
  const dispatch = useDispatch();

  const { account } = useWeb3React();

  const { uid } = useParams();

  const { user: me } = useSelector(state => state.Auth);
  const { authToken } = useSelector(state => state.ConnectWallet);

  const fileInput = useRef();

  const [bundleModalVisible, setBundleModalVisible] = useState(false);
  const [fetching, setFetching] = useState(false);
  const tokens = useRef([]);
  const bundles = useRef([]);
  const [count, setCount] = useState(0);
  const [now, setNow] = useState(new Date());
  const [page, setPage] = useState(0);
  const [bannerHash, setBannerHash] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [fetchInterval, setFetchInterval] = useState(null);

  const getUserDetails = async account => {
    setLoading(true);
    try {
      const { data } = await getUserAccountDetails(account);
      setUser(data);
    } catch {
      setUser({});
    }
    setLoading(false);
  };

  const fetchNFTs = async step => {
    if (fetching) return;

    setFetching(true);
    setCount(0);

    try {
      const { data } = await fetchTokens(
        step,
        tab === 0 ? 'single' : 'bundle',
        [],
        null,
        'createdAt',
        [],
        uid
      );
      setFetching(false);
      if (tab === 0) tokens.current.push(...data.tokens);
      else bundles.current.push(...data.tokens);
      setCount(data.total);
      setPage(step);
    } catch {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (tab !== 0) {
      setTab(0);
      getUserDetails(uid);
      setTimeout(init, 0);
    }
  }, [uid]);

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
    updateCollections();
    setFetchInterval(setInterval(updateCollections, 1000 * 60 * 10));

    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, []);

  const isMe = account?.toLowerCase() === uid.toLowerCase();

  useEffect(() => {
    if (isMe) {
      setUser(me);
    }
  }, [me]);

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
    setInterval(() => setNow(new Date()), 1000);
  }, []);

  const loadNextPage = () => {
    if (fetching) return;
    if (tab === 0 && tokens.current.length === count) return;
    if (tab === 1 && bundles.current.length === count) return;

    fetchNFTs(page + 1);
  };

  const handleScroll = e => {
    if (tab) return;

    const obj = e.currentTarget;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 100) {
      loadNextPage();
    }
  };

  const init = () => {
    if (tab === 0) {
      tokens.current = [];
      setCount(0);
      fetchNFTs(0);
    } else if (tab === 1) {
      bundles.current = [];
      setCount(0);
      fetchNFTs(0);
    } else if (tab === 2) {
      getActivity();
    } else {
      getOffers();
    }
  };

  useEffect(() => {
    init();
  }, [tab]);

  const getActivity = async () => {
    try {
      setActivityLoading(true);
      const { data } = await getAccountActivity(uid);
      const _activities = [];
      data.bids.map(({ owner, ...rest }) =>
        _activities.push({
          event: 'Bid',
          ...rest,
          quantity: 1,
          to: owner,
        })
      );
      data.listings.map(listing =>
        _activities.push({
          event: 'Listing',
          ...listing,
        })
      );
      data.offers.map(({ owner, ...rest }) =>
        _activities.push({
          event: 'Offer',
          ...rest,
          to: owner,
        })
      );
      _activities.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setActivities(_activities);
      setActivityLoading(false);
    } catch {
      setActivityLoading(false);
    }
  };

  const getOffers = async () => {
    try {
      setOffersLoading(true);
      const { data } = await getActivityFromOthers(uid);
      data.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setOffers(data);
      setOffersLoading(false);
    } catch {
      setOffersLoading(false);
    }
  };

  const handleCopyAddress = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleMouseOver = () => {
    setTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
    setCopied(false);
  };

  const selectBanner = () => {
    fileInput.current?.click();
  };

  const handleSelectFile = e => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onload = async function(e) {
        const { data } = await updateBanner(e.target.result, authToken);
        setBannerHash(data);
      };

      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const openAccountSettings = () => {
    dispatch(ModalActions.showAccountModal());
  };

  const handleCreateBundle = () => {
    setBundleModalVisible(true);
  };

  const formatDate = _date => {
    const date = new Date(_date);
    const diff = Math.floor((now - date.getTime()) / 1000);
    if (diff >= ONE_MONTH) {
      const m = Math.ceil(diff / ONE_MONTH);
      return `${m} Month${m > 1 ? 's' : ''} Ago`;
    }
    if (diff >= ONE_DAY) {
      const d = Math.ceil(diff / ONE_DAY);
      return `${d} Day${d > 1 ? 's' : ''} Ago`;
    }
    if (diff >= ONE_HOUR) {
      const h = Math.ceil(diff / ONE_HOUR);
      return `${h} Hour${h > 1 ? 's' : ''} Ago`;
    }
    if (diff >= ONE_MIN) {
      const h = Math.ceil(diff / ONE_MIN);
      return `${h} Min${h > 1 ? 's' : ''} Ago`;
    }
    return `${diff} Second${diff > 1 ? 's' : ''} Ago`;
  };

  if (!isAddress(uid)) {
    return <Redirect to="/404" />;
  }

  return (
    <div className={styles.container}>
      <Header light />
      <div className={styles.profile}>
        <div className={styles.banner}>
          {loading ? (
            <Skeleton width="100%" height={200} />
          ) : bannerHash || user.bannerHash ? (
            <img
              src={`https://gateway.pinata.cloud/ipfs/${bannerHash ||
                user.bannerHash}`}
              className={styles.bannerImg}
            />
          ) : (
            <div className={styles.bannerPlaceholder} />
          )}
          {isMe && (
            <div className={styles.editBanner} onClick={selectBanner}>
              <input
                ref={fileInput}
                hidden
                type="file"
                onChange={handleSelectFile}
                accept="image/*"
              />
              <EditIcon className={styles.editIcon} />
            </div>
          )}
        </div>
        {isMe && (
          <div className={styles.settings} onClick={openAccountSettings}>
            <img src={iconSettings} className={styles.settingsIcon} />
          </div>
        )}
        <div className={styles.avatarWrapper}>
          {loading ? (
            <Skeleton width={150} height={150} className={styles.avatar} />
          ) : user.imageHash ? (
            <img
              src={`https://gateway.pinata.cloud/ipfs/${user.imageHash}`}
              className={styles.avatar}
            />
          ) : (
            <Identicon className={styles.avatar} account={uid} size={150} />
          )}
        </div>
        <div className={styles.username}>
          {loading ? (
            <Skeleton width={120} height={24} />
          ) : (
            user.alias || 'Unnamed'
          )}
        </div>
        <div className={styles.addressWrapper}>
          {loading ? (
            <Skeleton width={160} height={20} />
          ) : (
            <Tooltip
              title={copied ? 'Copied!' : 'Copy'}
              open={tooltipOpen}
              arrow
              classes={{ tooltip: styles.tooltip }}
            >
              <div className={styles.address}>{shortenAddress(uid)}</div>
            </Tooltip>
          )}
          <CopyToClipboard text={uid} onCopy={handleCopyAddress}>
            <img
              src={iconCopy}
              onMouseOver={handleMouseOver}
              onMouseLeave={handleMouseLeave}
            />
          </CopyToClipboard>
        </div>
        <div className={styles.bio}>{user.bio || ''}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          {tabs.map((t, idx) => (
            <div
              key={idx}
              className={cx(styles.tab, idx === tab && styles.selected)}
              onClick={() => setTab(idx)}
            >
              {t}
            </div>
          ))}
        </div>
        <div className={styles.contentBody} onScroll={handleScroll}>
          {tab === 0 ? (
            <NFTsGrid items={tokens.current} loading={fetching} />
          ) : tab === 1 ? (
            <NFTsGrid
              items={bundles.current}
              loading={fetching}
              showCreate={isMe}
              onCreate={handleCreateBundle}
            />
          ) : tab === 2 ? (
            <div className={styles.tableWapper}>
              <div className={styles.activityHeader}>
                <div className={styles.event}>Event</div>
                <div className={styles.name}>Item</div>
                <div className={styles.price}>Price</div>
                <div className={styles.quantity}>Quantity</div>
                <div className={styles.owner}>Owner</div>
                <div className={styles.date}>Date</div>
              </div>
              <div className={styles.activityList}>
                {(activityLoading ? new Array(5).fill(null) : activities).map(
                  (activity, idx) => (
                    <div key={idx} className={styles.activity}>
                      <div className={styles.event}>
                        {activity ? (
                          activity.event
                        ) : (
                          <Skeleton width={100} height={20} />
                        )}
                      </div>
                      {activity ? (
                        <Link
                          to={`/explore/${activity.contractAddress}/${activity.tokenID}`}
                          className={styles.name}
                        >
                          {activity.name}
                        </Link>
                      ) : (
                        <div className={styles.name}>
                          <Skeleton width={120} height={20} />
                        </div>
                      )}
                      <div className={styles.price}>
                        {activity ? (
                          `${activity.price} FTM`
                        ) : (
                          <Skeleton width={100} height={20} />
                        )}
                      </div>
                      <div className={styles.quantity}>
                        {activity ? (
                          activity.quantity
                        ) : (
                          <Skeleton width={80} height={20} />
                        )}
                      </div>
                      {activity ? (
                        activity.to ? (
                          <Link
                            to={`/account/${activity.to}`}
                            className={styles.owner}
                          >
                            <div className={styles.ownerAvatarWrapper}>
                              {activity.image ? (
                                <img
                                  src={`https://gateway.pinata.cloud/ipfs/${activity.image}`}
                                  className={styles.ownerAvatar}
                                />
                              ) : (
                                <Identicon
                                  account={activity.to}
                                  size={24}
                                  className={styles.ownerAvatar}
                                />
                              )}
                            </div>
                            {activity.alias || shortenAddress(activity.to)}
                          </Link>
                        ) : (
                          <div className={styles.owner} />
                        )
                      ) : (
                        <div className={styles.owner}>
                          <Skeleton width={130} height={20} />
                        </div>
                      )}
                      <div className={styles.date}>
                        {activity ? (
                          formatDate(activity.createdAt)
                        ) : (
                          <Skeleton width={120} height={20} />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <>
              <div className={styles.activityHeader}>
                <div className={styles.owner}>From</div>
                <div className={styles.price}>Price</div>
                <div className={styles.quantity}>Quantity</div>
                <div className={styles.date}>Date</div>
              </div>
              <div className={styles.activityList}>
                {(offersLoading
                  ? new Array(5).fill(null)
                  : offers.filter(
                      offer => offer.deadline * 1000 > now.getTime()
                    )
                ).map((offer, idx) => (
                  <div key={idx} className={styles.activity}>
                    {offer ? (
                      <Link
                        to={`/account/${offer.creator}`}
                        className={styles.owner}
                      >
                        <div className={styles.ownerAvatarWrapper}>
                          {offer.image ? (
                            <img
                              src={`https://gateway.pinata.cloud/ipfs/${offer.image}`}
                              className={styles.ownerAvatar}
                            />
                          ) : (
                            <Identicon
                              account={offer.creator}
                              size={24}
                              className={styles.ownerAvatar}
                            />
                          )}
                        </div>
                        {offer.alias || shortenAddress(offer.creator)}
                      </Link>
                    ) : (
                      <div className={styles.owner}>
                        <Skeleton width={130} height={20} />
                      </div>
                    )}
                    <div className={styles.price}>
                      {offer ? (
                        `${offer.pricePerItem} FTM`
                      ) : (
                        <Skeleton width={100} height={20} />
                      )}
                    </div>
                    <div className={styles.quantity}>
                      {offer ? (
                        offer.quantity
                      ) : (
                        <Skeleton width={80} height={20} />
                      )}
                    </div>
                    <div className={styles.date}>
                      {offer ? (
                        formatDate(offer.createdAt)
                      ) : (
                        <Skeleton width={120} height={20} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <NewBundleModal
        visible={bundleModalVisible}
        onClose={() => setBundleModalVisible(false)}
        items={tokens.current}
        onLoadNext={loadNextPage}
        onCreateSuccess={() => {
          bundles.current = [];
          fetchNFTs(0);
        }}
      />
    </div>
  );
};

export default AccountDetails;
