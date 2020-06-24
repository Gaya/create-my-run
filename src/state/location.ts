import { atom, selector, selectorFamily } from 'recoil';

import { LatLng, LocationResponse, LocationsResponse } from '../server/types';
import { Locations } from '../types';
import { API_URL } from '../constants';
import { routeLocationState } from './route';
import { safeStoredLocation } from '../utils/localStorage';
import { alertError } from '../components/Error/ErrorProvider';

export const locationSearchState = atom<string | LatLng>({
  key: 'LocationSearch',
  default: '',
});

type onCompleteLocation = (locations: LocationResponse[]) => void;

let onCompleteLocation: onCompleteLocation = (): void => undefined;

export function setOnCompleteLocation(newOnCompleteLocation: onCompleteLocation): void {
  onCompleteLocation = newOnCompleteLocation;
}

let cachedLocations: Locations = {};

function mergeCachedLocations(locations: LocationResponse[] = []): Locations {
  cachedLocations = locations.reduce(
    (acc: Locations, location) => ({ ...acc, [location.key]: location }),
    cachedLocations,
  );

  return cachedLocations;
}

export const locationsDataQuery = selectorFamily<Locations | null, string | LatLng>({
  key: 'LocationsFound',
  get: (q) => (): Promise<Locations | null> => {
    if (q === '') {
      const location = safeStoredLocation();
      if (location) {
        return Promise.resolve(mergeCachedLocations([location]));
      }

      return Promise.resolve(null);
    }

    const isLatLng = Array.isArray(q);

    const url = Array.isArray(q)
      ? `${API_URL}/locations?latlng=${q.join(',')}`
      : `${API_URL}/locations?q=${q}`;

    return fetch(url)
      .then((res) => res.json() as Promise<LocationsResponse>)
      .then((res) => {
        if (isLatLng) {
          onCompleteLocation(res.locations);
        }

        return res;
      })
      .then((res) => mergeCachedLocations(res.locations))
      .catch(() => {
        alertError('Something went from looking for a location.');
        return mergeCachedLocations();
      });
  },
});

export const locationByRouteLocation = selector<LocationResponse | null>({
  key: 'LocationByRouteLocaction',
  get: ({ get }) => {
    const selectedLocation = get(routeLocationState);
    const search = get(locationSearchState);
    const locations = get(locationsDataQuery(search));

    return locations && selectedLocation ? locations[selectedLocation] : null;
  },
});
