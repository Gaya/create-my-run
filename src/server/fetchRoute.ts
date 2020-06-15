import fetch from 'node-fetch';
import querystring from 'querystring';

import {
  ExternalRoutesResponse,
  LatLong,
  RoutesResponse,
} from './types';
import createResponseCache from './responseCache';

const routesCache = createResponseCache<ExternalRoutesResponse>();

interface RouteParams {
  distance: number;
  locations: string | string[];
  preferences: number | number[];
  routetype: number;
  speed: number;
  randomseed: number;
}

function fetchExternalOrCached(params: RouteParams): Promise<ExternalRoutesResponse> {
  const qs = querystring.stringify({ ...params });

  if (routesCache.has(qs)) {
    return Promise.resolve(routesCache.get(qs));
  }

  return fetch(`${process.env.ROUTE_API}?${qs}`)
    .then((res) => res.json() as Promise<ExternalRoutesResponse>)
    .then((routes) => {
      routesCache.set(qs, routes);

      return routes;
    });
}

function fetchRoute(
  distance: number,
  routetype: number,
  location: string,
  randomseed = 800,
): Promise<RoutesResponse> {
  const speed = 12;
  const preferences = 63;

  return fetchExternalOrCached({
    distance: distance * 1000,
    locations: location,
    preferences,
    routetype,
    speed,
    randomseed,
  })
    .then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      const route = result._embedded.routes[0];
      const routeSegments = route.routesegments;

      const coordinates = routeSegments.reduce((acc: LatLong[], segments) => [
        ...acc,
        ...segments.segmentsections.reduce((accSegments: LatLong[], segment) => [
          ...accSegments,
          ...segment.geometry.coordinates.map(([long, lat]): LatLong => [lat, long]),
        ], []),
      ], []);

      return {
        time: route.routetime,
        length: route.routelength,
        coordinates,
      };
    });
}

export default fetchRoute;
