import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { StoreState } from './types';

import app from './app/reducer';
import route from './route/reducer';

const reducers = combineReducers<StoreState>({
  app,
  route,
});

const store = createStore(
  reducers,
  undefined,
  composeWithDevTools(
    applyMiddleware(),
  ),
);

export default store;
