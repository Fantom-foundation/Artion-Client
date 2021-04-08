import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { Auth } from './auth.reducers';
import { ConnectWallet } from './connectwallet.reducers';
import { HeaderOptions } from './header.reducers';
import { Modal } from './modal.reducers';
import { Filter } from './filter.reducers';
import { Collections } from './collections.reducers';

const persistConfig = {
  key: 'collections',
  storage,
  whitelist: ['Collections'],
};

const rootReducer = combineReducers({
  Auth,
  ConnectWallet,
  HeaderOptions,
  Modal,
  Filter,
  Collections,
});

export default persistReducer(persistConfig, rootReducer);
