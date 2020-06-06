import querystring from "querystring";
import fetch from 'node-fetch';

import { ExternalLocationsResponse, LatLong, LocationsResponse } from './types';

interface ResponseCache {
  [qs: string]: ExternalLocationsResponse;
}

const responseCache: ResponseCache = {};

function fetchExternalOrCached(q: string): Promise<ExternalLocationsResponse> {
  const qs = querystring.stringify({ q });

  if (responseCache[qs]) {
    return Promise.resolve(responseCache[qs]);
  }

  return fetch(`${process.env.LOCATIONS_API}?${qs}`)
    .then((res) => res.json() as Promise<ExternalLocationsResponse>)
    .then((locations) => {
      responseCache[qs] = locations;
      return locations;
    });
}

export function fetchLocations(search: string): Promise<LocationsResponse> {
  return fetchExternalOrCached(search)
    .then((result) => {
      return {
        locations: result._embedded.locations.map((location) => ({
          name: location.name,
          key: location.key,
          coordinates: location.geometry.coordinates,
        })),
      }
    });
}
