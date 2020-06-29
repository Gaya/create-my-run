import { createSelector } from 'reselect';

import { LocationState, StoreState } from '../types';
import { LocationResponse } from '../../server/types';

const locationState = (state: StoreState): LocationState => state.location;

export const searchSelector = createSelector(locationState, (state) => state.search);
export const locationsSelector = createSelector(locationState, (state) => state.locations);
export const locationsStateSelector = createSelector(locationState, (state) => state.state);
export const locationsBySearchSelector = createSelector(locationState, (state) => state.bySearch);

export const locationByKeySelector = (key: string | undefined) => createSelector(
  locationsSelector,
  (state): LocationResponse | undefined => (key ? state[key] : undefined),
);
