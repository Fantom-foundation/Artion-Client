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
import { Container, Canvas } from './style';
import { isMobile } from 'utils/userAgent';

const App = ({ paintStore }) => {
  const canvasRef = useRef(null);
  const { start, draw, stop } = paintStore;

  useEffect(() => paintStore.initialize(canvasRef.current), [paintStore]);

  const PaintBoard = () => {
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
      <NiftyHeader></NiftyHeader>
      <Router>
        <Switch>
          <Route exact path="/" component={SignIn}></Route>
          <Route exact path="/signin" component={SignIn}></Route>
          <Route exact path="/signup" component={SignUp}></Route>
          <Route exact path="/create" component={PaintBoard}></Route>
        </Switch>
      </Router>
      <NiftyFooter></NiftyFooter>
    </div>
  );
};

export default inject('paintStore')(observer(App));
