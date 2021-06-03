import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Edit as EditIcon } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import { useWeb3React } from '@web3-react/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Skeleton from 'react-loading-skeleton';

// import NFTsGrid from 'components/NFTsGrid';
import Header from 'components/header';
import Identicon from 'components/Identicon';
import { shortenAddress } from 'utils';
import { getUserAccountDetails, fetchTokens, updateBanner } from 'api';
import TokensActions from 'actions/tokens.actions';
import HeaderActions from 'actions/header.actions';
import ModalActions from 'actions/modal.actions';

import iconCopy from 'assets/svgs/copy.svg';
import iconSettings from 'assets/svgs/settings.svg';

import styles from './styles.module.scss';

const AccountDetails = () => {
  const dispatch = useDispatch();

  const { account } = useWeb3React();

  const { uid } = useParams();

  // const { fetching, tokens, count } = useSelector(state => state.Tokens);
  const { collections, category } = useSelector(state => state.Filter);
  const { user: me } = useSelector(state => state.Auth);
  const { authToken } = useSelector(state => state.ConnectWallet);

  const fileInput = useRef();

  // const [page, setPage] = useState(0);
  const [bannerHash, setBannerHash] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

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
    dispatch(TokensActions.startFetching());

    try {
      const { data } = await fetchTokens(step, collections, category, uid);
      dispatch(TokensActions.fetchingSuccess(data.total, data.tokens));
      // setPage(step);
    } catch {
      dispatch(TokensActions.fetchingFailed());
    }
  };

  useEffect(() => {
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

    return () => {
      dispatch(HeaderActions.toggleSearchbar(false));
    };
  }, []);

  // const handleScroll = e => {
  //   if (fetching) return;
  //   if (tokens.length === count) return;

  //   const obj = e.currentTarget;
  //   if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 100) {
  //     fetchNFTs(page + 1);
  //   }
  // };

  useEffect(() => {
    dispatch(TokensActions.resetTokens());
    fetchNFTs(0);
  }, [collections, category, uid]);

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
    // e.target.value = null;
  };

  const openAccountSettings = () => {
    dispatch(ModalActions.showAccountModal());
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
        <div className={styles.settings} onClick={openAccountSettings}>
          <img src={iconSettings} className={styles.settingsIcon} />
        </div>
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
      <div className={styles.content}></div>
    </div>
  );
};

export default AccountDetails;
