import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AccountCircle } from '@material-ui/icons';

import StatusFilter from 'components/StatusFilter';
import CollectionsFilter from 'components/CollectionsFilter';
import ExploreHeader from './Header';
import ExploreFilterHeader from './Body/FilterHeader';
import NFTsGrid from 'components/NFTsGrid';
import Header from 'components/header';
import { getUserAccountDetails, fetchCollections, fetchTokens } from 'api';
import CollectionsActions from 'actions/collections.actions';
import TokensActions from 'actions/tokens.actions';
import HeaderActions from 'actions/header.actions';
import { shortenAddress } from 'utils';

import styles from './styles.module.scss';

const ExploreAllPage = () => {
  const dispatch = useDispatch();

  const { uid } = useParams();

  const [page, setPage] = useState(0);
  const [user, setUser] = useState({});
  const [fetchInterval, setFetchInterval] = useState(null);

  const { fetching, tokens, count } = useSelector(state => state.Tokens);
  const { collections, category } = useSelector(state => state.Filter);
  // const { user: me } = useSelector(state => state.Auth);

  const getUserDetails = async account => {
    try {
      const { data } = await getUserAccountDetails(account);
      setUser(data);
    } catch {
      setUser({});
    }
  };

  useEffect(() => {
    getUserDetails(uid);
  }, [uid]);

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(true));
  }, []);

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

  const fetchNFTs = async step => {
    dispatch(TokensActions.startFetching());

    try {
      const { data } = await fetchTokens(step, collections, category, uid);
      dispatch(TokensActions.fetchingSuccess(data.total, data.tokens));
      setPage(step);
    } catch {
      dispatch(TokensActions.fetchingFailed());
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

  const handleScroll = e => {
    if (fetching) return;
    if (tokens.length === count) return;

    const obj = e.currentTarget;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 100) {
      fetchNFTs(page + 1);
    }
  };

  useEffect(() => {
    dispatch(TokensActions.resetTokens());
    fetchNFTs(0);
  }, [collections, category, uid]);

  return (
    <>
      <Header light />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          {uid && (
            <div className={styles.profileWrapper}>
              {user.imageHash ? (
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${user.imageHash}`}
                  className={styles.avatar}
                />
              ) : (
                <AccountCircle className={styles.avatar} />
              )}
              <div className={styles.username}>{user.alias || ''}</div>
              <a
                href={`https://ftmscan.com/address/${uid}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.account}
              >
                {shortenAddress(uid)}
              </a>
              <div className={styles.bio}>{user.bio || ''}</div>
            </div>
          )}
          <StatusFilter />
          <CollectionsFilter />
        </div>
        <div className={styles.body}>
          <div className={styles.header}>
            <ExploreHeader />
          </div>
          <div className={styles.filterHeader}>
            <ExploreFilterHeader />
          </div>
          <div className={styles.exploreAll} onScroll={handleScroll}>
            <NFTsGrid items={tokens} loading={fetching} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreAllPage;
