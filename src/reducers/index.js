import { combineReducers } from 'redux';

import { Auth } from './auth.reducers';
import { ConnectWallet } from './connectwallet.reducers';

const rootReducer = combineReducers({ Auth, ConnectWallet });

export default rootReducer;
