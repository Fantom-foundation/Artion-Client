import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import './index.css';

import App from 'components/app';
import { store, persistor } from '../src/stores/reduxStore';
import PaintStore from './stores/paintStore';
import { NetworkContextName } from './constants';
import getLibrary from './utils/getLibrary';

const stores = {
  paintStore: new PaintStore(),
};

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

ReactDOM.render(
  <ReduxProvider store={store}>
    <Provider {...stores}>
      <PersistGate loading={null} persistor={persistor}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <App fullScreen />
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </PersistGate>
    </Provider>
  </ReduxProvider>,
  document.getElementById('root')
);
