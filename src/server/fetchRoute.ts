import fetch from 'node-fetch';
import querystring from 'querystring';
import {
  ExternalRoutesResponse,
  LatLong,
  RouteSegment,
  RoutesResponse
} from './types';

interface ResponseCache {
  [qs: string]: ExternalRoutesResponse;
}

const responseCache: ResponseCache = {};

interface RouteParams {
  distance: number;
  locations: number | number[];
  preferences: number | number[];
  routetype: number;
  speed: number;
}

function fetchExternalOrCached(params: RouteParams): Promise<ExternalRoutesResponse> {
  const url = 'https://planner1.fietsersbond.nl/planner/v1/routes';

  const randomseed = 800; // Math.floor(Math.random() * 1000);

  const qs = querystring.stringify({ ...params, randomseed });

  if (responseCache[qs]) {
    return Promise.resolve(responseCache[qs]);
  }

  return fetch(`${url}?${qs}`)
    .then((res) => res.json() as Promise<ExternalRoutesResponse>)
    .then((routes) => {
      responseCache[qs] = routes;
      return routes;
    });
}

function fetchRoute(distance: number, routetype: number): Promise<RoutesResponse> {
  const locations = 20611963;
  const speed = 12;
  const preferences = 63;

  return fetchExternalOrCached({
    distance: distance * 1000,
    locations,
    preferences,
    routetype,
    speed,
  })
    .then((result) => {
      const route = result._embedded.routes[0];
      const routeSegments = route.routesegments;

      let index = 0;

      const segments = routeSegments.reduce((acc: RouteSegment[], segments) => {
        return [
          ...acc,
          ...segments.segmentsections.map((s) => {
            index++;

            return {
              ...s.geometry,
              index,
              coordinates: s.geometry.coordinates.map(([long, lat]): LatLong => [lat, long]),
            };
          }),
        ];
      }, []);

      return {
        time: route.routetime,
        length: route.routelength,
        segments,
      }
    });
}

export default fetchRoute;
