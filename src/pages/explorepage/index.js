import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
import Identicon from 'components/Identicon';
import useWindowDimensions from 'hooks/useWindowDimensions';

import styles from './styles.module.scss';

const ExploreAllPage = () => {
  const dispatch = useDispatch();

  const { uid } = useParams();
  const { width } = useWindowDimensions();

  const [page, setPage] = useState(0);
  const [user, setUser] = useState({});
  const [fetchInterval, setFetchInterval] = useState(null);
  const [cancelSource, setCancelSource] = useState(null);

  const { fetching, tokens, count } = useSelector(state => state.Tokens);
  const {
    collections,
    category,
    sortBy,
    statusBuyNow,
    statusHasBids,
    statusHasOffers,
    statusOnAuction,
  } = useSelector(state => state.Filter);

  const getUserDetails = async account => {
    try {
      const { data } = await getUserAccountDetails(account);
      setUser(data);
    } catch {
      setUser({});
    }
  };

  useEffect(() => {
    if (uid) {
      getUserDetails(uid);
      dispatch(HeaderActions.toggleSearchbar(false));
    } else {
      dispatch(HeaderActions.toggleSearchbar(true));
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

  const fetchNFTs = async step => {
    if (cancelSource) {
      cancelSource.cancel();
    }

    dispatch(TokensActions.startFetching());

    try {
      const filterBy = [];
      if (statusBuyNow) filterBy.push('buyNow');
      if (statusHasBids) filterBy.push('hasBids');
      if (statusHasOffers) filterBy.push('hasOffers');
      if (statusOnAuction) filterBy.push('onAuction');

      const cancelTokenSource = axios.CancelToken.source();
      setCancelSource(cancelTokenSource);
      const { data } = await fetchTokens(
        step,
        collections,
        category,
        sortBy,
        filterBy,
        uid,
        cancelTokenSource.token
      );
      dispatch(TokensActions.fetchingSuccess(data.total, data.tokens));
      setPage(step);
    } catch (e) {
      if (!axios.isCancel(e)) {
        dispatch(TokensActions.fetchingFailed());
      }
    } finally {
      setCancelSource(null);
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

    const obj = e.target;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 100) {
      fetchNFTs(page + 1);
    }
  };

  useEffect(() => {
    dispatch(TokensActions.resetTokens());
    fetchNFTs(0);
  }, [
    collections,
    category,
    sortBy,
    statusBuyNow,
    statusHasBids,
    statusHasOffers,
    statusOnAuction,
    uid,
  ]);

  return (
    <>
      <Header light />
      <div
        className={styles.container}
        onScroll={width <= 600 ? handleScroll : null}
      >
        <div className={styles.sidebar}>
          {uid && (
            <div className={styles.profileWrapper}>
              {user.imageHash ? (
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${user.imageHash}`}
                  className={styles.avatar}
                />
              ) : (
                <Identicon account={uid} size={100} />
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
            <ExploreFilterHeader loading={fetching} />
          </div>
          <div
            className={styles.exploreAll}
            onScroll={width > 600 ? handleScroll : null}
          >
            <NFTsGrid items={tokens} loading={fetching} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreAllPage;
