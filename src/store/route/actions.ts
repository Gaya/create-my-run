interface RouteParameters {
  distance: number;
  location: string;
  routeType: number;
  randomSeed: number;
  flipped: boolean;
}

interface UpdateRouteParameters {
  type: 'ROUTE_UPDATE_PARAMETERS';
  payload: RouteParameters;
}

export function updateRouteParameters(payload: RouteParameters): UpdateRouteParameters {
  return {
    type: 'ROUTE_UPDATE_PARAMETERS',
    payload,
  };
}

interface GenerateRun {
  type: 'ROUTE_GENERATE_RUN';
}

export type routeActions = UpdateRouteParameters | GenerateRun;
