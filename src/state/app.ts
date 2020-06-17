import { atom } from 'recoil';

import { safeStoredDistance } from './utils';

export const drawerOpenState = atom<boolean>({
  key: 'DrawerOpenState',
  default: true,
});

const storedDistanceSettings = safeStoredDistance();

export const defaultDistanceState = atom<number>({
  key: 'DefaultDistanceState',
  default: storedDistanceSettings?.defaultDistance || 10,
});

export const minimumDistanceState = atom<number>({
  key: 'MinimumDistanceState',
  default: storedDistanceSettings?.min || 1,
});

export const maximumDistanceState = atom<number>({
  key: 'MaximumDistanceState',
  default: storedDistanceSettings?.max || 50,
});
