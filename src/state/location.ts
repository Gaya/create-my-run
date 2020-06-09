import { atom, selector } from 'recoil';

import { LocationResponse, LocationsResponse } from '../server/types';
import { Locations } from '../types';
import { routeLocationState } from './route';
import { safeStoredLocation } from './utils';

export const locationSearchState = atom<string>({
  key: 'LocationSearch',
  default: '',
});

export const locationsDataQuery = selector<Locations | null>({
  key: 'LocationsFound',
  get: ({ get }) => {
    const url = process.env.REACT_APP_API;
    const q = get(locationSearchState);

    if (q === '') {
      const location = safeStoredLocation();
      if (location) {
        return Promise.resolve({ [location.key]: location });
      }

      return Promise.resolve(null);
    }

    return fetch(`${url}/locations?q=${q}`)
      .then((res) => res.json() as Promise<LocationsResponse>)
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
