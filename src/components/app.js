import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Client } from '@bandprotocol/bandchain.js';

import AccountModal from './AccountModal';
import WFTMModal from './WFTMModal';
import NotFound from './NotFound';
import PaintBoard from './PaintBoard';
import LandingPage from '../pages/landingpage';
import ExplorePage from '../pages/explorepage';
import AccountDetails from '../pages/AccountDetails';
import NFTItem from '../pages/NFTItem';
import CollectionCreate from '../pages/Collection/Create';
import PriceActions from 'actions/price.actions';

const App = () => {
  const dispatch = useDispatch();

  const getPrice = async () => {
    try {
      const endpoint = 'https://rpc.bandchain.org';
      const client = new Client(endpoint);
      const [{ rate }] = await client.getReferenceData(['FTM/USD']);
      dispatch(PriceActions.updatePrice(rate));
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        getPrice();
      }, 10 * 1000);
    }
  };

  useEffect(() => {
    getPrice();
  }, []);

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/exploreall" component={ExplorePage} />
          <Route exact path="/create" component={PaintBoard} />
          <Route path="/explore/:addr/:id" component={NFTItem} />
          <Route path="/bundle/:bundleID" component={NFTItem} />
          <Route path="/account/:uid" component={AccountDetails} />
          <Route path="/collection/add" component={CollectionCreate} />
          <Route path="/404" component={NotFound} />
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
        <AccountModal />
        <WFTMModal />
        <Toaster position="bottom-right" reverseOrder={false} />
      </Router>
    </div>
  );
};

export default App;
