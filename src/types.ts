import { LocationResponse } from './server/types';

export interface RouteTypeValue {
  id: number;
  name: string;
}

export interface Locations {
  [key: string]: LocationResponse;
}
