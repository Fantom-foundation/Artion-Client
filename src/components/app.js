import React, { useRef, useEffect } from 'react';
import { observer, inject } from 'mobx-react';

import Layout from './layout';
import Toolbar from './toolbar';
import { Container, Canvas } from './style';
import { isMobile } from 'utils/userAgent';

const App = ({ paintStore, fullScreen }) => {
  const canvasRef = useRef(null);
  const { start, draw, stop } = paintStore;

  useEffect(() => paintStore.initialize(canvasRef.current), [paintStore]);

  return (
    <Layout>
      <Container full={fullScreen} isMobile={isMobile}>
        <Canvas
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
  );
};

export default inject('paintStore')(observer(App));
