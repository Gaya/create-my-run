import { atom, selector } from 'recoil';

import { LatLng, LocationResponse, LocationsResponse } from '../server/types';
import { Locations } from '../types';
import { API_URL } from '../constants';
import { routeLocationState } from './route';
import { safeStoredLocation } from './utils';

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

export const locationsDataQuery = selector<Locations | null>({
  key: 'LocationsFound',
  get: ({ get }) => {
    const q = get(locationSearchState);
    const latLng = get(locationPointState);

    if (q === '' && !latLng) {
      const location = safeStoredLocation();
      if (location) {
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
      .then((res) => res.locations.reduce(
        (acc: Locations, location) => ({ ...acc, [location.key]: location }),
        {},
      ));
  },
});

export const locationByRouteLocation = selector<LocationResponse | null>({
  key: 'LocationByRouteLocaction',
  get: ({ get }) => {
    const selectedLocation = get(routeLocationState);
    const locations = get(locationsDataQuery);

    return locations && selectedLocation ? locations[selectedLocation] : null;
  },
});
