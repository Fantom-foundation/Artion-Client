import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import StatusFilter from '../../components/StatusFilter';
import CollectionsFilter from '../../components/CollectionsFilter';
import ExploreHeader from './Header';
import ExploreFilterHeader from './Body/FilterHeader';
import NFTsGrid from '../../components/NFTsGrid';
import { fetchCollections } from '../../api';
import CollectionsActions from '../../actions/collections.actions';

import './styles.css';

const ExploreAllPage = () => {
  const dispatch = useDispatch();

  const [fetchInterval, setFetchInterval] = useState(null);

  const updateCollections = async () => {
    const res = await fetchCollections();
    if (res.status === 'success') {
      dispatch(CollectionsActions.updateCollections(res.data));
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
        <div className="exploreAllPannel">
          <div className="exploreBodyFilterHeader">
            <ExploreFilterHeader></ExploreFilterHeader>
          </div>
          <div className="exploreBodyInfiniteLoaderContainer">
            <NFTsGrid items={new Array(100).fill(0)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreAllPage;
