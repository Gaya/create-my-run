import { atom, selector } from 'recoil';

import { LocationsResponse } from '../server/types';
import { Locations } from '../types';

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
      return Promise.resolve(null);
    }

    return fetch(`${url}/locations?q=${q}`)
      .then((res) => res.json() as Promise<LocationsResponse>)
      .then((res) => res.locations.reduce(
        (acc: Locations, location) => ({ ...acc, [location.key]: location }),
        {},
      ));
  }
});
