import {
  atom,
  selector,
  selectorFamily,
} from 'recoil';

import { RouteFormat, RoutesResponse } from '../server/types';
import { RouteTypeValue } from '../types';
import { API_URL } from '../constants';
import { safeStoredLocation } from '../utils/localStorage';
import { alertError } from '../components/Error/ErrorProvider';

export const routeRandomSeedState = atom<number | undefined>({
  key: 'RouteRandomSeed',
  default: undefined,
});

export const routeDistanceState = atom<number | undefined>({
  key: 'RouteDistance',
  default: undefined,
});

export const routeTypeState = atom<RouteTypeValue['id'] | undefined>({
  key: 'RouteType',
  default: undefined,
});

export const routeFlippedState = atom<boolean>({
  key: 'RouteFlipped',
  default: false,
});

export const routeLocationState = atom<string | undefined>({
  key: 'RouteLocation',
  default: safeStoredLocation()?.key,
});

export function createRouteUrl(
  distance: number,
  routeType: number,
  r: number,
  location: string,
  flipped = false,
  format?: RouteFormat,
): string {
  return [
    `${API_URL}/route?`,
    `distance=${distance}`,
    `routeType=${routeType}`,
    `r=${r}`,
    `location=${location}`,
    flipped ? 'flipped=true' : undefined,
    format ? `format=${format}` : undefined,
  ].join('&');
}

type RouteParameter = {
  distance?: number;
  routeType?: number;
  location?: string;
  r?: number;
}

export const routeParams = selector<RouteParameter>({
  key: 'RouteParams',
  get: ({ get }) => {
    const distance = get(routeDistanceState);
    const routeType = get(routeTypeState);
    const location = get(routeLocationState);
    const r = get(routeRandomSeedState);

    return {
      distance, routeType, location, r,
    };
  },
});

export const routeDataQuery = selectorFamily<RoutesResponse | null, RouteParameter>({
  key: 'RouteData',
  get: ({
    distance,
    routeType,
    location,
    r,
  }) => (): Promise<RoutesResponse | null> => {
    if (!distance || !routeType || !r || !location) {
      return Promise.resolve(null);
    }

    return fetch(createRouteUrl(distance, routeType, r, location))
      .then((res) => res.json() as Promise<RoutesResponse>)
      .catch(() => {
        alertError('Whoops, something went wrong with your route');
        return null;
      });
  },
});
