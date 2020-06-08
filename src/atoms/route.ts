import { atom, selector } from 'recoil';

import { RoutesResponse } from '../server/types';
import { RouteTypeValue } from '../types';

export const routeDistanceState = atom<number | undefined>({
  key: 'RouteDistance',
  default: undefined,
});

export const routeTypeState = atom<RouteTypeValue['id'] | undefined>({
  key: 'RouteType',
  default: undefined,
});

export const routeLocationState = atom<string | undefined>({
  key: 'RouteLocation',
  default: undefined,
});

export const routeDataQuery = selector<RoutesResponse | null>({
  key: 'RouteData',
  get: ({ get }) => {
    const url = process.env.REACT_APP_API;
    const distance = get(routeDistanceState);
    const routeType = get(routeTypeState);

    if (!distance || !routeType) {
      return Promise.resolve(null);
    }

    return fetch(`${url}/route?distance=${distance}&routeType=${routeType}`)
      .then((res) => res.json() as Promise<RoutesResponse>);
  }
});

export const routeLengthState = selector<number | undefined>({
  key: 'RouteLength',
  get: ({ get }) => {
    const routeData = get(routeDataQuery);

    return routeData?.length;
  },
});
