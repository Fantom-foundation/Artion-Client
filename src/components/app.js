import React, { useRef, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Layout from './layout';
import Toolbar from './toolbar';
import NiftyHeader from './header';
import NiftyFooter from './footer';
import Metadata from './metadata';
import SignIn from '../components/auth/signin';
import SignUp from '../components/auth/signup';
import AccountModal from './AccountModal';
import { Container, Canvas } from './style';
import { isMobile } from 'utils/userAgent';
import LandingPage from '../pages/landingpage';
import ExploreAllPage from '../pages/explorepage';

const App = ({ paintStore }) => {
  const canvasRef = useRef(null);
  const { start, draw, stop } = paintStore;

  const PaintBoard = () => {
    useEffect(() => paintStore.initialize(canvasRef.current), [paintStore]);
    return (
      <>
        <Layout>
          <Container isMobile={isMobile}>
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
          </Container>
        </Layout>
        <Metadata></Metadata>
      </>
    );
  };

  return (
    <div>
      <Router>
        <NiftyHeader></NiftyHeader>
        <Switch>
          <Route exact path="/" component={LandingPage}></Route>
          <Route exact path="/exploreall" component={ExploreAllPage}></Route>
          <Route exact path="/signin" component={SignIn}></Route>
          <Route exact path="/signup" component={SignUp}></Route>
          <Route exact path="/create" component={PaintBoard}></Route>
        </Switch>
        <NiftyFooter></NiftyFooter>
        <AccountModal />
      </Router>
    </div>
  );
};

export default inject('paintStore')(observer(App));
