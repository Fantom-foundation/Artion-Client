import { combineReducers } from 'redux';

import { Auth } from './auth.reducers';
import { ConnectWallet } from './connectwallet.reducers';
import { HeaderOptions } from './header.reducers';

const rootReducer = combineReducers({ Auth, ConnectWallet, HeaderOptions });

export default rootReducer;
