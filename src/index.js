import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Provider as ReduxProvider } from 'react-redux';
import './index.css';

import App from 'components/app';
import { reduxStore } from '../src/stores/reduxStore';
import PaintStore from './stores/paintStore';

const stores = {
  paintStore: new PaintStore(),
};

ReactDOM.render(
  <ReduxProvider store={reduxStore}>
    <Provider {...stores}>
      <App fullScreen />
    </Provider>
  </ReduxProvider>,
  document.getElementById('root')
);
