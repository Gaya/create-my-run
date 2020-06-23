import { LocationResponse } from '../server/types';
import { DistanceSettings } from '../types';

enum LOCALSTORAGE {
  LOCATION = 'CMRLOCATION',
  DISTANCE = 'CMRDISTANCE',
}

export function storeLocation(location: LocationResponse): void {
  const currentLocation = getStoreValueSafe<LocationResponse>(LOCALSTORAGE.LOCATION);

  if (currentLocation?.key === location.key) return;

  setStoreValue(LOCALSTORAGE.LOCATION, location);
}

export function safeStoredLocation(): LocationResponse | undefined {
  return getStoreValueSafe(LOCALSTORAGE.LOCATION);
}

export function removeStoredLocation(): void {
  localStorage.removeItem(LOCALSTORAGE.LOCATION);
}

export function storeDistanceSettings(settings: DistanceSettings): void {
  setStoreValue(LOCALSTORAGE.DISTANCE, settings);
}

export function safeStoredDistance(): DistanceSettings | undefined {
  return getStoreValueSafe(LOCALSTORAGE.DISTANCE);
}

export function removeStoredDistanceSettings(): void {
  localStorage.removeItem(LOCALSTORAGE.DISTANCE);
}

export function getStoreValueSafe<T>(key: LOCALSTORAGE): T | undefined {
  try {
    if (hasStoreValue(key)) {
      return getStoreValue(key);
    }
  } catch (e) {
    // fail silently
  }

  return undefined;
}

export function hasStoreValue(key: LOCALSTORAGE): boolean {
  return localStorage.getItem(key) !== null;
}

export function getStoreValue<T>(key: LOCALSTORAGE): T {
  return JSON.parse(localStorage.getItem(key) || '');
}

export function setStoreValue<T>(key: LOCALSTORAGE, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
