import { GarminBuilder, BaseBuilder, buildGPX } from 'gpx-builder';

import { LatLng } from './types';

export function convertCoordinatesToGPX(coordinates: LatLng[], Builder = BaseBuilder): string {
  const { Point } = Builder.MODELS;
  const points = coordinates.map(([lat, lng]) => new Point(lat, lng));

  const gpxData = new Builder();
  gpxData.setSegmentPoints(points);

  return buildGPX(gpxData.toObject());
}

export function convertCoordinatesToGarmin(coordinates: LatLng[]): string {
  return convertCoordinatesToGPX(coordinates, GarminBuilder);
}
