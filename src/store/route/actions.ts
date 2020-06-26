import { Dispatch } from 'redux';

interface RouteParameters {
  distance: number;
  location: string;
  routeType: number;
  randomSeed: number;
  flipped: boolean;
}

export interface UpdateRouteParameters {
  type: 'ROUTE_UPDATE_PARAMETERS';
  payload: RouteParameters;
}

export function updateRouteParameters(payload: RouteParameters) {
  return (dispatch: Dispatch<routeActions>): void => {
    dispatch({
      type: 'ROUTE_UPDATE_PARAMETERS',
      payload,
    });

    // @TODO continue here
    console.log('fetch');
  };
}

interface GenerateRun {
  type: 'ROUTE_GENERATE_RUN';
}

export type routeActions = UpdateRouteParameters | GenerateRun;
