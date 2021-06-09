import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Client } from '@bandprotocol/bandchain.js';

import Header from './header';
import Layout from './layout';
import Toolbar from './toolbar';
import Metadata from './metadata';
import AccountModal from './AccountModal';
import WFTMModal from './WFTMModal';
import { Container, Board, Canvas, CanvasBg } from './style';
import { isMobile } from 'utils/userAgent';
import LandingPage from '../pages/landingpage';
import ExploreAllPage from '../pages/explorepage';
import AccountDetails from '../pages/AccountDetails';
import NFTItem from '../pages/NFTItem';
import CollectionCreate from '../pages/Collection/Create';
import PriceActions from 'actions/price.actions';
import HeaderActions from 'actions/header.actions';

const App = ({ paintStore }) => {
  const canvasRef = useRef(null);
  const canvasBgRef = useRef(null);
  const { start, draw, stop } = paintStore;

  const PaintBoard = () => {
    const resetBoard = () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
    };

    const initPaintStore = () => {
      paintStore.initialize(canvasRef.current, canvasBgRef.current);
    };
    useEffect(() => initPaintStore(), [paintStore]);

    useEffect(() => {
      dispatch(HeaderActions.toggleSearchbar(false));
      resetBoard();
      window.addEventListener('resize', initPaintStore);

      return () => {
        window.removeEventListener('resize', initPaintStore);
      };
    }, []);

    return (
      <>
        <Layout>
          <Header light />
          <Container>
            <Board isMobile={isMobile}>
              <CanvasBg id="drawingbg" ref={canvasBgRef} />
              <Canvas
                id="drawingboard"
                ref={canvasRef}
                onMouseDown={start}
                onMouseMove={draw}
                onMouseUp={stop}
                onMouseOut={stop}
                onTouchStart={start}
                onTouchMove={draw}
                onTouchEnd={stop}
                onTouchCancel={stop}
              />
              <Toolbar />
            </Board>
            <Metadata></Metadata>
          </Container>
        </Layout>
      </>
    );
  };

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
          <Route exact path="/exploreall" component={ExploreAllPage} />
          <Route exact path="/create" component={PaintBoard} />
          <Route path="/explore/:addr/:id" component={NFTItem} />
          <Route path="/account/:uid" component={AccountDetails} />
          <Route path="/collection/create" component={CollectionCreate} />
        </Switch>
        <AccountModal />
        <WFTMModal />
        <Toaster position="bottom-right" reverseOrder={false} />
      </Router>
    </div>
  );
};

export default inject('paintStore')(observer(App));
