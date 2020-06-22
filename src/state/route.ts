import { atom, selector } from 'recoil';

import { RouteFormat, RoutesResponse } from '../server/types';
import { RouteTypeValue } from '../types';
import { safeStoredLocation } from './utils';

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
  flipped: boolean,
  format?: RouteFormat,
): string {
  const url = process.env.REACT_APP_API;
  return [
    `${url}/route?`,
    `distance=${distance}`,
    `routeType=${routeType}`,
    `r=${r}`,
    `location=${location}`,
    flipped ? 'flipped=true' : undefined,
    format ? `format=${format}` : undefined,
  ].join('&');
}

let onCompleteRoute = (): void => undefined;

export function setOnCompleteRoute(newOnCompleteRoute: () => void): void {
  onCompleteRoute = newOnCompleteRoute;
}

export const routeDataQuery = selector<RoutesResponse | null>({
  key: 'RouteData',
  get: ({ get }) => {
    const distance = get(routeDistanceState);
    const routeType = get(routeTypeState);
    const location = get(routeLocationState);
    const r = get(routeRandomSeedState);
    const flipped = get(routeFlippedState);

    if (!distance || !routeType || !r || !location) {
      return Promise.resolve(null);
    }

    return fetch(createRouteUrl(distance, routeType, r, location, flipped))
      .then((res) => res.json() as Promise<RoutesResponse>)
      .then((res) => {
        onCompleteRoute();
        return res;
      });
  },
});

export const routeLengthState = selector<number | undefined>({
  key: 'RouteLength',
  get: ({ get }) => {
    const routeData = get(routeDataQuery);

    return routeData?.length;
  },
});
