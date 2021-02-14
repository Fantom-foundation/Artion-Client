import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import App from 'components/app';
import PaintStore from './stores/paintStore';

const stores = {
  paintStore: new PaintStore(),
};

ReactDOM.render(
  <Provider {...stores}>
    <App fullScreen />
  </Provider>,
  document.getElementById('root')
);
