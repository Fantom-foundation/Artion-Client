import React from "react";
import { Global } from "@emotion/core";

import global from "./global";

const Layout = ({ children }) => (
  <>
    <Global styles={global} />
    {children}
  </>
);

export default Layout;
