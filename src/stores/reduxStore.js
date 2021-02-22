import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from '../reducers/index';

const loggerMiddleware = createLogger();

export const reduxStore = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);
