import querystring from 'querystring';
import fetch from 'node-fetch';

import { ExternalLocationsResponse, LocationsResponse } from './types';

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

function fetchLocations(search: string): Promise<LocationsResponse> {
  if (search.trim() === '') {
    return Promise.resolve({ locations: [] });
  }

  return fetchExternalOrCached(search)
    .then((result) => ({
      // eslint-disable-next-line no-underscore-dangle
      locations: result._embedded.locations.map((location) => ({
        name: location.name,
        key: location.key,
        coordinates: [location.geometry.coordinates[1], location.geometry.coordinates[0]],
      })),
    }));
}

export default fetchLocations;
