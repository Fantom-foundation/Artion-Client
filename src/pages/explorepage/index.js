import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StatusFilter from '../../components/StatusFilter';
import CollectionsFilter from '../../components/CollectionsFilter';
import ExploreHeader from './Header';
import ExploreFilterHeader from './Body/FilterHeader';
import NFTsGrid from '../../components/NFTsGrid';
import { fetchCollections, fetchTokens } from '../../api';
import CollectionsActions from '../../actions/collections.actions';
import TokensActions from '../../actions/tokens.actions';

import './styles.css';

const ExploreAllPage = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [fetchInterval, setFetchInterval] = useState(null);

  const { fetching, tokens } = useSelector(state => state.Tokens);

  const updateCollections = async () => {
    const res = await fetchCollections();
    if (res.status === 'success') {
      dispatch(CollectionsActions.updateCollections(res.data));
    }
  };

  const fetchNFTs = async step => {
    dispatch(TokensActions.startFetching());

    try {
      const { data } = await fetchTokens(step);
      dispatch(
        TokensActions.fetchingSuccess(data.totalTokenCounts, data.tokens)
      );
    } catch {
      dispatch(TokensActions.fetchingFailed());
    }
  };

  useEffect(() => {
    fetchNFTs(0);
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

    const obj = e.currentTarget;
    if (obj.scrollHeight - obj.clientHeight - obj.scrollTop < 50) {
      fetchNFTs(page + 1);
      setPage(page + 1);
    }
  };

  return (
    <div className="exploreAllPageContainer">
      <div className="exploreSideBar">
        <div className="sidebarHeader">NFT MarketPlace</div>
        <div className="sidebarBody">
          <StatusFilter />
          <CollectionsFilter />
        </div>
      </div>
      <div className="exploreWithHeader">
        <div className="exploreHeader">
          <ExploreHeader></ExploreHeader>
        </div>
        <div className="exploreAllPannel" onScroll={handleScroll}>
          <div className="exploreBodyFilterHeader">
            <ExploreFilterHeader></ExploreFilterHeader>
          </div>
          <div className="exploreBodyInfiniteLoaderContainer">
            <NFTsGrid items={tokens} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreAllPage;
