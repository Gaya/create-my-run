import { RouteResponse } from '../server/types';
import { Locations } from '../types';

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

export interface RouteState {
  location?: string;
  distance?: number;
  routeType?: number;
  randomSeed?: number;
  flipped?: boolean;
  route: LoadableValue<RouteResponse>;
}

export interface LocationState {
  byLatLng: { [search: string]: string[] };
  bySearch: { [search: string]: string[] };
  locations: Locations;
  state: 'idle' | 'loading';
  search: string;
}

export interface StoreState {
  app: AppState;
  route: RouteState;
  location: LocationState;
}
