import React from 'react';
import ExploreStatus from './Sidebar/Status';
import ExploreCollections from './Sidebar/Collections';
import ExploreHeader from './Header';
import ExploreFilterHeader from './Body/FilterHeader';
import NFTsGrid from '../../components/NFTsGrid';

import './styles.css';

const ExploreAllPage = () => {
  return (
    <div className="exploreAllPageContainer">
      <div className="exploreSideBar">
        <div className="sidebarHeader">NFT MarketPlace</div>
        <div className="sidebarBody">
          <ExploreStatus />
          <ExploreCollections />
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
