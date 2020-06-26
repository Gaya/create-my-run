import { RoutesResponse } from '../server/types';

export type Loadable<T = unknown> = {
  state: 'hasValue';
  data: T;
} | {
  state: 'initial';
} | {
  state: 'loading';
} | {
  state: 'error';
  error: Error;
}

export interface AppState {
  drawerOpened: boolean;
  defaultDistance: number;
  minimumDistance: number;
  maximumDistance: number;
}

export type RouteState = {
  location?: string;
  distance?: number;
  routeType?: number;
  randomSeed?: number;
  flipped?: boolean;
  route: Loadable<RoutesResponse>;
};

export interface StoreState {
  app: AppState;
  route: RouteState;
}
