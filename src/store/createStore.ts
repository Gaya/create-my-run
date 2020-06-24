import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import app from './app/reducer';

const reducers = combineReducers({
  app,
});

const store = createStore(
  reducers,
  undefined,
  composeWithDevTools(
    applyMiddleware(),
  ),
);

export default store;
