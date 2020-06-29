import { createSelector } from 'reselect';

import { LoadableValue, RouteState, StoreState } from '../types';

const routeState = (state: StoreState): RouteState => state.route;

export const routeSelector = createSelector(routeState, (state) => state.route);

const isLoading = (item: LoadableValue): boolean => item.state === 'loading';
const getValue = <T>(item: LoadableValue<T>): T | undefined => (item.state === 'hasValue' ? item.data : undefined);

export const isRouteLoadingSelector = createSelector(routeSelector, isLoading);
const getRouteValueSelector = createSelector(routeSelector, getValue);

const distanceSelector = createSelector(routeState, (state) => state.distance);
const routeTypeSelector = createSelector(routeState, (state) => state.routeType);
export const locationSelector = createSelector(routeState, (state) => state.location);
const randomSeedSelector = createSelector(routeState, (state) => state.randomSeed);
export const flippedSelector = createSelector(routeState, (state) => state.flipped);

export const routeParametersSelector = createSelector(
  [distanceSelector, routeTypeSelector, locationSelector, randomSeedSelector],
  (distance, routeType, location, randomSeed) => ({
    distance,
    routeType,
    location,
    randomSeed,
  }),
);

export const routeLengthSelector = createSelector(getRouteValueSelector, (route) => route?.length);
