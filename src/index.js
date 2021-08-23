import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import './index.css';

import App from 'components/app';
import Web3ReactManager from 'components/Web3ReactManager';
import { store } from '../src/stores/reduxStore';
import { NetworkContextName } from './constants';
import getLibrary from './utils/getLibrary';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Web3ReactManager>
          <App fullScreen />
        </Web3ReactManager>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </Provider>,
  document.getElementById('root')
);
