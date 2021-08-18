import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, Redirect } from 'react-router-dom';
import { useResizeDetector } from 'react-resize-detector';
import cx from 'classnames';
import { Edit as EditIcon } from '@material-ui/icons';
import { Tooltip, Menu, MenuItem } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Skeleton from 'react-loading-skeleton';
import { ClipLoader } from 'react-spinners';
import ReactPlayer from 'react-player';
import Loader from 'react-loader-spinner';
import axios from 'axios';

import NFTsGrid from 'components/NFTsGrid';
import Header from 'components/header';
import Identicon from 'components/Identicon';
import NewBundleModal from 'components/NewBundleModal';
import FollowersModal from 'components/FollowersModal';
import SuspenseImg from 'components/SuspenseImg';
import { isAddress, shortenAddress, formatFollowers } from 'utils';
import toast from 'utils/toast';
import { useApi } from 'api';
import HeaderActions from 'actions/header.actions';
import ModalActions from 'actions/modal.actions';
import CollectionsActions from 'actions/collections.actions';

import iconCopy from 'assets/svgs/copy.svg';
import iconSettings from 'assets/svgs/settings.svg';
import iconShare from 'assets/svgs/share.svg';
import iconArtion from 'assets/svgs/logo_small_blue.svg';
import iconFacebook from 'assets/imgs/facebook.png';
import iconTwitter from 'assets/svgs/twitter_blue.svg';
import IconList from 'assets/icons/iconList';
import IconBundle from 'assets/icons/iconBundle';
import IconHeart from 'assets/icons/iconHeart';
import IconClock from 'assets/icons/iconClock';

import styles from './styles.module.scss';

const ONE_MIN = 60;
const ONE_HOUR = ONE_MIN * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_MONTH = ONE_DAY * 30;

