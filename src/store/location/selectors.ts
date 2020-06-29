import { createSelector, OutputSelector } from 'reselect';

import { LocationState, StoreState } from '../types';
import { LocationResponse } from '../../server/types';
import { Locations } from '../../types';

const locationState = (state: StoreState): LocationState => state.location;

export const searchSelector = createSelector(locationState, (state) => state.search);
export const locationsSelector = createSelector(locationState, (state) => state.locations);
export const locationsStateSelector = createSelector(locationState, (state) => state.state);
export const locationsBySearchSelector = createSelector(locationState, (state) => state.bySearch);

type OptionalLocationResponse = LocationResponse | undefined;
type LocationByKeySelector = (locations: Locations) => OptionalLocationResponse;

export const locationByKeySelector = (
  key: string | undefined,
): OutputSelector<StoreState, OptionalLocationResponse, LocationByKeySelector> => createSelector(
  locationsSelector,
  (state): OptionalLocationResponse => (key ? state[key] : undefined),
);
