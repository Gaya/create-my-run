import querystring from 'querystring';
import fetch from 'node-fetch';

import { ExternalLocationsResponse, LatLng, LocationsResponse } from './types';
import createResponseCache from './responseCache';

const locationsCache = createResponseCache<ExternalLocationsResponse>();

function fetchExternalOrCached(q?: string, latLng?: LatLng): Promise<ExternalLocationsResponse> {
  const qsObject: { q?: string; point?: string } = {};

  if (q !== '') {
    qsObject.q = q;
  }

  if (latLng) {
    qsObject.point = [latLng[1], latLng[0]].join(',');
  }

  const qs = querystring.stringify(qsObject);

  if (locationsCache.has(qs)) {
    return Promise.resolve(locationsCache.get(qs));
  }

  const apiUrl = qsObject.q ? process.env.LOCATIONS_API : process.env.LOCATIONS_GPS_API;

  return fetch(`${apiUrl}?${qs}`)
    .then((res) => res.json() as Promise<ExternalLocationsResponse>)
    .then((locations) => {
      locationsCache.set(qs, locations);

      return locations;
    });
}

function fetchLocations(search: string, latLng: string): Promise<LocationsResponse> {
  const latLngParsed = latLng.split(',').map((s) => parseFloat(s));

  if (search.trim() === '' && latLngParsed.length !== 2) {
    return Promise.resolve({ locations: [] });
  }

  return fetchExternalOrCached(search, [latLngParsed[0], latLngParsed[1]])
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
