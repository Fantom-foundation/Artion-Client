import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';

import App from 'components/app';
import { store, persistor } from '../src/stores/reduxStore';
import PaintStore from './stores/paintStore';

const stores = {
  paintStore: new PaintStore(),
};

ReactDOM.render(
  <ReduxProvider store={store}>
    <Provider {...stores}>
      <PersistGate loading={null} persistor={persistor}>
        <App fullScreen />
      </PersistGate>
    </Provider>
  </ReduxProvider>,
  document.getElementById('root')
);
