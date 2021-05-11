import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StatusFilter from 'components/StatusFilter';
import CollectionsFilter from 'components/CollectionsFilter';
import ExploreHeader from './Header';
import ExploreFilterHeader from './Body/FilterHeader';
import NFTsGrid from 'components/NFTsGrid';
import Header from 'components/header';
import { fetchCollections, fetchTokens } from 'api';
import CollectionsActions from 'actions/collections.actions';
import TokensActions from 'actions/tokens.actions';
import HeaderActions from 'actions/header.actions';

import './styles.css';

const ExploreAllPage = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [fetchInterval, setFetchInterval] = useState(null);

  const { fetching, tokens, count } = useSelector(state => state.Tokens);
  const { collections, category } = useSelector(state => state.Filter);

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
      const { data } = await fetchTokens(step, collections, category);
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
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 50) {
      fetchNFTs(page + 1);
    }
  };

  useEffect(() => {
    dispatch(TokensActions.resetTokens());
    fetchNFTs(0);
  }, [collections, category]);

  return (
    <>
      <Header light />
      <div className="exploreAllPageContainer">
        <div className="exploreSideBar">
          <StatusFilter />
          <CollectionsFilter />
        </div>
        <div className="exploreWithHeader">
          <div className="exploreHeader">
            <ExploreHeader />
          </div>
          <div className="exploreBodyFilterHeader">
            <ExploreFilterHeader />
          </div>
          <div className="exploreAllPannel" onScroll={handleScroll}>
            <NFTsGrid items={tokens} loading={fetching} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreAllPage;
