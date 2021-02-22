import { combineReducers } from 'redux';

import { Auth } from './auth.reducers';

const rootReducer = combineReducers({ Auth });

export default rootReducer;
