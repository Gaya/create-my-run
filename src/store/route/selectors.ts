import { createSelector } from 'reselect';

import { Loadable, RouteState, StoreState } from '../types';

const routeState = (state: StoreState): RouteState => state.route;

const routeValueState = createSelector(routeState, (state) => state.route);

const isLoading = (item: Loadable): boolean => item.state === 'loading';
const isInitial = (item: Loadable): boolean => item.state === 'initial';
const hasError = (item: Loadable): boolean => item.state === 'error';
const getError = (item: Loadable): Error | undefined => (item.state === 'error' ? item.error : undefined);
const hasValue = (item: Loadable): boolean => item.state === 'hasValue';
const getValue = <T>(item: Loadable<T>): T | undefined => (item.state === 'hasValue' ? item.data : undefined);

const isRouteInitialSelector = createSelector(routeValueState, isLoading);
const isRouteLoadingSelector = createSelector(routeValueState, isInitial);
const hasRouteErrorSelector = createSelector(routeValueState, hasError);
const routeErrorSelector = createSelector(routeValueState, getError);
const hasRouteValueSelector = createSelector(routeValueState, hasValue);
const getRouteValueSelector = createSelector(routeValueState, getValue);
