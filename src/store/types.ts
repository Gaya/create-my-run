import { RouteResponse } from '../server/types';

export type LoadableValue<T = unknown> = {
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
  route: LoadableValue<RouteResponse>;
};

export interface StoreState {
  app: AppState;
  route: RouteState;
}
