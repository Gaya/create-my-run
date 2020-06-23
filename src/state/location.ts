import { atom, selector, selectorFamily } from 'recoil';

import { LatLng, LocationResponse, LocationsResponse } from '../server/types';
import { Locations } from '../types';
import { API_URL } from '../constants';
import { routeLocationState } from './route';
import { safeStoredLocation } from '../utils/localStorage';
import { alertError } from '../components/Error/ErrorProvider';

export const locationSearchState = atom<string>({
  key: 'LocationSearch',
  default: '',
});

export const locationPointState = atom<LatLng | undefined>({
  key: 'LocationPoint',
  default: undefined,
});

type onCompleteLocation = (locations: LocationResponse[]) => void;

let onCompleteLocation: onCompleteLocation = (): void => undefined;

export function setOnCompleteLocation(newOnCompleteLocation: onCompleteLocation): void {
  onCompleteLocation = newOnCompleteLocation;
}

type LocationParameter = {
  q: string;
  latLng?: LatLng;
};

let cachedLocations: Locations = {};

function mergeCachedLocations(locations: LocationResponse[]): Locations {
  cachedLocations = locations.reduce(
    (acc: Locations, location) => ({ ...acc, [location.key]: location }),
    cachedLocations,
  );

  return cachedLocations;
}

export const locationsDataQuery = selectorFamily<Locations | null, LocationParameter>({
  key: 'LocationsFound',
  get: ({ q, latLng }) => (): Promise<Locations | null> => {
    if (q === '' && !latLng) {
      const location = safeStoredLocation();
      if (location) {
        mergeCachedLocations([location]);
        return Promise.resolve({ [location.key]: location });
      }

      return Promise.resolve(null);
    }

    const url = latLng
      ? `${API_URL}/locations?latlng=${latLng.join(',')}`
      : `${API_URL}/locations?q=${q}`;

    return fetch(url)
      .then((res) => res.json() as Promise<LocationsResponse>)
      .then((res) => {
        if (latLng) {
          onCompleteLocation(res.locations);
        }

        return res;
      })
      .then((res) => mergeCachedLocations(res.locations))
      .catch(() => {
        alertError('Something went from looking for a location.');
        return cachedLocations;
      });
  },
});

export const locationByRouteLocation = selector<LocationResponse | null>({
  key: 'LocationByRouteLocaction',
  get: ({ get }) => {
    const selectedLocation = get(routeLocationState);
    const q = get(locationSearchState);
    const latLng = get(locationPointState);
    const locations = get(locationsDataQuery({ q, latLng }));

    return locations && selectedLocation ? locations[selectedLocation] : null;
  },
});
