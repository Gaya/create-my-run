import fetch from 'node-fetch';
import querystring from 'querystring';
import {
  ExternalRoutesResponse,
  LatLong,
  RoutesResponse
} from './types';

interface ResponseCache {
  [qs: string]: ExternalRoutesResponse;
}

const responseCache: ResponseCache = {};

interface RouteParams {
  distance: number;
  locations: string | string[];
  preferences: number | number[];
  routetype: number;
  speed: number;
}

function fetchExternalOrCached(params: RouteParams): Promise<ExternalRoutesResponse> {
  const randomseed = 800; // Math.floor(Math.random() * 1000);

  const qs = querystring.stringify({ ...params, randomseed });

  if (responseCache[qs]) {
    return Promise.resolve(responseCache[qs]);
  }

  return fetch(`${process.env.ROUTE_API}?${qs}`)
    .then((res) => res.json() as Promise<ExternalRoutesResponse>)
    .then((routes) => {
      responseCache[qs] = routes;
      return routes;
    });
}

function fetchRoute(distance: number, routetype: number, location: string): Promise<RoutesResponse> {
  const speed = 12;
  const preferences = 63;

  return fetchExternalOrCached({
    distance: distance * 1000,
    locations: location,
    preferences,
    routetype,
    speed,
  })
    .then((result) => {
      const route = result._embedded.routes[0];
      const routeSegments = route.routesegments;

      const coordinates = routeSegments.reduce((acc: LatLong[], segments) => [
        ...acc,
        ...segments.segmentsections.reduce((acc: LatLong[], segment) => [
          ...acc,
          ...segment.geometry.coordinates.map(([long, lat]): LatLong => [lat, long]),
        ], []),
      ], []);

      return {
        time: route.routetime,
        length: route.routelength,
        coordinates,
      }
    });
}

export default fetchRoute;
