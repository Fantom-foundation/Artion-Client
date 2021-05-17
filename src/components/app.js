import React, { useRef, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './header';
import Layout from './layout';
import Toolbar from './toolbar';
import Metadata from './metadata';
import AccountModal from './AccountModal';
import WFTMModal from './WFTMModal';
import { Container, Board, Canvas } from './style';
import { isMobile } from 'utils/userAgent';
import LandingPage from '../pages/landingpage';
import ExploreAllPage from '../pages/explorepage';
import NFTItem from '../pages/NFTItem';
// import AccountDetails from '../pages/AccountDetails';
import CollectionCreate from '../pages/Collection/Create';

const App = ({ paintStore }) => {
  const canvasRef = useRef(null);
  const { start, draw, stop } = paintStore;

  const PaintBoard = () => {
    const initPaintStore = () => {
      paintStore.initialize(canvasRef.current);
    };
    useEffect(() => initPaintStore(), [paintStore]);

    useEffect(() => {
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

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/exploreall" component={ExploreAllPage} />
          <Route exact path="/create" component={PaintBoard} />
          <Route path="/explore/:addr/:id" component={NFTItem} />
          <Route path="/account/:uid" component={ExploreAllPage} />
          <Route path="/collection/create" component={CollectionCreate} />
        </Switch>
        <AccountModal />
        <WFTMModal />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              padding: 24,
              borderRadius: 10,
              boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </Router>
    </div>
  );
};

export default inject('paintStore')(observer(App));
