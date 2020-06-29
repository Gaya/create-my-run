import { Dispatch } from 'redux';

import { RouteResponse } from '../../server/types';
import { alertError } from '../../components/Error/ErrorProvider';

import { createRouteUrl } from './utils';

interface RouteParameters {
  distance: number;
  location: string;
  routeType: number;
  randomSeed: number;
  flipped: boolean;
}

interface ReceiveRoute {
  type: 'ROUTE_RECEIVE';
  payload: RouteResponse;
}

function receiveRoute(route: RouteResponse): ReceiveRoute {
  return {
    type: 'ROUTE_RECEIVE',
    payload: route,
  };
}

export interface UpdateRouteParameters {
  type: 'ROUTE_UPDATE_PARAMETERS';
  payload: RouteParameters;
}

export function updateRouteParameters(payload: RouteParameters) {
  return (dispatch: Dispatch<RouteActions>): void => {
    dispatch({
      type: 'ROUTE_UPDATE_PARAMETERS',
      payload,
    });

    const {
      distance,
      routeType,
      randomSeed,
      location,
    } = payload;

    fetch(createRouteUrl(distance, routeType, randomSeed, location))
      .then((res) => res.json() as Promise<RouteResponse>)
      .then((route) => dispatch(receiveRoute(route)))
      .catch(() => {
        alertError('Whoops, something went wrong with your route');
      });
  };
}

interface UpdateRouteLocation {
  type: 'ROUTE_UPDATE_LOCATION';
  payload: string | undefined;
}

export function updateRouteLocation(location: string | undefined): UpdateRouteLocation {
  return {
    type: 'ROUTE_UPDATE_LOCATION',
    payload: location,
  };
}

export type RouteActions = UpdateRouteParameters | ReceiveRoute | UpdateRouteLocation;
