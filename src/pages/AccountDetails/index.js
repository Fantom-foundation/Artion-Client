import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import cx from 'classnames';
import { Edit as EditIcon } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import { useWeb3React } from '@web3-react/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Skeleton from 'react-loading-skeleton';

import NFTsGrid from 'components/NFTsGrid';
import Header from 'components/header';
import Identicon from 'components/Identicon';
import { shortenAddress } from 'utils';
import {
  getUserAccountDetails,
  fetchTokens,
  updateBanner,
  getAccountActivity,
  getActivityFromOthers,
} from 'api';
import TokensActions from 'actions/tokens.actions';
import HeaderActions from 'actions/header.actions';
import ModalActions from 'actions/modal.actions';

import iconCopy from 'assets/svgs/copy.svg';
import iconSettings from 'assets/svgs/settings.svg';

import styles from './styles.module.scss';

const ONE_MIN = 60;
const ONE_HOUR = ONE_MIN * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_MONTH = ONE_DAY * 30;

const tabs = ['Items', 'Activity', 'Offers'];

const AccountDetails = () => {
  const dispatch = useDispatch();

  const { account } = useWeb3React();

  const { uid } = useParams();

  const { fetching, tokens, count } = useSelector(state => state.Tokens);
  const { collections, category } = useSelector(state => state.Filter);
  const { user: me } = useSelector(state => state.Auth);
  const { authToken } = useSelector(state => state.ConnectWallet);

  const fileInput = useRef();

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

    dispatch(TokensActions.startFetching());

    try {
      const { data } = await fetchTokens(
        step,
        collections,
        category,
        'createdAt',
        [],
        uid
      );
      dispatch(TokensActions.fetchingSuccess(data.total, data.tokens));
      setPage(step);
    } catch {
      dispatch(TokensActions.fetchingFailed());
    }
  };

  useEffect(() => {
    setTab(0);
    getUserDetails(uid);
  }, [uid]);

  const isMe = account?.toLowerCase() === uid.toLowerCase();

  useEffect(() => {
    if (isMe && me.alias) {
      setUser(me);
    }
  }, [me]);

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(true));
    setInterval(() => setNow(new Date()), 1000);

    return () => {
      dispatch(HeaderActions.toggleSearchbar(false));
    };
  }, []);

  const handleScroll = e => {
    if (tab) return;
    if (fetching) return;
    if (tokens.length === count) return;

    const obj = e.currentTarget;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 100) {
      fetchNFTs(page + 1);
    }
  };

  useEffect(() => {
    if (tab === 0) {
      dispatch(TokensActions.resetTokens());
      fetchNFTs(0);
    } else if (tab === 1) {
      getActivity();
    } else {
      getOffers();
    }
  }, [tab, uid]);

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
            <NFTsGrid items={tokens} loading={fetching} />
          ) : tab === 1 ? (
            <>
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
                        <Link
                          to={`/account/${activity.to}`}
                          className={styles.owner}
                        >
                          {shortenAddress(activity.to)}
                        </Link>
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
            </>
          ) : (
            <>
              <div className={styles.activityHeader}>
                <div className={styles.owner}>From</div>
                <div className={styles.price}>Price</div>
                <div className={styles.quantity}>Quantity</div>
                <div className={styles.date}>Date</div>
              </div>
              <div className={styles.activityList}>
                {(offersLoading ? new Array(5).fill(null) : offers).map(
                  (offer, idx) => (
                    <div key={idx} className={styles.activity}>
                      {offer ? (
                        <Link
                          to={`/account/${offer.creator}`}
                          className={styles.owner}
                        >
                          {shortenAddress(offer.creator)}
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
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
