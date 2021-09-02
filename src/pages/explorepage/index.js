import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import cx from 'classnames';
import { useWeb3React } from '@web3-react/core';
import { useResizeDetector } from 'react-resize-detector';

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
  const { fetchCollections, fetchTokens, getItemsLiked } = useApi();

  const dispatch = useDispatch();

  const { chainId } = useWeb3React();

  const { width: gridWidth, ref } = useResizeDetector();
  const { width } = useWindowDimensions();

  const conRef = useRef();
  const [collapsed, setCollapsed] = useState(false);
  const [fetchInterval, setFetchInterval] = useState(null);
  const [cancelSource, setCancelSource] = useState(null);
  const [likeCancelSource, setLikeCancelSource] = useState(null);
  const [prevNumPerRow, setPrevNumPerRow] = useState(null);

  const { authToken } = useSelector(state => state.ConnectWallet);
  const { upFetching, downFetching, tokens, from, to } = useSelector(
    state => state.Tokens
  );
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

  const numPerRow = Math.floor(gridWidth / 240);
  const fetchCount = numPerRow <= 3 ? 18 : numPerRow === 4 ? 16 : numPerRow * 3;

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(true));

    if (fetchInterval) {
      clearInterval(fetchInterval);
    }

    updateCollections();
    setFetchInterval(setInterval(updateCollections, 1000 * 60 * 10));
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

  const fetchNFTs = async dir => {
    if (cancelSource) {
      cancelSource.cancel();
    }
    if (isNaN(fetchCount)) return;

    dispatch(TokensActions.startFetching(dir));

    try {
      const filterBy = [];
      if (statusBuyNow) filterBy.push('buyNow');
      if (statusHasBids) filterBy.push('hasBids');
      if (statusHasOffers) filterBy.push('hasOffers');
      if (statusOnAuction) filterBy.push('onAuction');

      const cancelTokenSource = axios.CancelToken.source();
      setCancelSource(cancelTokenSource);

      let start;
      let _count = fetchCount;
      if (dir !== 0) {
        _count -= tokens.length % numPerRow;
        start = Math.max(dir < 0 ? from - _count : to, 0);
      } else {
        start = from;
        _count = fetchCount * 2;
      }
      const { data } = await fetchTokens(
        start,
        _count,
        groupType,
        collections,
        category,
        sortBy,
        filterBy,
        null,
        cancelTokenSource.token
      );

      let newTokens =
        dir > 0
          ? [...tokens, ...data.tokens]
          : dir < 0
          ? [...data.tokens, ...tokens]
          : data.tokens;
      newTokens = newTokens.filter(
        (tk, idx) =>
          newTokens.findIndex(_tk =>
            tk.items
              ? tk._id === _tk._id
              : tk.contractAddress === _tk.contractAddress &&
                tk.tokenID === _tk.tokenID
          ) === idx
      );
      let _from = from;
      let _to = to;
      const newCount = newTokens.length - tokens.length;
      if (dir > 0) {
        _to += newCount;
      } else if (dir < 0) {
        _from -= newCount;
      } else {
        _to = _from + newTokens.length;
      }
      newTokens =
        dir > 0
          ? newTokens.slice(-fetchCount * 2)
          : newTokens.slice(0, fetchCount * 2);
      if (dir > 0) {
        _from = _to - newTokens.length;
      } else if (dir < 0) {
        _to = _from + newTokens.length;
      }
      dispatch(
        TokensActions.fetchingSuccess(data.total, newTokens, _from, _to)
      );
      if (dir === 0 && from) {
        // move scrollbar to middle
        const obj = width > 600 ? ref.current : conRef.current;
        obj.scrollTop = (obj.scrollHeight - obj.clientHeight) / 2;
      }
    } catch (e) {
      if (!axios.isCancel(e)) {
        dispatch(TokensActions.fetchingFailed());
      }
    } finally {
      setCancelSource(null);
    }
  };

  const handleScroll = e => {
    if (upFetching || downFetching) return;

    const obj = e.target;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 100) {
      fetchNFTs(1);
    } else if (obj.scrollTop < 100 && from) {
      fetchNFTs(-1);
    }
  };

  useEffect(() => {
    setPrevNumPerRow(numPerRow);
    if (isNaN(numPerRow) || (prevNumPerRow && prevNumPerRow !== numPerRow))
      return;
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
    numPerRow,
  ]);

  const updateItems = async () => {
    try {
      const missingTokens = tokens
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
      if (authToken) {
        const { data, status } = await getItemsLiked(
          missingTokens,
          authToken,
          cancelTokenSource.token
        );
        if (status === 'success') {
          const newTokens = [...tokens];
          missingTokens.map((tk, idx) => {
            newTokens[tk.index].isLiked = data[idx].isLiked;
          });
          dispatch(TokensActions.updateTokens(newTokens));
        }
      } else {
        const newTokens = [...tokens];
        missingTokens.map(tk => {
          newTokens[tk.index].isLiked = false;
        });
        dispatch(TokensActions.updateTokens(newTokens));
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
    if (tokens.length) {
      updateItems();
    }
  }, [tokens, authToken]);

  return (
    <>
      <Header light />
      <div
        ref={conRef}
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
            <ExploreFilterHeader loading={upFetching || downFetching} />
          </div>
          <div
            ref={ref}
            className={styles.exploreAll}
            onScroll={width > 600 ? handleScroll : null}
          >
            <NFTsGrid
              items={tokens}
              uploading={upFetching}
              loading={downFetching}
              numPerRow={numPerRow}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreAllPage;
