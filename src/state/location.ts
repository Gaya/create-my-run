import { atom, selector, selectorFamily } from 'recoil';

import { LatLng, LocationResponse, LocationsResponse } from '../server/types';
import { Locations } from '../types';
import { API_URL } from '../constants';
import { routeLocationState } from './route';
import { safeStoredLocation } from '../utils/localStorage';
import { alertError } from '../components/Error/ErrorProvider';

export const locationSearchState = atom<string | LatLng>({
  key: 'LocationSearch',
  default: safeStoredLocation()?.name || '',
});

type onCompleteLocation = (locations: LocationResponse[]) => void;

let onCompleteLocation: onCompleteLocation = (): void => undefined;

export function setOnCompleteLocation(newOnCompleteLocation: onCompleteLocation): void {
  onCompleteLocation = newOnCompleteLocation;
}

export const locationsState = atom<Locations>({
  key: 'Locations',
  default: {},
});

export function mergeCachedLocations(
  locations: LocationResponse[] = [],
  state: Locations,
): Locations {
  return locations.reduce(
    (acc: Locations, location) => ({ ...acc, [location.key]: location }),
    state,
  );
}

export const locationsDataQuery = selectorFamily<LocationResponse[], string | LatLng>({
  key: 'LocationsFound',
  get: (q) => (): Promise<LocationResponse[]> => {
    if (q === '') {
      const location = safeStoredLocation();
      if (location) {
        return Promise.resolve([location]);
      }

      return Promise.resolve([]);
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
      .then((res) => res.locations)
      .catch(() => {
        alertError('Something went from looking for a location.');
        return [];
      });
  },
});

export const locationByRouteLocation = selector<LocationResponse | null>({
  key: 'LocationByRouteLocation',
  get: ({ get }) => {
    const selectedLocation = get(routeLocationState);
    const locations = get(locationsState);

    return locations && selectedLocation ? locations[selectedLocation] : null;
  },
});
