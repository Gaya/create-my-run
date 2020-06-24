import { createSelector } from 'reselect';

import { AppState, StoreState } from '../types';

const appState = (state: StoreState): AppState => state.app;

export const defaultDistanceSelector = createSelector(
  appState,
  (state) => state.defaultDistance,
);

export const maximumDistanceSelector = createSelector(
  appState,
  (state) => state.maximumDistance,
);

export const minimumDistanceSelector = createSelector(
  appState,
  (state) => state.minimumDistance,
);
