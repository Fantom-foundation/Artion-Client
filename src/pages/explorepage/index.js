import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import cx from 'classnames';
import { useWeb3React } from '@web3-react/core';

import StatusFilter from 'components/StatusFilter';
import CollectionsFilter from 'components/CollectionsFilter';
import CategoriesFilter from 'components/CategoriesFilter';
import ExploreFilterHeader from './Body/FilterHeader';
import NFTsGrid from 'components/NFTsGrid';
import Header from 'components/header';
import { useApi } from 'api';
import CollectionsActions from 'actions/collections.actions';
import TokensActions from 'actions/tokens.actions';
import HeaderActions from 'actions/header.actions';
import useWindowDimensions from 'hooks/useWindowDimensions';

import iconCollapse from 'assets/svgs/collapse.svg';

import styles from './styles.module.scss';

const ExploreAllPage = () => {
  const { fetchCollections, fetchTokens } = useApi();

  const dispatch = useDispatch();

  const { chainId } = useWeb3React();

  const { width } = useWindowDimensions();

  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState(0);
  const [fetchInterval, setFetchInterval] = useState(null);
  const [cancelSource, setCancelSource] = useState(null);

  const { fetching, tokens, count } = useSelector(state => state.Tokens);
  const {
    collections,
    groupType,
    category,
    sortBy,
    statusBuyNow,
    statusHasBids,
    statusHasOffers,
    statusOnAuction,
  } = useSelector(state => state.Filter);

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
        groupType,
        collections,
        category,
        sortBy,
        filterBy,
        null,
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
    if (!chainId) return;

    if (fetchInterval) {
      clearInterval(fetchInterval);
    }

    updateCollections();
    setFetchInterval(setInterval(updateCollections, 1000 * 60 * 10));
  }, [chainId]);

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
    groupType,
    category,
    sortBy,
    statusBuyNow,
    statusHasBids,
    statusHasOffers,
    statusOnAuction,
    chainId,
  ]);

  return (
    <>
      <Header light />
      <div
        className={styles.container}
        onScroll={width <= 600 ? handleScroll : null}
      >
        <div className={cx(styles.sidebar, collapsed && styles.collapsed)}>
          <div className={styles.sidebarHeader}>
            {!collapsed && <div className={styles.sidebarTitle}>Filters</div>}
            <img
              src={iconCollapse}
              className={styles.iconCollapse}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
          <div className={styles.filterList}>
            <StatusFilter />
            <CollectionsFilter />
            <CategoriesFilter />
          </div>
        </div>
        <div className={styles.body}>
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
