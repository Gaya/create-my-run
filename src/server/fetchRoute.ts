import fetch from 'node-fetch';
import querystring from 'querystring';
import { ExternalRoutesResponse, GeometryLineString, RoutesResponse } from './types';

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

function fetchRoute(): Promise<RoutesResponse> {
  const locations = 20611963;
  const speed = 12;
  const distance = 18000;
  const routetype = 69;
  const preferences = 63;

  return fetchExternalOrCached({
    distance,
    locations,
    preferences,
    routetype,
    speed,
  })
    .then((result) => {
      const route = result._embedded.routes[0];
      const routeSegments = route.routesegments;

      const segments = routeSegments.reduce((acc: GeometryLineString[], segments) => {
        return [
          ...acc,
          ...segments.segmentsections.map((s) => s.geometry),
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
