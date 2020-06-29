import { atom } from 'recoil';

import { safeStoredLocation } from '../utils/localStorage';

export const routeLocationState = atom<string | undefined>({
  key: 'RouteLocation',
  default: safeStoredLocation()?.key,
});