const AccountDetails = () => {
  const dispatch = useDispatch();

  const {
    storageUrl,
    getUserAccountDetails,
    getUserFigures,
    fetchCollections,
    fetchTokens,
    updateBanner,
    getAccountActivity,
    getActivityFromOthers,
    getMyOffers,
    getFollowing,
    followUser: _followUser,
    getFollowers,
    getFollowings,
    getMyLikes,
    getItemsLiked,
  } = useApi();
  const { account, chainId } = useWeb3React();
  const { width, ref } = useResizeDetector();

  const { uid } = useParams();

  const { authToken } = useSelector(state => state.ConnectWallet);
  const { user: me } = useSelector(state => state.Auth);

  const fileInput = useRef();

  const [anchorEl, setAnchorEl] = useState(null);
  const [prevUID, setPrevUID] = useState(null);
  const [bundleModalVisible, setBundleModalVisible] = useState(false);
  const [followingsModalVisible, setFollowingsModalVisible] = useState(false);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [bundleFetching, setBundleFetching] = useState(false);
  const [favFetching, setFavFetching] = useState(false);
  const tokens = useRef([]);
  const bundles = useRef([]);
  const likes = useRef([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const followers = useRef([]);
  const followings = useRef([]);
  const [following, setFollowing] = useState(false);
  const [followingInProgress, setFollowingInProgress] = useState(false);
  const [count, setCount] = useState(0);
  const [bundleCount, setBundleCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [now, setNow] = useState(new Date());
  const [page, setPage] = useState(0);
  const [bannerHash, setBannerHash] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bids, setBids] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [fetchInterval, setFetchInterval] = useState(null);
  const [likeCancelSource, setLikeCancelSource] = useState(null);
  const [prevNumPerRow, setPrevNumPerRow] = useState(null);

  const numPerRow = Math.floor(width / 240);
  const fetchCount = numPerRow <= 3 ? 18 : numPerRow === 4 ? 16 : numPerRow * 3;

  const getUserDetails = async _account => {
    setLoading(true);
    try {
      const { data } = await getUserAccountDetails(_account);
      setUser(data);
    } catch {
      setUser({});
    }
    try {
      const { data: isFollowing } = await getFollowing(account, _account);
      setFollowing(isFollowing);
    } catch {
      setFollowing(false);
    }
    setLoading(false);
  };

  const getFigures = async _account => {
    setFetching(true);
    setBundleFetching(true);
    setFavFetching(true);

    try {
      const {
        data: { single, bundle, fav },
      } = await getUserFigures(_account);
      setCount(single);
      setBundleCount(bundle);
      setFavCount(fav);
    } catch {
      setCount(0);
      setBundleCount(0);
      setFavCount(0);
    }

    setFetching(false);
    setBundleFetching(false);
    setFavFetching(false);
  };

  const fetchNFTs = async () => {
    if (tab === 0) {
      if (fetching) return;
      setFetching(true);
    } else {
      if (bundleFetching) return;
      setBundleFetching(true);
    }

    try {
      const start = tab === 0 ? tokens.current.length : bundles.current.length;
      const _count =
        fetchCount -
        ((tab === 0 ? tokens.current : bundles.current).length % numPerRow);
      const { data } = await fetchTokens(
        start,
        _count,
        tab === 0 ? 'single' : 'bundle',
        [],
        null,
        'createdAt',
        [],
        uid
      );

      if (tab === 0) {
        // eslint-disable-next-line require-atomic-updates
        tokens.current = [...tokens.current, ...data.tokens];
        setCount(data.total);
        if (authToken) {
          updateItems(tokens.current)
            .then(_tokens => (tokens.current = _tokens))
            .catch();
        }
      } else {
        // eslint-disable-next-line require-atomic-updates
        bundles.current = [...bundles.current, ...data.tokens];
        setBundleCount(data.total);
        if (authToken) {
          updateItems(bundles.current)
            .then(_bundles => (bundles.current = _bundles))
            .catch();
        }
      }

      setFetching(false);
      setBundleFetching(false);
    } catch {
      setFetching(false);
      setBundleFetching(false);
    }
  };

  const fetchLikes = async step => {
    if (fetching) return;

    setFavFetching(true);

    try {
      const { data } = await getMyLikes(step, uid);
      setFavFetching(false);
      likes.current = [...likes.current, ...data.tokens];
      setFavCount(data.total);
      if (authToken) {
        updateItems(likes.current)
          .then(_likes => (likes.current = _likes))
          .catch();
      }
      setPage(step);
    } catch {
      setFavFetching(false);
    }
  };

  useEffect(() => {
    setPrevNumPerRow(numPerRow);
    if (isNaN(numPerRow) || (prevNumPerRow && prevNumPerRow !== numPerRow))
      return;

    if (!chainId) return;

    if (prevUID !== uid) {
      setPrevUID(uid);
      getUserDetails(uid);
      getFigures(uid);
      setTab(0);
      if (tab === 0) {
        init();
      }
    } else {
      init();
    }
  }, [uid, tab, chainId, numPerRow]);

  useEffect(() => {
    if (me && user && me.address?.toLowerCase() === uid.toLowerCase()) {
      setUser({ ...user, ...me });
    }
  }, [me, uid]);

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
    if (fetchInterval) {
      clearInterval(fetchInterval);
    }

    updateCollections();
    setFetchInterval(setInterval(updateCollections, 1000 * 60 * 10));
  }, [chainId]);

  const isMe = account?.toLowerCase() === uid.toLowerCase();

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(true));
    setInterval(() => setNow(new Date()), 1000);
  }, []);

  const updateItems = async _tokens => {
    return new Promise((resolve, reject) => {
      const missingTokens = _tokens
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

      if (missingTokens.length === 0) {
        reject();
        return;
      }

      const cancelTokenSource = axios.CancelToken.source();
      setLikeCancelSource(cancelTokenSource);
      getItemsLiked(missingTokens, authToken, cancelTokenSource.token)
        .then(({ data, status }) => {
          setLikeCancelSource(null);
          if (status === 'success') {
            const newTokens = [...tokens.current];
            missingTokens.map((tk, idx) => {
              newTokens[tk.index].isLiked = data[idx].isLiked;
            });
            resolve(newTokens);
          }
        })
        .catch(() => {
          reject();
        });
    });
  };

  useEffect(() => {
    if (likeCancelSource) {
      likeCancelSource.cancel();
    }
    if (!authToken) return;

    if (tokens.current.length) {
      updateItems(tokens.current)
        .then(_tokens => (tokens.current = _tokens))
        .catch();
    }
    if (bundles.current.length) {
      updateItems(bundles.current)
        .then(_bundles => (bundles.current = _bundles))
        .catch();
    }
    if (likes.current.length) {
      updateItems(likes.current)
        .then(_likes => (likes.current = _likes))
        .catch();
    }
  }, [authToken]);

  const loadNextPage = () => {
    if (fetching || bundleFetching) return;

    if (tab === 0 && tokens.current.length === count) return;
    if (tab === 1 && bundles.current.length === bundleCount) return;
    if (tab === 2 && likes.current.length === favCount) return;

    if (tab === 0 || tab === 1) {
      fetchNFTs();
    } else {
      fetchLikes(page + 1);
    }
  };

  const handleScroll = e => {
    if (tab > 2) return;

    const obj = e.currentTarget;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 100) {
      loadNextPage();
    }
  };

  const init = () => {
    if (tab === 0) {
      tokens.current = [];
      setCount(0);
      fetchNFTs();
    } else if (tab === 1) {
      bundles.current = [];
      setBundleCount(0);
      fetchNFTs();
    } else if (tab === 2) {
      likes.current = [];
      setFavCount(0);
      fetchLikes(0);
    } else if (tab === 3) {
      getActivity();
    } else if (tab === 4) {
      getOffersFromOthers();
    } else if (tab === 5) {
      getOffers();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    handleClose();
    toast('success', 'Link copied to clipboard!');
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
      `https://twitter.com/intent/tweet?text=Check%20out%20this%20account%20on%20Artion&url=${window.location.href}`,
      '_blank'
    );
  };

  const goToTab = _tab => {
    tokens.current = [];
    bundles.current = [];
    likes.current = [];

    setTab(_tab);
  };

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

  const getOffersFromOthers = async () => {
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

  const getOffers = async () => {
    try {
      setBidsLoading(true);
      const { data } = await getMyOffers(uid);
      data.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setBids(data);
      setBidsLoading(false);
    } catch {
      setBidsLoading(false);
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

  const fetchFollowers = async () => {
    setFollowersLoading(true);
    try {
      const { data } = await getFollowers(uid);
      followers.current = data;
    } catch {
      followers.current = [];
    }
    setFollowersLoading(false);
  };

  const fetchFollowings = async () => {
    setFollowersLoading(true);
    try {
      const { data } = await getFollowings(uid);
      followings.current = data;
    } catch {
      followings.current = [];
    }
    setFollowersLoading(false);
  };

  const showFollowers = () => {
    if (loading || !user.followers || user.followers === 0) return;

    setFollowersModalVisible(true);
    fetchFollowers();
  };

  const showFollowings = () => {
    if (loading || !user.followings || user.followings === 0) return;

    setFollowingsModalVisible(true);
    fetchFollowings();
  };

  const followUser = async () => {
    if (followingInProgress) return;

    setFollowingInProgress(true);
    try {
      const { status, data } = await _followUser(uid, !following, authToken);
      if (status === 'success') {
        const { data } = await getUserAccountDetails(uid);
        setUser(data);
        setFollowing(!following);
      } else {
        toast('error', data);
      }
    } catch (e) {
      console.log(e);
    }
    setFollowingInProgress(false);
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

  const renderMedia = image => {
    if (image?.includes('youtube')) {
      return (
        <ReactPlayer
          className={styles.mediaInner}
          url={image}
          controls={true}
          width="100%"
          height="100%"
        />
      );
    } else {
      return (
        <Suspense
          fallback={
            <Loader type="Oval" color="#007BFF" height={32} width={32} />
          }
        >
          <SuspenseImg className={styles.mediaInner} src={image} />
        </Suspense>
      );
    }
  };

  const renderTab = (label, Icon, idx, count, countLoading) => (
    <div
      className={cx(styles.tab, idx === tab && styles.selected)}
      onClick={() => goToTab(idx)}
    >
      <Icon className={styles.tabIcon} />
      <div className={styles.tabLabel}>{label}</div>
      <div className={styles.tabCount}>
        {countLoading ? (
          <Skeleton className={styles.tabCountLoading} width={40} height={22} />
        ) : (
          count
        )}
      </div>
    </div>
  );

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
        <div className={styles.buttonsWrapper}>
          {isMe && (
            <div className={styles.settings} onClick={openAccountSettings}>
              <img src={iconSettings} className={styles.settingsIcon} />
            </div>
          )}
          <div
            className={styles.settings}
            onClick={e => setAnchorEl(e.currentTarget)}
          >
            <img src={iconShare} className={styles.settingsIcon} />
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.avatarWrapper}>
            {loading ? (
              <Skeleton width={160} height={160} className={styles.avatar} />
            ) : user.imageHash ? (
              <img
                src={`https://gateway.pinata.cloud/ipfs/${user.imageHash}`}
                className={styles.avatar}
              />
            ) : (
              <Identicon className={styles.avatar} account={uid} size={160} />
            )}
          </div>
          <div className={styles.usernameWrapper}>
            {loading ? (
              <Skeleton width={120} height={24} />
            ) : (
              <div className={styles.username}>{user.alias || 'Unnamed'}</div>
            )}
            {isMe ? null : loading ? (
              <Skeleton width={80} height={26} style={{ marginLeft: 16 }} />
            ) : (
              <div
                className={cx(
                  styles.followBtn,
                  followingInProgress && styles.disabled
                )}
                onClick={followUser}
              >
                {followingInProgress ? (
                  <ClipLoader color="#FFF" size={14} />
                ) : following ? (
                  'Unfollow'
                ) : (
                  'Follow'
                )}
              </div>
            )}
          </div>
          <div className={styles.bio}>{user.bio || ''}</div>
          <div className={styles.bottomWrapper}>
            <div className={styles.addressWrapper}>
              {loading ? (
                <Skeleton width={120} height={20} />
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
                <div className={styles.copyIcon}>
                  <img
                    src={iconCopy}
                    onMouseOver={handleMouseOver}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
              </CopyToClipboard>
            </div>
            <div className={styles.followers} onClick={showFollowers}>
              {loading ? (
                <Skeleton width={100} height={24} />
              ) : (
                <>
                  <b>{formatFollowers(user.followers || 0)}</b> Followers
                </>
              )}
            </div>
            <div className={styles.followers} onClick={showFollowings}>
              {loading ? (
                <Skeleton width={100} height={24} />
              ) : (
                <>
                  <b>{formatFollowers(user.followings || 0)}</b> Following
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentSidebar}>
          <div className={styles.tabsGroup}>
            <div className={styles.groupTitle}>My Items</div>
            {renderTab('Single Items', IconList, 0, count, fetching)}
            {renderTab('Bundles', IconBundle, 1, bundleCount, bundleFetching)}
            {renderTab('Favorited', IconHeart, 2, favCount, favFetching)}
          </div>
          <div className={styles.tabsGroup}>
            <div className={styles.groupTitle}>Account</div>
            {renderTab('Activity', IconClock, 3)}
            {renderTab('Offers', IconList, 4)}
            {renderTab('Bids', IconList, 5)}
          </div>
        </div>
        <div ref={ref} className={styles.contentBody} onScroll={handleScroll}>
          {tab === 0 ? (
            <NFTsGrid
              items={tokens.current}
              numPerRow={numPerRow}
              loading={fetching}
            />
          ) : tab === 1 ? (
            <NFTsGrid
              items={bundles.current}
              numPerRow={numPerRow}
              loading={fetching}
              showCreate={isMe}
              onCreate={handleCreateBundle}
            />
          ) : tab === 2 ? (
            <NFTsGrid
              items={likes.current}
              numPerRow={numPerRow}
              loading={fetching}
              onLike={() => {
                likes.current = [];
                fetchLikes(0);
              }}
            />
          ) : tab === 3 ? (
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
                          <div className={styles.media}>
                            {renderMedia(
                              activity.thumbnailPath.length > 10
                                ? `${storageUrl()}/image/${
                                    activity.thumbnailPath
                                  }`
                                : activity.imageURL
                            )}
                          </div>
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
          ) : tab === 4 ? (
            <>
              <div className={styles.activityHeader}>
                <div className={styles.name}>Item</div>
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
                        to={`/explore/${offer.contractAddress}/${offer.tokenID}`}
                        className={styles.name}
                      >
                        <div className={styles.media}>
                          {renderMedia(
                            offer.thumbnailPath.length > 10
                              ? `${storageUrl()}/image/${offer.thumbnailPath}`
                              : offer.imageURL
                          )}
                        </div>
                        {offer.name}
                      </Link>
                    ) : (
                      <div className={styles.name}>
                        <Skeleton width={120} height={20} />
                      </div>
                    )}
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
          ) : (
            <>
              <div className={styles.activityHeader}>
                <div className={styles.name}>Item</div>
                <div className={styles.price}>Price</div>
                <div className={styles.quantity}>Quantity</div>
                <div className={styles.date}>Date</div>
              </div>
              <div className={styles.activityList}>
                {(bidsLoading
                  ? new Array(5).fill(null)
                  : bids.filter(bid => bid.deadline * 1000 > now.getTime())
                ).map((bid, idx) => (
                  <div key={idx} className={styles.activity}>
                    {bid ? (
                      <Link
                        to={`/explore/${bid.contractAddress}/${bid.tokenID}`}
                        className={styles.name}
                      >
                        <div className={styles.media}>
                          {renderMedia(
                            bid.thumbnailPath.length > 10
                              ? `${storageUrl()}/image/${bid.thumbnailPath}`
                              : bid.imageURL
                          )}
                        </div>
                        {bid.name}
                      </Link>
                    ) : (
                      <div className={styles.name}>
                        <Skeleton width={120} height={20} />
                      </div>
                    )}
                    <div className={styles.price}>
                      {bid ? (
                        `${bid.pricePerItem} FTM`
                      ) : (
                        <Skeleton width={100} height={20} />
                      )}
                    </div>
                    <div className={styles.quantity}>
                      {bid ? bid.quantity : <Skeleton width={80} height={20} />}
                    </div>
                    <div className={styles.date}>
                      {bid ? (
                        formatDate(bid.createdAt)
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
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
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
      <NewBundleModal
        visible={bundleModalVisible}
        onClose={() => setBundleModalVisible(false)}
        onCreateSuccess={() => {
          bundles.current = [];
          fetchNFTs();
        }}
      />
      <FollowersModal
        visible={followersModalVisible || followingsModalVisible}
        onClose={() => {
          setFollowersModalVisible(false);
          setFollowingsModalVisible(false);
        }}
        title={followersModalVisible ? 'Followers' : 'Followings'}
        users={
          followersLoading
            ? new Array(5).fill(null)
            : followersModalVisible
            ? followers.current
            : followings.current
        }
      />
    </div>
  );
};

export default AccountDetails;
