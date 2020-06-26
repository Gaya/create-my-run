import { createSelector } from 'reselect';

import { Loadable, RouteState, StoreState } from '../types';
import { routeDataQuery, routeParams } from '../../state/route';

const routeState = (state: StoreState): RouteState => state.route;

const routeValueState = createSelector(routeState, (state) => state.route);

const isInitial = (item: Loadable): boolean => item.state === 'initial';
const isLoading = (item: Loadable): boolean => item.state === 'loading';
const hasError = (item: Loadable): boolean => item.state === 'error';
const getError = (item: Loadable): Error | undefined => (item.state === 'error' ? item.error : undefined);
const hasValue = (item: Loadable): boolean => item.state === 'hasValue';
const getValue = <T>(item: Loadable<T>): T | undefined => (item.state === 'hasValue' ? item.data : undefined);

const isRouteInitialSelector = createSelector(routeValueState, isInitial);
export const isRouteLoadingSelector = createSelector(routeValueState, isLoading);
const hasRouteErrorSelector = createSelector(routeValueState, hasError);
const routeErrorSelector = createSelector(routeValueState, getError);
const hasRouteValueSelector = createSelector(routeValueState, hasValue);
const getRouteValueSelector = createSelector(routeValueState, getValue);

const distanceSelector = createSelector(routeState, (state) => state.distance);
const routeTypeSelector = createSelector(routeState, (state) => state.routeType);
const locationSelector = createSelector(routeState, (state) => state.location);
const randomSeedSelector = createSelector(routeState, (state) => state.randomSeed);

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
