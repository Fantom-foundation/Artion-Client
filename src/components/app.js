import React, { useRef, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { BrowserRouter } from "react-router-dom";

import Layout from "./layout";
import Toolbar from "./toolbar";
import NiftyHeader from "./header";
import { Container, Canvas } from "./style";
import { isMobile } from "utils/userAgent";
import { faPray } from "@fortawesome/free-solid-svg-icons";

const App = ({ paintStore, fullScreen }) => {
  const canvasRef = useRef(null);
  const { start, draw, stop } = paintStore;

  useEffect(() => paintStore.initialize(canvasRef.current), [paintStore]);

  return (
    <div>
      <NiftyHeader></NiftyHeader>
      <BrowserRouter>
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
      </BrowserRouter>
    </div>
  );
};

export default inject("paintStore")(observer(App));
