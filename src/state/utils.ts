import { Loadable } from 'recoil';

import { LocationResponse } from '../server/types';

export function isLoading<T>(i: Loadable<T>): boolean {
  return i.state === 'loading';
}

const LOCATION_STORAGE_KEY = 'CMRLOCATION';

export function hasStoredLocation(): boolean {
  return localStorage.getItem(LOCATION_STORAGE_KEY) !== null;
}

export function getStoredLocation(): LocationResponse {
  return JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY) || '');
}

export function storeLocation(location: LocationResponse): void {
  if (hasStoredLocation()) {
    const currentLocation = getStoredLocation();

    if (currentLocation.key === location.key) return;
  }

  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
}

export function safeStoredLocation(): LocationResponse | undefined {
  try {
    if (hasStoredLocation()) {
      return getStoredLocation();
    }
  } catch (e) {
    // fail silently
  }

  return undefined;
}
