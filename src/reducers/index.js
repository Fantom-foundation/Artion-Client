import { combineReducers } from 'redux';

import { Auth } from './auth.reducers';
import { ConnectWallet } from './connectwallet.reducers';
import { HeaderOptions } from './header.reducers';
import { Modal } from './modal.reducers';
import { Filter } from './filter.reducers';
import { Collections } from './collections.reducers';
import { Tokens } from './tokens.reducers';

const rootReducer = combineReducers({
  Auth,
  ConnectWallet,
  HeaderOptions,
  Modal,
  Filter,
  Collections,
  Tokens,
});

export default rootReducer;
