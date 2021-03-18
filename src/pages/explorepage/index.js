import React from 'react';
import ExploreStatus from './Sidebar/Status';
import ExploreCollections from './Sidebar/Collections';
import ExploreOnSaleIn from './Sidebar/OnSaleIn';
import ExploreHeader from './Header';
import ExploreFilterHeader from './Body/FilterHeader';
import ExploreAllNFTs from './Body/ExploreBody';

import './styles.css';

const ExploreAllPage = () => {
  return (
    <div className="exploreAllPageContainer">
      <div className="exploreSideBar">
        <div className="sidebarHeader">NFT MarketPlace</div>
        <div className="sidebarBody">
          <ExploreStatus></ExploreStatus>
          <ExploreCollections></ExploreCollections>
          <ExploreOnSaleIn></ExploreOnSaleIn>
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
            <ExploreAllNFTs></ExploreAllNFTs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreAllPage;
