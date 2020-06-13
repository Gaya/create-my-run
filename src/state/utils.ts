import { Loadable } from 'recoil';
import { BaseBuilder, buildGPX } from 'gpx-builder';

import { LocationResponse, LatLong } from '../server/types';

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

export function randomSeed(): number {
  return Math.floor(Math.random() * 1000);
}

const { Point } = BaseBuilder.MODELS;
export function convertCoordinatesToGPX(coordinates: LatLong[]): string {
  const pointArray = coordinates.map((value) => new Point(value[0], value[1]));
  const gpxData = new BaseBuilder();
  gpxData.setSegmentPoints(pointArray);
  return buildGPX(gpxData.toObject());
}

export function downloadGPX(gpxData: string): void {
  const anchor = window.document.createElement('a');
  anchor.href = `data:text/plain;charset=utf-8,${encodeURIComponent(gpxData)}`;
  anchor.download = 'route.gpx';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.URL.revokeObjectURL(anchor.href);
}
